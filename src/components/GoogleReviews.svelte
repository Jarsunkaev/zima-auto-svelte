<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n/index.js';
  
  let reviews = [];
  let isLoading = true;
  let error = null;
  let showAllReviews = false;
  const maxInitialReviews = 3;
  
  async function fetchGoogleReviews() {
    try {
      // Replace with your actual Google Places API endpoint
      const response = await fetch('YOUR_GOOGLE_PLACES_API_ENDPOINT');
      const data = await response.json();
      reviews = data.reviews;
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }

  function toggleReviews() {
    showAllReviews = !showAllReviews;
  }

  function writeReview() {
    // Replace with your actual Google Maps review URL
    window.open('YOUR_GOOGLE_MAPS_REVIEW_URL', '_blank');
  }

  onMount(() => {
    fetchGoogleReviews();
  });
</script>

<div class="google-reviews">
  <div class="reviews-header">
    <h3>{$currentLang === 'hu' ? 'Google Értékelések' : 'Google Reviews'}</h3>
    <button class="write-review-btn" on:click={writeReview}>
      {$currentLang === 'hu' ? 'Értékelés Írása' : 'Write a Review'}
    </button>
  </div>

  {#if isLoading}
    <div class="loading">Loading reviews...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <div class="reviews-grid">
      {#each reviews.slice(0, showAllReviews ? reviews.length : maxInitialReviews) as review}
        <div class="review-card">
          <div class="review-header">
            <img src={review.profile_photo_url} alt={review.author_name} class="reviewer-photo" />
            <div class="reviewer-info">
              <h4>{review.author_name}</h4>
              <div class="rating">
                {#each Array(5) as _, i}
                  <span class="star {i < review.rating ? 'filled' : ''}">★</span>
                {/each}
              </div>
            </div>
          </div>
          <p class="review-text">{review.text}</p>
          <div class="review-date">{new Date(review.time * 1000).toLocaleDateString()}</div>
        </div>
      {/each}
    </div>

    {#if reviews.length > maxInitialReviews}
      <button class="toggle-reviews-btn" on:click={toggleReviews}>
        {showAllReviews 
          ? ($currentLang === 'hu' ? 'Kevesebb Értékelés' : 'Show Less Reviews')
          : ($currentLang === 'hu' ? 'További Értékelések' : 'Show More Reviews')}
      </button>
    {/if}
  {/if}
</div>

<style>
  .google-reviews {
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .write-review-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .write-review-btn:hover {
    background: var(--primary-dark);
  }

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .review-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .review-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .reviewer-photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
  }

  .reviewer-info h4 {
    margin: 0;
    font-size: 1rem;
  }

  .rating {
    color: #ffc107;
  }

  .star {
    font-size: 1.2rem;
  }

  .star.filled {
    color: #ffc107;
  }

  .review-text {
    margin: 1rem 0;
    line-height: 1.5;
  }

  .review-date {
    color: #666;
    font-size: 0.9rem;
  }

  .toggle-reviews-btn {
    margin-top: 2rem;
    background: none;
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .toggle-reviews-btn:hover {
    background: var(--primary);
    color: white;
  }

  .loading, .error {
    text-align: center;
    padding: 2rem;
  }
</style> 