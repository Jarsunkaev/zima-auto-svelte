<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';

  let showPopup = false;
  let hasShown = false;

  // Subscribe to language changes
  let lang;
  currentLang.subscribe(value => {
    lang = value;
  });

  onMount(() => {
    // Check if popup has been shown before
    hasShown = localStorage.getItem('phoneChangePopupShown') === 'true';

    if (!hasShown) {
      // Show immediately on page load (slight delay for page render)
      setTimeout(() => {
        showPopup = true;
      }, 800);
    }
  });

  // Function to close the popup
  function closePopup() {
    showPopup = false;
    hasShown = true;
    localStorage.setItem('phoneChangePopupShown', 'true');
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
    aria-label={lang === 'hu' ? 'Telefonszám változás' : 'Phone Number Change'}
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
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>

        <h2>
          {lang === 'hu' ? 'Megváltozott a telefonszámunk!' : 'Our phone number has changed!'}
        </h2>

        <p>
          {lang === 'hu'
            ? 'Kérjük, mostantól az alábbi új számon keressen minket.'
            : 'Please contact us at our new number from now on.'}
        </p>

        <a href="tel:+36705859959" class="phone-number">
          +36 70 585 9959
        </a>

        <button class="confirm-btn" on:click={closePopup}>
          {lang === 'hu' ? 'Rendben' : 'OK'}
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
    z-index: 9997; /* Below cookie consent and discount popup */
    padding: 1rem;
    animation: fadeIn 0.4s ease-out;
    overflow-y: auto;
  }

  .popup-content {
    position: relative;
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(19, 21, 26, 0.98));
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
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(0, 186, 229, 0.15), rgba(0, 186, 229, 0.05));
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    color: var(--primary, #00bae5);
    border: 2px solid rgba(0, 186, 229, 0.2);
    animation: pulseGlow 2s ease-in-out infinite;
  }

  h2 {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    font-weight: 800;
    line-height: 1.2;
  }

  p {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    max-width: 380px;
    margin-left: auto;
    margin-right: auto;
  }

  .phone-number {
    display: block;
    font-size: 2rem;
    font-weight: 900;
    color: var(--primary, #00bae5);
    text-decoration: none;
    margin-bottom: 2rem;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    text-shadow: 0 0 20px rgba(0, 186, 229, 0.3);
  }

  .phone-number:hover {
    color: white;
    text-shadow: 0 0 30px rgba(0, 186, 229, 0.5);
    transform: scale(1.03);
  }

  .confirm-btn {
    background-color: var(--primary, #00bae5);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 1rem 3rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-block;
    box-shadow: 0 0 20px rgba(0, 186, 229, 0.3);
  }

  .confirm-btn:hover {
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

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 10px rgba(0, 186, 229, 0.1);
    }
    50% {
      box-shadow: 0 0 25px rgba(0, 186, 229, 0.25);
    }
  }

  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .popup-text {
      padding: 2.5rem 1.5rem;
    }

    h2 {
      font-size: 1.6rem;
    }

    p {
      font-size: 1rem;
    }

    .phone-number {
      font-size: 1.7rem;
    }

    .confirm-btn {
      padding: 0.9rem 2.5rem;
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

    .phone-icon {
      width: 64px;
      height: 64px;
    }

    .phone-icon svg {
      width: 32px;
      height: 32px;
    }

    h2 {
      font-size: 1.4rem;
    }

    p {
      font-size: 0.95rem;
    }

    .phone-number {
      font-size: 1.5rem;
    }

    .confirm-btn {
      padding: 0.8rem 2rem;
      font-size: 0.9rem;
    }

    .close-button {
      width: 32px;
      height: 32px;
    }
  }
</style>
