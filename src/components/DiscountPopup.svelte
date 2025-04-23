<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';

  let showPopup = false;
  let hasShown = false;

  onMount(() => {
    // Show popup after 5 seconds
    setTimeout(() => {
      showPopup = true;
    }, 5000);
  });

  function closePopup() {
    showPopup = false;
    hasShown = true;
    localStorage.setItem('discountPopupShown', 'true');
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closePopup();
    }
  }
</script>

{#if showPopup && !hasShown}
  <div 
    class="popup-overlay" 
    on:click={closePopup}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label="Discount Popup"
    tabindex="-1"
  >
    <div 
      class="popup-content" 
      on:click|stopPropagation
      role="document"
      on:keydown={handleKeydown}
    >
      <button 
        class="close-button" 
        on:click={closePopup} 
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="popup-text">
        <h2>{$currentLang === 'hu' ? '20% KEDVEZMÉNY' : '20% DISCOUNT'}</h2>
        <p>{$currentLang === 'hu' 
          ? 'Foglaljon most és kapjon 20%-os kedvezményt első szolgáltatásunkra!'
          : 'Book now and get 20% off your first service!'}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    position: relative;
    max-width: 90%;
    width: 400px;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .popup-text {
    text-align: center;
  }

  .popup-text h2 {
    color: var(--primary);
    margin-bottom: 1rem;
  }

  .popup-text p {
    color: var(--text);
    margin-bottom: 1rem;
  }
</style> 