<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { currentLang, t } from '../lib/i18n/index.js';
  import ServiceCard from '../components/ServiceCard.svelte';
  import TestimonialCard from '../components/TestimonialCard.svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Add navigate prop
  export let navigate;

  let lang;
  let servicesVisible = false;
  let testimonialsVisible = false;
  let bookingVisible = false;
  let ctaVisible = false;
  let heroSection;
  let showReviewsWidget = false;

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  // Service data with SVG icons - Only Parking and Car Wash for parking frontend
  const services = [
    {
      id: 'parking',
      color: '#2b0f4d',
      hoverColor: '#1f0839',
      svgIcon: `<svg fill="#ffffff" width="219px" height="219px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></g></svg>`,
      image: 'images/parking-lot.webp'
    },
    {
      id: 'washing',
      color: '#003a70',
      hoverColor: '#002851',
      svgIcon: `<svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M142.25,206.819c-11.982,0.247-23.234-6.299-28.755-17.521l-2.751-5.591H62.71l1.296-5.894 c-5.764-0.319-11.242-2.802-15.533-7.128c-4.972-5.008-8.189-12.11-9.732-21.491l-14.374,65.334l0.249,60.473 C10.504,278.339,0,291.007,0,306.138c0,17.674,14.326,32,32,32h22.252c0-39.307,31.979-71.286,71.286-71.286 c12.595,0,24.428,3.297,34.707,9.052v-69.417L142.25,206.819z"></path> </g> </g> <g> <g> <path d="M301.995,74.561c-4.888-8.729-14.137-14.15-24.14-14.15H136.613c5.117,8.867,4.418,20.507,2.632,30.824h39.416 c8.615-10.736,21.831-17.628,36.636-17.628c14.804,0,28.021,6.892,36.636,17.628h24.074l50.407,90.015 c-0.493-4.596,0.054-9.945,2.447-16.113c2.611-6.727,8.117-12.181,14.736-16.29L301.995,74.561z"></path> </g> </g> <g> <g> <path d="M352.07,260.154c-3.421-4.743-6.068-9.242-8.122-13.501l-40.47,13.681c-11.896,4.025-24.553,0.473-32.751-8.072 c0,67.969,0.052,26.197,0.052,85.876h55.885c0-27.503,15.665-51.4,38.532-63.283C360.825,271.131,356.463,266.245,352.07,260.154z "></path> </g> </g> <g> <g> <path d="M490.667,275.966c0-4.949,0-10.028,0-15.137h-23.202c-11.436,0-20.706-9.27-20.706-20.706 c0-11.436,9.27-20.706,20.706-20.706h20.006c-7.529-20.927-27.547-35.896-51.066-35.896h-20.637 c3.383,11.767,5.348,26.998-1.26,39.26c-5.568,10.331-4.45,31.472-4.45,36.857c0,2.834-0.471,5.526-1.302,8.034 c34.198,5.222,60.48,34.833,60.48,70.468c3.943,0,6.995,0,10.765,0c17.672,0,32-14.328,32-32 C512,292.206,503.094,280.36,490.667,275.966z"></path> </g> </g> <g> <g> <path d="M125.539,289.327c-26.957,0.001-48.81,21.854-48.81,48.811s21.853,48.81,48.81,48.81c13.359,0,25.459-5.371,34.272-14.066 v-69.488C150.997,294.698,138.897,289.327,125.539,289.327z M125.539,357.908c-10.919,0-19.77-8.851-19.77-19.77 s8.851-19.77,19.77-19.77c10.919,0,19.77,8.851,19.77,19.77S136.458,357.908,125.539,357.908z"></path> </g> </g> <g> <g> <path d="M397.949,289.328c-26.957,0-48.81,21.853-48.81,48.81c0,26.957,21.852,48.81,48.81,48.81 c26.957,0,48.81-21.853,48.81-48.81C446.758,311.181,424.906,289.328,397.949,289.328z M397.949,357.908 c-10.919,0-19.77-8.851-19.77-19.77s8.851-19.77,19.77-19.77s19.77,8.851,19.77,19.77S408.868,357.908,397.949,357.908z"></path> </g> </g> <g> <g> <path d="M384.574,159.738c-2.448-2.26-6.1-3.212-10.227-3.212c-11.621,0-26.995,7.553-29.773,14.712 c-1.873,4.827-1.758,8.322-0.671,11.21c13.144,0.327,24.716,8.792,28.945,21.305c4.753,14.058-1.07,29.178-13.161,36.697 c1.569,3.091,3.544,6.362,6.055,9.844c8.994,12.472,16.122,16.696,20.858,16.696c4.271,0,6.597-3.434,6.597-7.353 c0-6.78-1.437-30.186,6.469-44.854C407.572,200.115,393.916,168.361,384.574,159.738z"></path> </g> </g> <g> <g> <path d="M123.24,72.004C120.8,59.525,92.948,52.038,84.177,57.639c-13.97,8.921-3.438,18.865-9.36,29.381 c-5.923,10.516-20.068,17.661-20.289,46.903c-0.154,20.329,5.579,27.099,10.73,27.099c2.259,0,4.406-1.303,5.895-3.335 c2.548-3.478,8.601-12.716,16.538-20.826l-1.148-2.332c-7.641-15.526-1.226-34.374,14.301-42.016 c6.617-3.257,14.104-4.104,21.46-2.291C123.718,82.948,124.069,76.249,123.24,72.004z"></path> </g> </g> <g> <g> <path d="M356.879,209.151c-0.001-0.003-0.002-0.007-0.003-0.01c-2.563-7.571-10.85-11.669-18.409-9.099 c-14.502,4.902-23.759,8.033-38.712,13.087c-4.507-7.356-15.44-25.202-20.63-33.671c-7.251-11.835-20.379-19.185-34.258-19.185 c-83.287,0-60.216-0.155-94.254,0.474c-4.401-8.943-18.447-37.486-22.879-46.493c-3.565-7.248-12.34-10.118-19.448-6.62 c-7.199,3.543-10.163,12.249-6.621,19.447c16.505,33.54,11.631,23.638,26.954,54.773c2.49,5.06,7.758,8.245,13.302,8.11 c37.258-0.689,34.271-0.64,35.182-0.64c0,0.256-0.435,84.692-0.435,249.492c0,9.627,7.805,17.431,17.431,17.431 c9.625,0,17.431-7.804,17.431-17.431c0-14.798,0-110.297,0-125.829h7.526c0,15.538,0,110.994,0,125.829 c0,9.627,7.805,17.431,17.431,17.431c9.627,0,17.431-7.804,17.431-17.431c0-54.87-0.049-180.103-0.051-239.359 c0-0.709,0.471-1.331,1.153-1.524c0.682-0.193,1.41,0.09,1.781,0.694c3.083,5.025,9.717,15.869,24.234,39.564 c3.537,5.771,10.603,8.352,17.041,6.174c31.192-10.545,16.238-5.49,49.694-16.801 C355.383,224.992,359.442,216.736,356.879,209.151z"></path> </g> </g> <g> <g> <circle cx="215.299" cy="120.568" r="30.709"></circle> </g> </g> </g></svg>`,
      image: 'images/car-wash.webp'
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Csilla Demcsák',
      location: '',
      text: 'Nagyon profik. Fiatalok, energikusak, jó áron dolgoznak! Nagyon szép és kényelmes volt, hogy a javítást, a gumijavítást és az autótisztítást egyben elvégezhettem.',
      image: null
    },
    {
      id: 2,
      name: 'Helyi idegenvezető',
      location: '',
      text: 'Minden dicséret a tulajnak, kivitt minket a reptérre és vissza a parkolóba. Problémánk volt az autón a kerékkel, amit a tulajdonos segítségével megoldottunk. Még egyszer köszönöm és minden ajánlást ehhez a parkolóhoz.',
      image: null
    },
    {
      id: 3,
      name: 'Kubilay Öztürk',
      location: '',
      text: 'Minden gördülékeny volt, ajánlom őket!!',
      image: null
    }
  ];

  // Handler for service card CTA buttons - navigate to booking page with service pre-selected
  function handleServiceAction(serviceId) {
    // Map service IDs to booking service IDs
    const serviceMap = {
      'parking': 'airportParking',
      'washing': 'carWash'
    };
    const bookingServiceId = serviceMap[serviceId] || serviceId;
    // Store the service ID in sessionStorage before navigation
    sessionStorage.setItem('preselectedService', bookingServiceId);
    // Navigate to booking page
    navigate('booking');
  }

  function toggleReviewsWidget() {
    showReviewsWidget = !showReviewsWidget;
  }


  onMount(() => {
    // Debug logging
    console.log('Component mounted');
    
    // Load EmbedSocial script
    const script = document.createElement('script');
    script.id = 'EmbedSocialWidgetScript';
    script.src = 'https://embedsocial.com/cdn/aht.js';
    document.head.appendChild(script);
    
    // Setup parallax effect for hero section
    

    // Setup animations with ScrollTrigger

    // Booking section animation
    gsap.from('.booking-container', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.booking-section',
        start: 'top 80%',
        onEnter: () => {
          bookingVisible = true;
        }
      }
    });

    // Services section animation (handled by the shouldAnimate prop)
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
      ScrollTrigger.create({
        trigger: servicesSection,
        start: 'top 70%',
        onEnter: () => {
          servicesVisible = true;
        }
      });
    }

    // Testimonials section animation
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
      ScrollTrigger.create({
        trigger: testimonialsSection,
        start: 'top 70%',
        onEnter: () => {
          testimonialsVisible = true;
        }
      });
    }

    // CTA section animation
    gsap.from('.cta-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        onEnter: () => {
          ctaVisible = true;
        }
      }
    });
  });
</script>

<section class="hero" bind:this={heroSection}>
  <div class="hero-background">
    <div class="hero-image-left"></div>
    <div class="hero-image-right"></div>
  </div>
  <div class="hero-overlay"></div>
  <div class="container hero-container">
    <div class="hero-content">
      <h1>{$currentLang === 'hu' ? 'Zima Repülőtéri Parkolás és Autómosó' : 'Zima Airport Parking and Car Wash'}</h1>
      <p>{$currentLang === 'hu'
        ? 'Biztonságos repülőtéri parkolás és professzionális autómosó szolgáltatás'
        : 'Secure airport parking and professional car wash services'}</p>
      <button class="btn btn-primary" on:click={() => navigate('booking')}>
        {$currentLang === 'hu' ? 'FOGLALJON MOST' : 'BOOK NOW'}
      </button>
    </div>

    <div
      class="scroll-down-indicator"
      on:click={() => {
        const nextSection = document.querySelector('.booking-section');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          const nextSection = document.querySelector('.booking-section');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }}
      tabindex="0"
      role="button"
      aria-label={$currentLang === 'hu' ? 'Görgessen lefelé' : 'Scroll down'}
    >
      <span>{$currentLang === 'hu' ? 'Görgessen lefelé' : 'Scroll down'}</span>
      <div class="scroll-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<section class="booking-section" id="booking">
  <div class="container">
    <h2 class="section-title">{$currentLang === 'hu' ? 'FOGLALJON HELYET' : 'BOOK A SPOT'}</h2>

    <div class="booking-container">
      <div class="booking-image">
        <img src="images/zima-gate.webp" alt="Airport Parking" loading="lazy" />
      </div>
      <div class="booking-content">
        <p class="booking-description">
          {$currentLang === 'hu'
            ? 'Foglaljon biztonságos parkolóhelyet már ma! Garantált helyek, 24/7 felügyelet, ingyenes reptéri transzfer.'
            : 'Book your secure parking spot today! Guaranteed spaces, 24/7 surveillance, free airport transfer.'}
        </p>
         <button class="btn btn-primary booking-btn" on:click={() => navigate('booking')}>
          {$currentLang === 'hu' ? 'Reptéri Parkolás Foglalása' : 'Book Airport Parking'}
        </button>
      </div>
    </div>
  </div>
</section>

<section class="services-section" id="services"> 
  <div class="wave-top">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 20" preserveAspectRatio="none">
      <path fill="#ffffff" fill-opacity="1" d="M0,0L1440,0L1440,0L0,0Z"></path>
    </svg>
  </div>

  <div class="container">
    <h2 class="section-title">{$currentLang === 'hu' ? 'SZOLGÁLTATÁSOK' : 'OUR SERVICES'}</h2>
    <p class="section-subtitle">
      {$currentLang === 'hu'
        ? 'Fedezze fel átfogó szolgáltatásainkat, melyek az Ön járművének minden igényét kielégítik'
        : 'Discover our comprehensive services covering all your vehicle needs in one place'}
    </p>

    <div class="services-grid">
      {#each services as service, i}
        <ServiceCard
          svgIcon={service.svgIcon}
          image={service.image}
          title={$currentLang === 'hu'
            ? (service.id === 'parking' ? '24/7 REPÜLŐTÉRI PARKOLÁS' : 'AUTÓMOSÓ')
            : (service.id === 'parking' ? '24/7 AIRPORT PARKING' : 'CAR WASH')
          }
          description={$currentLang === 'hu'
            ? (service.id === 'parking' ? 'Biztonságos parkolóhelyeink 24 órás kamerás megfigyeléssel és szakértő személyzettel várják járművét, maximális biztonságot nyújtva.' :
               'Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon.')
            : (service.id === 'parking' ? 'Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle.' :
               'Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful.')
          }
          index={i}
          shouldAnimate={servicesVisible}
          ctaText={$currentLang === 'hu' ? 'Foglalás' : 'Book now'}
          ctaAction={() => handleServiceAction(service.id)}
          color={service.color}
          hoverColor={service.hoverColor}
        />
      {/each}
    </div>
  </div>

  <div class="wave-bottom">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 20" preserveAspectRatio="none">
      <path fill="#141a25" fill-opacity="1" d="M0,20L1440,20L1440,20L0,20Z"></path>
    </svg>
  </div>
</section>

<section class="testimonials-section">
  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <div class="container">
    <h2 class="section-title">
      {$currentLang === 'hu' ? 'Ügyfeleink Véleménye' : 'Customer Testimonials'}
    </h2>

    <div class="testimonials-grid">
      {#each testimonials as testimonial, i}
        <TestimonialCard
          name={testimonial.name}
          location={testimonial.location}
          text={testimonial.text}
          image={testimonial.image}
          index={i}
          isVisible={testimonialsVisible}
        />
      {/each}
    </div>

    <div class="widget-container">
      <div class="embedsocial-widget" data-ref="0374a3cc3b883d7c92fcc25ebb3f82bc">
        <a href="https://embedsocial.com/google-reviews-widget/" title="Add Google reviews on a website" target="_blank" class="powered-by-es es-slider">
          <img src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp" alt="EmbedSocial">
          <span>Google reviews widget</span>
        </a>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2>{$currentLang === 'hu' ? 'Fedezze fel versenyképes árainkat – nézze meg most!' : 'Discover our competitive prices – check them out now!'}</h2>
      <button class="btn btn-outline" on:click={() => navigate('services')}>
        {$currentLang === 'hu' ? 'Árlista Megtekintése' : 'View Price List'}
      </button>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
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
    z-index: 0;
    overflow: hidden;
  }

  .hero-image-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/aero.jpg');
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    clip-path: polygon(0 0, 100% 0, 60% 100%, 0 100%);
    z-index: 1;
  }

  .hero-image-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/wash.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    clip-path: polygon(40% 0, 100% 0, 100% 100%, 60% 100%);
    z-index: 1;
  }

  .hero-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.65) 100%
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
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
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
    z-index: 3;
  }

  .scroll-down-indicator:hover,
  .scroll-down-indicator:focus {
    opacity: 1;
    outline: none;
  }

  .scroll-down-indicator:focus {
    outline: 2px solid var(--primary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  .scroll-down-indicator span {
    font-size: 0.9rem;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .scroll-arrow svg {
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

  /* Booking Section */
  .booking-section {
    padding: 6rem 2rem;
    background-color: #ffffff;
    position: relative;
  }

  .section-title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 2.2rem;
    position: relative;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--primary);
  }

  .section-subtitle {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 3rem;
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .booking-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #f8f9fa;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .booking-image {
    flex: 1.2;
    overflow: hidden;
  }

  .booking-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .booking-container:hover .booking-image img {
    transform: scale(1.05);
  }

  .booking-content {
    flex: 0.8;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .booking-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    margin-bottom: 2rem;
  }

  .booking-btn {
    align-self: center;
    font-size: 1rem;
    padding: 0.8rem 2rem;
     /* Inherits primary button styles but explicit for clarity */
     background-color: var(--secondary);
     color: white;
     border: none;
     border-radius: 5px;
     cursor: pointer;
     transition: all 0.3s ease;
  }

  .booking-btn:hover,
  .booking-btn:focus {
     transform: translateY(-3px);
     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
     background-color: var(--primary-dark);
     outline: none;
  }


  /* Services Section */
  .services-section {
    padding: 6rem 2rem;
    background-color: #f8f9fa;
    position: relative;
  }

  /* Simplified waves for better mobile performance */
  .wave-top, .wave-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    height: 20px;
    overflow: hidden;
    line-height: 0;
  }

  .wave-top {
    top: 0;
    transform: translateY(-1px); /* Ensure no gaps */
  }

  .wave-bottom {
    bottom: 0;
    transform: translateY(1px); /* Ensure no gaps */
  }

  .wave-top svg, .wave-bottom svg {
    width: 100%;
    height: 100%;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  /* Testimonials Section */
  .testimonials-section {
    padding: 6rem 2rem;
    background-color: #141a25;
    color: white;
    position: relative;
    overflow: hidden;
  }

  /* Background shapes */
  .background-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.05;
  }

  .shape-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #00bae5, #0088cc);
    top: -250px;
    right: -100px;
  }

  .shape-2 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #0088cc, #004466);
    bottom: -300px;
    left: -150px;
  }

  .shape-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #00bae5, #004466);
    top: 40%;
    right: 10%;
  }

  .testimonials-section .container {
    position: relative;
    z-index: 2;
  }

  .testimonials-section .section-title {
    margin-bottom: 3.5rem;
    font-size: 2.6rem;
    color: white;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .testimonials-section .section-title::after {
    background: linear-gradient(to right, #00bae5, #0088cc);
    height: 3px;
    width: 60px;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }

  

  /* CTA Section */
  .cta-section {
    padding: 5rem 2rem;
    background-color: #13151a;
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(30, 10, 60, 0.95), rgba(13, 13, 30, 0.9));
    z-index: 0;
  }

  .cta-content {
    position: relative;
    z-index: 1;
  }

  .cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-section .btn {
    font-size: 1rem;
    padding: 1rem 2rem;
    border: 2px solid white;
    background-color: transparent;
    color: white;
    transition: all 0.3s ease;
     /* Inherit primary button styles if available, or define specific ones */
  }

  .cta-section .btn:hover {
    background-color: white;
    color: #13151a;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  /* Responsive Styles - Optimized for mobile */
  @media screen and (max-width: 1200px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .testimonials-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 768px) {
    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media screen and (max-width: 992px) {
    .booking-container {
      flex-direction: column;
      max-width: 600px;
    }

    .booking-image {
      width: 100%;
      height: 250px;
    }

    .booking-content {
      width: 100%;
      padding: 2rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .testimonials-section .section-title {
      font-size: 2.2rem;
    }

    .cta-section h2 {
      font-size: 2rem;
    }
  }

  @media screen and (max-width: 768px) {
    /* Make the diagonal split more dramatic on mobile */
    .hero-image-left {
      clip-path: polygon(0 0, 100% 0, 0 100%);
    }

    .hero-image-right {
      clip-path: polygon(0 100%, 100% 0, 100% 100%);
    }

    .hero {
      min-height: 500px;
    }
    .hero-content h1 {
      font-size: 2.8rem;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }

    .hero-content p {
      font-size: 1.4rem;
    }

    .scroll-down-indicator {
      bottom: 20px;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .testimonials-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .section-title {
      font-size: 2.2rem;
    }

    .section-subtitle {
      font-size: 1.2rem;
    }

    .testimonials-section .section-title {
      font-size: 2.2rem;
    }

    .cta-section h2 {
      font-size: 2.2rem;
    }

    .services-section,
    .testimonials-section,
    .booking-section {
      padding: 4rem 1.5rem;
    }

    .wave-top, .wave-bottom {
      height: 10px;
    }

    /* Increased text sizes for mobile */
    :global(.service-card h3) {
      font-size: 1.6rem !important;
    }

    :global(.service-card p) {
      font-size: 1.1rem !important;
      line-height: 1.6 !important;
    }

    :global(.testimonial-card h3) {
      font-size: 1.5rem !important;
    }

    :global(.testimonial-card p) {
      font-size: 1.1rem !important;
      line-height: 1.6 !important;
    }

    .booking-description {
      font-size: 1.2rem !important;
      line-height: 1.6 !important;
    }
  }

  @media screen and (max-width: 480px) {
    .hero {
      min-height: 400px;
    }
    .hero-content h1 {
      font-size: 2.4rem;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .hero-content .btn {
      font-size: 1.1rem;
      padding: 0.8rem 2rem;
    }

    .booking-section, .services-section, .testimonials-section, .cta-section {
      padding: 3rem 1rem;
    }

    .wave-top, .wave-bottom {
      height: 5px;
    }

    .booking-content {
      padding: 1.5rem;
    }

    .booking-description {
      font-size: 1.2rem !important;
    }

    .cta-section h2 {
      font-size: 1.8rem;
    }

    /* Even larger text sizes for smaller screens */
    :global(.service-card h3) {
      font-size: 1.8rem !important;
    }

    :global(.service-card p) {
      font-size: 1.2rem !important;
      line-height: 1.6 !important;
    }

    :global(.testimonial-card h3) {
      font-size: 1.6rem !important;
    }

    :global(.testimonial-card p) {
      font-size: 1.2rem !important;
      line-height: 1.6 !important;
    }
  }

  .widget-container {
    max-width: 1000px;
    margin: 3rem auto 0;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  /* EmbedSocial widget styles */
  :global(.embedsocial-widget) {
    width: 100% !important;
  }

  :global(.powered-by-es) {
    display: none !important;
  }

  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .widget-container {
      padding: 1rem;
      margin: 2rem 1rem 0;
    }
  }
</style>