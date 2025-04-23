<script>
  import { page } from '$app/stores';
  import { currentLang } from '$lib/i18n';
  import CookieConsent from '$lib/components/CookieConsent.svelte';
  import DiscountPopup from '$lib/components/DiscountPopup.svelte';

  // Update locale when currentLang changes
  $: if (currentLang) {
    // Store the language preference if needed
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', $currentLang);
    }
  }

  // Handle language switch
  function switchLanguage(lang) {
    currentLang.set(lang);
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
    class:active={$currentLang === 'hu'} 
    on:click={() => switchLanguage('hu')}
  >
    HU
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