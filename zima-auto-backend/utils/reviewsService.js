// zima-auto-backend/utils/reviewsService.js
const fs = require('fs').promises;
const path = require('path');

// Import fetch for Node.js compatibility
let fetch;
if (typeof globalThis.fetch === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = globalThis.fetch;
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE_PATH = path.join(__dirname, '../reviews-cache.json');

// Default / fallback metadata for A&T Group / Zima Auto (no fake review cards)
const FALLBACK_REVIEWS_DATA = {
  name: "A&T Reptéri Parkoló és Autószerviz",
  rating: 4.9,
  totalReviews: 198,
  googleMapsUrl: "https://www.google.com/maps/place/A%26T+Rept%C3%A9ri+Parkol%C3%B3+%C3%A9s+K%C3%A9zi+Aut%C3%B3mos%C3%B3/@47.409985,19.0926473,21108m/data=!3m1!1e3!4m10!1m2!2m1!1sat+parking!3m6!1s0x4741c1683c4acc0d:0xd5187321a7799279!8m2!3d47.4099852!4d19.232723!15sCgphdCBwYXJraW5nkgELcGFya2luZ19sb3TgAQA!16s%2Fg%2F11zh3c3lc4",
  reviews: []
};

// In-memory cache
let memoryCache = {
  data: null,
  lastFetched: 0
};

// Load cache from disk if available
async function loadDiskCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data && parsed.lastFetched) {
      memoryCache = parsed;
      return true;
    }
  } catch (err) {
    // Cache file doesn't exist yet or is invalid
  }
  return false;
}

// Save cache to disk
async function saveDiskCache(data) {
  try {
    memoryCache = {
      data,
      lastFetched: Date.now()
    };
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(memoryCache, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save reviews cache to disk:', err.message);
  }
}

/**
 * Fetch reviews from Google Places API or return cached/fallback data.
 * @param {Object} options
 * @param {boolean} [options.forceRefresh=false]
 * @param {string} [options.language='hu']
 */
async function getReviews({ forceRefresh = false, language = 'hu', placeId = null } = {}) {
  const now = Date.now();
  const targetPlaceId = placeId || process.env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_ID_SERVICE || 'ChIJgxyanwvBQUcRi1dw9p0sVHE';
  const cacheKey = `${targetPlaceId}_${language}`;

  // Try loading cache from disk if memory cache is empty
  if (!memoryCache.data) {
    await loadDiskCache();
  }

  // Return cached data if valid and fresh
  if (!forceRefresh && memoryCache.data && memoryCache.data[cacheKey] && (now - memoryCache.lastFetched < CACHE_DURATION_MS)) {
    return {
      success: true,
      cached: true,
      lastFetched: memoryCache.lastFetched,
      ...memoryCache.data[cacheKey]
    };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('[ReviewsService] GOOGLE_PLACES_API_KEY not configured in .env. Using fallback reviews until API key is set.');
    return {
      success: true,
      cached: false,
      isFallback: true,
      ...FALLBACK_REVIEWS_DATA
    };
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(targetPlaceId)}`;
    console.log(`[ReviewsService] Fetching fresh reviews from Google Places API (v1) for place_id: ${targetPlaceId}`);

    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri'
      }
    });

    const data = await response.json();

    if (data.error || typeof data.rating === 'undefined') {
      console.error(`[ReviewsService] Google Places API error:`, data.error || 'No rating returned');
      if (memoryCache.data && memoryCache.data[cacheKey]) {
        return {
          success: true,
          cached: true,
          stale: true,
          ...memoryCache.data[cacheKey]
        };
      }
      return {
        success: true,
        cached: false,
        isFallback: true,
        ...FALLBACK_REVIEWS_DATA
      };
    }

    const formattedData = {
      name: data.displayName?.text || FALLBACK_REVIEWS_DATA.name,
      rating: data.rating || FALLBACK_REVIEWS_DATA.rating,
      totalReviews: data.userRatingCount || FALLBACK_REVIEWS_DATA.totalReviews,
      googleMapsUrl: data.googleMapsUri || FALLBACK_REVIEWS_DATA.googleMapsUrl,
      reviews: (data.reviews || []).map(r => ({
        author_name: r.authorAttribution?.displayName || 'Google Felhasználó',
        profile_photo_url: r.authorAttribution?.photoUri || '',
        rating: r.rating || 5,
        relative_time_description: r.relativePublishTimeDescription || '',
        text: r.text?.text || r.originalText?.text || '',
        time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : Math.floor(Date.now() / 1000)
      }))
    };

    if (!memoryCache.data) memoryCache.data = {};
    memoryCache.data[cacheKey] = formattedData;
    await saveDiskCache(memoryCache.data);

    return {
      success: true,
      cached: false,
      ...formattedData
    };
  } catch (error) {
    console.error('[ReviewsService] Error fetching Google Reviews:', error.message);
    if (memoryCache.data && memoryCache.data[cacheKey]) {
      return {
        success: true,
        cached: true,
        stale: true,
        ...memoryCache.data[cacheKey]
      };
    }
    return {
      success: true,
      cached: false,
      isFallback: true,
      ...FALLBACK_REVIEWS_DATA
    };
  }
}

/**
 * Fetch reviews from both the service and parking place IDs and merge them.
 * Used by the combined (zima-auto-svelte) frontend.
 * @param {Object} options
 * @param {boolean} [options.forceRefresh=false]
 * @param {string} [options.language='hu']
 */
async function getReviewsForBothPlaces({ forceRefresh = false, language = 'hu' } = {}) {
  const servicePlaceId = process.env.GOOGLE_PLACE_ID_SERVICE || 'ChIJgxyanwvBQUcRi1dw9p0sVHE';
  const parkingPlaceId = process.env.GOOGLE_PLACE_ID_PARKING || 'ChIJDcxKPGjBQUcReZJ5pyFzGNU';

  const [serviceData, parkingData] = await Promise.all([
    getReviews({ forceRefresh, language, placeId: servicePlaceId }),
    getReviews({ forceRefresh, language, placeId: parkingPlaceId })
  ]);

  // Interleave reviews sorted by time (newest first)
  const allReviews = [
    ...(serviceData.reviews || []),
    ...(parkingData.reviews || [])
  ].sort((a, b) => (b.time || 0) - (a.time || 0));

  // Combined totals
  const totalReviews = (serviceData.totalReviews || 0) + (parkingData.totalReviews || 0);

  // Weighted average rating
  const serviceCount = serviceData.totalReviews || 0;
  const parkingCount = parkingData.totalReviews || 0;
  const combined = serviceCount + parkingCount;
  const avgRating = combined > 0
    ? ((serviceData.rating || 5) * serviceCount + (parkingData.rating || 5) * parkingCount) / combined
    : (serviceData.rating || parkingData.rating || 4.9);

  // Use parking maps URL as the primary CTA (more reviews there)
  const googleMapsUrl = parkingData.googleMapsUrl || serviceData.googleMapsUrl || FALLBACK_REVIEWS_DATA.googleMapsUrl;

  return {
    success: true,
    cached: serviceData.cached && parkingData.cached,
    name: 'A&T Group',
    rating: Math.round(avgRating * 10) / 10,
    totalReviews,
    googleMapsUrl,
    reviews: allReviews
  };
}

module.exports = {
  getReviews,
  getReviewsForBothPlaces,
  FALLBACK_REVIEWS_DATA
};
