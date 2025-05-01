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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="popup-text">
        <h2>
          {lang === 'hu' ? '20% Kedvezmény Autómosásra!' : 'Get 20% Off Your Car Wash!'}
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
          {lang === 'hu' ? 'BEZÁRÁS' : 'CLOSE'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Variables (assuming these are defined globally or imported) */
  /*
  :global(:root) {
    --primary: rgba(0, 186, 229, 1);
    --primary-dark: rgba(0, 150, 190, 1);
    --secondary: #13151a;
    --text: #333333;
    --text-light: #666666;
    --light: #f8f9fa;
    --white: #ffffff;
    --gray: #cccccc;
    --dark-gray: #888888;
    --transition: all 0.3s ease;
    --font-family: 'Raleway', sans-serif;
  }
  */

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7); /* Darker overlay */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    padding: 1.5rem; /* Increased padding */
    animation: fadeIn 0.4s ease-out;
    overflow-y: auto; /* Allow scrolling if content is too tall */
  }

  .popup-content {
    position: relative;
    background-image: url('/images/car-wash.jpg'); /* Keep background image */
    background-size: cover;
    background-position: center;
    border-radius: 16px; /* Rounded corners */
    max-width: 600px; /* Max width */
    width: 100%; /* Full width on smaller screens */
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); /* Stronger shadow */
    display: flex;
    flex-direction: column; /* Stack content vertically */
    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    color: white; /* Default text color for content */
  }

  /* Background overlay with frosted glass effect */
  .popup-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(13, 13, 30, 0.85); /* More opaque overlay */
    backdrop-filter: blur(12px); /* Slightly less blur */
    -webkit-backdrop-filter: blur(12px);
    z-index: 0;
  }

  .popup-text {
    position: relative;
    z-index: 2;
    padding: 3rem; /* Consistent padding */
    width: 100%;
    text-align: center; /* Center align text */
  }

  h2 {
    color: white;
    font-size: 2.5rem; /* Slightly larger title */
    margin-bottom: 1rem; /* Reduced bottom margin */
    font-weight: 800; /* Bolder font weight */
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4); /* Softer text shadow */
    line-height: 1.2;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem; /* Reduced bottom margin */
  }

  .offer-note {
    font-style: italic;
    margin-bottom: 2rem; /* Increased bottom margin */
    color: rgba(255, 255, 255, 0.7); /* Slightly less prominent */
    font-size: 0.95rem; /* Slightly larger font size */
  }

  .discount-btn {
    background-color: var(--primary, rgba(0, 186, 229, 1)); /* Use primary color variable */
    color: var(--secondary, #13151a); /* Use secondary color variable for text */
    border: none;
    border-radius: 50px; /* Pill shape */
    padding: 1rem 2.5rem; /* Increased padding */
    font-size: 1.1rem; /* Slightly larger font size */
    font-weight: 700; /* Bolder font weight */
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    width: auto; /* Auto width based on content */
    display: inline-block; /* Allow padding to affect size */
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .discount-btn:hover {
    background-color: var(--primary-dark, rgba(0, 150, 190, 1)); /* Use primary dark color variable */
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }

  .close-button {
    position: absolute;
    top: 1.2rem; /* Adjusted position */
    right: 1.2rem; /* Adjusted position */
    background: rgba(255, 255, 255, 0.15); /* Slightly more visible background */
    border: none;
    width: 40px; /* Larger button */
    height: 40px; /* Larger button */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px); /* Add blur to the button background */
    -webkit-backdrop-filter: blur(8px);
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.3); /* More visible on hover */
    transform: rotate(90deg);
  }

  /* Animations (kept as they are good) */
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
      padding: 2rem 1.5rem; /* Adjusted padding */
    }

    h2 {
      font-size: 2rem; /* Adjusted font size */
    }

    p {
      font-size: 1rem; /* Adjusted font size */
    }

    .discount-btn {
       padding: 0.9rem 2rem; /* Adjusted padding */
       font-size: 1rem; /* Adjusted font size */
    }

    .close-button {
      width: 36px;
      height: 36px;
      top: 1rem;
      right: 1rem;
    }
  }

  @media screen and (max-width: 480px) {
    .popup-overlay {
      padding: 1rem; /* Reduced padding */
    }
    h2 {
      font-size: 1.6rem; /* Adjusted font size */
    }

    p {
      font-size: 0.95rem; /* Adjusted font size */
    }

    .offer-note {
      font-size: 0.85rem; /* Adjusted font size */
    }

    .discount-btn {
      padding: 0.8rem 1.5rem; /* Adjusted padding */
      font-size: 0.9rem; /* Adjusted font size */
    }
  }
</style>
