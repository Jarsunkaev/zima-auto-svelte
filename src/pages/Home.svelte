<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import HeroSection from '../components/HeroSection.svelte';
  import ServiceCard from '../components/ServiceCard.svelte';
  import TestimonialCard from '../components/TestimonialCard.svelte';
  
  let lang;
  let servicesVisible = false;
  let testimonialsVisible = false;
  
  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
    console.log('Language in Home:', value);
  });
  
  // Service data
  const services = [
    {
      id: 'parking',
      icon: 'images/parking-icon.svg',
      image: 'images/parking-lot.jpg'
    },
    {
      id: 'washing',
      icon: 'images/wash-icon.svg',
      image: 'images/car-wash.jpg'
    },
    {
      id: 'tire',
      icon: 'images/tire-icon.svg',
      image: 'images/tire-service.jpg'
    },
    {
      id: 'service',
      icon: 'images/service-icon.svg',
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
  
  onMount(() => {
    console.log('Home component mounted');
    
    // Setup observers for scroll animations
    setupScrollObservers();
  });
  
  function setupScrollObservers() {
    try {
      // Services observer
      const servicesSection = document.querySelector('.services-section');
      if (servicesSection) {
        const servicesObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              console.log('Services section visible');
              servicesVisible = true;
              servicesObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -100px 0px',
          threshold: 0.1
        });
        
        servicesObserver.observe(servicesSection);
      }
      
      // Testimonials observer
      const testimonialsSection = document.querySelector('.testimonials-section');
      if (testimonialsSection) {
        const testimonialsObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              console.log('Testimonials section visible');
              testimonialsVisible = true;
              testimonialsObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -100px 0px',
          threshold: 0.1
        });
        
        testimonialsObserver.observe(testimonialsSection);
      }
    } catch (error) {
      console.error('Error setting up observers:', error);
    }
  }
</script>

<HeroSection />

<!-- Booking Section -->
<section class="booking-section">
  <div class="container">
    <h2 class="section-title">{t('booking.title', $currentLang)}</h2>
    
    <div class="booking-container">
      <div class="booking-image">
        <img src="images/parking-lot.jpg" alt="Airport Parking" />
      </div>
      <div class="booking-content">
        <button class="btn btn-primary">{t('booking.button', $currentLang)}</button>
      </div>
    </div>
  </div>
</section>

<!-- Services Section -->
<section class="services-section">
  <div class="container">
    <h2 class="section-title">{t('services.title', $currentLang) || 'SZOLGÁLTATÁSOK'}</h2>
    
    <div class="services-grid">
      {#each services as service, i}
        <ServiceCard 
          id={service.id}
          icon={service.icon}
          image={service.image}
          title={t(`services.${service.id}.title`, $currentLang)}
          description={t(`services.${service.id}.description`, $currentLang)}
          index={i}
          shouldAnimate={servicesVisible}
        />
      {/each}
    </div>
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
      {$currentLang === 'hu' ? 'Ügyfeleink Véleménye' : 'What People Say'}
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
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container">
    <h2>{t('cta.discover', $currentLang)}</h2>
    <button class="btn btn-outline">{t('cta.button', $currentLang)}</button>
  </div>
</section>

<style>
  /* Booking Section */
  .booking-section {
    padding: 6rem 2rem;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 3rem;
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
    background-color: #0088cc;
  }
  
  .booking-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .booking-image {
    flex: 1;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: perspective(1000px) rotateY(-5deg);
    transition: all 0.5s ease;
  }
  
  .booking-image:hover {
    transform: perspective(1000px) rotateY(0);
  }
  
  .booking-image img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }
  
  .booking-image:hover img {
    transform: scale(1.05);
  }
  
  .booking-content {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  /* Services Section */
  .services-section {
    padding: 6rem 2rem;
    background-color: #f8f9fa;
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
    background: linear-gradient(45deg, rgba(0,136,204,0.8) 0%, rgba(0,0,0,0.9) 100%);
    z-index: -1;
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
  }
  
  /* Responsive Styles */
  @media screen and (max-width: 1200px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .testimonials-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media screen and (max-width: 992px) {
    .booking-container {
      flex-direction: column;
      gap: 2rem;
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
    .services-grid,
    .testimonials-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .section-title {
      font-size: 1.8rem;
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
  }
</style>