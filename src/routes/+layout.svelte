<script>
  import { page } from '$app/stores';
  import { currentLang } from '$lib/i18n';
  import { addMessages, init, locale } from 'svelte-i18n';
  import en from '$lib/locales/en.js';
  import ru from '$lib/locales/ru.js';
  import CookieConsent from '$lib/components/CookieConsent.svelte';
  import DiscountPopup from '$lib/components/DiscountPopup.svelte';

  // Initialize i18n
  addMessages('en', en);
  addMessages('ru', ru);
  init({
    fallbackLocale: 'en',
    initialLocale: currentLang
  });

  // Update locale when currentLang changes
  $: if (currentLang) {
    locale.set(currentLang);
  }

  // Handle language switch
  function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
  }
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
  <DiscountPopup />
  <CookieConsent />
</div>

<div class="language-switcher">
  <button 
    class:active={$currentLang === 'en'} 
    on:click={() => switchLanguage('en')}
  >
    EN
  </button>
  <button 
    class:active={$currentLang === 'ru'} 
    on:click={() => switchLanguage('ru')}
  >
    RU
  </button>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }

  .language-switcher {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    gap: 0.5rem;
  }

  .language-switcher button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .language-switcher button.active {
    background: #333;
    color: white;
    border-color: #333;
  }
</style> 