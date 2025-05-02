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

  // --- Data Structures ---
  const parkingPrices = [
    { days: 1, normal: '7500 Ft', discount: '5500 Ft' }, { days: 2, normal: '8200 Ft', discount: '6200 Ft' },
    { days: 3, normal: '9000 Ft', discount: '7000 Ft' }, { days: 4, normal: '9800 Ft', discount: '8000 Ft' },
    { days: 5, normal: '10500 Ft', discount: '8600 Ft' }, { days: 6, normal: '11200 Ft', discount: '9500 Ft' },
    { days: 7, normal: '12500 Ft', discount: '10500 Ft' }, { days: 8, normal: '14000 Ft', discount: '11000 Ft' },
    { days: 9, normal: '15500 Ft', discount: '11500 Ft' }, { days: 10, normal: '16000 Ft', discount: '12000 Ft' },
    { days: 11, normal: '17000 Ft', discount: '12400 Ft' }, { days: 12, normal: '17600 Ft', discount: '12900 Ft' },
    { days: 13, normal: '18000 Ft', discount: '13500 Ft' }, { days: 14, normal: '18500 Ft', discount: '13900 Ft' },
    { days: 15, normal: '19000 Ft', discount: '14300 Ft' }, { days: 16, normal: '19500 Ft', discount: '14700 Ft' },
    { days: 17, normal: '20000 Ft', discount: '15000 Ft' }, { days: 18, normal: '20500 Ft', discount: '15400 Ft' },
    { days: 19, normal: '21000 Ft', discount: '15800 Ft' }, { days: 20, normal: '21500 Ft', discount: '16200 Ft' },
    { days: 21, normal: '22000 Ft', discount: '16600 Ft' }, { days: 22, normal: '22500 Ft', discount: '17000 Ft' },
    { days: 23, normal: '23000 Ft', discount: '17400 Ft' }, { days: 24, normal: '23500 Ft', discount: '17800 Ft' },
    { days: 25, normal: '24000 Ft', discount: '18200 Ft' }, { days: 26, normal: '24500 Ft', discount: '18600 Ft' },
    { days: 27, normal: '25000 Ft', discount: '19000 Ft' }, { days: 28, normal: '25500 Ft', discount: '19500 Ft' },
    { days: 29, normal: '26000 Ft', discount: '19500 Ft' }, { days: 30, normal: '26000 Ft', discount: '19500 Ft' }
  ];

   const carWashData = {
      smart: {
          name: { hu: 'SMART', en: 'SMART' },
          inclusions: {
              exterior: {
                  name: { hu: 'Külső', en: 'Exterior' },
                  items: [
                      { hu: 'Hideg vizes öblítés', en: 'Cold water rinse' },
                      { hu: 'Magasnyomású öblítés', en: 'High-pressure rinse' },
                      { hu: 'Habos mosás', en: 'Foam wash' },
                      { hu: 'Kézi szivacsos mosás', en: 'Hand sponge wash' },
                      { hu: 'Felni tisztítás', en: 'Wheel cleaning' },
                      { hu: 'Kézi mikroszálas szárazra törlés', en: 'Hand microfiber drying' },
                      { hu: 'Falctisztítás', en: 'Door jamb cleaning' }
                  ]
              },
              interior: {
                  name: { hu: 'Belső', en: 'Interior' },
                  items: [
                      { hu: 'Szemétszedés', en: 'Trash removal' },
                      { hu: 'Gyors porszívózás', en: 'Quick vacuuming' },
                      { hu: 'Csomagtartó takarítás', en: 'Trunk cleaning' },
                      { hu: 'Lábnyomtisztítás', en: 'Footprint cleaning' },
                      { hu: 'Portörlés', en: 'Dusting' }
                  ]
              }
          },
          prices: [
              { type: { hu: 'Személyautó', en: 'Passenger Car' }, 'Exterior & Interior': '8900 Ft', 'Exterior': '5600 Ft', 'Interior': '3800 Ft' },
              { type: { hu: 'SUV/Kisbusz', en: 'SUV/Minivan' }, 'Exterior & Interior': '10500 Ft', 'Exterior': '6100 Ft', 'Interior': '4300 Ft' }
          ]
      },
      premium: {
          name: { hu: 'PREMIUM', en: 'PREMIUM' },
           inclusions: {
              exterior: {
                  name: { hu: 'Külső', en: 'Exterior' },
                  items: [
                      { hu: 'Hideg vizes öblítés', en: 'Cold water rinse' },
                      { hu: 'Magasnyomású öblítés', en: 'High-pressure rinse' },
                      { hu: 'Előmosás, bogároldás', en: 'Pre-wash, bug removal' },
                      { hu: 'Aktív habos mosás', en: 'Active foam wash' },
                      { hu: 'Kézi szivacsos mosás', en: 'Hand sponge wash' },
                      { hu: 'Kézi felni tisztítás', en: 'Hand wheel cleaning' },
                      { hu: 'Kézi mikroszálas szárazra törlés', en: 'Hand microfiber drying' },
                      { hu: 'Levegős szárazra fújás', en: 'Air drying' },
                      { hu: 'Gumiápolás', en: 'Tire dressing' }
                  ]
              },
              interior: {
                  name: { hu: 'Belső', en: 'Interior' },
                  items: [
                      { hu: 'Szemétszedés', en: 'Trash removal' },
                      { hu: 'Teljes porszívózás', en: 'Full vacuuming' },
                      { hu: 'Csomagtartó tisztítás', en: 'Trunk cleaning' },
                      { hu: 'Lábtér tisztítás', en: 'Footwell cleaning' },
                      { hu: 'Portörlés', en: 'Dusting' },
                       { hu: 'Ablaktisztítás', en: 'Window cleaning' },
                       { hu: 'Műanyag tisztítás és ápolás', en: 'Plastic cleaning and conditioning' }
                  ]
              }
          }
          ,
          prices: [
              { type: { hu: 'Személyautó', en: 'Passenger Car' }, 'Exterior & Interior': '11900 Ft', 'Exterior': '6100 Ft', 'Interior': '4300 Ft' },
              { type: { hu: 'SUV/Kisbusz', en: 'SUV/Minivan' }, 'Exterior & Interior': '13500 Ft', 'Exterior': '6900 Ft', 'Interior': '5600 Ft' }
          ]
      }
  };


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
              ? ['Biztonságos, kamerával megfigyelt területt', '24/7 személyzet a helyszínen', 'Kedvező árak hosszabb tartózkodásra is', 'Ingyenes transzfer a repülőtérre és vissza', 'Előfoglalási lehetőség']
              : ['Secure, camera-monitored area', '24/7 staff on site', 'Favorable rates for longer stays', 'Free transfer to and from the airport', 'Pre-booking option']
            ) as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <a href="/#booking" class="btn btn-primary">
            {$currentLang === 'hu' ? 'Foglalás' : 'Book now'}
          </a>
        </div>
        <div class="service-image">
          <img src="images/parking-lot.webp" alt="Airport Parking" />
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
            {#each parkingPrices as price (price.days)}
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
    <div class="animated-background">
        {#each Array(20) as _, i}
            <div class="bubble" style="
                --size: {Math.random() * 5 + 1}rem;
                --left: {Math.random() * 100}%;
                --animation-duration: {Math.random() * 10 + 5}s;
                --animation-delay: {Math.random() * 5}s;
                --opacity: {Math.random() * 0.4 + 0.1}; /* Vary opacity */
            "></div>
        {/each}
    </div>

    <div class="container">
      <div class="service-grid reverse">
        <div class="service-image">
          <img src="images/car-wash.webp" alt="Car Wash" />
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
          <a href="/#booking" class="btn btn-primary">
            {$currentLang === 'hu' ? 'Foglalás' : 'Book now'}
          </a>
        </div>
      </div>

      <div class="car-wash-tables">
          <h3 class="car-wash-title smart-title">{$currentLang === 'hu' ? 'SMART Csomag' : 'SMART Package'}</h3>
          <div class="package-inclusions-container">
              <div class="inclusion-card frosted-card">
                  <h4 class="inclusion-section-title">{$currentLang === 'hu' ? 'Külső' : 'Exterior'}</h4>
                  <ul class="inclusion-pills smart-pills">
                       {#each carWashData.smart.inclusions.exterior.items as item}
                           <li>{item[$currentLang]}</li>
                       {/each}
                  </ul>
              </div>
               <div class="inclusion-card frosted-card">
                  <h4 class="inclusion-section-title">{$currentLang === 'hu' ? 'Belső' : 'Interior'}</h4>
                  <ul class="inclusion-pills smart-pills">
                       {#each carWashData.smart.inclusions.interior.items as item}
                           <li>{item[$currentLang]}</li>
                       {/each}
                  </ul>
              </div>
           </div>
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
                      {#each carWashData.smart.prices as price (price.type[$currentLang])}
                          <tr>
                              <td>{price.type[$currentLang]}</td>
                              <td>{price['Exterior & Interior']}</td>
                              <td>{price.Exterior}</td>
                              <td>{price.Interior}</td>
                          </tr>
                      {/each}
                  </tbody>
              </table>
          </div>

          <h3 class="car-wash-title premium-title">{$currentLang === 'hu' ? 'PREMIUM Csomag' : 'PREMIUM Package'}</h3>
          <div class="package-inclusions-container">
              <div class="inclusion-card frosted-card">
                  <h4 class="inclusion-section-title">{$currentLang === 'hu' ? 'Külső' : 'Exterior'}</h4>
                  <ul class="inclusion-pills premium-pills">
                       {#each carWashData.premium.inclusions.exterior.items as item}
                           <li>{item[$currentLang]}</li>
                       {/each}
                  </ul>
              </div>
               <div class="inclusion-card frosted-card">
                  <h4 class="inclusion-section-title">{$currentLang === 'hu' ? 'Belső' : 'Interior'}</h4>
                  <ul class="inclusion-pills premium-pills">
                       {#each carWashData.premium.inclusions.interior.items as item}
                           <li>{item[$currentLang]}</li>
                       {/each}
                  </ul>
              </div>
          </div>
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
                      {#each carWashData.premium.prices as price (price.type[$currentLang])}
                          <tr>
                              <td>{price.type[$currentLang]}</td>
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
          <a href="/#booking" class="btn btn-primary">
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
            <a href="/#contact" class="btn btn-primary maintenance-contact-btn">
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


  /* Per set/note text style */
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
        margin-bottom: 1.5rem; /* Space below title before inclusions */
        text-align: center;
        font-weight: 600;
    }

    .smart-title {
        color: var(--teal-dark); /* SMART title color */
         margin-top: 0; /* No extra margin on the first title */
    }

    .premium-title {
        color: var(--dark-purple); /* PREMIUM title color */
         margin-top: 3rem; /* More space between the two car wash blocks */
    }

    .package-inclusions-container {
        display: flex;
        gap: 1.5rem; /* Space between inclusion sections */
        margin-bottom: 2rem; /* Space below inclusions before the table */
        flex-wrap: wrap; /* Allow wrapping */
        justify-content: center; /* Center inclusion sections when wrapped */
    }

    /* Styles for the new frosted card wrapping the inclusion section */
    .inclusion-card.frosted-card {
        flex: 1; /* Allow cards to grow/shrink */
        min-width: 280px; /* Minimum width */
        max-width: 400px; /* Max width for readability */
        background-color: var(--frosted-background); /* Semi-transparent background */
        border: 1px solid var(--frosted-border); /* Semi-transparent border */
        border-radius: 12px; /* Rounded corners */
        padding: 1.5rem;
        backdrop-filter: blur(12px); /* Increased blur for "very frosted" effect */
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        text-align: center;
        display: flex; /* Use flex to arrange title and pills */
        flex-direction: column;
        align-items: center;
    }


    .inclusion-section-title {
         font-size: 1.1rem;
         font-weight: 600;
         margin-bottom: 1rem;
         color: var(--text); /* Adjust color for readability */
     }

     .inclusion-pills {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap; /* Allow pills to wrap */
        justify-content: center; /* Center pills within the section */
        gap: 0.6rem; /* Space between pills */
     }

      .inclusion-pills li {
          font-size: 0.9rem;
          padding: 0.4rem 0.9rem; /* Padding around pill text */
          border-radius: 20px; /* Pill shape */
          white-space: nowrap; /* Prevent wrapping within a pill */
           border: 1px solid transparent; /* Default transparent border */
      }

      /* Specific styles for SMART pills */
      .smart-pills li {
          color: white; /* White text for better contrast on dark background */
          background-color: var(--teal-dark); /* SMART pill background color */
           border-color: var(--teal-dark); /* Border matching background */
      }

       /* Specific styles for PREMIUM pills */
      .premium-pills li {
          color: var(--text); /* Dark text for better contrast on light background */
          background-color: var(--lavender); /* PREMIUM pill background color */
           border-color: var(--premium-pill-border); /* Slightly darker lavender border */
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


   /* Animated Background Styles */
   .animated-background {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       overflow: hidden;
       z-index: 0; /* Ensure it's behind content */
   }

   .bubble {
       position: absolute;
       bottom: -100px; /* Start below the section */
       width: var(--size);
       height: var(--size);
       left: var(--left);
       background-color: var(--bubble-color);
       border-radius: 50%;
       animation: float 10s infinite ease-in-out var(--animation-delay);
       opacity: var(--opacity); /* Use the varying opacity */
   }

   @keyframes float {
       0% {
           transform: translateY(0) scale(1);
           opacity: var(--opacity);
       }
       50% {
           transform: translateY(-50vh) scale(1.1); /* Float up */
           opacity: calc(var(--opacity) + 0.2); /* Slightly more opaque in the middle */
       }
       100% {
           transform: translateY(-100vh) scale(1); /* Float off the top */
           opacity: 0; /* Fade out */
       }
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

    /* Parking table specific mobile adjustments */
    .parking-table th,
    .parking-table td {
        min-width: 90px; /* Slightly wider */
    }
    .parking-table .day-col {
        min-width: 60px;
    }

    /* Car wash table specific mobile adjustments */
    .car-wash-table th,
    .car-wash-table td {
        min-width: 90px;
    }
    .car-wash-table th:first-child,
    .car-wash-table td:first-child {
        min-width: 110px; /* Adjust car type column */
        white-space: nowrap; /* Keep car type from wrapping if possible */
    }

     /* Inclusion sections responsive adjustments */
     .package-inclusions-container {
         flex-direction: column; /* Stack sections vertically on mobile */
         align-items: center; /* Center stacked sections */
     }


       .inclusion-card.frosted-card { /* Mobile adjustments for the card itself */
           width: 100%; /* Full width minus padding */
           max-width: 400px; /* Keep a reasonable max-width */
           padding: 1.2rem; /* Adjust padding */
       }


      .inclusion-section-title {
          font-size: 1rem; /* Adjust title size */
      }

      .inclusion-pills li {
          font-size: 0.85rem; /* Adjust pill font size */
          padding: 0.3rem 0.7rem; /* Adjust pill padding */
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

     .car-wash-tables { margin-top: 2rem; }
     .car-wash-title { font-size: 1.3rem; margin-top: 1.5rem; margin-bottom: 0.8rem; }
     .premium-title { margin-top: 2.5rem; }


     /* Smaller mobile inclusion card adjustments */
      .inclusion-card.frosted-card {
         min-width: 240px; /* Even smaller min width */
         padding: 1rem; /* More compact padding */
      }

       .inclusion-section-title {
           font-size: 1rem;
           margin-bottom: 0.8rem;
       }

       .inclusion-pills li {
           font-size: 0.8rem; /* Even smaller pill text */
           padding: 0.25rem 0.6rem; /* More compact pill padding */
           white-space: normal; /* Allow wrapping on very small screens */
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