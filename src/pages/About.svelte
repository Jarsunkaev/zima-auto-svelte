<script>
  import { onMount, onDestroy } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
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
      subtitle: 'Az A&T Groupnál új értelmet kap a kényelem és a kiválóság az autóápolási szolgáltatások terén. Több mint egy évtizedes tapasztalattal és szakértelemmel, büszkén kínáljuk az egyik legkiterjedtebb autószolgáltatási kínálatot, amely az Ön járművének minden igényét kielégíti egy helyen.',
      story: {
        title: 'Tapasztalat, amiben megbízhat',
        text: 'Több mint 10 év tapasztalattal szolgálva ügyfeleinket, tökéletesítettük képességeinket és finomítottuk folyamatainkat annak érdekében, hogy a legmagasabb színvonalú szolgáltatást és ügyfél-elégedettséget biztosítsunk. Járműve csak a legjobbat érdemli, és pontosan ezt nyújtjuk az A&T Groupnál.'
      },
      // Repurposed 'mission' section for location
      mission: {
        title: 'Kiváló elhelyezkedés',
        text: 'Stratégiai helyen, mindössze 5 kilométerre és 5 percre a Budapest Liszt Ferenc Nemzetközi Repülőterétől, Vecsésen, létesítményünk páratlan elérhetőséget és kényelmet biztosít. Búcsút mondhat a városban szétszórva lévő szolgáltatók keresési nehézségeinek. Az A&T Grouppal gyorsan és hatékonyan kezelheti minden autójával kapcsolatos igényét, időt és energiát megtakarítva ezzel.'
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
                  'Gumiszerviz: Ne engedje, hogy egy defektes gumi gátat szabjon a programjának. Szakértőink azonnal foglalkoznak bármilyen gumival kapcsolatos problémával, gumicserével, és biztonságosan visszajuttatják Önt az útra.',
                  'Autószerviz: A rutinellenőrzésektől a bonyolult javításokig képzett szerelőink fel vannak készülve az Ön karbantartási és javítási igényeinek kezelésére, hogy járműve zökkenőmentesen és hatékonyan működjön.'
              ]
          },
          block2: { // Second grid block content
              paymentOptionsTitle: 'Rugalmas fizetési lehetőségek',
              paymentOptionsText: 'Tudjuk, hogy a kényelem fontos, ezért rugalmas fizetési lehetőségeket kínálunk, beleértve a készpénzes, bankkártyás fizetést is.',
              pricesTitle: 'Versenyképes árak',
              pricesText: 'Az A&T Groupnál úgy véljük, hogy a minőségi autóápolásnak mindenki számára elérhetőnek kell lennie. Ezért kínáljuk a legjobb árakat minden szolgáltatásunkra, biztosítva, hogy a lehető legtöbbet kapja pénzéért, anélkül, hogy engednénk a minőségből.',
               conclusion: 'Tapasztalja meg a különbséget az A&T Groupnál - ahol minden alkalommal a kiválóság találkozik a kényelemmel.\n\nLépjen kapcsolatba velünk még ma, hogy felfedezze, hogyan emelhetjük autóápolási élményét új magasságokba!'
          }
      },
      cta: 'Vegye igénybe szolgáltatásainkat'
    },
    en: {
      title: 'Who We Are',
      subtitle: 'With over a decade of unwavering dedication and expertise in the industry, we take pride in offering an unmatched range of services tailored to meet all your automotive requirements under one roof.',
      story: {
        title: 'Experience You Can Trust',
        text: 'With more than 10 years of experience serving our valued customers, we have honed our skills and refined our processes to ensure the highest quality of service and customer satisfaction. Your vehicle deserves nothing but the best, and that\'s precisely what we deliver at A&T Group.'
      },
       // Repurposed 'mission' section for location
      mission: {
        title: 'Unbeatable Location',
        text: 'Strategically situated just 4.8 kilometers and 5 minutes away from the Budapest Airport, at Vecsés our facility provides unparalleled accessibility and convenience. Say goodbye to the hassle of searching for multiple service providers scattered across the city. With A&T Group, you can address all your car care needs swiftly and efficiently, saving both time and effort.'
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
              pricesText: 'At A&T Group, we believe that quality car care should be accessible to everyone. That\'s why we offer the best competitive prices on all our services, ensuring that you get the most value for your money without compromising on quality.',
              conclusion: 'Experience the difference with A&T Group - where excellence meets convenience, every time.\n\nGet in touch with us today to discover how we can elevate your car care experience to new heights!'
          }
      },
      cta: 'Use our services'
    }
  };

  // Keep existing animation logic and ensure ScrollTrigger is used
  let ctx;

  onMount(() => {
    ctx = gsap.context(() => {
      // Cinematic fade-in with slight scale
      gsap.fromTo('.about-hero .container > *', 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          clearProps: 'all'
        }
      );

      // Animate individual sections with glassmorphism reveal
      gsap.utils.toArray('.about-grid').forEach((section) => {
        const content = section.querySelector('.about-content');
        if (content) {
          gsap.fromTo(content, 
            { x: section.classList.contains('reverse') ? 50 : -50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
              },
              clearProps: 'all'
            }
          );
        }

        const image = section.querySelector('.about-image-wrapper');
        if (image) {
          gsap.fromTo(image, 
            { x: section.classList.contains('reverse') ? -50 : 50, opacity: 0, scale: 0.95 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
              },
              clearProps: 'all'
            }
          );
        }
      });
      
      // Refresh ScrollTrigger after a slight delay to ensure layout is ready
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section class="about-hero">
  <div class="hero-background"></div>
  <div class="container relative z-10">
    <h1 class="hero-title">{content[$currentLang].title}</h1>
    <p class="hero-subtitle">{content[$currentLang].subtitle}</p>
  </div>
  <div class="hero-wave">
    <svg preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
    </svg>
  </div>
</section>

<div class="about-container">
  <!-- Section 1: Story -->
  <section class="about-section odd-section">
    <div class="container">
      <div class="about-grid">
        <div class="about-content glass-card">
          <h2>{content[$currentLang].story.title}</h2>
          <div class="heading-accent"></div>
          <p>{content[$currentLang].story.text}</p>
        </div>
        <div class="about-image-wrapper">
          <div class="image-glow"></div>
          <img src="images/parking-lot.webp" alt="A&T Group parking lot" />
        </div>
      </div>
    </div>
  </section>

  <!-- Section 2: Mission -->
  <section class="about-section even-section">
    <div class="container">
      <div class="about-grid reverse">
        <div class="about-image-wrapper">
          <div class="image-glow"></div>
          <img src="images/map.avif" alt="Car Wash Service" />
        </div>
        <div class="about-content glass-card">
          <h2>{content[$currentLang].mission.title}</h2>
          <div class="heading-accent"></div>
          <p>{content[$currentLang].mission.text}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: Offerings Block 1 -->
  <section class="about-section odd-section">
    <div class="container">
      <h2 class="section-main-title">{content[$currentLang].offerings.mainTitle}</h2>
      
      <div class="about-grid">
        <div class="about-content glass-card">
          <h3>{content[$currentLang].offerings.block1.title}</h3>
          <p>{content[$currentLang].offerings.block1.text}</p>
          <ul class="custom-list">
            {#each content[$currentLang].offerings.block1.listItems as item}
              <li>
                <div class="list-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span>
                  {#if $currentLang === 'hu'}
                    {@html item.replace(/\n/g, '<br><br>')}
                  {:else}
                    {item}
                  {/if}
                </span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="about-image-wrapper">
          <div class="image-glow"></div>
          <img src="images/workshop2.jpg" alt="Auto Service" />
        </div>
      </div>
    </div>
  </section>

  <!-- Section 4: Offerings Block 2 -->
  <section class="about-section even-section">
    <div class="container">
      <div class="about-grid reverse">
        <div class="about-image-wrapper">
          <div class="image-glow"></div>
          <img src="images/car-wash.webp" alt="Car Wash" />
        </div>
        <div class="about-content glass-card">
          <h3>{content[$currentLang].offerings.block2.paymentOptionsTitle}</h3>
          <p>{content[$currentLang].offerings.block2.paymentOptionsText}</p>

          <h3 class="mt-4">{content[$currentLang].offerings.block2.pricesTitle}</h3>
          <p>{content[$currentLang].offerings.block2.pricesText}</p>

          <div class="conclusion-box">
            <p>{@html content[$currentLang].offerings.block2.conclusion.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  
</div>

<style>
  :global(body) {
    background-color: rgb(253, 251, 238);
  }

  /* --- HERO SECTION --- */
  .about-hero {
    position: relative;
    background: linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(27, 42, 75) 100%);
    color: white;
    padding: 10rem 2rem 8rem;
    text-align: center;
    overflow: hidden;
  }

  .hero-background {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(circle at top right, rgba(255,255,255,0.05) 0%, transparent 40%),
                      radial-gradient(circle at bottom left, rgba(255,255,255,0.03) 0%, transparent 40%);
    pointer-events: none;
  }

  .relative { position: relative; }
  .z-10 { z-index: 10; }

  .hero-title {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.35rem;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.85;
    line-height: 1.6;
    font-weight: 300;
  }

  .hero-wave {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    line-height: 0;
  }

  .hero-wave svg {
    display: block;
    width: calc(100% + 1.3px);
    height: 120px;
    fill: rgb(253, 251, 238);
  }

  /* --- SECTIONS & LAYOUT --- */
  .about-container {
    padding-bottom: 4rem;
    background-color: rgb(253, 251, 238);
  }

  .about-section {
    padding: 6rem 2rem;
  }

  .odd-section {
    background-color: rgb(253, 251, 238);
  }

  .even-section {
    background-color: #ffffff;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  .about-grid.reverse {
    direction: rtl;
  }

  .about-grid.reverse > * {
    direction: ltr;
  }

  /* --- GLASS CARDS (Content Blocks) --- */
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 24px;
    padding: 3rem;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }

  .glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.08);
  }

  .about-content h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: rgb(27, 42, 75);
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .heading-accent {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, rgb(27, 42, 75), rgb(75, 105, 165));
    border-radius: 2px;
    margin-bottom: 2rem;
  }

  .about-content h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: rgb(27, 42, 75);
    margin-bottom: 1rem;
  }

  .mt-4 {
    margin-top: 2.5rem;
  }

  .about-content p {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #475569;
    margin-bottom: 1.5rem;
  }

  .section-main-title {
    text-align: center;
    font-size: 3rem;
    font-weight: 800;
    color: rgb(27, 42, 75);
    margin-bottom: 5rem;
  }

  /* --- LISTS & ICONS --- */
  .custom-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
  }

  .custom-list li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.7;
  }

  .list-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: rgba(27, 42, 75, 0.1);
    color: rgb(27, 42, 75);
    border-radius: 50%;
    margin-right: 1rem;
    margin-top: 4px;
  }

  .list-icon svg {
    width: 14px;
    height: 14px;
  }

  .conclusion-box {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: rgba(27, 42, 75, 0.03);
    border-left: 4px solid rgb(27, 42, 75);
    border-radius: 0 12px 12px 0;
  }

  .conclusion-box p {
    margin-bottom: 0;
    font-weight: 500;
    color: rgb(27, 42, 75);
  }

  /* --- IMAGES & HOVER EFFECTS --- */
  .about-image-wrapper {
    position: relative;
    border-radius: 24px;
    z-index: 1;
  }

  .image-glow {
    position: absolute;
    top: 5%; left: 5%; right: -5%; bottom: -5%;
    background: linear-gradient(135deg, rgba(27,42,75,0.2), rgba(27,42,75,0.05));
    border-radius: 24px;
    z-index: -1;
    transition: transform 0.5s ease;
  }

  .about-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .about-image-wrapper:hover .image-glow {
    transform: translate(10px, 10px);
  }


  /* --- CTA BUTTON SECTION --- */
  .about-cta {
    text-align: center;
    padding: 6rem 2rem;
    background-color: rgb(253, 251, 238);
  }

  .about-cta .btn {
    background-color: rgb(27, 42, 75) !important;
    color: white !important;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1.2rem 3rem;
    border-radius: 12px;
    border: none;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px -5px rgba(27, 42, 75, 0.3);
  }

  .about-cta .btn:hover {
    background-color: rgb(45, 68, 115) !important;
    transform: translateY(-3px);
    box-shadow: 0 15px 35px -5px rgba(27, 42, 75, 0.4);
  }

  /* --- RESPONSIVE DESIGN --- */
  @media screen and (max-width: 1024px) {
    .about-grid {
      gap: 3rem;
    }
    .hero-title {
      font-size: 3.5rem;
    }
  }

  @media screen and (max-width: 768px) {
    .about-hero {
      padding: 8rem 1.5rem 6rem;
    }
    .hero-title {
      font-size: 2.8rem;
    }
    .hero-wave svg {
      height: 80px;
    }
    .about-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .about-grid.reverse {
      direction: ltr;
    }
    .about-grid.reverse .about-image-wrapper {
      order: 1;
    }
    .about-grid.reverse .about-content {
      order: 2;
    }
    .about-content {
      padding: 2rem;
    }
    .section-main-title {
      font-size: 2.3rem;
      margin-bottom: 3rem;
    }
  }

  @media screen and (max-width: 480px) {
    .hero-title {
      font-size: 2.2rem;
    }
    .hero-subtitle {
      font-size: 1.1rem;
    }
    .about-section {
      padding: 4rem 1.5rem;
    }
    .about-content {
      padding: 1.5rem;
    }
    .about-content h2 {
      font-size: 2rem;
    }
    .about-cta {
      padding: 4rem 1.5rem;
    }
  }
</style>
