<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n'; // Assuming t function handles nested keys like 'pricing.perCar'
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  let lang;

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  // Services content translations (Removed providerHeader as per request, added new parking price headers)
  const content = {
    hu: {
      title: 'SZOLGÁLTATÁSOK',
      subtitle: 'Mindent egy helyen az Ön járművének kényeztetéséhez',
      parking: {
        title: '24/7 REPÜLŐTÉRI PARKOLÁS',
        description: 'Biztonságos parkolási lehetőségünk bekerített határokkal és 24 órás kamerás megfigyeléssel rendelkezik, ami garantálja járművének a legnagyobb biztonságot.',
        features: [
          'Biztonságos, kamerával megfigyelt terület', // Corrected typo
          '24/7 szemyezet a helyszínen', // Corrected typo
          'Kedvező árak hosszabb tartózkodásra is',
          'Ingyenes transzfer a repülőtérre és vissza', // Corrected typo
          'Előfoglalási lehetőség'
        ],
        cta: 'Foglaljon most'
      },
      carWash: {
        title: 'AUTÓMOSÓ',
        description: 'Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon.',
        features: [
          'Külső és belső tisztítás', // Corrected typo
          'Prémi-m waxolás és polírozás', // Corrected typo
          'Kárpittisztítás',
          'Bőrápolás és kondicionálás',
          'Gőztisztítás és fertőtlenítés'
        ],
        cta: 'Részletek megtekintése'
      },
      tire: {
        title: 'GUMISZERVIZ', // Corrected typo
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
      pricing: {
        title: 'ÁRAINK',
        subtitle: 'Versenyképes árakkal és csomagajánlatokkal várjuk',
        parkingTitle: 'Parkolási áraink',
        carWashTitle: 'Autómosási áraink',
        tireServiceTitle: 'Gumiszerelési áraink',
        // providerHeader: 'Szolgáltató', // Removed as per request
        daysHeader: 'Nap', // Simplified header for row-based
        priceNormal: 'Normál ár', // Added for parking table columns
        priceDiscount: 'Kedvezményes ár', // Added for parking table columns
        monthly: '30 napos díjcsomag',
        fleet: 'Flotta (30+ autó)',
        perCar: '/ autó',
        perDay: '/ nap',
        perMonth: '/ hónap',
        perTireSet: '/ 4 kerék',
        // Specific car wash terms from screenshot
        washSmart: 'SMART',
        washPremium: 'PREMIUM',
        washExterior: 'Külső', // Simplified based on screenshot table headers
        washInterior: 'Belső',     // Simplified
        washInteriorExterior: 'Külső & Belső',
        carSizeRegular: 'Személyautó', // Changed from Regular Sized Car
        carSizeSUV: 'SUV, Kisbusz',      // Changed from SUV/Minibus

        wheel16: '16" kerék',
        wheel17: '17" kerék',
        wheel18: '18" kerék',
        wheel19: '19" kerék',
        wheel20: '20" kerék',
        wheel21: '21" kerék'
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
      pricing: {
        title: 'OUR PRICES',
        subtitle: 'We offer competitive prices and package deals',
        parkingTitle: 'Our parking prices',
        carWashTitle: 'Our car wash prices',
        tireServiceTitle: 'Our tire service prices',
        // providerHeader: 'Provider', // Removed as per request
        daysHeader: 'Day', // Simplified header for row-based
        priceNormal: 'Normal Price', // Added for parking table columns
        priceDiscount: 'Discounted Price', // Added for parking table columns
        monthly: '30-day package rate',
        fleet: 'Fleet (30+ cars)',
        perCar: '/ car',
        perDay: '/ day',
        perMonth: '/ month',
        perTireSet: '/ 4 wheels',
         // Specific car wash terms from screenshot
        washSmart: 'SMART',
        washPremium: 'PREMIUM',
        washExterior: 'Exterior', // Simplified based on screenshot table headers
        washInterior: 'Interior',     // Simplified
        washInteriorExterior: 'Interior & Exterior',
        carSizeRegular: 'Regular Sized Car',
        carSizeSUV: 'SUV, Minibus',

        wheel16: '16" wheel',
        wheel17: '17" wheel',
        wheel18: '18" wheel',
        wheel19: '19" wheel',
        wheel20: '20" wheel',
        wheel21: '21" wheel'
      }
    }
  };

  // Pricing data (ONLY Zima Auto data included)
  // Restructured car wash data based on screenshot
  const pricingData = {
    parking: [
      { // Only Zima Auto data
        name: 'Zima Auto', // Keep name in data structure, but not displayed in table as per request
        prices: [
          { days: 1, normal: '7500 Ft', discount: '5500 Ft' },
          { days: 2, normal: '8200 Ft', discount: '6200 Ft' },
          { days: 3, normal: '9000 Ft', discount: '7000 Ft' },
          { days: 4, normal: '9800 Ft', discount: '8000 Ft' },
          { days: 5, normal: '10500 Ft', discount: '8600 Ft' },
          { days: 6, normal: '11200 Ft', discount: '9500 Ft' },
          { days: 7, normal: '12500 Ft', discount: '10500 Ft' },
          { days: 8, normal: '14000 Ft', discount: '11000 Ft' },
          { days: 9, normal: '15500 Ft', discount: '11500 Ft' },
          { days: 10, normal: '16000 Ft', discount: '12000 Ft' },
          { days: 11, normal: '17000 Ft', discount: '12400 Ft' },
          { days: 12, normal: '17600 Ft', discount: '12900 Ft' },
          { days: 13, normal: '18000 Ft', discount: '13500 Ft' },
          { days: 14, normal: '18500 Ft', discount: '13900 Ft' },
          { days: 15, normal: '19000 Ft', discount: '14300 Ft' },
          { days: 16, normal: '19500 Ft', discount: '14700 Ft' },
          { days: 17, normal: '20000 Ft', discount: '15000 Ft' },
          { days: 18, normal: '20500 Ft', discount: '15400 Ft' },
          { days: 19, normal: '21000 Ft', discount: '15800 Ft' },
          { days: 20, normal: '21500 Ft', discount: '16200 Ft' },
          { days: 21, normal: '22000 Ft', discount: '16600 Ft' },
          { days: 22, normal: '22500 Ft', discount: '17000 Ft' },
          { days: 23, normal: '23000 Ft', discount: '17400 Ft' },
          { days: 24, normal: '23500 Ft', discount: '17800 Ft' },
          { days: 25, normal: '24000 Ft', discount: '18200 Ft' },
          { days: 26, normal: '24500 Ft', discount: '18600 Ft' },
          { days: 27, normal: '25000 Ft', discount: '19000 Ft' },
          { days: 28, normal: '25500 Ft', discount: '19500 Ft' },
          { days: 29, normal: '26000 Ft', discount: '19500 Ft' }, // Assuming 29 and 30 are the same
          { days: 30, normal: '26000 Ft', discount: '19500 Ft' }
        ],
        monthly: '24,500 Ft', // Assuming this is the >30 day price or a different package? Keep for now.
        fleet: '516 Ft' // Assuming this is per car per day fleet rate
      }
    ],
    carWash: [
       { // Only Zima Auto data
        name: 'Zima Auto', // Keep name in data structure, but not displayed in table as per request
        packages: {
          smart: {
            regular: {
              interiorExterior: '8900 Ft',
              interior: '4900 Ft',
              exterior: '5900 Ft'
            },
            suv: {
              interiorExterior: '10500 Ft',
              interior: '4900 Ft', // Assuming Interior price is the same for SUV SMART
              exterior: '5900 Ft' // Assuming Exterior price is the same for SUV SMART
            }
          },
          premium: {
             regular: {
              interiorExterior: '11900 Ft',
              interior: '5600 Ft',
              exterior: '6900 Ft'
            },
            suv: {
              interiorExterior: '13500 Ft',
              interior: '5600 Ft', // Assuming Interior price is the same for SUV PREMIUM
              exterior: '6900 Ft' // Assuming Exterior price is the same for SUV PREMIUM
            }
          }
        }
      }
    ],
    tireService: [
      { // Only Zima Auto data
        name: 'Zima Auto', // Keep name in data structure, but not displayed in table as per request
        wheel16: '16,000 Ft',
        wheel17: '17,000 Ft',
        wheel18: '19,000 Ft',
        wheel19: '21,000 Ft',
        wheel20: '22,000 Ft',
        wheel21: '25,000 Ft'
      }
    ]
  };

  // --- Filtered Data for "Zima Auto" ---
  // This logic still works fine, it just finds the only item available now.
  let ourParkingData;
  let ourCarWashData;
  let ourTireData;

  $: { // Reactive block to find our data
      ourParkingData = pricingData.parking.find(p => p.name === 'Zima Auto');
      ourCarWashData = pricingData.carWash.find(p => p.name === 'Zima Auto');
      ourTireData = pricingData.tireService.find(p => p.name === 'Zima Auto');
  }
  // --- End Filtered Data ---


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

    // Animate pricing tables
    gsap.from('.pricing-table-container', { // Animate container for better stagger
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

  <section class="service-section" id="carwash">
    <div class="container">
      <div class="service-grid reverse">
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

  <section class="pricing-section">
    <div class="container">
      <h2 class="section-title">{content[$currentLang].pricing.title}</h2>
      <p class="section-subtitle">{content[$currentLang].pricing.subtitle}</p>

      {#if ourParkingData}
      <div class="pricing-table-container">
        <h3>{content[$currentLang].pricing.parkingTitle}</h3>
        <div class="pricing-scroll-container">
          <table class="parking-table"> <thead>
              <tr>
                <th>{content[$currentLang].pricing.daysHeader}</th>
                <th>{content[$currentLang].pricing.priceNormal}</th>
                <th>{content[$currentLang].pricing.priceDiscount}</th>
              </tr>
            </thead>
            <tbody>
              {#each ourParkingData.prices as price (price.days)}
                <tr>
                  <td>{price.days}</td>
                  <td>{price.normal || '-'}</td>
                  <td>
                    {#if price.discount}
                      {price.discount}
                    {:else}
                      -
                    {/if}
                  </td>
                </tr>
              {/each}
               <tr>
                 <td>{content[$currentLang].pricing.monthly}</td>
                 <td>{ourParkingData.monthly || '-'}</td>
                 <td>-</td> </tr>
               <tr>
                 <td>{content[$currentLang].pricing.fleet}</td>
                 <td>{ourParkingData.fleet || '-'}</td>
                 <td>-</td> </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/if}

      {#if ourCarWashData}
      <div class="pricing-table-container">
        <h3>{content[$currentLang].pricing.carWashTitle}</h3>
        <div class="pricing-scroll-container">
          <table class="carwash-table">
            <thead>
              <tr>
                <th></th>
                <th colspan="3">{content[$currentLang].pricing.washSmart}</th>
                <th colspan="3">{content[$currentLang].pricing.washPremium}</th>
              </tr>
              <tr>
                <th></th>
                <th>{content[$currentLang].pricing.washInteriorExterior}</th>
                <th>{content[$currentLang].pricing.washInterior}</th>
                <th>{content[$currentLang].pricing.washExterior}</th>
                <th>{content[$currentLang].pricing.washInteriorExterior}</th>
                <th>{content[$currentLang].pricing.washInterior}</th>
                <th>{content[$currentLang].pricing.washExterior}</th>
              </tr>
            </thead>
            <tbody>
               <tr>
                <td>{content[$currentLang].pricing.carSizeRegular}</td>
                <td>{ourCarWashData.packages.smart.regular.interiorExterior || '-'}</td>
                <td>{ourCarWashData.packages.smart.regular.interior || '-'}</td>
                <td>{ourCarWashData.packages.smart.regular.exterior || '-'}</td>
                 <td>{ourCarWashData.packages.premium.regular.interiorExterior || '-'}</td>
                <td>{ourCarWashData.packages.premium.regular.interior || '-'}</td>
                <td>{ourCarWashData.packages.premium.regular.exterior || '-'}</td>
              </tr>
              <tr>
                <td>{content[$currentLang].pricing.carSizeSUV}</td>
                 <td>{ourCarWashData.packages.smart.suv.interiorExterior || '-'}</td>
                <td>{ourCarWashData.packages.smart.suv.interior || '-'}</td>
                <td>{ourCarWashData.packages.smart.suv.exterior || '-'}</td>
                 <td>{ourCarWashData.packages.premium.suv.interiorExterior || '-'}</td>
                <td>{ourCarWashData.packages.premium.suv.interior || '-'}</td>
                <td>{ourCarWashData.packages.premium.suv.exterior || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/if}

      {#if ourTireData}
      <div class="pricing-table-container">
        <h3>{content[$currentLang].pricing.tireServiceTitle}</h3>
        <div class="pricing-scroll-container">
          <table>
            <thead>
              <tr>
                 <th>{content[$currentLang].pricing.wheel16}</th>
                <th>{content[$currentLang].pricing.wheel17}</th>
                <th>{content[$currentLang].pricing.wheel18}</th>
                <th>{content[$currentLang].pricing.wheel19}</th>
                <th>{content[$currentLang].pricing.wheel20}</th>
                <th>{content[$currentLang].pricing.wheel21}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                 <td>{ourTireData.wheel16 || '-'} {ourTireData.wheel16 ? content[$currentLang].pricing.perTireSet : ''}</td>
                <td>{ourTireData.wheel17 || '-'} {ourTireData.wheel17 ? content[$currentLang].pricing.perTireSet : ''}</td>
                <td>{ourTireData.wheel18 || '-'} {ourTireData.wheel18 ? content[$currentLang].pricing.perTireSet : ''}</td>
                <td>{ourTireData.wheel19 || '-'} {ourTireData.wheel19 ? content[$currentLang].pricing.perTireSet : ''}</td>
                <td>{ourTireData.wheel20 || '-'} {ourTireData.wheel20 ? content[$currentLang].pricing.perTireSet : ''}</td>
                <td>{ourTireData.wheel21 || '-'} {ourTireData.wheel21 ? content[$currentLang].pricing.perTireSet : ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/if}

    </div>
  </section>
</div>

<style>
  :root {
    /* Define your CSS variables if not defined globally */
    --primary: rgba(0, 186, 229, 1);
    --secondary: #34495e; /* Example */
    --light: #f8f9fa;    /* Example */
    --text: #333;        /* Example */
    --text-light: #666; /* Example */
    --dark-header-bg: #1a1a1a; /* Dark background for headers */
    --dark-header-text: white; /* White text for headers */
     --dark-header-secondary-bg: #333; /* Slightly lighter dark for second row */
  }

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

  .services-container {
    /* Container for all service sections + pricing */
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
    max-width: 1200px; /* Limit max width */
    margin: 0 auto;    /* Center grid */
  }

  .service-grid.reverse {
    direction: rtl;
  }

  .service-grid.reverse > * {
    direction: ltr;
  }

  .service-content h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--text);
    position: relative;
    padding-bottom: 10px; /* Space for the line */
  }

  .service-content h2::after {
    content: '';
    position: absolute;
    bottom: 0; /* Position at the bottom */
    left: 0;
    width: 50px;
    height: 3px;
    background-color: var(--primary);
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
    color: var(--text);
  }

  .feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 2px; /* Adjust vertical alignment */
    color: var(--primary);
    font-weight: bold;
    font-size: 1.2em;
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
    color: var(--text);
  }

  .section-subtitle {
    text-align: center;
    margin-bottom: 3rem;
    color: var(--text-light);
    font-size: 1.1rem;
  }

  .pricing-table-container {
    margin-bottom: 4rem;
    max-width: 1200px; /* Limit max width */
    margin-left: auto;
    margin-right: auto;
  }

  .pricing-table-container h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.8rem; /* Slightly larger */
    color: var(--text);
    font-weight: 600;
  }

  .pricing-scroll-container {
    overflow-x: auto; /* Enable horizontal scroll */
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    background-color: white;
    margin-bottom: 2rem;
    padding: 0; /* Remove padding if table cells have enough */
    border: 1px solid #eee; /* Add subtle border */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }

 /* Style scrollbars for browsers that support it */
  .pricing-scroll-container::-webkit-scrollbar {
      height: 8px;
  }
  .pricing-scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
  }
  .pricing-scroll-container::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
  }
  .pricing-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #aaa;
  }


  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px; /* Minimum width for smaller tables */
    border: none; /* Remove table border, rely on container */
  }

  .parking-table {
      /* Min width might not be needed anymore with row-based layout */
      min-width: unset;
  }

  .carwash-table {
      min-width: 800px; /* Ensure carwash table is wide enough */
  }

  th, td {
    padding: 1rem 1rem; /* Adjusted padding slightly */
    text-align: center;
    border: 1px solid #eee;
    white-space: nowrap; /* Prevent text wrapping in cells */
    font-size: 0.95rem;
    vertical-align: middle;
  }

  th {
    background-color: var(--dark-header-bg); /* Black header background */
    color: var(--dark-header-text); /* White header text */
    font-weight: 600;
    position: sticky; /* Sticky header for vertical scroll */
    top: 0;
    z-index: 2; /* Above sticky first column */
  }

  /* Keep second row of header sticky as well (only applies to carwash table now) */
  .carwash-table thead tr:nth-child(2) th {
    top: 48px; /* Adjust based on first row header height + padding/border */
     background-color: var(--dark-header-secondary-bg); /* Slightly lighter dark for distinction */
  }

  /* Specific styling for the first header cell in car wash table (empty) */
  .carwash-table th:first-child {
      background-color: var(--dark-header-bg); /* Match first row header background */
  }
   .carwash-table thead tr:nth-child(2) th:first-child {
      background-color: var(--dark-header-secondary-bg); /* Match second row header background */
   }


  td {
      color: var(--text);
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }

   /* Remove the specific styling for the old .wide-table sticky first column */
   /* It's no longer needed with the new parking table structure */
   .wide-table th:first-child,
   .wide-table td:first-child {
       position: static;
       left: unset;
       z-index: auto;
       border-right: 1px solid #eee; /* Reset border */
   }
    .wide-table thead th:first-child,
    .wide-table tbody td:first-child,
    .wide-table tbody tr:nth-child(even) td:first-child,
    .wide-table tbody tr:hover td:first-child {
        background-color: unset; /* Reset background colors */
    }


  .current-price {
    color: #e74c3c; /* Adjust color if needed */
    font-weight: bold;
    /* No longer need display: block or margin-bottom */
  }

  .discounted-price {
    text-decoration: line-through;
    color: #999;
    font-size: 0.85em; /* Smaller */
     /* No longer need display: block or margin-bottom */
     margin-right: 8px; /* Add some space between discounted and current price if needed, but with row structure they are in separate cells */
  }

  .btn {
    display: inline-block;
    padding: 0.8rem 1.8rem;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 0.95rem;
  }

  .btn-primary {
    background-color: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background-color: #009cc1; /* Darken primary */
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 186, 229, 0.3);
  }

  @media screen and (max-width: 992px) {
    .service-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .service-grid.reverse {
      direction: ltr; /* Reset direction */
    }

    /* Ensure image is below text on mobile */
     .service-grid .service-content {
        order: 1;
     }
     .service-grid .service-image {
        order: 2;
     }
     /* Reverse order for the reversed grid */
      .service-grid.reverse .service-content {
        order: 1; /* Keep text first */
     }
      .service-grid.reverse .service-image {
        order: 2; /* Keep image second */
     }


    .service-image {
      max-width: 500px; /* Limit image width */
      margin: 0 auto; /* Center image */
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

    .pricing-section {
       padding: 4rem 1rem; /* Less padding on mobile */
    }

     .pricing-table-container h3 {
        font-size: 1.5rem;
     }

    .pricing-scroll-container {
      /* No specific changes needed, overflow handles it */
    }

    th, td {
      padding: 0.8rem 0.5rem; /* Less padding */
      font-size: 0.8rem; /* Smaller font for more columns */
    }

     /* Adjust sticky header height for second row */
     .carwash-table thead tr:nth-child(2) th {
        top: 40px; /* Adjusted based on smaller font/padding */
     }

     .btn {
        padding: 0.7rem 1.5rem;
        font-size: 0.9rem;
     }
  }

</style>