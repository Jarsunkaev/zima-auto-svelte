<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';

  let showPopup = false;
  let hasShown = false;
  let cookieConsentClosed = false;

  onMount(() => {
    // Check if popup has been shown before
    hasShown = localStorage.getItem('discountPopupShown') === 'true';
    
    // Check cookie consent status
    const cookieConsent = localStorage.getItem('cookieConsent');
    cookieConsentClosed = !!cookieConsent;
    
    // Function to show popup with delay
    const showPopupWithDelay = () => {
      if (!hasShown) {
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
      }, 1000);
      
      // Fallback: Show after 15 seconds regardless of cookie consent
      // This ensures popup shows even if user doesn't interact with cookie banner
      setTimeout(() => {
        if (!showPopup && !hasShown) {
          showPopup = true;
          clearInterval(checkCookieConsent);
        }
      }, 15000);
    }
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
        <h2>{$currentLang === 'hu' ? '20% kedvezmény autómosásra!' : 'Get 20% Off Your Car Wash!'}</h2>
        <p>
          {$currentLang === 'hu' 
            ? 'Parkolj autóddal repülőtéri parkolónkban, és élvezd a 20% kedvezményt az autómosás árából.'
            : 'Park your car at our airport parking and enjoy a 20% discount on your car wash.'}
        </p>
        
        <div class="offer-note">
          {$currentLang === 'hu' 
            ? 'Az ajánlat minden repülőtéri parkoló ügyfél számára érvényes.'
            : 'Offer valid for all airport parking customers.'}
        </div>
        
        <button class="discount-btn" on:click={closePopup}>
          {$currentLang === 'hu' ? 'BEZÁRÁS' : 'CLOSE'}
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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    padding: 1rem;
    animation: fadeIn 0.4s ease-out;
  }

  .popup-content {
    position: relative;
    background-image: url('/images/car-wash.jpg');
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    max-width: 600px;
    width: 90%;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35);
    display: flex;
    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Background overlay with frosted glass effect */
  .popup-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(13, 13, 30, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    z-index: 0;
  }

  .popup-text {
    position: relative;
    z-index: 2;
    padding: 3rem;
    width: 100%;
  }

  h2 {
    color: white;
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
    font-weight: 700;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .discount-btn {
    background-color: #13151a; /* Dark blue matching footer */
    color: white;
    border: none;
    border-radius: 50px;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .discount-btn:hover {
    background-color: #1e212a; /* Slightly lighter dark blue on hover */
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
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
    color: white;
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }

  .discount-badge {
    position: absolute;
    bottom: -20px;
    right: 30px;
    background: var(--primary, #00bae5);
    color: white;
    padding: 0.7rem 0;
    font-weight: 800;
    font-size: 1.2rem;
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    transform: rotate(-3deg);
  }

  .discount-badge span {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .offer-note {
    font-style: italic;
    margin-bottom: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { 
      opacity: 0; 
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Responsive Adjustments */
  @media screen and (max-width: 768px) {
    .popup-content {
      width: 95%;
    }

    .popup-text {
      padding: 2.5rem 1.5rem;
    }

    h2 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1rem;
    }

    .discount-badge {
      font-size: 1.2rem;
      padding: 0.4rem 1.2rem 0.4rem 0.8rem;
    }
  }

  @media screen and (max-width: 480px) {
    h2 {
      font-size: 1.5rem;
    }

    .discount-btn {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
    }
  }
</style>