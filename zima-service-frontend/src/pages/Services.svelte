<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let lang;
  currentLang.subscribe(value => {
    lang = value;
  });


  // REFACTORED Tire Service Prices
  const tireServicePrices = {
      // Main service: Wheel fitting, tire fitting, alignment per 4 tires
      fullServicePer4Tires: [
          { size: '16"', price: '16000 Ft' },
          { size: '17"', price: '17000 Ft' },
          { size: '18"', price: '19000 Ft' },
          { size: '19"', price: '21000 Ft' },
          { size: '20"', price: '22000 Ft' },
          { size: '21"', price: '25000 Ft' }
      ],
      // Other services
      patching: { // Defekt javítás
          name: { hu: 'Defekt javítás', en: 'Tire Patching' },
          pricePerTyre: '2000 Ft',
          note: { hu: '/ gumi + szerelés', en: '/ tire + mounting' }
      },
      wheelMountingOnly: { // Kerék le-fel szerelés (4 pcs)
          name: { hu: 'Kerék le-fel szerelés', en: 'Wheel Mounting Only' },
          pricePer4pcs: '5000 Ft',
          note: { hu: '/ 4 darab', en: '/ 4 pcs' }
      },
      alloyWheelMountingAlignment: { // Kerék le-fel szerelés és centrírozás könnyűfém felnin (4 pcs)
          name: { hu: 'Kerék le-fel szerelés és centrírozás (könnyűfém felni)', en: 'Alloy Wheel Mounting & Alignment' },
          pricePer4pcs: '12000 Ft',
          note: { hu: '/ 4 darab', en: '/ 4 pcs' }
        }
  };


  const maintenanceServices = [
      { name: { hu: 'Autóvizsgálat', en: 'Car Inspection' } }, { name: { hu: 'Fékjavítás', en: 'Brake Repair' } },
      { name: { hu: 'Futómű javítások', en: 'Chassis Repairs' } }, { name: { hu: 'Kuplung javítás, kuplungcsere', en: 'Clutch Repair, Replacement' } },
      { name: { hu: 'Olajcsere, szűrők és váltó olajcsere', en: 'Oil Change, Filters, and Gearbox Oil Change' } },
      { name: { hu: 'Vezérműszíj csere', en: 'Timing Belt Replacement' } }, { name: { hu: 'Váltó felújítás', en: 'Gearbox Overhaul' } },
      { name: { hu: 'Motorjavítás, felújítás', en: 'Engine Repair, Overhaul' } }
  ];

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
  });
</script>

<section class="services-hero">
  <div class="container">
    <h1>{$currentLang === 'hu' ? 'SZOLGÁLTATÁSOK' : 'SERVICES'}</h1>
    <p>{$currentLang === 'hu'
      ? 'Mindent egy helyen az Ön járművének kényeztetéséhez'
      : 'Everything in one place to pamper your vehicle'}</p>
  </div>
</section>

<div class="services-container">
  <section class="service-section" id="tire">
    <div class="container">
      <div class="service-grid">
        <div class="service-content">
          <h2>{$currentLang === 'hu' ? 'GUMISZERVIZ' : 'TIRE SERVICE'}</h2>
          <p class="service-description">
            {$currentLang === 'hu'
              ? 'Szakértő technikusaink készen állnak az abroncsokkal kapcsolatos bármilyen probléma azonnali megoldására, hogy biztonságosan visszatérhessen az útra.'
              : 'Our expert technicians are ready to solve any tire-related problems immediately and get you safely back on the road.'}
          </p>
          <ul class="feature-list">
            {#each ($currentLang === 'hu'
              ? ['Gumiabroncs csere és javítás', 'Kerék kiegyensúlyozás', 'Szezonális tárolás', 'Futóműbeállítás', 'Prémium márkák széles választéka']
              : ['Tire replacement and repair', 'Wheel balancing', 'Seasonal storage', 'Wheel alignment', 'Wide selection of premium brands']
            ) as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <a href="/booking" class="btn btn-primary">
            {$currentLang === 'hu' ? 'Foglalás' : 'Book now'}
          </a>
        </div>
        <div class="service-image">
          <img src="images/merc-tyre.webp" alt="Tire Service" />
        </div>
      </div>

      <h3 class="tire-main-service-title">
          {$currentLang === 'hu' ? 'Kerék le-fel szerelés, Gumiabroncs átszerelés és Centrízorás' : 'Wheel & Tire Fitting, Alignment'}
      </h3>
      <div class="pricing-table-container scrollable-table tire-table-container">
        <table class="pricing-table tire-service-main-table">
          <thead>
            <tr>
              <th>{$currentLang === 'hu' ? 'Méret' : 'Size'}</th>
              <th>{$currentLang === 'hu' ? 'Ár / 4 abroncs' : 'Price / 4 tires'}</th>
            </tr>
          </thead>
          <tbody>
            {#each tireServicePrices.fullServicePer4Tires as item (item.size)}
              <tr>
                <td>{item.size}</td>
                <td>{item.price}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="tire-services-grid">
          {#if tireServicePrices.patching}
           <div class="tire-service-block">
             <h3>{tireServicePrices.patching.name[$currentLang]}</h3>
             <div class="service-price">
                 {tireServicePrices.patching.pricePerTyre}
                 <span class="per-set">{tireServicePrices.patching.note[$currentLang]}</span>
             </div>
           </div>
          {/if}

          {#if tireServicePrices.wheelMountingOnly}
           <div class="tire-service-block">
             <h3>{tireServicePrices.wheelMountingOnly.name[$currentLang]}</h3>
             <div class="service-price">
                 {tireServicePrices.wheelMountingOnly.pricePer4pcs}
                 <span class="per-set">{tireServicePrices.wheelMountingOnly.note[$currentLang]}</span>
             </div>
           </div>
          {/if}

          {#if tireServicePrices.alloyWheelMountingAlignment}
           <div class="tire-service-block">
             <h3>{tireServicePrices.alloyWheelMountingAlignment.name[$currentLang]}</h3>
             <div class="service-price">
                 {tireServicePrices.alloyWheelMountingAlignment.pricePer4pcs}
                  <span class="per-set">{tireServicePrices.alloyWheelMountingAlignment.note[$currentLang]}</span>
             </div>
           </div>
          {/if}
       </div>

       </div>
  </section>

  <section class="service-section" id="maintenance">
    <div class="container">
      <div class="service-content centered-content">
        <h2>{$currentLang === 'hu' ? 'MÁRKAFÜGGETLEN AUTÓSZERVIZ' : 'BRAND-AGNOSTIC CAR SERVICE'}</h2>
        <p class="service-description">
          {$currentLang === 'hu'
            ? 'Szakértő csapatunk széles körű szervizszolgáltatást nyújt minden autómárka számára, a rendszeres karbantartástól a komplex javításokig.'
            : 'Our expert team provides a wide range of maintenance services for all car brands, from routine maintenance to complex repairs.'}
        </p>
      </div>

      <div class="maintenance-bubbles-container">
        {#each maintenanceServices as service (service.name.hu)}
          <div class="maintenance-bubble">
              {service.name[$currentLang]}
          </div>
        {/each}
      </div>

      <div class="centered-button-container">
            <a href="/contact" class="btn btn-primary maintenance-contact-btn">
              {$currentLang === 'hu' ? 'Kérj árajánlatot' : 'Request a Quote'}
          </a>
      </div>

    </div>
  </section>
</div>

<style>

  :root {
    /* Define your color variables here if they are not in a global file */
    --primary: #00baff; /* Example primary color */
    --primary-dark: #0099cc; /* Example dark primary color */
    --secondary: #333; /* Example secondary color */
    --text: #1a1a1a; /* Example text color */
    --text-light: #555; /* Example light text color */
    --light: #f4f4f4; /* Example light background color */
    --teal-dark: #00796b; /* Darker teal for SMART title and pills */
    --teal-light: #4db6ac; /* Lighter teal - maybe for borders or accents */
    --dark-purple: #4b0082; /* Dark purple for PREMIUM title */
    --lavender: #e6e6fa; /* Lavender for PREMIUM pills background */
    --premium-pill-border: #b3a3c8; /* Slightly darker lavender border */
    --frosted-background: rgba(255, 255, 255, 0.3); /* Increased transparency for more frosting */
    --frosted-border: rgba(255, 255, 255, 0.5); /* Increased border visibility */
    --bubble-color: rgba(0, 186, 229, 0.2); /* Semi-transparent primary color for bubbles */
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

  .service-section {
    padding: 5rem 2rem;
    position: relative; /* Needed for absolute positioning of animated background */
    overflow: hidden; /* Hide overflowing bubbles */
  }

  /* Alternating background colors for sections */
  .services-container section:nth-child(odd) {
       background-color: white; /* Default white background */
   }

  .services-container section:nth-child(even) {
    background-color: var(--light); /* Light grey background */
  }


  .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem; /* Add some horizontal padding */
      position: relative; /* Ensure content is above the animated background */
      z-index: 1; /* Ensure content has a higher z-index */
  }

  .service-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    margin-bottom: 3rem; /* Add space below the grid before the table */
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
    padding-bottom: 12px;
  }

    /* Consistent Primary Blue underline for all titles */
   .service-content h2::after {
       content: '';
       position: absolute;
       bottom: 0;
       left: 0; /* Align to left by default */
       width: 50px;
       height: 3px;
       background-color: var(--primary); /* Primary Blue underline */
   }

     /* Specific rule to center the underline only for the maintenance section */
    #maintenance .service-content h2::after {
        left: 50%; /* Center the underline */
        transform: translateX(-50%);
    }

    /* Mobile adjustment for centering underline on all titles */
    @media (max-width: 992px) {
        .services-container section:not(#maintenance) .service-content h2::after {
             left: 50%;
             transform: translateX(-50%);
         }
    }


  .service-description {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-light);
  }

   .centered-content {
       text-align: center; /* Center content block */
   }

   .centered-content .service-description {
       max-width: 800px; /* Limit width for centering */
       margin-left: auto;
       margin-right: auto;
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
    top: 2px;
    color: var(--primary);
    font-weight: bold;
    font-size: 1.2em;
  }

  .service-image {
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    height: 100%; /* Ensure image container takes full height */
    display: flex; /* Use flex to center image */
    justify-content: center;
    align-items: center;
  }

  .service-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .service-image:hover img {
    transform: scale(1.05);
  }

  /* Pricing Tables Styles */
  .pricing-table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Hide overflow for the container */
    margin-top: 1.5rem; /* Adjust margin top for tables */
  }

   /* Add scrollability to the table container */
  .scrollable-table {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
  }


  .pricing-table {
    width: 100%; /* Ensure table tries to take full width of container */
    border-collapse: collapse;
    /* min-width handled via CSS or column content */
  }

  .pricing-table th {
    background-color: #1a1a1a;
    color: white;
    padding: 1rem;
    text-align: center;
    font-weight: 600;
    white-space: nowrap; /* Prevent header text from wrapping */
  }

  .pricing-table td {
    padding: 0.8rem;
    text-align: center;
    border-bottom: 1px solid #eee;
    white-space: nowrap; /* Prevent cell text from wrapping by default */
     vertical-align: middle;
  }

   .pricing-table tbody tr:last-child td {
        border-bottom: none; /* Remove bottom border for the last row */
    }

  /* Per set/note text style */
  .per-set {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.2rem;
    white-space: normal; /* Allow this text to wrap */
  }

    /* Tire Service Styles */
    .tire-main-service-title {
        text-align: center;
        font-size: 1.5rem;
        margin-top: 3rem;
        margin-bottom: 1rem;
        font-weight: 600;
        color: var(--text);
    }

    /* Ensure the tire service main table has reasonable column widths */
    .tire-service-main-table th:first-child,
    .tire-service-main-table td:first-child {
        width: 40%; /* Give Size column reasonable width */
    }
    .tire-service-main-table th:last-child,
    .tire-service-main-table td:last-child {
        width: 60%; /* Give Price column remaining width */
    }


    .tire-services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
      gap: 2rem;
      margin: 3rem 0;
    }

    .tire-service-block {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07); /* Slightly more pronounced shadow */
      text-align: center;
      border: 1px solid #eee;
    }

     .tire-service-block h3 {
         font-size: 1.1rem;
         font-weight: 600;
         margin-bottom: 0.8rem;
         color: var(--text);
     }

    .service-price {
      font-size: 1.2rem; /* Slightly larger price */
      font-weight: 600; /* Bolder price */
      color: var(--primary); /* Use primary color for price */
      margin-top: 0.5rem;
    }

    /* Removed tire-repair-section and tire-repair-table styles */

    /* Maintenance Services Styles (Black Bubble Style) */
    .maintenance-bubbles-container {
        display: flex;
        flex-wrap: wrap; /* Allow bubbles to wrap to the next line */
        justify-content: center; /* Center bubbles horizontally */
        gap: 1rem; /* Space between bubbles */
        margin-top: 3rem;
        padding: 0 1rem; /* Add some padding inside the container */
    }

    .maintenance-bubble {
        background-color: #1a1a1a; /* Black/very dark grey background */
        color: white; /* White text color */
        padding: 0.8rem 1.5rem; /* Padding inside the bubble */
        border-radius: 50px; /* Large border-radius for bubble shape */
        font-size: 1.1rem;
        font-weight: 500;
        text-align: center;
        white-space: nowrap; /* Prevent text from wrapping inside the bubble */
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
        cursor: default; /* Change cursor since they are not links now */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Subtle shadow */
        flex-shrink: 0; /* Prevent bubbles from shrinking */
    }

    /* Removed hover effect if they are not meant to be clicked */
    /* .maintenance-bubble:hover { ... } */


    /* Button Styles */
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
        background-color: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 186, 229, 0.3);
    }

   /* Specific style for the maintenance contact button */
   .maintenance-contact-btn {
       margin-top: 3rem; /* Add space above the button */
   }

    .centered-button-container {
        text-align: center; /* Center the button container */
    }


  /* Mobile Responsive */
  @media (max-width: 992px) {
    .service-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .service-content h2 {
      text-align: center;
    }

    .tire-service-block h3 {
        text-align: center;
    }

    .service-grid.reverse {
      direction: ltr;
    }

    .service-grid .service-content { order: 1; }
    .service-grid .service-image { order: 2; }
    .service-grid.reverse .service-content { order: 1; }
    .service-grid.reverse .service-image { order: 2; }

    .service-image {
      max-width: 500px;
      margin: 0 auto;
    }

    /* Adjust padding for smaller screens */
    .pricing-table th,
    .pricing-table td {
        padding: 0.7rem 0.5rem; /* Adjust padding */
        white-space: normal; /* Allow text wrapping */
    }

    /* Tire service table mobile adjustments */
     .tire-service-main-table th,
     .tire-service-main-table td {
         min-width: 100px; /* Ensure reasonable min width */
     }


    /* Maintenance bubbles mobile adjustments */
    .maintenance-bubble {
        font-size: 1rem;
        padding: 0.7rem 1.2rem;
        white-space: normal; /* Allow wrapping on mobile */
        text-align: center;
    }
    .maintenance-bubbles-container {
        gap: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    .services-hero h1 { font-size: 2rem; }
    .services-hero p { font-size: 1rem; }
    .service-section { padding: 3rem 1rem; }
    .service-content h2 { font-size: 1.8rem; }

    /* Make tables more compact on mobile - increased font sizes as requested */
    .pricing-table th,
    .pricing-table td {
      padding: 0.6rem 0.4rem;
      font-size: 1.1rem; /* Increased from 0.9rem */
    }

    .pricing-table-container {
      margin-top: 1.5rem;
      border-radius: 8px;
    }

    .btn {
      width: 100%;
      text-align: center;
      padding: 1rem 1.5rem; /* Make button larger */
      font-size: 1rem;
    }

    /* Adjust min-widths for smaller mobile screens - increased font sizes as requested */
    .parking-table th,
    .parking-table td { min-width: 75px; font-size: 1rem; } /* Increased from 0.85rem */
    .parking-table .day-col { min-width: 45px;}

    .car-wash-table th,
    .car-wash-table td { min-width: 70px; font-size: 1rem; } /* Increased from 0.85rem */
    .car-wash-table th:first-child,
    .car-wash-table td:first-child { min-width: 90px;}


    .tire-service-main-table th,
    .tire-service-main-table td {
        min-width: 80px; /* Adjust tire table */
        font-size: 1rem; /* Increased from 0.85rem */
    }

    .tire-services-grid {
      grid-template-columns: 1fr; /* Stack blocks */
      gap: 1rem;
    }

    /* Maintenance bubbles smaller mobile adjustments */
    .maintenance-bubble { font-size: 0.9rem; padding: 0.6rem 1rem; }
    .maintenance-bubbles-container { gap: 0.6rem; }
    #maintenance .service-content h2 { font-size: 1.5rem; }
    #maintenance .service-description { font-size: 1rem; }
  }

  /* Style the scrollbar */
  .scrollable-table::-webkit-scrollbar {
      height: 8px;
      width: 8px; /* Added for vertical scrollbar */
  }

  .scrollable-table::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
  }

  .scrollable-table::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
  }

  .scrollable-table::-webkit-scrollbar-thumb:hover {
      background: #555;
  }

</style>