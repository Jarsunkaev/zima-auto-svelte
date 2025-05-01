

<script>
  import { currentLang, t } from '../lib/i18n';
  import { onMount } from 'svelte';

  export let navigate;
  export let currentPage;

  let scrolled = false;
  let mobileMenuOpen = false;
  let lang;

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  // Function to toggle language based on the clicked element
  function toggleLanguage(selectedLang) {
    currentLang.set(selectedLang);
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    // Prevent body scrolling when menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function handleNavClick(page) {
    navigate(page);
    mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  function handleLogoKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate('home');
    }
  }

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll);

    // Handle ESC key to close mobile menu
    const handleKeydown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        mobileMenuOpen = false;
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<header class:scrolled>
  <div class="container">
    <div
      class="logo"
      on:click={() => navigate('home')}
      on:keydown={handleLogoKeydown}
      tabindex="0"
      role="button"
      aria-label="Go to homepage"
    >
      <img src="images/zima-logo.avif" alt="Zima Auto" />
    </div>

    <nav class:open={mobileMenuOpen}>
      <ul>
        <li class:active={currentPage === 'home'}>
          <a href="#home" on:click|preventDefault={() => handleNavClick('home')}>
            {t('nav.home', $currentLang)}
          </a>
        </li>
        <li class:active={currentPage === 'booking'}>
          <a href="#booking" on:click|preventDefault={() => handleNavClick('booking')}>
            {t('nav.booking', $currentLang)}
          </a>
        </li>
        <li class:active={currentPage === 'about'}>
          <a href="#about" on:click|preventDefault={() => handleNavClick('about')}>
            {t('nav.about', $currentLang)}
          </a>
        </li>
        <li class:active={currentPage === 'services'}>
          <a href="#services" on:click|preventDefault={() => handleNavClick('services')}>
            {t('nav.services', $currentLang)}
          </a>
        </li>
        <li class:active={currentPage === 'contact'}>
          <a href="#contact" on:click|preventDefault={() => handleNavClick('contact')}>
            {t('nav.contact', $currentLang)}
          </a>
        </li>
      </ul>
    </nav>

    <div class="right-section">
      <div class="language-toggle">
        <button
          class="language-button {currentLang === 'hu' ? 'active' : ''}"
          on:click={() => toggleLanguage('hu')}
          aria-label="Magyar nyelv"
        >
          <img src="/flags/hu.svg" alt="Magyar zászló" width="24" height="16" />
          <span>HU</span>
        </button>
        <button
          class="language-button {currentLang === 'en' ? 'active' : ''}"
          on:click={() => toggleLanguage('en')}
          aria-label="English language"
        >
          <img src="/flags/gb.svg" alt="British flag" width="24" height="16" />
          <span>EN</span>
        </button>
      </div>

      <button
        class="mobile-menu-toggle"
        class:open={mobileMenuOpen}
        on:click={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</header>

<style>
  :global(:root) {
    --primary: rgba(0, 186, 229, 1);
    --primary-dark: rgba(0, 150, 190, 1);
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    padding: 1.5rem 0;
    transition: all 0.3s ease;
    background-color: transparent;
  }

  header.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 1rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    z-index: 1001;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .logo:focus {
    outline: 2px solid var(--primary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  .logo img {
    height: 50px;
    transition: all 0.3s ease;
  }

  header.scrolled .logo img {
    height: 40px;
  }

  nav {
    display: flex;
    align-items: center;
  }

  nav ul {
    display: flex;
    list-style: none;
    gap: 2.5rem;
  }

  nav li a {
    font-weight: 600;
    position: relative;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    color: white; /* Default color on dark backgrounds */
    padding: 0.5rem 0;
  }

  header.scrolled nav li a {
    color: #333; /* Color when on light background */
  }

  nav li a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary);
    transition: width 0.3s ease;
  }

  nav li a:hover::after,
  nav li a:focus::after,
  nav li.active a::after {
    width: 100%;
  }

  nav li a:focus {
    outline: none;
  }

  nav li.active a {
    color: var(--primary);
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    z-index: 1001;
  }

  .language-toggle {
    display: flex;
    gap: 0.5rem;
    margin-left: 2rem;
  }

  .language-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  header.scrolled .language-button {
    color: #333;
    border-color: rgba(0, 0, 0, 0.1);
  }

  .language-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  header.scrolled .language-button:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
  }

  .language-button.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }

  header.scrolled .language-button.active {
    background: rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.2);
  }

  .language-button img {
    width: 24px;
    height: 16px;
    object-fit: cover;
    border-radius: 2px;
  }

  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    background: none;
    border: none;
    z-index: 1001;
    padding: 0;
    cursor: pointer;
  }

  .mobile-menu-toggle:focus {
    outline: 2px solid var(--primary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  .mobile-menu-toggle span {
    width: 100%;
    height: 2px;
    background-color: white; /* Default color on dark backgrounds */
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  header.scrolled .mobile-menu-toggle span {
    background-color: #333; /* Color when on light background */
  }

  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .mobile-menu-toggle {
      display: flex;
    }

    nav {
      position: fixed;
      top: 0;
      right: -100%;
      width: 100%;
      height: 100vh;
      background-color: rgba(19, 21, 26, 0.98);
      flex-direction: column;
      justify-content: center;
      transition: all 0.4s ease;
      backdrop-filter: blur(10px);
    }

    nav.open {
      right: 0;
    }

    nav ul {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
    }

    nav li a {
      font-size: 1.5rem;
      color: white;
      opacity: 0.9;
      padding: 0.5rem 1rem;
      display: block;
      text-align: center;
    }

    nav li a:hover,
    nav li a:focus,
    nav li.active a {
      opacity: 1;
      color: var(--primary);
    }

    header.scrolled nav li a {
      color: white;
    }

    /* Ensure language toggle text stays white in mobile menu */
    nav.open ~ .right-section .language-button {
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
    }

    nav.open ~ .right-section .language-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    nav.open ~ .right-section .language-button.active {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }

    /* Animated hamburger to X transformation */
    .mobile-menu-toggle.open span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }

    .mobile-menu-toggle.open span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.open span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }

    .language-toggle {
      margin-left: 1rem;
    }

    .language-button {
      padding: 0.4rem 0.6rem;
      font-size: 0.85rem;
    }

    .language-button img {
      width: 20px;
      height: 14px;
    }
  }

  @media screen and (max-width: 480px) {
    .language-toggle {
      margin-left: 0.5rem;
    }

    .language-button {
      padding: 0.3rem 0.5rem;
    }
  }
</style>