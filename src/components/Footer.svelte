<svelte:options tag={null} />

<script>
  import { currentLang, t } from '../lib/i18n';
  import { onMount } from 'svelte';

  export let navigate;

  let lang;
  let showBackToTop = false;
  // showDirectionsPopup and related functions are removed
  // as we are now directly linking to Google Maps

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Function to open Google Maps directions to Zima Auto
  function openGoogleMapsDirections() {
    // Updated URL based on user feedback
    window.open('https://www.google.com/maps/place/Zima+Auto+Airport+Parking+-+Aut%C3%B3szerv%C3%ADz+-+Gumiszerv%C3%ADz+-+K%C3%A9zi+aut%C3%B3mos%C3%B3/@47.4099403,19.2301139,17z/data=!3m1!4b1!4m6!3m5!1s0x4741c1ece824d30f:0x632898beef8d5983!8m2!3d47.4099403!4d19.2326888!16s%2Fg%2F11vyx0730g?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D', '_blank');
  }

  onMount(() => {
    const handleScroll = () => {
      showBackToTop = window.scrollY > 300;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<footer>
  <div class="footer-top">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-info">
          <div class="footer-logo">
            <img src="images/zima-logo.avif" alt="Zima Auto" />
          </div>
          <div class="contact-info">
            <h3>{t('footer.visit', $currentLang)}</h3>
            <p class="address">{t('footer.address', $currentLang)}</p>
            <p><strong>{t('footer.phone', $currentLang)}:</strong> {t('footer.phoneNumber', $currentLang)}</p>
            <p><strong>{t('footer.email', $currentLang)}:</strong> {t('footer.emailAddress', $currentLang)}</p>
          </div>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.04001C6.5 2.04001 2 6.53001 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85001C10.44 7.34001 11.93 5.96001 14.22 5.96001C15.31 5.96001 16.45 6.15001 16.45 6.15001V8.62001H15.19C13.95 8.62001 13.56 9.39001 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5879 18.0622 20.3855 19.6099 18.5701C21.1576 16.7546 22.0054 14.4457 22 12.06C22 6.53001 17.5 2.04001 12 2.04001Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <h3>{t('footer.links', $currentLang)}</h3>
          <ul>
            <li>
              <a href="#home" on:click|preventDefault={() => navigate('home')}>
                {t('nav.home', $currentLang)}
              </a>
            </li>
            <li>
              <a href="#booking" on:click|preventDefault={() => navigate('booking')}>
                {t('nav.booking', $currentLang)}
              </a>
            </li>
            <li>
              <a href="#about" on:click|preventDefault={() => navigate('about')}>
                {t('nav.about', $currentLang)}
              </a>
            </li>
            <li>
              <a href="#services" on:click|preventDefault={() => navigate('services')}>
                {t('nav.services', $currentLang)}
              </a>
            </li>
            <li>
              <a href="#contact" on:click|preventDefault={() => navigate('contact')}>
                {t('nav.contact', $currentLang)}
              </a>
            </li>
          </ul>
        </div>

        <div class="footer-map">
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2700.102580768995!2d19.230113876877105!3d47.40994027117247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c1ece824d30f%3A0x632898beef8d5983!2sZima%20Auto%20Airport%20Parking%20-%20Aut%C3%B3szerv%C3%ADz%20-%20Gumiszerv%C3%ADz%20-%20K%C3%A9zi%20aut%C3%B3mos%C3%B3!5e0!3m2!1sen!2shu!4v1745609320883!5m2!1sen!2shu"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Zima Auto location">
            </iframe>
            <button
              class="directions-link"
              on:click={openGoogleMapsDirections}
            >
              {$currentLang === 'hu' ? 'Útvonaltervezés' : 'Get Directions'}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="container">
      <p>{t('footer.copyright', $currentLang)}</p>
      <a href="/privacy" class="privacy-link">
        {$currentLang === 'hu' ? 'Adatvédelmi irányelvek' : 'Privacy Policy'}
      </a>
    </div>
  </div>

  <button
    class="back-to-top"
    class:visible={showBackToTop}
    on:click={scrollToTop}
    aria-label={$currentLang === 'hu' ? 'Vissza a tetejére' : 'Back to top'}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  </button>
</footer>

<style>
  footer {
    background-color: #111111;
    color: #f5f5f5;
  }

  .footer-top {
    padding: 60px 0;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 40px;
  }

  .footer-logo {
    margin-bottom: 25px;
  }

  .footer-logo img {
    height: 45px;
  }

  .contact-info h3 {
    margin-bottom: 20px;
    font-size: 1.1rem;
    position: relative;
    display: inline-block;
    color: white;
  }

  .contact-info h3::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #00bae5;
  }

  .contact-info p {
    margin-bottom: 10px;
    font-size: 0.95rem;
    color: #aaa;
    line-height: 1.6;
  }

  .social-links {
    display: flex;
    gap: 15px;
    margin-top: 25px;
  }

  .social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    color: #aaa;
    transition: all 0.3s ease;
  }

  .social-links a:hover {
    background-color: #00bae5;
    color: white;
    transform: translateY(-3px);
  }

  .footer-links h3 {
    margin-bottom: 20px;
    font-size: 1.1rem;
    position: relative;
    display: inline-block;
    color: white;
  }

  .footer-links h3::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #00bae5;
  }

  .footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 12px;
  }

  .footer-links a {
    color: #aaa;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
    padding-left: 15px;
  }

  .footer-links a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50% !important;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background-color: #00bae5;
    border-radius: 50%;
  }

  .footer-links a:hover {
    color: white;
    padding-left: 20px;
  }

  .footer-map {
    position: relative;
    height: 100%;
    min-height: 250px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .footer-bottom {
    background-color: #0a0a0a;
    padding: 20px 0;
    text-align: center;
  }

  .footer-bottom .container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .footer-bottom p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  .privacy-link {
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
  }

  .privacy-link:hover {
    color: var(--primary);
  }

  @media screen and (max-width: 992px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
    }

    .footer-map {
      grid-column: span 2;
    }
  }

  @media screen and (max-width: 768px) {
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .footer-map {
      grid-column: span 1;
      min-height: 200px;
    }

    .footer-top {
      padding: 40px 20px;
    }

    .footer-bottom .container {
      flex-direction: column;
      gap: 10px;
    }
  }

  .back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }

  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .back-to-top:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .back-to-top:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 186, 229, 0.3);
  }

  @media screen and (max-width: 768px) {
    .back-to-top {
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
    }
  }

  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;
  }

  .map-container iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .directions-link {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #111111;
    color: white;
    padding: 8px 16px;
    border-radius: 5px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border: none;
    cursor: pointer;
  }

  .directions-link:hover {
    background-color: #222222;
  }

  /* Removed styles for directions-popup and navigation-buttons */
</style>