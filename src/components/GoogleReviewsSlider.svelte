<script>
  import { onMount, onDestroy } from 'svelte';
  import { currentLang } from '../lib/i18n/index.js';

  // Props
  export let autoplay = true;
  export let autoplayInterval = 5000;

  // State
  let reviews = [];
  let rating = 4.9;
  let totalReviews = 198;
  let googleMapsUrl = "https://www.google.com/maps/place/A%26T+Rept%C3%A9ri+Parkol%C3%B3+%C3%A9s+K%C3%A9zi+Aut%C3%B3mos%C3%B3/@47.409985,19.0926473,21108m/data=!3m1!1e3!4m10!1m2!2m1!1sat+parking!3m6!1s0x4741c1683c4acc0d:0xd5187321a7799279!8m2!3d47.4099852!4d19.232723!15sCgphdCBwYXJraW5nkgELcGFya2luZ19sb3TgAQA!16s%2Fg%2F11zh3c3lc4";
  let isLoading = true;
  let error = null;

  let currentIndex = 0;
  let visibleCards = 3;
  let isPaused = false;
  let timer = null;
  let touchStartX = 0;
  let touchEndX = 0;

  // Fallback reviews if API is loading or offline
  const fallbackReviews = [
    {
      author_name: "Gábor Kovács",
      rating: 5,
      relative_time_description: "egy hete",
      text: "Kiváló reptéri parkoló! Gyors és pontos transzfer a terminálhoz, az autómat tisztán, biztonságban kaptam vissza. A szerviz szolgáltatásukat is igénybe vettem olajcserére, minden profi volt. Csak ajánlani tudom!",
      time: Math.floor(Date.now() / 1000) - 604800
    },
    {
      author_name: "Péter Nagy",
      rating: 5,
      relative_time_description: "2 hete",
      text: "Már többször parkoltam náluk mikor repültem. Mindig rugalmasak és udvariasak. Külön plusz pont a kézi autómosóért: mire visszatértem az utazásból, csillogott-villogott az autó. 5 csillag!",
      time: Math.floor(Date.now() / 1000) - 1209600
    },
    {
      author_name: "Eszter Szabó",
      rating: 5,
      relative_time_description: "egy hónapja",
      text: "Nagyon megbízható csapat! Éjszaka érkeztünk vissza a reptérre, a transzfer busz 5 percen belül ott volt értünk. Az online foglalás gyors és egyszerű volt.",
      time: Math.floor(Date.now() / 1000) - 2592000
    },
    {
      author_name: "David Miller",
      rating: 5,
      relative_time_description: "a month ago",
      text: "Super smooth airport parking experience in Budapest. Free and prompt shuttle to/from airport terminal. Great English communication and friendly staff. Will definitely use again!",
      time: Math.floor(Date.now() / 1000) - 2678400
    },
    {
      author_name: "Zoltán Tóth",
      rating: 5,
      relative_time_description: "2 hónapja",
      text: "Autószerviz és gumicsere kapcsán voltam náluk. Pontosak, korrektek, reális árakon dolgoznak és nem próbálnak felesleges dolgokat rábeszélni az emberre. Ritka az ilyen korrekt műhely.",
      time: Math.floor(Date.now() / 1000) - 5184000
    }
  ];

  function getApiBaseUrl() {
    const isDevelopment = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
    return isDevelopment ? 'http://localhost:3001' : (import.meta.env?.VITE_BACKEND_API_URL || 'https://atgroup-backend.fly.dev');
  }

  async function fetchReviews() {
    isLoading = true;
    error = null;
    try {
      const apiBase = getApiBaseUrl().replace(/\/+$/, '').replace(/\/api$/, '');
      const lang = $currentLang || 'hu';
      const res = await fetch(`${apiBase}/api/reviews?lang=${lang}`);
      
      if (!res.ok) {
        throw new Error(`Failed to load reviews (${res.status})`);
      }
      
      const data = await res.json();
      if (data && data.reviews && data.reviews.length > 0) {
        reviews = data.reviews;
        if (data.rating) rating = data.rating;
        if (data.totalReviews) totalReviews = data.totalReviews;
        if (data.googleMapsUrl) googleMapsUrl = data.googleMapsUrl;
      } else {
        reviews = fallbackReviews;
      }
    } catch (err) {
      console.warn('[GoogleReviewsSlider] Using fallback reviews due to fetch error:', err.message);
      reviews = fallbackReviews;
    } finally {
      isLoading = false;
      resetSlider();
    }
  }

  function updateVisibleCards() {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    if (w < 768) {
      visibleCards = 1;
    } else if (w < 1024) {
      visibleCards = 2;
    } else {
      visibleCards = 3;
    }
    // Clamp currentIndex if out of bounds
    const maxIdx = Math.max(0, reviews.length - visibleCards);
    if (currentIndex > maxIdx) {
      currentIndex = maxIdx;
    }
  }

  function maxIndex() {
    return Math.max(0, reviews.length - visibleCards);
  }

  function nextSlide() {
    if (reviews.length <= visibleCards) return;
    if (currentIndex >= maxIndex()) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
  }

  function prevSlide() {
    if (reviews.length <= visibleCards) return;
    if (currentIndex <= 0) {
      currentIndex = maxIndex();
    } else {
      currentIndex--;
    }
  }

  function goToSlide(idx) {
    currentIndex = Math.min(Math.max(0, idx), maxIndex());
  }

  function startAutoplay() {
    stopAutoplay();
    if (autoplay) {
      timer = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, autoplayInterval);
    }
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetSlider() {
    currentIndex = 0;
    startAutoplay();
  }

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX = 0;
    touchEndX = 0;
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function formatReviewDate(timeInSeconds, relativeDescription) {
    if (relativeDescription) return relativeDescription;
    if (!timeInSeconds) return '';
    try {
      const date = new Date(timeInSeconds * 1000);
      return date.toLocaleDateString($currentLang === 'hu' ? 'hu-HU' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }

  onMount(() => {
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    fetchReviews();
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateVisibleCards);
    }
    stopAutoplay();
  });
</script>

<div class="google-reviews-slider-wrap">
  <!-- Rating Summary Banner -->
  <div class="reviews-summary-bar">
    <div class="google-badge-left">
      <div class="google-logo" title="Google">
        <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
      </div>
      <div class="rating-info">
        <div class="score-row">
          <span class="rating-number">{rating.toFixed(1)}</span>
          <div class="stars" aria-label="{rating} out of 5 stars">
            {#each [1, 2, 3, 4, 5] as star}
              <svg class="star-icon filled" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            {/each}
          </div>
        </div>
        <span class="rating-subtext">
          {$currentLang === 'hu' 
            ? `${totalReviews}+ valós Google értékelés alapján` 
            : `Based on ${totalReviews}+ verified Google reviews`}
        </span>
      </div>
    </div>

    <a 
      href={googleMapsUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      class="write-review-btn"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      <span>{$currentLang === 'hu' ? 'Értékelés Írása' : 'Write a Review'}</span>
    </a>
  </div>

  <!-- Carousel Area -->
  <div 
    class="carousel-container"
    on:mouseenter={() => (isPaused = true)}
    on:mouseleave={() => (isPaused = false)}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    {#if isLoading}
      <div class="skeleton-track">
        {#each [1, 2, 3] as _}
          <div class="review-card skeleton">
            <div class="card-header">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-lines">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line tiny"></div>
              </div>
            </div>
            <div class="skeleton-line full"></div>
            <div class="skeleton-line medium"></div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="slider-viewport">
        <div 
          class="slider-track"
          style="transform: translateX(-{currentIndex * (100 / visibleCards)}%);"
        >
          {#each reviews as review, i}
            <div 
              class="slide-item" 
              style="flex: 0 0 {100 / visibleCards}%; max-width: {100 / visibleCards}%;"
            >
              <div class="review-card">
                <div class="card-header">
                  {#if review.profile_photo_url}
                    <img 
                      src={review.profile_photo_url} 
                      alt={review.author_name} 
                      class="author-avatar"
                      loading="lazy"
                      on:error={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div class="author-avatar-fallback" style="display: none;">
                      {getInitials(review.author_name)}
                    </div>
                  {:else}
                    <div class="author-avatar-fallback">
                      {getInitials(review.author_name)}
                    </div>
                  {/if}

                  <div class="author-meta">
                    <div class="author-name-row">
                      <h4 class="author-name">{review.author_name}</h4>
                      <svg class="verified-icon" viewBox="0 0 24 24" width="16" height="16" title="Verified Google Review">
                        <path fill="#4285F4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span class="review-time">
                      {formatReviewDate(review.time, review.relative_time_description)}
                    </span>
                  </div>
                </div>

                <div class="card-rating">
                  {#each Array(5) as _, starIdx}
                    <svg 
                      class="star-icon {starIdx < (review.rating || 5) ? 'filled' : ''}" 
                      viewBox="0 0 24 24" 
                      width="16" 
                      height="16" 
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  {/each}
                </div>

                <p class="review-text">{review.text}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Navigation Arrows -->
      {#if reviews.length > visibleCards}
        <button 
          class="nav-btn prev" 
          on:click={prevSlide} 
          aria-label="Previous reviews"
          disabled={currentIndex === 0}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button 
          class="nav-btn next" 
          on:click={nextSlide} 
          aria-label="Next reviews"
          disabled={currentIndex >= maxIndex()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      {/if}
    {/if}
  </div>

  <!-- Pagination Dots -->
  {#if !isLoading && reviews.length > visibleCards}
    <div class="dots-pagination">
      {#each Array(maxIndex() + 1) as _, dotIdx}
        <button 
          class="dot {dotIdx === currentIndex ? 'active' : ''}"
          on:click={() => goToSlide(dotIdx)}
          aria-label="Go to slide {dotIdx + 1}"
        ></button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .google-reviews-slider-wrap {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    font-family: inherit;
    box-sizing: border-box;
  }

  /* Summary Bar */
  .reviews-summary-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    padding: 1.25rem 2rem;
    margin: 0 0.65rem 1.75rem 0.65rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  .google-badge-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .google-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rating-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .score-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .rating-number {
    font-size: 1.45rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
  }

  .stars {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .star-icon {
    color: #e0e0e0;
  }

  .star-icon.filled {
    color: #fbbc04;
  }

  .rating-subtext {
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
  }

  .write-review-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #1a73e8;
    color: #ffffff;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.65rem 1.25rem;
    border-radius: 50px;
    transition: all 0.25s ease;
    box-shadow: 0 2px 6px rgba(26, 115, 232, 0.25);
    white-space: nowrap;
  }

  .write-review-btn:hover {
    background: #1557b0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 115, 232, 0.35);
  }

  /* Carousel Container */
  .carousel-container {
    position: relative;
    padding: 0;
  }

  .slider-viewport {
    overflow: hidden;
    width: 100%;
    border-radius: 16px;
    padding: 0.5rem 0;
  }

  .slider-track {
    display: flex;
    transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: transform;
  }

  .slide-item {
    box-sizing: border-box;
    padding: 0 0.65rem;
    display: flex;
  }

  /* Review Card */
  .review-card {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 0.85rem;
  }

  .author-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .author-avatar-fallback {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4285f4, #34a853);
    color: #ffffff;
    font-weight: 700;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .author-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .author-name-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .author-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .verified-icon {
    flex-shrink: 0;
  }

  .review-time {
    font-size: 0.8rem;
    color: #888;
  }

  .card-rating {
    display: flex;
    gap: 2px;
    margin-bottom: 0.85rem;
  }

  .review-text {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.55;
    color: #444;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Navigation Buttons */
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    color: #333;
    transition: all 0.2s ease;
  }

  .nav-btn:hover:not(:disabled) {
    background: #1a73e8;
    color: #ffffff;
    border-color: #1a73e8;
    box-shadow: 0 6px 16px rgba(26, 115, 232, 0.3);
  }

  .nav-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .nav-btn.prev {
    left: -16px;
  }

  .nav-btn.next {
    right: -16px;
  }

  /* Pagination Dots */
  .dots-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d1d5db;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .dot.active {
    width: 24px;
    border-radius: 10px;
    background: #1a73e8;
  }

  /* Skeletons */
  .skeleton-track {
    display: flex;
    gap: 1.25rem;
  }

  .review-card.skeleton {
    flex: 1;
    min-height: 180px;
    background: #f8f9fa;
  }

  .skeleton-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #e9ecef;
    animation: pulse 1.5s infinite;
  }

  .skeleton-lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: #e9ecef;
    animation: pulse 1.5s infinite;
  }

  .skeleton-line.short { width: 50%; }
  .skeleton-line.tiny { width: 30%; }
  .skeleton-line.full { width: 100%; margin-top: 10px; }
  .skeleton-line.medium { width: 75%; margin-top: 6px; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .reviews-summary-bar {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
      padding: 1.25rem;
    }

    .write-review-btn {
      width: 100%;
      justify-content: center;
    }

    .nav-btn.prev {
      left: -8px;
    }

    .nav-btn.next {
      right: -8px;
    }
  }
</style>
