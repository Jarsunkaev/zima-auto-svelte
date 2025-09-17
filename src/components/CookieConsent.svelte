<script>
    import { onMount } from 'svelte';
    import { currentLang } from '../lib/i18n';
  
    // Config for cookie consent
    const config = {
      necessary: {
        title: {
          hu: 'Szükséges Cookie-k',
          en: 'Necessary Cookies'
        },
        description: {
          hu: 'Ezek a cookie-k a weboldal működéséhez szükségesek, és nem kapcsolhatók ki.',
          en: 'These cookies are required for the website to function and cannot be switched off.'
        }
      },
      analytics: {
        title: {
          hu: 'Analitikai Cookie-k',
          en: 'Analytics Cookies'
        },
        description: {
          hu: 'Ezek a cookie-k segítenek megérteni, hogyan használják a látogatók a weboldalt.',
          en: 'These cookies help us understand how visitors interact with our website.'
        }
      }
    };
  
    let lang;
    let analyticsEnabled = false;
    
    // Subscribe to language changes
    currentLang.subscribe(value => {
      lang = value;
    });
  
    let consentShown = false;
    let showPreferences = false;
    
    // Check if consent was already given
    function checkCookieConsent() {
      const consent = localStorage.getItem('cookieConsent');
      return consent ? JSON.parse(consent) : null;
    }
  
    function saveConsent(categories) {
      localStorage.setItem('cookieConsent', JSON.stringify({
        necessary: true, // Always necessary
        analytics: categories.includes('analytics'),
        date: new Date().toISOString()
      }));
      consentShown = false;
    }
  
    function acceptAll() {
      saveConsent(['necessary', 'analytics']);
    }
  
    function acceptNecessary() {
      saveConsent(['necessary']);
    }
  
    function togglePreferences() {
      showPreferences = !showPreferences;
    }
  
    onMount(() => {
      // Check if consent was already given
      const existingConsent = checkCookieConsent();
      
      if (!existingConsent) {
        // Show consent banner if no consent found
        setTimeout(() => {
          consentShown = true;
        }, 1000);
      } else {
        // Set analytics checkbox based on saved preferences
        analyticsEnabled = existingConsent.analytics || false;
      }
    });
  </script>
  
  {#if consentShown}
    <div class="cookie-consent-container">
      <div class="cookie-consent-banner">
        <div class="cookie-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor"/>
            <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
            <circle cx="9" cy="15" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        
        <div class="cookie-content">
          <h2>{lang === 'hu' ? 'Cookie Beállítások' : 'Cookie Settings'}</h2>
          
          <p>{lang === 'hu' 
            ? 'Ez a weboldal cookie-kat használ a jobb felhasználói élmény érdekében. Az "Elfogadom" gombra kattintva hozzájárul a cookie-k használatához. További információt az ' 
            : 'We use cookies to enhance your browsing experience. By clicking "Accept", you consent to our use of cookies. See our '}
            <a href="/privacy" on:click|preventDefault={() => window.location.hash = 'privacy'}>
              {lang === 'hu' ? 'Adatvédelmi Szabályzatban' : 'Privacy Policy'}
            </a>
            {lang === 'hu' ? ' talál.' : ' for more information.'}
          </p>
          
          {#if showPreferences}
            <div class="cookie-preferences">
              <div class="cookie-category">
                <div class="cookie-category-header">
                  <label class="cookie-checkbox-label">
                    <input type="checkbox" checked disabled>
                    <span>{config.necessary.title[lang]}</span>
                  </label>
                </div>
                <p class="cookie-category-description">{config.necessary.description[lang]}</p>
              </div>
              
              <div class="cookie-category">
                <div class="cookie-category-header">
                  <label class="cookie-checkbox-label">
                    <input type="checkbox" bind:checked={analyticsEnabled}>
                    <span>{config.analytics.title[lang]}</span>
                  </label>
                </div>
                <p class="cookie-category-description">{config.analytics.description[lang]}</p>
              </div>
            </div>
          {/if}
        </div>
        
        <div class="cookie-consent-actions">
          <button class="consent-btn preferences-btn" on:click={togglePreferences}>
            {showPreferences 
              ? (lang === 'hu' ? 'Elrejt' : 'Hide') 
              : (lang === 'hu' ? 'Beállítások' : 'Preferences')
            }
          </button>
          
          <button class="consent-btn accept-necessary" on:click={acceptNecessary}>
            {lang === 'hu' ? 'Csak szükséges' : 'Necessary Only'}
          </button>
          
          <button class="consent-btn accept-all" on:click={acceptAll}>
            {lang === 'hu' ? 'Elfogadom' : 'Accept All'}
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .cookie-consent-container {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      width: 95%;
      max-width: 1200px;
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .cookie-consent-banner {
      background-color: #13151a; /* Dark blue footer color */
      color: white;
      border-radius: 12px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
    }
    
    .cookie-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background-color: rgba(255, 255, 255, 0.05);
      color: var(--primary, #00bae5);
    }
    
    .cookie-content {
      flex: 1;
      padding: 1.5rem;
      min-width: 0; /* Prevent content from overflowing */
    }
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: white;
      font-weight: 600;
    }
    
    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1.5rem;
      line-height: 1.6;
      font-size: 0.95rem;
    }
    
    .cookie-preferences {
      background-color: rgba(255, 255, 255, 0.05);
      padding: 1.2rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      max-height: 250px;
      overflow-y: auto;
    }
    
    .cookie-category {
      margin-bottom: 1.2rem;
      padding-bottom: 1.2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cookie-category:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .cookie-category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .cookie-checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      color: white;
      cursor: pointer;
      user-select: none;
    }
    
    .cookie-checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--primary, #00bae5);
    }
    
    .cookie-category-description {
      font-size: 0.85rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      padding-left: 1.5rem;
    }
    
    .cookie-consent-actions {
      display: flex;
      gap: 0.7rem;
      padding: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      background-color: rgba(0, 0, 0, 0.2);
      width: 100%;
    }
    
    .consent-btn {
      padding: 0.7rem 1.2rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .accept-all {
      background-color: var(--primary, #00bae5);
      color: white;
    }
    
    .accept-necessary {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .preferences-btn {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .accept-all:hover {
      background-color: var(--primary-dark, #0088cc);
      transform: translateY(-2px);
    }
    
    .accept-necessary:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    .preferences-btn:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
    }
  
    .cookie-content a {
      color: var(--primary, #00bae5);
      text-decoration: underline;
      transition: all 0.2s ease;
    }
  
    .cookie-content a:hover {
      color: white;
      text-decoration: underline;
    }
  
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    
    /* Responsive Adjustments */
    @media screen and (max-width: 992px) {
      .cookie-consent-container {
        bottom: 0;
        border-radius: 12px 12px 0 0;
        width: 100%;
      }
  
      .cookie-consent-banner {
        border-radius: 12px 12px 0 0;
      }
    }
    
    @media screen and (max-width: 768px) {
      .cookie-icon {
        padding: 1rem;
      }
      
      .cookie-content {
        padding: 1rem;
      }
      
      .cookie-consent-actions {
        padding: 1rem;
        justify-content: center;
      }
      
      .consent-btn {
        flex: 1;
        text-align: center;
        padding: 0.7rem 0.5rem;
        font-size: 0.85rem;
      }
  
      h2 {
        font-size: 1.3rem;
      }
    }
    
    @media screen and (max-width: 480px) {
      .cookie-icon {
        display: none;
      }
      
      .consent-btn {
        padding: 0.6rem 0.4rem;
        font-size: 0.8rem;
      }
    }
  </style>