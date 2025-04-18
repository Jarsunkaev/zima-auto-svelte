<script>
    import { onMount } from 'svelte';
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
    
    // Services content translations
    const content = {
      hu: {
        title: 'SZOLGÁLTATÁSOK',
        subtitle: 'Mindent egy helyen az Ön járművének kényeztetéséhez',
        parking: {
          title: '24/7 REPÜLŐTÉRI PARKOLÁS',
          description: 'Biztonságos parkolási lehetőségünk bekerített határokkal és 24 órás kamerás megfigyeléssel rendelkezik, ami garantálja járművének a legnagyobb biztonságot.',
          features: [
            'Biztonságos, kamerával megfigyelt terület',
            '24/7 személyzet a helyszínen',
            'Kedvező árak hosszabb tartózkodásra is',
            'Ingyenes transzfer a repülőtérre és vissza',
            'Előfoglalási lehetőség'
          ],
          cta: 'Foglaljon most'
        },
        carWash: {
          title: 'AUTÓMOSÓ',
          description: 'Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon.',
          features: [
            'Külső és belső tisztítás',
            'Prémium waxolás és polírozás',
            'Kárpittisztítás',
            'Bőrápolás és kondicionálás',
            'Gőztisztítás és fertőtlenítés'
          ],
          cta: 'Részletek megtekintése'
        },
        tire: {
          title: 'GUMISZERIVZ',
          description: 'Szakértő technikusaink készen állnak az abroncsokkal kapcsolatos bármilyen probléma azonnali megoldására, és biztonságosan visszatérni az útra.',
          features: [
            'Gumiabroncs csere és javítás',
            'Kerék kiegyensúlyozás',
            'Szezonális tárolás',
            'Futóműbeállítás',
            'Prémium márkák széles választéka'
          ],
          cta: 'További információ'
        },
        service: {
          title: 'AUTÓSZERVIZ',
          description: 'A rutinellenőrzéstől a komplex javításokig szakképzett szerelőink fel vannak szerelve az összes karbantartás elvégzésére.',
          features: [
            'Olajcsere és rutin karbantartás',
            'Diagnosztika és hibaelhárítás',
            'Fék- és felfüggesztés javítás',
            'Elektromos rendszerek',
            'Klíma szerviz'
          ],
          cta: 'Időpont foglalása'
        },
        pricing: {
          title: 'ÁRAINK',
          subtitle: 'Versenyképes árakkal és csomagajánlatokkal várjuk',
          packages: [
            {
              title: 'ALAP PARKOLÁS',
              price: '2 500 Ft',
              period: '/ nap',
              features: [
                'Biztonságos parkolás',
                'Kamerás felügyelet',
                'Transzfer a repülőtérre',
                'Online foglalás'
              ],
              cta: 'Kiválasztás'
            },
            {
              title: 'PRÉMIUM PARKOLÁS',
              price: '3 500 Ft',
              period: '/ nap',
              features: [
                'Minden az Alap csomagban',
                'Fedett parkolóhely',
                'Alap külső mosás',
                'Kiemelt transzfer'
              ],
              featured: true,
              cta: 'Kiválasztás'
            },
            {
              title: 'VIP CSOMAG',
              price: '5 000 Ft',
              period: '/ nap',
              features: [
                'Minden a Prémium csomagban',
                'Teljes külső és belső mosás',
                'Prioritásos kiszolgálás',
                'Üzemanyag utántöltés (külön díj)'
              ],
              cta: 'Kiválasztás'
            }
          ]
        }
      },
      en: {
        title: 'SERVICES',
        subtitle: 'Everything in one place to pamper your vehicle',
        parking: {
          title: '24/7 AIRPORT PARKING',
          description: 'Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle.',
          features: [
            'Secure, camera-monitored area',
            '24/7 staff on site',
            'Favorable rates for longer stays',
            'Free transfer to and from the airport',
            'Pre-booking option'
          ],
          cta: 'Book now'
        },
        carWash: {
          title: 'CAR WASH',
          description: 'Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful.',
          features: [
            'Exterior and interior cleaning',
            'Premium waxing and polishing',
            'Upholstery cleaning',
            'Leather care and conditioning',
            'Steam cleaning and sanitization'
          ],
          cta: 'View details'
        },
        tire: {
          title: 'TIRE SERVICE',
          description: 'Our expert technicians are ready to solve any tire-related problems immediately and get you safely back on the road.',
          features: [
            'Tire replacement and repair',
            'Wheel balancing',
            'Seasonal storage',
            'Wheel alignment',
            'Wide selection of premium brands'
          ],
          cta: 'More information'
        },
        service: {
          title: 'AUTO SERVICE',
          description: 'From routine checks to complex repairs, our qualified mechanics are equipped to perform all maintenance.',
          features: [
            'Oil changes and routine maintenance',
            'Diagnostics and troubleshooting',
            'Brake and suspension repair',
            'Electrical systems',
            'A/C service'
          ],
          cta: 'Book appointment'
        },
        pricing: {
          title: 'OUR PRICES',
          subtitle: 'We offer competitive prices and package deals',
          packages: [
            {
              title: 'BASIC PARKING',
              price: '2 500 HUF',
              period: '/ day',
              features: [
                'Secure parking',
                'Camera surveillance',
                'Airport transfer',
                'Online booking'
              ],
              cta: 'Select'
            },
            {
              title: 'PREMIUM PARKING',
              price: '3 500 HUF',
              period: '/ day',
              features: [
                'Everything in Basic package',
                'Covered parking space',
                'Basic exterior wash',
                'Priority transfer'
              ],
              featured: true,
              cta: 'Select'
            },
            {
              title: 'VIP PACKAGE',
              price: '5 000 HUF',
              period: '/ day',
              features: [
                'Everything in Premium package',
                'Complete exterior and interior wash',
                'Priority service',
                'Fuel refill (extra charge)'
              ],
              cta: 'Select'
            }
          ]
        }
      }
    };
    
    onMount(() => {
      // Animate service sections
      gsap.from('.service-section', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.services-container',
          start: 'top 70%'
        }
      });
      
      // Animate pricing plans
      gsap.from('.pricing-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.pricing-section',
          start: 'top 70%'
        }
      });
    });
  </script>
  
  <section class="services-hero">
    <div class="container">
      <h1>{content[$currentLang].title}</h1>
      <p>{content[$currentLang].subtitle}</p>
    </div>
  </section>
  
  <div class="services-container">
    <!-- Parking Service -->
    <section class="service-section" id="parking">
      <div class="container">
        <div class="service-grid">
          <div class="service-content">
            <h2>{content[$currentLang].parking.title}</h2>
            <p class="service-description">{content[$currentLang].parking.description}</p>
            
            <ul class="feature-list">
              {#each content[$currentLang].parking.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
            
            <button class="btn btn-primary">{content[$currentLang].parking.cta}</button>
          </div>
          
          <div class="service-image">
            <img src="images/parking-lot.jpg" alt="Airport Parking" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Car Wash Service -->
    <section class="service-section" id="carwash">
      <div class="container">
        <div class="service-grid reversed">
          <div class="service-image">
            <img src="images/car-wash.jpg" alt="Car Wash" />
          </div>
          
          <div class="service-content">
            <h2>{content[$currentLang].carWash.title}</h2>
            <p class="service-description">{content[$currentLang].carWash.description}</p>
            
            <ul class="feature-list">
              {#each content[$currentLang].carWash.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
            
            <button class="btn btn-primary">{content[$currentLang].carWash.cta}</button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Tire Service -->
    <section class="service-section" id="tire">
      <div class="container">
        <div class="service-grid">
          <div class="service-content">
            <h2>{content[$currentLang].tire.title}</h2>
            <p class="service-description">{content[$currentLang].tire.description}</p>
            
            <ul class="feature-list">
              {#each content[$currentLang].tire.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
            
            <button class="btn btn-primary">{content[$currentLang].tire.cta}</button>
          </div>
          
          <div class="service-image">
            <img src="images/tire-service.jpg" alt="Tire Service" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Auto Service -->
    <section class="service-section" id="autoservice">
      <div class="container">
        <div class="service-grid reversed">
          <div class="service-image">
            <img src="images/auto-service.jpg" alt="Auto Service" />
          </div>
          
          <div class="service-content">
            <h2>{content[$currentLang].service.title}</h2>
            <p class="service-description">{content[$currentLang].service.description}</p>
            
            <ul class="feature-list">
              {#each content[$currentLang].service.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
            
            <button class="btn btn-primary">{content[$currentLang].service.cta}</button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="container">
        <h2 class="section-title">{content[$currentLang].pricing.title}</h2>
        <p class="section-subtitle">{content[$currentLang].pricing.subtitle}</p>
        
        <div class="pricing-grid">
          {#each content[$currentLang].pricing.packages as pkg}
            <div class="pricing-card {pkg.featured ? 'featured' : ''}">
              <div class="pricing-header">
                <h3>{pkg.title}</h3>
                <div class="pricing-price">
                  <span class="price">{pkg.price}</span>
                  <span class="period">{pkg.period}</span>
                </div>
              </div>
              
              <div class="pricing-features">
                <ul>
                  {#each pkg.features as feature}
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                      </svg>
                      {feature}
                    </li>
                  {/each}
                </ul>
              </div>
              
              <div class="pricing-footer">
                <button class="btn {pkg.featured ? 'btn-primary' : 'btn-outline-dark'}">{pkg.cta}</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </div>
  
  <style>
    .services-hero {
      background-color: var(--secondary);
      color: white;
      padding: 8rem 2rem 5rem;
      text-align: center;
    }
    
    .services-hero h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    
    .services-hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
      opacity: 0.9;
    }
    
    .service-section {
      padding: 5rem 2rem;
    }
    
    .service-section:nth-child(odd) {
      background-color: var(--light);
    }
    
    .service-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .service-grid.reversed {
      direction: rtl;
    }
    
    .service-grid.reversed .service-content {
      direction: ltr;
    }
    
    .service-content h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: var(--text);
      position: relative;
    }
    
    .service-content h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 50px;
      height: 3px;
      background-color: rgba(0, 186, 229, 1);
    }
    
    .service-description {
      margin-bottom: 2rem;
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text-light);
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }
    
    .feature-list li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 1rem;
      font-size: 1.05rem;
    }
    
    .feature-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: rgba(0, 186, 229, 1);
      font-weight: bold;
    }
    
    .feature-list li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 1rem;
      font-size: 1.05rem;
    }
    
    .feature-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--primary);
      font-weight: bold;
    }
    
    .service-image {
      overflow: hidden;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .service-image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s ease;
    }
    
    .service-image:hover img {
      transform: scale(1.05);
    }
    
    /* Pricing Section */
    .pricing-section {
      padding: 6rem 2rem;
      background-color: white;
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 2.2rem;
    }
    
    .section-subtitle {
      text-align: center;
      margin-bottom: 3rem;
      color: var(--text-light);
      font-size: 1.1rem;
    }
    
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .pricing-card {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 1px solid #eee;
    }
    
    .pricing-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .pricing-card.featured {
      transform: scale(1.05);
      box-shadow: 0 20px 40px rgba(0, 186, 229, 0.1);
      border: 2px solid rgba(0, 186, 229, 1);
      position: relative;
    }
    
    .pricing-card.featured::before {
      content: '';
      position: absolute;
      top: 0;
      right: 2rem;
      width: 30px;
      height: 30px;
      background-color: rgba(0, 186, 229, 1);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      transform: rotate(180deg);
    }
    
    .pricing-header {
      background-color: #f8f9fa;
      padding: 2rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    
    .pricing-card.featured .pricing-header {
      background-color: rgba(0, 186, 229, 1);
      color: white;
    }
    
    .pricing-header h3 {
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    
    .pricing-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
    }
    
    .price {
      font-size: 2rem;
      font-weight: 700;
    }
    
    .period {
      font-size: 0.9rem;
      margin-left: 0.5rem;
      color: var(--text-light);
    }
    
    .pricing-card.featured .period {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .pricing-features {
      padding: 2rem;
    }
    
    .pricing-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .pricing-features li {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }
    
    .pricing-features li svg {
      margin-right: 10px;
      color: rgba(0, 186, 229, 1);
    }
    
    .pricing-footer {
      padding: 0 2rem 2rem;
      text-align: center;
    }
    
    .btn-outline-dark {
      background-color: transparent;
      border: 2px solid var(--text);
      color: var(--text);
    }
    
    .btn-outline-dark:hover {
      background-color: var(--text);
      color: white;
    }
    
    @media screen and (max-width: 992px) {
      .service-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      
      .service-grid.reversed {
        direction: ltr;
      }
      
      .service-content {
        order: 1;
      }
      
      .service-image {
        order: 2;
      }
      
      .pricing-card.featured {
        transform: none;
        grid-row: 1;
      }
    }
    
    @media screen and (max-width: 768px) {
      .services-hero h1 {
        font-size: 2.2rem;
      }
      
      .services-hero p {
        font-size: 1rem;
      }
      
      .service-section {
        padding: 3rem 1.5rem;
      }
      
      .service-content h2 {
        font-size: 1.8rem;
      }
      
      .pricing-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>  