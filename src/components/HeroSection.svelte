<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import { gsap } from 'gsap';
  
  let animationPlayed = false;
  
  function scrollToNextSection() {
    // Get the height of the viewport
    const viewportHeight = window.innerHeight;
    
    // Scroll down to the next section smoothly
    window.scrollTo({
      top: viewportHeight,
      behavior: 'smooth'
    });
  }
  
  onMount(() => {
    if (!animationPlayed) {
      const tl = gsap.timeline();
      
      tl.from('.hero-content h1', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2
      })
      .from('.hero-content p', {
        y: 30,
        opacity: 0,
        duration: 0.6
      }, '-=0.3')
      .from('.hero-content .btn', {
        y: 20,
        opacity: 0,
        duration: 0.5
      }, '-=0.2')
      .from('.hero-overlay', {
        opacity: 0.3,
        duration: 0.8
      }, '-=0.5')
      .from('.scroll-down-indicator', {
        y: -20,
        opacity: 0,
        duration: 0.5
      });
      
      // Set up continuous animation for the scroll indicator
      gsap.to('.scroll-down-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
      
      animationPlayed = true;
    }
  });
</script>

<section class="hero">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="container hero-container">
    <div class="hero-content">
      <h1>{t('hero.welcome', $currentLang)}</h1>
      <p>{t('hero.subtitle', $currentLang)}</p>
      <button class="btn btn-primary">{t('hero.cta', $currentLang)}</button>
    </div>
    
    <!-- Scroll down indicator -->
    <div 
      class="scroll-down-indicator" 
      on:click={scrollToNextSection} 
      on:keydown={(e) => e.key === 'Enter' && scrollToNextSection()} 
      tabindex="0" 
      role="button" 
      aria-label={$currentLang === 'hu' ? 'Görgessen lefelé' : 'Scroll down'}
    >
      <span>{$currentLang === 'hu' ? 'Görgessen lefelé' : 'Scroll down'}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </div>
</section>

<style>
  .hero {
    height: 100vh;
    min-height: 600px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
  }
  
  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('images/hero-airport.jpg');
    background-size: cover;
    background-position: center;
    transform: scale(1.05);
    animation: subtle-zoom 20s infinite alternate ease-in-out;
  }
  
  @keyframes subtle-zoom {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }
  
  .hero-container {
    position: relative;
    z-index: 2;
    padding: 0 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .hero-content {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    font-weight: 800;
    line-height: 1.2;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  .hero-content p {
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    font-weight: 400;
    opacity: 0.9;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  .hero-content .btn {
    font-size: 1.1rem;
    padding: 1rem 2.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    background-color: var(--primary);
    color: white;
    border: none;
  }
  
  .hero-content .btn:hover,
  .hero-content .btn:focus {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: var(--primary-dark);
    outline: none;
  }
  
  /* Scroll down indicator */
  .scroll-down-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    cursor: pointer;
    transition: opacity 0.3s ease;
    opacity: 0.8;
  }
  
  .scroll-down-indicator:hover,
  .scroll-down-indicator:focus {
    opacity: 1;
    outline: none;
  }
  
  .scroll-down-indicator span {
    font-size: 0.9rem;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }
  
  .scroll-down-indicator svg {
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @media screen and (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
    
    .hero-content p {
      font-size: 1.1rem;
    }
    
    .scroll-down-indicator {
      bottom: 20px;
    }
  }
  
  @media screen and (max-width: 480px) {
    .hero-content h1 {
      font-size: 2rem;
    }
    
    .hero-content p {
      font-size: 1rem;
      margin-bottom: 2rem;
    }
    
    .hero-content .btn {
      font-size: 1rem;
      padding: 0.8rem 2rem;
    }
  }
</style>