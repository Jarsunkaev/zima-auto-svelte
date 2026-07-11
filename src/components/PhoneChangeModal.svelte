<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';

  let showPopup = false;
  let hasShown = false;
  let cookieConsentClosed = false;

  let lang;
  currentLang.subscribe(value => {
    lang = value;
  });

  onMount(() => {
    hasShown = localStorage.getItem('phoneChangeModalClosed') === 'true';
    
    // Fallback: If it's already shown, just ensure the flag is set so DiscountPopup can show.
    if (hasShown) {
        localStorage.setItem('phoneChangeModalClosed', 'true');
    }

    const showPopupWithDelay = () => {
      if (!hasShown) {
        setTimeout(() => {
          showPopup = true;
        }, 4000);
      }
    };

    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) {
      showPopupWithDelay();
    } else {
      const checkCookieConsent = setInterval(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent) {
          clearInterval(checkCookieConsent);
          showPopupWithDelay();
        }
      }, 1000);

      setTimeout(() => {
        if (!showPopup && !hasShown) {
          showPopup = true;
          clearInterval(checkCookieConsent);
        }
      }, 12000); // show anyway after 12s
    }
  });

  function closePopup() {
    showPopup = false;
    hasShown = true;
    localStorage.setItem('phoneChangeModalClosed', 'true');
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
    aria-label={lang === 'hu' ? 'Telefonszám Változás' : 'Phone Number Change'}
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
        <div class="phone-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        <h2>
          {lang === 'hu' ? 'Fontos Tájékoztatás' : 'Important Notice'}
        </h2>
        <p>
          {lang === 'hu'
            ? 'Felhívjuk figyelmét, hogy központi telefonszámunk megváltozott:'
            : 'Please note that our central phone number has changed to:'}
        </p>
        <div class="phone-number">
          +36 70 585 9959
        </div>

        <button class="action-btn" on:click={closePopup}>
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
    z-index: 9999; /* Higher than other popups */
    padding: 1rem;
    animation: fadeIn 0.4s ease-out;
    overflow-y: auto;
  }

  .popup-content {
    position: relative;
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(27, 42, 75, 0.98));
    border-radius: 24px;
    max-width: 500px;
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

  .phone-icon {
    color: white;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
  }

  h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 800;
    line-height: 1.2;
  }

  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .phone-number {
    font-size: 2.2rem;
    font-weight: 900;
    color: white;
    margin-bottom: 2rem;
    letter-spacing: 1px;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  .action-btn {
    background-color: var(--primary, #00bae5);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 1rem 3rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 10px 20px rgba(0, 186, 229, 0.3);
  }

  .action-btn:hover {
    background-color: white;
    color: var(--primary, #00bae5);
    transform: translateY(-3px);
    box-shadow: 0 15px 25px rgba(0, 186, 229, 0.4);
  }

  .close-button {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media screen and (max-width: 480px) {
    .popup-text {
      padding: 2.5rem 1.5rem;
    }
    
    h2 {
      font-size: 1.8rem;
    }
    
    .phone-number {
      font-size: 1.8rem;
    }
  }
</style>
