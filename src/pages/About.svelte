<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // Import the VideoPlayer component
  import VideoPlayer from '../components/VideoPlayer.svelte';

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  let lang;

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  // About content translations - UPDATED AND STRUCTURED FOR NEW LAYOUT
  const content = {
    hu: {
      title: 'Kik vagyunk?',
      subtitle: 'A Zima Autó Kft-nél új értelmet kap a kényelem és a kiválóság az autóápolási szolgáltatások terén. Több mint egy évtizedes tapasztalattal és szakértelemmel, büszkén kínáljuk az egyik legkiterjedtebb autószolgáltatási kínálatot, amely az Ön járművének minden igényét kielégíti egy helyen.',
      story: {
        title: 'Tapasztalat, amiben megbízhat',
        text: 'Több mint 10 év tapasztalattal szolgálva ügyfeleinket, tökéletesítettük képességeinket és finomítottuk folyamatainkat annak érdekében, hogy a legmagasabb színvonalú szolgáltatást és ügyfél-elégedettséget biztosítsunk. Járműve csak a legjobbat érdemli, és pontosan ezt nyújtjuk a Zima Autó Kft-nél.'
      },
      // Repurposed 'mission' section for location
      mission: {
        title: 'Kiváló elhelyezkedés',
        text: 'Stratégiai helyen, mindössze 5 kilométerre és 5 percre a Budapest Liszt Ferenc Nemzetközi Repülőterétől, Vecsésen, létesítményünk páratlan elérhetőséget és kényelmet biztosít. Búcsút mondhat a városban szétszórva lévő szolgáltatók keresési nehézségeinek. A Zima Autó Kft-vel gyorsan és hatékonyan kezelheti minden autójával kapcsolatos igényét, időt és energiát megtakarítva ezzel.'
      },
      // Repurposed 'values' section for 'Why Choose Us?'
      values: {
        title: 'Miért válasszon minket?',
        videoCaption: 'Tekintse meg videónkat és ismerje meg szolgáltatásainkat!'
      },
      // New structure for services, pricing, and conclusion - split for grid layout
      offerings: {
          mainTitle: 'Szolgáltatásaink, áraink és fizetési lehetőségek',
          block1: { // First grid block content
              title: 'Átfogó Szolgáltatási Kínálat',
              text: 'Megértjük, hogy járműve több, mint egyszerű közlekedési eszköz; egy befektetés, amely megérdemli a legnagyobb gondosságot és figyelmet. Ezért kínálunk teljes körű szolgáltatási listát, ideértve:',
               listItems: [ // Detailed list for HU
                  'Repülőtéri parkoló: Nyugodtan utazzon tudva, hogy járműve biztonságban van, amíg Ön távol van. Biztonságos parkoló létesítményünk körbekerített és 24/7-es kamerafelügyelettel biztosítja járműve maximális biztonságát. Ráadásul élvezze az ingyenes repülőtéri transzfert a parkolóból a repülőtérre kényelmes shuttle szolgáltatásunkkal, ami megszünteti az utazási logisztika stresszét. 3000 négyzetméteres, nyitott parkolóhelyünkön 150 parkolóhely áll rendelkezésre, így járművének helyet találni sosem jelenthet gondot. Akár online foglalja, akár egyszerűen csak behajt, mi gondoskodunk róla.',
                  'Kézi Autómosó: Kényeztesse járművét egy profi külső-belső autómosás szolgáltatással, amely ragyogóan tisztává és újjászületetté varázsolja autóját.',
                  'Gumiszervíz: Ne engedje, hogy egy defektes gumi gátat szabjon a programjának. Szakértőink azonnal foglalkoznak bármilyen gumival kapcsolatos problémával, gumicserével, és biztonságosan visszajuttatják Önt az útra.',
                  'Autószervíz: A rutinellenőrzésektől a bonyolult javításokig képzett szerelőink fel vannak készülve az Ön karbantartási és javítási igényeinek kezelésére, hogy járműve zökkenőmentesen és hatékonyan működjön.'
              ]
          },
          block2: { // Second grid block content
              paymentOptionsTitle: 'Rugalmas fizetési lehetőségek',
              paymentOptionsText: 'Tudjuk, hogy a kényelem fontos, ezért rugalmas fizetési lehetőségeket kínálunk, beleértve a készpénzes, bankkártyás fizetést is.',
              pricesTitle: 'Versenyképes árak',
              pricesText: 'A Zima Autó Kft-nél úgy véljük, hogy a minőségi autóápolásnak mindenki számára elérhetőnek kell lennie. Ezért kínáljuk a legjobb árakat minden szolgáltatásunkra, biztosítva, hogy a lehető legtöbbet kapja pénzéért, anélkül, hogy engednénk a minőségből.',
               conclusion: 'Tapasztalja meg a különbséget a Zima Autó Kft-nél - ahol minden alkalommal a kiválóság találkozik a kényelemmel.\n\nLépjen kapcsolatba velünk még ma, hogy felfedezze, hogyan emelhetjük autóápolási élményét új magasságokba!'
          }
      },
      cta: 'Vegye igénybe szolgáltatásainkat'
    },
    en: {
      title: 'Who We Are',
      subtitle: 'With over a decade of unwavering dedication and expertise in the industry, we take pride in offering an unmatched range of services tailored to meet all your automotive requirements under one roof.',
      story: {
        title: 'Experience You Can Trust',
        text: 'With more than 10 years of experience serving our valued customers, we have honed our skills and refined our processes to ensure the highest quality of service and customer satisfaction. Your vehicle deserves nothing but the best, and that\'s precisely what we deliver at Zima Auto Kft.'
      },
       // Repurposed 'mission' section for location
      mission: {
        title: 'Unbeatable Location',
        text: 'Strategically situated just 4.8 kilometers and 5 minutes away from the Budapest Airport, at Vecsés our facility provides unparalleled accessibility and convenience. Say goodbye to the hassle of searching for multiple service providers scattered across the city. With Zima Auto Kft, you can address all your car care needs swiftly and efficiently, saving both time and effort.'
      },
      // Repurposed 'values' section for 'Why Choose Us?'
      values: {
        title: 'Why Choose Us?',
        videoCaption: 'Watch our video to learn more about our services!'
      },
       // New structure for services, pricing, and conclusion - split for grid layout
      offerings: {
          mainTitle: 'Our Offerings: Services, Pricing, and More', // Adjusted main title
          block1: { // First grid block content
              title: 'Comprehensive Range of Services',
              text: 'We understand that your vehicle is more than just a mode of transportation; it\'s an investment that deserves the utmost care and attention. That\'s why we offer a comprehensive suite of services, including:',
               listItems: [ // Simple list for EN
                  'Airport Parking',
                  'Car Wash',
                  'Tyre Repair Service',
                  'Car Maintenance Service'
              ]
          },
           block2: { // Second grid block content
              paymentOptionsTitle: 'Flexible Payment Options',
              paymentOptionsText: 'We understand the importance of convenience, which is why we offer flexible payment options including cash, debit, and credit cards, making your car care experience seamless and hassle-free.',
              pricesTitle: 'Competitive Prices',
              pricesText: 'At Zima Auto Kft, we believe that quality car care should be accessible to everyone. That\'s why we offer the best competitive prices on all our services, ensuring that you get the most value for your money without compromising on quality.',
              conclusion: 'Experience the difference with Zima Auto - where excellence meets convenience, every time.\n\nGet in touch with us today to discover how we can elevate your car care experience to new heights!'
          }
      },
      cta: 'Use our services'
    }
  };

  // Keep existing animation logic and ensure ScrollTrigger is used
  onMount(() => {
    // Animate sections
    gsap.from('.about-section', {
      y: 50,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power2.out',
      scrollTrigger: { // Use scrollTrigger for sections
          trigger: '.about-section',
          start: 'top 80%', // Adjust trigger point as needed
          // markers: true // Uncomment for debugging trigger
      }
    });

    // Animate the video section
    gsap.from('.video-section-wrapper', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.values-section',
        start: 'top 70%',
      }
    });

    // Animate the two new content blocks in the offerings section grid
    gsap.from('.offerings-section .about-content', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3, // Stagger animation between the two blocks
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.offerings-section', // Trigger when the offerings section comes into view
        start: 'top 80%', // Adjust trigger point
        // markers: true, // Uncomment for debugging
      }
    });
     
    // Animate the images in the two new grid blocks
    gsap.from('.offerings-section .about-image', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.15, // Slightly delay image animation
      stagger: 0.3, // Stagger animation between the two images
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.offerings-section', // Trigger when the offerings section comes into view
        start: 'top 80%', // Adjust trigger point
        // markers: true, // Uncomment for debugging
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

  <section class="about-section mission-section">
    <div class="container">
      <div class="about-grid reverse">
        <div class="about-image">
          <img src="images/map.avif" alt="Car Wash Service" />
        </div>
        <div class="about-content">
          <h2>{content[$currentLang].mission.title}</h2>
          <p>{content[$currentLang].mission.text}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="about-section values-section">
    <div class="container">
      <h2 class="section-title">{content[$currentLang].values.title}</h2>
      
      <div class="video-section-wrapper">
        <div class="video-container">
          <VideoPlayer />
        </div>
        <p class="video-caption">{content[$currentLang].values.videoCaption}</p>
      </div>
    </div>
  </section>

  <section class="about-section offerings-section">
    <div class="container">
      <h2 class="section-title">{content[$currentLang].offerings.mainTitle}</h2>

      <div class="about-grid">
        <div class="about-content">
          <h3>{content[$currentLang].offerings.block1.title}</h3>
          <p>{content[$currentLang].offerings.block1.text}</p>
          <ul>
            {#each content[$currentLang].offerings.block1.listItems as item}
              <li>
                {#if $currentLang === 'hu'}
                  {@html item.replace(/\n/g, '<br><br>')}
                {:else}
                  {item}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
        <div class="about-image">
          <img src="images/workshop2.jpg" alt="Auto Service" />
        </div>
      </div>

      <div class="about-grid reverse">
        <div class="about-image">
          <img src="images/car-wash.jpg" alt="Car Wash" />
        </div>
        <div class="about-content">
          <h3>{content[$currentLang].offerings.block2.paymentOptionsTitle}</h3>
          <p>{content[$currentLang].offerings.block2.paymentOptionsText}</p>

          <h3>{content[$currentLang].offerings.block2.pricesTitle}</h3>
          <p>{content[$currentLang].offerings.block2.pricesText}</p>

          <p>{@html content[$currentLang].offerings.block2.conclusion.replace(/\n/g, '<br><br>')}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="about-cta">
    <div class="container">
      <a href="#services" class="btn btn-primary">{content[$currentLang].cta}</a>
    </div>
  </section>
</div>

<style>
  /* Keep base styles */
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

  /* Apply to all sections except hero and cta */
  .about-section {
    padding: 5rem 2rem;
  }

  .about-section:nth-of-type(odd) { /* Apply to odd sections in the container */
     background-color: white;
  }

  .about-section:nth-of-type(even) { /* Apply to even sections in the container */
     background-color: var(--light);
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    margin-bottom: 4rem; /* Space between grid blocks if multiple in a section */
  }

  /* Remove margin-bottom for the last grid in a section */
  .about-section .about-grid:last-child {
    margin-bottom: 0;
  }

  .about-grid.reverse {
    direction: rtl;
  }

  .about-grid.reverse .about-content,
  .about-grid.reverse .about-image {
    direction: ltr; /* Reset text and image direction */
  }

  .about-content h2 { /* Styles for main titles within grid content */
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 15px;
  }

  .about-content h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0; /* Align underline left */
    width: 50px;
    height: 3px;
    background-color: var(--primary);
  }

  .about-content h3 { /* Styles for sub-titles within grid content */
    font-size: 1.5rem;
    margin-top: 1.5rem; /* Space above subheadings */
    margin-bottom: 1rem;
    color: var(--text-dark);
    position: relative; /* For potential future styling */
  }

  .about-content h3:first-child {
    margin-top: 0; /* No top margin if it's the first element */
  }

  .about-content p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-light);
    margin-bottom: 1.5rem; /* Space between paragraphs */
  }

  .about-content ul {
    list-style: none; /* Remove default bullets */
    padding: 0;
    margin: 1.5rem 0;
    text-align: left;
    max-width: 100%; /* Allow list to use full width in content block */
  }

  .about-content li {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-light);
    margin-bottom: 1rem;
    padding-left: 1.5rem; /* Space for custom bullet */
    position: relative;
  }

  .about-content li::before {
    content: '•'; /* Custom bullet point */
    color: var(--primary); /* Primary color bullet */
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    position: absolute;
    left: 0;
    top: 0; /* Align bullet to top of line */
  }

  .about-image {
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    height: 100%;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 600px;
    margin: 0 auto;
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

  /* Styles for the Values section title */
  .section-title {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.2rem;
    position: relative;
    padding-bottom: 15px;
    display: inline-block; /* Make the underline centered under the text */
    left: 50%;
    transform: translateX(-50%);
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); /* Center the underline */
    width: 60px;
    height: 3px;
    background-color: var(--primary);
  }

  /* Video section wrapper + container styles */
  .video-section-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 3rem;
    max-width: 800px; /* Wider container for desktop */
  }

  .video-container {
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .video-caption {
    text-align: center;
    font-size: 1.1rem;
    color: var(--text-light);
    margin-top: 1rem;
    max-width: 600px;
  }

  /* Styles for the Offerings section */
  .offerings-section .section-title { 
    margin-bottom: 4rem; /* More space below the main title */
  }

  .about-cta {
    text-align: center;
    padding: 4rem 2rem;
  }

  .about-cta .btn {
    font-size: 1.1rem;
    padding: 1rem 2.5rem;
    text-decoration: none;
  }

  /* Responsive Styles */
  @media screen and (max-width: 992px) {
    .about-hero {
      padding: 6rem 1.5rem 4rem;
    }

    .about-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .about-grid.reverse {
      direction: ltr;
    }

    .about-grid.reverse .about-content {
      order: 1;
    }

    .about-grid.reverse .about-image {
      order: 2;
    }

    .about-content {
      order: 1;
    }

    .about-image {
      order: 2;
      min-height: 250px;
      max-width: 100%;
    }

    .section-title,
    .about-content h2 {
      left: auto;
      transform: none;
      text-align: left;
      margin-left: 0;
      width: 100%;
      display: block;
    }

    .section-title::after,
    .about-content h2::after {
      left: 0;
      transform: none;
    }

    .values-section .section-title {
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
    }

    .values-section .section-title::after {
      left: 50%;
      transform: translateX(-50%);
    }

    .offerings-section .section-title {
      margin-bottom: 3rem;
    }

    .about-content ul {
      text-align: left;
      max-width: 100%;
    }

    /* Video Section Responsive Adjustment */
    .video-section-wrapper {
      max-width: 90%;
    }

    .video-caption {
      font-size: 1rem;
    }
  }

  @media screen and (max-width: 768px) {
    .about-hero {
      padding: 7rem 1.5rem 3rem;
    }

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

    .about-content h3 {
      font-size: 1.3rem;
    }

    .about-content p,
    .about-content li {
      font-size: 1rem;
    }

    .about-image {
      min-height: 200px;
    }

    .video-section-wrapper {
      margin: 1rem auto 2.5rem;
      max-width: 100%;
    }

    .video-caption {
      font-size: 0.95rem;
      margin-top: 0.8rem;
    }
  }

  @media screen and (max-width: 480px) {
    .about-hero {
      padding: 6.5rem 1rem 2.5rem;
    }

    .about-hero h1 {
      font-size: 1.8rem;
    }

    .section-title,
    .about-content h2 {
      font-size: 1.5rem;
      padding-bottom: 10px;
    }

    .section-title::after,
    .about-content h2::after {
      width: 40px;
    }

    .about-content h3 {
      font-size: 1.2rem;
    }

    .about-image {
      min-height: 180px;
    }

    .about-grid {
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .about-section {
      padding: 2rem 1rem;
    }

    .about-cta {
      padding: 2rem 1rem;
    }

    .about-cta .btn {
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
    }

    .video-section-wrapper {
      margin-bottom: 1.5rem;
    }

    .video-caption {
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  }

  /* Specific style for the offerings section images */
  .offerings-section .about-image {
    max-width: 500px;
    min-height: 250px;
  }

  .offerings-section .about-image img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  /* Adjust text alignment in the offerings section */
  .offerings-section .about-content {
    text-align: left;
  }

  .offerings-section .about-content h3 {
    text-align: left;
    margin-left: 0;
  }

  .offerings-section .about-content p {
    text-align: left;
  }

  /* Responsive adjustments for offerings section */
  @media screen and (max-width: 992px) {
    .offerings-section .about-image {
      max-width: 450px;
    }
  }

  @media screen and (max-width: 768px) {
    .offerings-section .about-image {
      max-width: 400px;
      min-height: 200px;
    }
  }

  @media screen and (max-width: 480px) {
    .offerings-section .about-image {
      max-width: 350px;
      min-height: 180px;
    }
  }
</style>