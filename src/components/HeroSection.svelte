<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  let animationPlayed = false;
  let showDiscountPopup = false;
  let heroSection;
  let nextSection;

  function scrollToNextSection() {
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
      behavior: 'smooth'
    });
  }

  function closeDiscountPopup() {
    showDiscountPopup = false;
    localStorage.setItem('discountPopupShown', 'true');
  }

  onMount(() => {
    if (!localStorage.getItem('discountPopupShown')) {
      setTimeout(() => {
        showDiscountPopup = true;
      }, 15000);
    }

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

      gsap.to('.scroll-down-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      animationPlayed = true;
    }

    // Set up parallax effect
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.to(".hero-background", {
          y: self.progress * 200,
          ease: "none"
        });
      }
    });
  });
</script>

<section class="hero" bind:this={heroSection}>
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="container hero-container">
    <div class="hero-content">
      <h1>{t('hero.welcome', $currentLang)}</h1>
      <p>{t('hero.subtitle', $currentLang)}</p>
      <button class="btn btn-primary">{t('hero.cta', $currentLang)}</button>
    </div>

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

{#if showDiscountPopup}
  <div class="discount-popup" role="dialog" aria-modal="true">
    <div class="discount-popup-background"></div>
    <div class="discount-popup-content">
      <button class="close-popup" on:click={closeDiscountPopup} aria-label="Close popup">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <h2>{$currentLang === 'hu' ? '20% KEDVEZMÉNY' : '20% DISCOUNT'}</h2>
      <p>{$currentLang === 'hu' 
        ? 'Élvezze első látogatásakor 20%-os kedvezményt minden szolgáltatásunkra!'
        : 'Enjoy 20% off on all our services during your first visit!'}</p>
      <button class="btn btn-primary" on:click={closeDiscountPopup}>
        {$currentLang === 'hu' ? 'ELFOGADOM' : 'I ACCEPT'}
      </button>
    </div>
  </div>
{/if}

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
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    z-index: 0;
    background-image: url('/images/airport-car.jpg');
    will-change: transform;
  }

  .hero-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
    z-index: 1;
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
    text-align: center;
    z-index: 2;
    max-width: 1200px;
    padding: 0 2rem;
  }

  .hero-content h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hero-content p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.4;
  }

  .hero-content .btn {
    font-size: 1.1rem;
    padding: 1rem 2.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    /* Assuming you have CSS variables for primary colors */
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 5px; /* Add some border-radius */
    cursor: pointer;
  }

  .hero-content .btn:hover,
  .hero-content .btn:focus {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: var(--primary-dark); /* Use a darker shade for hover */
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
    z-index: 3; /* Ensure indicator is above everything */
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

  @keyframes subtle-zoom {
    0% { transform: scale(1); }
    100% { transform: scale(1.05); }
  }

  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .hero {
        min-height: 500px; /* Adjust min-height for smaller screens */
    }
    .hero-content h1 {
      font-size: 2.5rem;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }

    .hero-content p {
      font-size: 1.2rem;
    }

    .scroll-down-indicator {
      bottom: 20px;
    }
  }

  @media screen and (max-width: 480px) {
     .hero {
         min-height: 400px; /* Further adjust min-height for very small screens */
     }
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

  /* IMPORTANT: Ensure the section *immediately following* the hero has a background color */
  /* This is crucial for the sticky background to appear to slide behind it. */
  /* Example CSS for your next section (add this to your global styles or the next section's component) */
  /*
  .your-next-section-class {
      background-color: white; // Or any solid color
      position: relative; // Often helpful for z-index stacking
      z-index: 1; // Ensure it's above the fixed hero background (z-index: 0)
  }
  */

  .discount-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.5s ease-out;
  }

  .discount-popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/car-wash.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
  }

  .discount-popup-background::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(63, 0, 113, 0.9) 0%,
      rgba(63, 0, 113, 0.7) 50%,
      rgba(63, 0, 113, 0.5) 100%
    );
  }

  .discount-popup-content {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    width: 90%;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .discount-popup-content h2 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .discount-popup-content p {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .close-popup {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .close-popup:hover {
    opacity: 1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media screen and (max-width: 768px) {
    .discount-popup-content {
      padding: 1.5rem;
    }

    .discount-popup-content h2 {
      font-size: 2rem;
    }

    .discount-popup-content p {
      font-size: 1rem;
    }
  }
</style>
