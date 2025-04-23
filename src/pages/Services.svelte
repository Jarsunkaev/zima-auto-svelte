<svelte:options tag={null} />

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

  const parkingPrices = [
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
    { days: 29, normal: '26000 Ft', discount: '19500 Ft' },
    { days: 30, normal: '26000 Ft', discount: '19500 Ft' }
  ];

  const carWashPrices = {
    smart: [
        { type: 'Személyautó', 'Exterior & Interior': '8900 Ft', 'Exterior': '5900 Ft', 'Interior': '4900 Ft' },
        { type: 'SUV/Kisbusz', 'Exterior & Interior': '10500 Ft', 'Exterior': '5900 Ft', 'Interior': '4900 Ft' }
    ],
    premium: [
        { type: 'Személyautó', 'Exterior & Interior': '11900 Ft', 'Exterior': '6900 Ft', 'Interior': '5600 Ft' },
        { type: 'SUV/Kisbusz', 'Exterior & Interior': '13500 Ft', 'Exterior': '6900 Ft', 'Interior': '5600 Ft' }
    ]
  };

    // Maintenance services data
    const maintenanceServices = [
        { name: { hu: 'Autóvizsgálat', en: 'Car Inspection' } },
        { name: { hu: 'Fékjavítás', en: 'Brake Repair' } },
        { name: { hu: 'Futómű javítások', en: 'Chassis Repairs' } },
        { name: { hu: 'Kuplung javítás, kuplungcsere', en: 'Clutch Repair, Replacement' } },
        { name: { hu: 'Olajcsere, szűrők és váltó olajcsere', en: 'Oil Change, Filters, and Gearbox Oil Change' } },
        { name: { hu: 'Vezérműszíj csere', en: 'Timing Belt Replacement' } },
        { name: { hu: 'Váltó felújítás', en: 'Gearbox Overhaul' } },
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
  <section class="service-section" id="parking">
    <div class="container">
      <div class="service-grid">
        <div class="service-content">
          <h2>{$currentLang === 'hu' ? '24/7 REPTÉRI PARKOLÁS' : '24/7 AIRPORT PARKING'}</h2>
          <p class="service-description">
            {$currentLang === 'hu'
              ? 'Biztonságos parkolási lehetőségünk bekerített határokkal és 24 órás kamerás megfigyeléssel rendelkezik, ami garantálja járművének a legnagyobb biztonságot.'
              : 'Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle.'}
          </p>
          <ul class="feature-list">
            {#each ($currentLang === 'hu'
              ? ['Biztonságos, kamerával megfigyelt terület', '24/7 személyzet a helyszínen', 'Kedvező árak hosszabb tartózkodásra is', 'Ingyenes transzfer a repülőtérre és vissza', 'Előfoglalási lehetőség']
              : ['Secure, camera-monitored area', '24/7 staff on site', 'Favorable rates for longer stays', 'Free transfer to and from the airport', 'Pre-booking option']
            ) as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <button class="btn btn-primary">
            {$currentLang === 'hu' ? 'Foglaljon most' : 'Book now'}
          </button>
        </div>
        <div class="service-image">
          <img src="images/parking-lot.jpg" alt="Airport Parking" />
        </div>
      </div>

      <div class="pricing-table-container scrollable-table parking-table-container">
        <table class="pricing-table parking-table">
          <thead>
            <tr>
              <th>{$currentLang === 'hu' ? 'Nap' : 'Day'}</th>
              <th class="normal-price-header">{$currentLang === 'hu' ? 'Normál ár' : 'Normal Price'}</th>
              <th>{$currentLang === 'hu' ? 'Kedvezményes' : 'Discounted'}</th>
            </tr>
          </thead>
          <tbody>
            {#each parkingPrices as price}
              <tr>
                <td class="day-col">{price.days}</td>
                <td class="normal-price-col">{price.normal}</td>
                <td class="discount-col">{price.discount}</td>
              </tr>
            {/each}
          </tbody>
        </table>
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
          <h2>{$currentLang === 'hu' ? 'KÉZI AUTÓMOSÓ' : 'HAND CAR WASH'}</h2>
          <p class="service-description">
            {$currentLang === 'hu'
              ? 'Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon.'
              : 'Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful.'}
          </p>
          <ul class="feature-list">
            {#each ($currentLang === 'hu'
              ? ['Külső és belső tisztítás', 'Prémium waxolás és polírozás', 'Kárpittisztítás', 'Bőrápolás és kondicionálás', 'Gőztisztítás és fertőtlenítés']
              : ['Exterior and interior cleaning', 'Premium waxing and polishing', 'Upholstery cleaning', 'Leather care and conditioning', 'Steam cleaning and sanitization']
            ) as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <button class="btn btn-primary">
            {$currentLang === 'hu' ? 'Részletek' : 'View details'}
          </button>
        </div>
      </div>

      <div class="car-wash-tables">
          <h3 class="car-wash-title smart-title">{$currentLang === 'hu' ? 'SMART Csomag Árak' : 'SMART Package Prices'}</h3>
          <div class="pricing-table-container scrollable-table car-wash-table-container">
              <table class="pricing-table car-wash-table smart-table">
                   <thead>
                      <tr>
                          <th>{$currentLang === 'hu' ? 'Autó típus' : 'Car type'}</th>
                          <th>{$currentLang === 'hu' ? 'Külső & Belső' : 'Exterior & Interior'}</th>
                          <th>{$currentLang === 'hu' ? 'Külső' : 'Exterior'}</th>
                          <th>{$currentLang === 'hu' ? 'Belső' : 'Interior'}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {#each carWashPrices.smart as price}
                          <tr>
                              <td>{price.type}</td>
                              <td>{price['Exterior & Interior']}</td>
                              <td>{price.Exterior}</td>
                              <td>{price.Interior}</td>
                          </tr>
                      {/each}
                  </tbody>
              </table>
          </div>

          <h3 class="car-wash-title premium-title">{$currentLang === 'hu' ? 'PREMIUM Csomag Árak' : 'PREMIUM Package Prices'}</h3>
           <div class="pricing-table-container scrollable-table car-wash-table-container">
              <table class="pricing-table car-wash-table premium-table">
                   <thead>
                      <tr>
                          <th>{$currentLang === 'hu' ? 'Autó típus' : 'Car type'}</th>
                          <th>{$currentLang === 'hu' ? 'Külső & Belső' : 'Exterior & Interior'}</th>
                          <th>{$currentLang === 'hu' ? 'Külső' : 'Exterior'}</th>
                          <th>{$currentLang === 'hu' ? 'Belső' : 'Interior'}</th>
                      </tr>
                  </thead>
                  <tbody>

                      {#each carWashPrices.premium as price}
                          <tr>
                              <td>{price.type}</td>
                              <td>{price['Exterior & Interior']}</td>
                              <td>{price.Exterior}</td>
                              <td>{price.Interior}</td>
                          </tr>
                      {/each}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  </section>

  <section class="service-section" id="tire">
    <div class="container">
      <div class="service-grid">
        <div class="service-content">
          <h2>{$currentLang === 'hu' ? 'GUMISZERVIZ' : 'TIRE SERVICE'}</h2>
          <p class="service-description">
            {$currentLang === 'hu'
              ? 'Szakértő technikusaink készen állnak az abroncsokkal kapcsolatos bármilyen probléma azonnali megoldására, és biztonságosan visszatérni az útra.'
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
          <button class="btn btn-primary">
            {$currentLang === 'hu' ? 'További információ' : 'More information'}
          </button>
        </div>
        <div class="service-image">
          <img src="images/merc-tyre.jpg" alt="Tire Service" />
        </div>
      </div>

      <div class="pricing-table-container scrollable-table tire-table-container">
        <table class="pricing-table tire-table">
          <thead>
            <tr>
              <th>16"</th>
              <th>17"</th>
              <th>18"</th>
              <th>19"</th>
              <th>20"</th>
              <th>21"</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>16 000 Ft<br><span class="per-set">{$currentLang === 'hu' ? '/ 4 kerék' : '/ 4 tires'}</span></td>
              <td>17 000 Ft<br><span class="per-set">{$currentLang === 'hu' ? '/ 4 kerék' : '/ 4 tires'}</span></td>
              <td>19 000 Ft<br><span class="per-set">{$currentLang === 'hu' ? '/ 4 kerék' : '/ 4 tires'}</span></td>
              <td>21 000 Ft<br><span class="per-set">{$currentLang === 'hu' ? '/ 4 kerék' : '/ 4 tires'}</span></td>
              <td>22 000 Ft<br><span class="per-set">{$currentLang === 'hu' ? '/ 4 kerék' : '/ 4 tires'}</span></td>
              <td>25 000 Ft<br><span class="per-set">{$currentLang === 'hu' ? '/ 4 kerék' : '/ 4 tires'}</span></td>
            </tr>
          </tbody>
        </table>
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
        {#each maintenanceServices as service}
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

</div><style>
  :root {
    /* Define your color variables here if they are not in a global file */
    --primary: #00baff; /* Example primary color */
    --primary-dark: #0099cc; /* Example dark primary color */
    --secondary: #333; /* Example secondary color */
    --text: #1a1a1a; /* Example text color */
    --text-light: #555; /* Example light text color */
    --light: #f4f4f4; /* Example light background color */
    --teal-dark: #00796b; /* Darker teal for SMART title */
    --teal-light: #4db6ac; /* Lighter teal for PREMIUM title */
    /* Removed unused purple variables */
    /* --purple-dark: #4a148c; */
    /* --purple-light: #7b1fa2; */
    /* --purple-accent: #9c27b0; */
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
        .services-container section .service-content h2::after {
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
    /* min-width will be handled by column widths */
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
  }

   .pricing-table tbody tr:last-child td {
        border-bottom: none; /* Remove bottom border for the last row */
    }

    /* Parking Table Specific Styles */
    .parking-table-container {
        max-height: 500px; /* Increased height to show more rows */
        overflow-y: auto; /* Enable vertical scrolling */
    }

    .parking-table thead th {
        position: sticky; /* Make header sticky */
        top: 0; /* Stick to the top of the container */
        z-index: 1; /* Ensure header is above scrolling body */
        background-color: #1a1a1a; /* Ensure background color covers content when sticky */
    }

    .parking-table .normal-price-col {
        text-decoration: line-through;
        color: #888; /* Make strikethrough price less prominent */
    }

    .parking-table .discount-col {
        color: #e53e3e; /* Red color for discount price */
        font-weight: 600;
    }


  /* Per set text for tire prices */
  .per-set {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.2rem;
    white-space: normal; /* Allow this text to wrap */
  }

    /* Car Wash Specific Styles */
    .car-wash-tables {
        margin-top: 3rem; /* Add space above the car wash tables block */
    }

    .car-wash-title {
        font-size: 1.5rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        text-align: center;
        font-weight: 600;
    }

    .smart-title {
        color: var(--teal-dark);
    }

    .premium-title {
        color: var(--teal-light);
         margin-top: 3rem; /* More space between the two car wash tables */
    }


     /* Car wash table general styles */
     .car-wash-table th,
     .car-wash-table td {
         border-right: 1px solid #eee; /* Standard border between columns */
     }

      .car-wash-table th:last-child,
      .car-wash-table td:last-child {
          border-right: none; /* No border on the last column */
      }

      .car-wash-table thead th {
          background-color: #1a1a1a; /* Ensure header background color */
          color: white;
      }

    /* Maintenance Services Styles (Black Bubble Style) */
 

    /* Title and description centering handled by .centered-content */


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
        cursor: pointer; /* Indicate it's interactive (even without a link) */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Subtle shadow */
        flex-shrink: 0; /* Prevent bubbles from shrinking */
    }

    /* Hover effects for black bubbles */
    .maintenance-bubble:hover {
        background-color: var(--secondary); /* Darker grey on hover */
        transform: translateY(-4px); /* Slight lift on hover */
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4); /* Stronger shadow on hover */
    }


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

    .service-grid.reverse {
      direction: ltr;
    }

    .service-grid .service-content {
      order: 1;
    }

    .service-grid .service-image {
      order: 2;
    }

    .service-grid.reverse .service-content {
      order: 1;
    }

    .service-grid.reverse .service-image {
      order: 2;
    }

    .service-image {
      max-width: 500px;
      margin: 0 auto;
    }

      /* Adjust padding for smaller screens */
      .pricing-table th,
      .pricing-table td {
          padding: 0.6rem 0.4rem;
      }

        .pricing-table th {
            white-space: normal; /* Allow header text to wrap if necessary */
        }

       .pricing-table td {
           white-space: normal; /* Allow cell text to wrap if necessary */
       }

         /* Parking table specific mobile adjustments */
         .parking-table th,
         .parking-table td {
             min-width: 100px; /* Ensure minimum width for parking table columns */
         }

         .parking-table .day-col {
             min-width: 60px; /* Smaller min-width for day column */
         }

         /* Car wash table specific mobile adjustments */
         .car-wash-table th,
         .car-wash-table td {
             min-width: 80px; /* Ensure minimum width for car wash columns */
         }

         .car-wash-table th:first-child,
         .car-wash-table td:first-child {
             min-width: 120px; /* Slightly larger min-width for car type column */
         }

        /* Tire table specific mobile adjustments */
         .tire-table th,
         .tire-table td {
             min-width: 70px; /* Ensure minimum width for tire size columns */
         }

    /* Maintenance bubbles mobile adjustments */
    .maintenance-bubble {
        font-size: 1rem;
        padding: 0.7rem 1.2rem;
    }
    .maintenance-bubbles-container {
        gap: 0.8rem; /* Reduce gap on smaller screens */
    }

    /* Center underline on mobile */
    /* This rule is now redundant due to the general rule above */
    /* .services-container section .service-content h2::after { ... } */


  }

  @media (max-width: 768px) {
    .services-hero h1 {
      font-size: 2rem;
    }

    .services-hero p {
      font-size: 1rem;
    }

    .service-section {
      padding: 3rem 1rem;
    }

    .service-content h2 {
      font-size: 1.8rem;
    }

    /* Make tables more compact on mobile */
    .pricing-table th,
    .pricing-table td {
      padding: 0.5rem 0.3rem;
      font-size: 0.9rem;
    }

    /* Container adjustments */
    .pricing-table-container {
      margin-top: 1.5rem;
      border-radius: 8px; /* Slightly smaller border-radius on smaller screens */
    }

     .car-wash-tables {
        margin-top: 2rem; /* Adjust margin top for car wash tables block on mobile */
    }

    .car-wash-title {
        font-size: 1.3rem;
        margin-top: 1.5rem;
        margin-bottom: 0.8rem;
    }

     .premium-title {
         margin-top: 2.5rem; /* Space between the two car wash tables on mobile */
     }


    .btn {
      width: 100%;
      text-align: center;
    }

      /* Adjust min-widths for smaller mobile screens */
      .parking-table th,
      .parking-table td {
          min-width: 80px;
      }
       .parking-table .day-col {
           min-width: 50px;
       }


      .car-wash-table th,
      .car-wash-table td {
          min-width: 60px;
      }

      .car-wash-table th:first-child,
      .car-wash-table td:first-child {
          min-width: 90px;
      }

       .tire-table th,
       .tire-table td {
           min-width: 50px;
       }

     /* Maintenance bubbles smaller mobile adjustments */
     .maintenance-bubble {
         font-size: 0.9rem;
         padding: 0.6rem 1rem;
     }
      .maintenance-bubbles-container {
         gap: 0.6rem; /* Further reduce gap */
     }

     #maintenance .service-content h2 {
         font-size: 1.5rem; /* Adjust heading size */
     }
      #maintenance .service-description {
         font-size: 1rem; /* Adjust description size */
     }
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