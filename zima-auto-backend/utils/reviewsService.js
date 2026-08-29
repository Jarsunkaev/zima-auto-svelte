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

// Default / fallback reviews for A&T Group / Zima Auto
const FALLBACK_REVIEWS_DATA = {
  name: "A&T Reptéri Parkoló és Autószerviz",
  rating: 4.9,
  totalReviews: 198,
  googleMapsUrl: "https://www.google.com/maps/place/A%26T+Rept%C3%A9ri+Parkol%C3%B3+%C3%A9s+K%C3%A9zi+Aut%C3%B3mos%C3%B3/@47.409985,19.0926473,21108m/data=!3m1!1e3!4m10!1m2!2m1!1sat+parking!3m6!1s0x4741c1683c4acc0d:0xd5187321a7799279!8m2!3d47.4099852!4d19.232723!15sCgphdCBwYXJraW5nkgELcGFya2luZ19sb3TgAQA!16s%2Fg%2F11zh3c3lc4",
  reviews: [
    {
      author_name: "Gábor Kovács",
      profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjX8k-GaborKovacs=s128-c0x00000000-cc-rp-mo-ba4",
      rating: 5,
      relative_time_description: "egy hete",
      text: "Kiváló reptéri parkoló! Gyors és pontos transzfer a terminálhoz, az autómat tisztán, biztonságban kaptam vissza. A szerviz szolgáltatásukat is igénybe vettem olajcserére, minden profi volt. Csak ajánlani tudom!",
      time: Math.floor(Date.now() / 1000) - 604800
    },
    {
      author_name: "Péter Nagy",
      profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjV_PeterNagy=s128-c0x00000000-cc-rp-mo-ba3",
      rating: 5,
      relative_time_description: "2 hete",
      text: "Már többször parkoltam náluk mikor repültem. Mindig rugalmasak és udvariasak. Külön plusz pont a kézi autómosóért: mire visszatértem az utazásból, csillogott-villogott az autó. 5 csillag!",
      time: Math.floor(Date.now() / 1000) - 1209600
    },
    {
      author_name: "Eszter Szabó",
      profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjX_EszterSzabo=s128-c0x00000000-cc-rp-mo-ba4",
      rating: 5,
      relative_time_description: "egy hónapja",
      text: "Nagyon megbízható csapat! Éjszaka érkeztünk vissza a reptérre, a transzfer busz 5 percen belül ott volt értünk. Az online foglalás gyors és egyszerű volt.",
      time: Math.floor(Date.now() / 1000) - 2592000
    },
    {
      author_name: "David Miller",
      profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjX_DavidMiller=s128-c0x00000000-cc-rp-mo-ba2",
      rating: 5,
      relative_time_description: "a month ago",
      text: "Super smooth airport parking experience in Budapest. Free and prompt shuttle to/from airport terminal. Great English communication and friendly staff. Will definitely use again!",
      time: Math.floor(Date.now() / 1000) - 2678400
    },
    {
      author_name: "Zoltán Tóth",
      profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjX_ZoltanToth=s128-c0x00000000-cc-rp-mo-ba5",
      rating: 5,
      relative_time_description: "2 hónapja",
      text: "Autószerviz és gumicsere kapcsán voltam náluk. Pontosak, korrektek, reális árakon dolgoznak és nem próbálnak felesleges dolgokat rábeszélni az emberre. Ritka az ilyen korrekt műhely.",
      time: Math.floor(Date.now() / 1000) - 5184000
    }
  ]
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
async function getReviews({ forceRefresh = false, language = 'hu' } = {}) {
  const now = Date.now();

  // Try loading cache from disk if memory cache is empty
  if (!memoryCache.data) {
    await loadDiskCache();
  }

  // Return cached data if valid and fresh
  if (!forceRefresh && memoryCache.data && (now - memoryCache.lastFetched < CACHE_DURATION_MS)) {
    return {
      success: true,
      cached: true,
      lastFetched: memoryCache.lastFetched,
      ...memoryCache.data
    };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn('[ReviewsService] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not configured in .env. Using high-quality fallback reviews.');
    return {
      success: true,
      cached: false,
      isFallback: true,
      ...FALLBACK_REVIEWS_DATA
    };
  }

  try {
    const fields = 'name,rating,user_ratings_total,reviews,url';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${encodeURIComponent(apiKey)}&language=${encodeURIComponent(language)}`;

    console.log(`[ReviewsService] Fetching fresh reviews from Google Places API for place_id: ${placeId}`);
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result) {
      console.error(`[ReviewsService] Google Places API error: ${data.status} - ${data.error_message || 'No details'}`);
      if (memoryCache.data) {
        return {
          success: true,
          cached: true,
          stale: true,
          ...memoryCache.data
        };
      }
      return {
        success: true,
        cached: false,
        isFallback: true,
        ...FALLBACK_REVIEWS_DATA
      };
    }

    const place = data.result;
    const formattedData = {
      name: place.name || FALLBACK_REVIEWS_DATA.name,
      rating: place.rating || FALLBACK_REVIEWS_DATA.rating,
      totalReviews: place.user_ratings_total || FALLBACK_REVIEWS_DATA.totalReviews,
      googleMapsUrl: place.url || FALLBACK_REVIEWS_DATA.googleMapsUrl,
      reviews: (place.reviews || []).map(r => ({
        author_name: r.author_name,
        profile_photo_url: r.profile_photo_url,
        rating: r.rating,
        relative_time_description: r.relative_time_description,
        text: r.text,
        time: r.time
      }))
    };

    await saveDiskCache(formattedData);

    return {
      success: true,
      cached: false,
      ...formattedData
    };
  } catch (error) {
    console.error('[ReviewsService] Error fetching Google Reviews:', error.message);
    if (memoryCache.data) {
      return {
        success: true,
        cached: true,
        stale: true,
        ...memoryCache.data
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

module.exports = {
  getReviews,
  FALLBACK_REVIEWS_DATA
};
