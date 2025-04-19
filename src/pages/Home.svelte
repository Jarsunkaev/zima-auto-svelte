<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n/index.js';
  import ServiceCard from '../components/ServiceCard.svelte';
  import TestimonialCard from '../components/TestimonialCard.svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  let lang;
  let servicesVisible = false;
  let testimonialsVisible = false;
  let bookingVisible = false;
  let ctaVisible = false;
  
  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });
  
  // Service data with SVG icons instead of image paths
  const services = [
    {
      id: 'parking',
      svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 9h2v6"/><path d="M9 12h2"/><path d="M13 9h2v6"/><path d="M13 12h2"/></svg>`,
      image: 'images/parking-lot.jpg'
    },
    {
      id: 'washing',
      svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9.5 7.5-2 9.5L9 15.5l1.5 2L12 9l1.5 7.5.5-2.5 2.5.5-2-9.5"/></svg>`,
      image: 'images/car-wash.jpg'
    },
    {
      id: 'tire',
      svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="m19 12 3 0"/><path d="m2 12 3 0"/><path d="m17 7-2 2"/><path d="m9 15-2 2"/><path d="m7 7 2 2"/><path d="m15 15 2 2"/></svg>`,
      image: 'images/tire-service.jpg'
    },
    {
      id: 'service',
      svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      image: 'images/auto-service.jpg'
    }
  ];
  
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Csilla Demcsák',
      location: '',
      text: 'Nagyon profi. Fiatalos, energialusok, jó áron dolgoznak! Nagyon szép és kényelmes volt, hogy a járművet, a gumipulálást és az autóbérlést egypen elővégezhettem.',
      image: null
    },
    {
      id: 2,
      name: 'Helyi idegenvezető',
      location: '',
      text: 'Minden dícséretet a tulajnak, bízik minket a reptére és vissza a parkolóba. Problémánk volt az autón a kerbleet, amit a tulajdonos segítségével megoldottunk. Még egyszer köszönöm és minden ajánlást elhng a parkolóhoz.',
      image: null
    },
    {
      id: 3,
      name: 'Kubilay Öztürk',
      location: '',
      text: 'Minden gördilékeniy volt, ajánlom őket!',
      image: null
    }
  ];
  
  // Handler for service card CTA buttons
  function handleServiceAction(serviceId) {
    // This would ideally navigate to the specific service section on the services page
    console.log(`Service action clicked for ${serviceId}`);
    // Navigate to services page
    // navigate('services');
  }
  
  // Function to scroll to the next section
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

<!-- Hero Section -->
<section class="hero">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="container hero-container">
    <div class="hero-content">
      <h1>{$currentLang === 'hu' ? 'Üdvözöljük a Zima Auto Kft-nél!' : 'Welcome to Zima Auto!'}</h1>
      <p>{$currentLang === 'hu' 
        ? 'Ahol az autója minden igényére egy helyen kínálunk megoldást!'
        : 'Where we offer solutions for all your car needs in one place!'}</p>
      <button class="btn btn-primary">{$currentLang === 'hu' ? 'FOGLALJON MOST' : 'BOOK NOW'}</button>
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
      <div class="scroll-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<!-- Booking Section -->
<section class="booking-section">
  <div class="container">
    <h2 class="section-title">{$currentLang === 'hu' ? 'FOGLALJON HELYET' : 'BOOK A SPOT'}</h2>
    
    <div class="booking-container">
      <div class="booking-image">
        <img src="images/parking-lot.jpg" alt="Airport Parking" />
      </div>
      <div class="booking-content">
        <p class="booking-description">
          {$currentLang === 'hu' 
            ? 'Foglaljon biztonságos parkolóhelyet már ma! Garantált helyek, 24/7 felügyelet, ingyenes reptéri transzfer.'
            : 'Book your secure parking spot today! Guaranteed spaces, 24/7 surveillance, free airport transfer.'}
        </p>
        <button class="btn btn-primary booking-btn">{$currentLang === 'hu' ? 'Reptéri Parkolás Foglalása' : 'Book Airport Parking'}</button>
      </div>
    </div>
  </div>
</section>

<!-- Services Section -->
<section class="services-section">
  <!-- Straight transition instead of wavy -->
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
            ? (service.id === 'parking' ? '24/7 REPÜLŐTÉRI PARKOLÁS' : 
               service.id === 'washing' ? 'AUTÓMOSÓ' : 
               service.id === 'tire' ? 'GUMISZERIVZ' : 'AUTÓSZERVIZ')
            : (service.id === 'parking' ? '24/7 AIRPORT PARKING' : 
               service.id === 'washing' ? 'CAR WASH' : 
               service.id === 'tire' ? 'TIRE SERVICE' : 'AUTO SERVICE')
          }
          description={$currentLang === 'hu' 
            ? (service.id === 'parking' ? 'Biztonságos parkolási lehetőségünk bekerített határokkal és 24 órás kamerás megfigyeléssel rendelkezik, ami garantálja járművének a legnagyobb biztonságot.' : 
               service.id === 'washing' ? 'Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon.' : 
               service.id === 'tire' ? 'Szakértő technikusaink készen állnak az abroncsokkal kapcsolatos bármilyen probléma azonnali megoldására, és biztonságosan visszatérni az útra.' : 
               'A rutinellenőrzéstől a komplex javításokig szakképzett szerelőink fel vannak szerelve az összes karbantartás elvégzésére.')
            : (service.id === 'parking' ? 'Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle.' : 
               service.id === 'washing' ? 'Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful.' : 
               service.id === 'tire' ? 'Our expert technicians are ready to solve any tire-related problems immediately and get you safely back on the road.' : 
               'From routine checks to complex repairs, our qualified mechanics are equipped to perform all maintenance.')
          }
          index={i}
          shouldAnimate={servicesVisible}
          ctaText={$currentLang === 'hu' ? 'Részletek' : 'Details'}
          ctaAction={() => handleServiceAction(service.id)}
        />
      {/each}
    </div>
  </div>
  
  <!-- Straight transition instead of wavy -->
  <div class="wave-bottom">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 20" preserveAspectRatio="none">
      <path fill="#141a25" fill-opacity="1" d="M0,20L1440,20L1440,20L0,20Z"></path>
    </svg>
  </div>
</section>

<!-- Testimonials Section -->
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
    
    <div class="testimonials-footer">
      <button class="btn btn-outline">
        {$currentLang === 'hu' ? 'További vélemények' : 'More testimonials'}
      </button>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2>{$currentLang === 'hu' ? 'Fedezze fel versenyképes árainkat – nézze meg most!' : 'Discover our competitive prices – check them out now!'}</h2>
      <button class="btn btn-outline">{$currentLang === 'hu' ? 'Árlista Megtekintése' : 'View Price List'}</button>
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
  
  .scroll-arrow {
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
    align-self: flex-start;
    font-size: 1rem;
    padding: 0.8rem 2rem;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
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
  
  .testimonials-footer {
    margin-top: 3rem;
    text-align: center;
  }
  
  .testimonials-footer .btn {
    background-color: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.8rem 2rem;
    transition: all 0.3s ease;
  }
  
  .testimonials-footer .btn:hover {
    background-color: var(--primary);
    border-color: var(--primary);
    transform: translateY(-3px);
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
    .hero-content h1 {
      font-size: 2.5rem;
    }
    
    .hero-content p {
      font-size: 1.1rem;
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
      font-size: 1.8rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
    }
    
    .testimonials-section .section-title {
      font-size: 1.8rem;
    }
    
    .cta-section h2 {
      font-size: 1.8rem;
    }
    
    .services-section,
    .testimonials-section,
    .booking-section {
      padding: 4rem 1.5rem;
    }
    
    /* Simplified waves for mobile to prevent layout issues */
    .wave-top, .wave-bottom {
      height: 10px;
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
      font-size: 1rem;
    }
    
    .cta-section h2 {
      font-size: 1.6rem;
    }

  }
</style>