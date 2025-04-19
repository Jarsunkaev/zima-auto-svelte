<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import { gsap } from 'gsap';
  
  let animationPlayed = false;
  
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
      }, '-=0.5');
      
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
  
  @media screen and (max-width: 768px) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
    
    .hero-content p {
      font-size: 1.1rem;
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