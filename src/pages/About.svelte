<script>
    import { onMount } from 'svelte';
    import { currentLang, t } from '../lib/i18n';
    import { gsap } from 'gsap';
    
    let lang;
    
    // Subscribe to language changes
    currentLang.subscribe(value => {
      lang = value;
    });
    
    // About content translations
    const content = {
      hu: {
        title: 'RÓLUNK',
        subtitle: 'Ismerje meg a Zima Auto történetét és szolgáltatásait',
        story: {
          title: 'TÖRTÉNETÜNK',
          text: 'A Zima Auto Kft. 2015-ben alakult családi vállalkozásként. Célunk kezdettől fogva az volt, hogy magas színvonalú, megbízható szolgáltatásokat nyújtsunk az autótulajdonosok számára. A reptéri parkolástól kezdve az autóápolási szolgáltatásokig mindent egy helyen kínálunk ügyfeleinknek, megkönnyítve ezzel a mindennapi életüket és utazásaikat.'
        },
        mission: {
          title: 'KÜLDETÉSÜNK',
          text: 'Küldetésünk, hogy az ügyfelek számára stresszmentes, biztonságos és kényelmes megoldást kínáljunk járműveik parkolására és karbantartására. Hiszünk abban, hogy a kiváló ügyfélszolgálat és a megbízható szolgáltatások kombinációja kulcsfontosságú a hosszú távú sikeres ügyfélkapcsolatok kialakításában.'
        },
        values: {
          title: 'ÉRTÉKEINK',
          items: [
            {
              title: 'Megbízhatóság',
              text: 'Pontosan azt nyújtjuk, amit ígérünk, minden alkalommal.'
            },
            {
              title: 'Biztonság',
              text: 'Az Ön járműve biztonságban van nálunk, 24 órás felügyelettel és bekerített területtel.'
            },
            {
              title: 'Ügyfélközpontúság',
              text: 'Az ügyfelek igényei és elégedettsége mindig az első helyen áll számunkra.'
            },
            {
              title: 'Szakértelem',
              text: 'Képzett szakembereink naprakész tudással rendelkeznek.'
            }
          ]
        },
        team: {
          title: 'CSAPATUNK',
          text: 'A Zima Auto csapata tapasztalt szakemberekből áll, akik elkötelezettek a kiváló minőségű szolgáltatások nyújtása mellett. Munkatársaink folyamatos képzéseken vesznek részt, hogy a legújabb technikákat és technológiákat is alkalmazhassák munkájuk során.'
        },
        cta: 'Vegye igénybe szolgáltatásainkat'
      },
      en: {
        title: 'ABOUT US',
        subtitle: 'Get to know Zima Auto\'s story and services',
        story: {
          title: 'OUR STORY',
          text: 'Zima Auto Ltd. was established in 2015 as a family business. From the beginning, our goal has been to provide high-quality, reliable services for car owners. From airport parking to car care services, we offer everything in one place for our customers, making their daily lives and travels easier.'
        },
        mission: {
          title: 'OUR MISSION',
          text: 'Our mission is to offer customers a stress-free, safe, and convenient solution for parking and maintaining their vehicles. We believe that the combination of excellent customer service and reliable services is key to establishing long-term successful customer relationships.'
        },
        values: {
          title: 'OUR VALUES',
          items: [
            {
              title: 'Reliability',
              text: 'We deliver exactly what we promise, every time.'
            },
            {
              title: 'Security',
              text: 'Your vehicle is safe with us, with 24-hour supervision and a fenced area.'
            },
            {
              title: 'Customer Focus',
              text: 'Customer needs and satisfaction are always our top priority.'
            },
            {
              title: 'Expertise',
              text: 'Our trained professionals have up-to-date knowledge.'
            }
          ]
        },
        team: {
          title: 'OUR TEAM',
          text: 'The Zima Auto team consists of experienced professionals who are committed to providing excellent quality services. Our employees participate in continuous training to apply the latest techniques and technologies in their work.'
        },
        cta: 'Use our services'
      }
    };
    
    onMount(() => {
      // Animate elements
      gsap.from('.about-section', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power2.out'
      });
      
      // Enhanced animation for values cards - one by one fade in with subtle scale
      gsap.from('.values-card', {
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        stagger: 0.2, // This creates the one-by-one effect
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.values-section',
          start: 'top 70%',
          // Add markers: true, to debug the trigger points
        }
      });
    });
  </script>
  
  <section class="about-hero">
    <div class="container">
      <h1>{content[$currentLang].title}</h1>
      <p>{content[$currentLang].subtitle}</p>
    </div>
  </section>
  
  <div class="about-container">
    <!-- Story Section -->
    <section class="about-section story-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <h2>{content[$currentLang].story.title}</h2>
            <p>{content[$currentLang].story.text}</p>
          </div>
          <div class="about-image">
            <img src="images/parking-lot.jpg" alt="Zima Auto parking lot" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Mission Section -->
    <section class="about-section mission-section">
      <div class="container">
        <div class="about-grid reverse">
          <div class="about-image">
            <img src="images/car-wash.jpg" alt="Car Wash Service" />
          </div>
          <div class="about-content">
            <h2>{content[$currentLang].mission.title}</h2>
            <p>{content[$currentLang].mission.text}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Values Section -->
    <section class="about-section values-section">
      <div class="container">
        <h2 class="section-title">{content[$currentLang].values.title}</h2>
        
        <div class="values-grid">
          {#each content[$currentLang].values.items as value, index}
            <div class="values-card">
              <span class="values-number">{index + 1}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
    
    <!-- Team Section -->
    <section class="about-section team-section">
      <div class="container">
        <div class="team-content">
          <h2>{content[$currentLang].team.title}</h2>
          <p>{content[$currentLang].team.text}</p>
        </div>
        
        <div class="team-image">
          <div class="image-overlay"></div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="about-cta">
      <div class="container">
        <a href="#services" class="btn btn-primary">{content[$currentLang].cta}</a>
      </div>
    </section>
  </div>
  
  <style>
    .about-hero {
      background-color: var(--secondary);
      color: white;
      padding: 8rem 2rem 5rem;
      text-align: center;
    }
    
    .about-hero h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    
    .about-hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
      opacity: 0.9;
    }
    
    .about-container {
      padding-bottom: 4rem;
    }
    
    .about-section {
      padding: 5rem 2rem;
    }
    
    .about-section:nth-child(even) {
      background-color: var(--light);
    }
    
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .about-grid.reverse {
      direction: rtl;
    }
    
    .about-grid.reverse .about-content {
      direction: ltr;
    }
    
    .about-content h2 {
      font-size: 2.2rem;
      margin-bottom: 1.5rem;
      position: relative;
    }
    
    .about-content h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 50px;
      height: 3px;
      background-color: rgba(0, 186, 229, 1);
    }
    
    .about-content p {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-light);
    }
    
    .about-image {
      overflow: hidden;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      height: 100%;
    }
    
    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .about-image:hover img {
      transform: scale(1.05);
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
      background-color: rgba(0, 186, 229, 1);
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .values-card {
      background-color: white;
      padding: 2.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .values-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .values-number {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 3rem;
      font-weight: 800;
      color: rgba(0, 186, 229, 0.1);
      transition: all 0.3s ease;
    }
    
    .values-card:hover .values-number {
      color: rgba(0, 186, 229, 0.2);
      transform: scale(1.2);
    }
    
    .values-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: rgba(0, 186, 229, 1);
    }
    
    .values-card p {
      color: var(--text-light);
      line-height: 1.6;
    }
    
    .team-section {
      position: relative;
    }
    
    .team-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 3rem;
    }
    
    .team-content h2 {
      font-size: 2.2rem;
      margin-bottom: 1.5rem;
      position: relative;
      display: inline-block;
    }
    
    .team-content h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background-color: rgba(0, 186, 229, 1);
    }
    
    .team-content p {
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-light);
    }
    
    .team-image {
      height: 300px;
      background-image: url('images/auto-service.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.4) 50%,
        rgba(0, 0, 0, 0.1) 100%
      );
    }
    
    .about-cta {
      text-align: center;
      padding: 4rem 2rem;
      background-color: var(--secondary);
    }
    
    .about-cta .btn {
      font-size: 1.1rem;
      padding: 1rem 2.5rem;
    }
    
    @media screen and (max-width: 992px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .about-grid.reverse {
        direction: ltr;
      }
      
      .about-content {
        order: 1;
      }
      
      .about-image {
        order: 2;
      }
    }
    
    @media screen and (max-width: 768px) {
      .about-hero h1 {
        font-size: 2.2rem;
      }
      
      .about-hero p {
        font-size: 1rem;
      }
      
      .about-content h2 {
        font-size: 1.8rem;
      }
      
      .about-section {
        padding: 3rem 1.5rem;
      }
      
      .team-image {
        height: 200px;
      }
    }
  </style>  