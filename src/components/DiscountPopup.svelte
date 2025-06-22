<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';

  let showPopup = false;
  let hasShown = false;
  let cookieConsentClosed = false;

  // Subscribe to language changes (already present, good)
  let lang;
  currentLang.subscribe(value => {
    lang = value;
  });

  onMount(() => {
    // Check if popup has been shown before
    hasShown = localStorage.getItem('discountPopupShown') === 'true';

    // Check cookie consent status
    const cookieConsent = localStorage.getItem('cookieConsent');
    cookieConsentClosed = !!cookieConsent;

    // Function to show popup with delay
    const showPopupWithDelay = () => {
      if (!hasShown) {
        // Delay showing the popup for 5 seconds
        setTimeout(() => {
          showPopup = true;
        }, 5000);
      }
    };

    // If cookie consent already closed, show popup after delay
    if (cookieConsentClosed) {
      showPopupWithDelay();
    } else {
      // Otherwise, wait for cookie consent to be closed
      const checkCookieConsent = setInterval(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent) {
          cookieConsentClosed = true;
          clearInterval(checkCookieConsent);
          showPopupWithDelay();
        }
      }, 1000); // Check every second

      // Fallback: Show after 15 seconds regardless of cookie consent
      // This ensures popup shows even if user doesn't interact with cookie banner
      setTimeout(() => {
        if (!showPopup && !hasShown) {
          showPopup = true;
          clearInterval(checkCookieConsent);
        }
      }, 15000); // Fallback after 15 seconds
    }
  });

  // Function to close the popup
  function closePopup() {
    showPopup = false;
    hasShown = true; // Mark as shown
    localStorage.setItem('discountPopupShown', 'true'); // Save state to localStorage
  }

  // Handle Escape key to close popup
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
    aria-label={lang === 'hu' ? 'Kedvezmény Popup' : 'Discount Popup'}
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
        aria-label={lang === 'hu' ? 'Bezárás' : 'Close'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="popup-text">
        <div class="discount-badge">20%</div>
        <h2>
          {lang === 'hu' ? 'Kedvezmény Autómosásra!' : 'Off Your Car Wash!'}
        </h2>
        <p>
          {lang === 'hu'
            ? 'Parkolj autóddal repülőtéri parkolónkban, és élvezd a 20% kedvezményt az autómosás árából.'
            : 'Park your car at our airport parking and enjoy a 20% discount on your car wash.'}
        </p>

        <div class="offer-note">
          {lang === 'hu'
            ? 'Az ajánlat minden repülőtéri parkoló ügyfél számára érvényes.'
            : 'Offer valid for all airport parking customers.'}
        </div>

        <button class="discount-btn" on:click={closePopup}>
          {lang === 'hu' ? 'MEGÉRTETTEM' : 'GOT IT'}
        </button>
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
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9998; /* Lower than cookie consent */
    padding: 1rem;
    animation: fadeIn 0.4s ease-out;
    overflow-y: auto;
  }

  .popup-content {
    position: relative;
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(19, 21, 26, 0.98));
    border-radius: 24px;
    max-width: 600px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .popup-text {
    padding: 3rem 2rem;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  .discount-badge {
    font-size: 4rem;
    font-weight: 900;
    line-height: 1;
    color: var(--primary, #00bae5);
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(0, 186, 229, 0.4);
  }

  h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 800;
    line-height: 1.2;
  }

  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .offer-note {
    font-size: 0.9rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }

  .discount-btn {
    background-color: var(--primary, #00bae5);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: auto;
    display: inline-block;
    box-shadow: 0 0 20px rgba(0, 186, 229, 0.3);
  }

  .discount-btn:hover {
    background-color: var(--primary-dark, #0088cc);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 186, 229, 0.4);
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: rotate(90deg);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .popup-text {
      padding: 2.5rem 1.5rem;
    }

    .discount-badge {
      font-size: 3.5rem;
    }

    h2 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1rem;
    }

    .discount-btn {
      padding: 0.9rem 2rem;
      font-size: 0.95rem;
    }
  }

  @media screen and (max-width: 480px) {
    .popup-content {
      border-radius: 16px;
    }

    .popup-text {
      padding: 2rem 1rem;
    }

    .discount-badge {
      font-size: 3rem;
    }

    h2 {
      font-size: 1.6rem;
    }

    p {
      font-size: 0.95rem;
    }

    .offer-note {
      font-size: 0.85rem;
    }

    .discount-btn {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
    }

    .close-button {
      width: 32px;
      height: 32px;
    }
  }
</style>