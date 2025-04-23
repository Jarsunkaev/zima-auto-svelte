<svelte:options tag={null} />

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
  
  function toggleLanguage() {
    currentLang.set(lang === 'hu' ? 'en' : 'hu');
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
        <button class:active={$currentLang === 'hu'} on:click={() => currentLang.set('hu')}>HU</button>
        <button class:active={$currentLang === 'en'} on:click={() => currentLang.set('en')}>EN</button>
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
  }
  
  .language-toggle button {
    background: none;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    padding: 0.4rem 0.6rem;
    font-weight: 600;
    transition: all 0.3s ease;
    color: white;
  }
  
  header.scrolled .language-toggle button {
    border-color: #ddd;
    color: #333;
  }
  
  .language-toggle button.active {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .language-toggle button:not(.active):hover,
  .language-toggle button:not(.active):focus {
    border-color: var(--primary);
    color: var(--primary);
    outline: none;
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
      background-color: rgba(19, 21, 26, 0.98); /* Dark background with slight transparency */
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
      color: white; /* Always white text in mobile menu */
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
      color: white; /* Keep white text in mobile menu even when header is scrolled */
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
  }
</style>