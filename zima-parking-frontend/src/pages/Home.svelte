<script>
  import { onMount, onDestroy } from "svelte";
  import { slide } from "svelte/transition";
  import { currentLang, t } from "../lib/i18n/index.js";
  import ServiceCard from "../components/ServiceCard.svelte";
  import TestimonialCard from "../components/TestimonialCard.svelte";
  import HeroBookingWidget from "../components/HeroBookingWidget.svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Add navigate prop
  export let navigate;

  let lang;
  let servicesVisible = false;
  let testimonialsVisible = false;
  let bookingVisible = false;
  let ctaVisible = false;
  let heroSection;
  let showReviewsWidget = false;
  let scrollTriggers = [];

  // Subscribe to language changes
  currentLang.subscribe((value) => {
    lang = value;
  });

  // Parking prices data
  const parkingPrices = [
    { days: 1, normal: '7500 Ft', discount: '6700 Ft' }, { days: 2, normal: '8200 Ft', discount: '7400 Ft' },
    { days: 3, normal: '9000 Ft', discount: '8200 Ft' }, { days: 4, normal: '9800 Ft', discount: '9200 Ft' },
    { days: 5, normal: '10500 Ft', discount: '9800 Ft' }, { days: 6, normal: '11200 Ft', discount: '10700 Ft' },
    { days: 7, normal: '12500 Ft', discount: '11700 Ft' }, { days: 8, normal: '14000 Ft', discount: '12200 Ft' },
    { days: 9, normal: '15500 Ft', discount: '12700 Ft' }, { days: 10, normal: '16000 Ft', discount: '13200 Ft' },
    { days: 11, normal: '17000 Ft', discount: '13600 Ft' }, { days: 12, normal: '17600 Ft', discount: '14100 Ft' },
    { days: 13, normal: '18000 Ft', discount: '14700 Ft' }, { days: 14, normal: '18500 Ft', discount: '15100 Ft' },
    { days: 15, normal: '19000 Ft', discount: '15500 Ft' }, { days: 16, normal: '19500 Ft', discount: '15900 Ft' },
    { days: 17, normal: '20000 Ft', discount: '16200 Ft' }, { days: 18, normal: '20500 Ft', discount: '16600 Ft' },
    { days: 19, normal: '21000 Ft', discount: '17000 Ft' }, { days: 20, normal: '21500 Ft', discount: '17400 Ft' },
    { days: 21, normal: '22000 Ft', discount: '17800 Ft' }, { days: 22, normal: '22500 Ft', discount: '18200 Ft' },
    { days: 23, normal: '23000 Ft', discount: '18600 Ft' }, { days: 24, normal: '23500 Ft', discount: '19000 Ft' },
    { days: 25, normal: '24000 Ft', discount: '19400 Ft' }, { days: 26, normal: '24500 Ft', discount: '19800 Ft' },
    { days: 27, normal: '25000 Ft', discount: '20200 Ft' }, { days: 28, normal: '25500 Ft', discount: '20700 Ft' },
    { days: 29, normal: '26000 Ft', discount: '20700 Ft' }, { days: 30, normal: '26000 Ft', discount: '20700 Ft' }
  ];

  // Service data with SVG icons - Only Parking and Car Wash for parking frontend
  const services = [
    {
      id: "parking",
      color: "#2b0f4d",
      hoverColor: "#1f0839",
      svgIcon: `<svg fill="#ffffff" width="219px" height="219px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></g></svg>`,
      image: "images/parking-lot.webp",
    },
    {
      id: "washing",
      color: "#003a70",
      hoverColor: "#002851",
      svgIcon: `<svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M142.25,206.819c-11.982,0.247-23.234-6.299-28.755-17.521l-2.751-5.591H62.71l1.296-5.894 c-5.764-0.319-11.242-2.802-15.533-7.128c-4.972-5.008-8.189-12.11-9.732-21.491l-14.374,65.334l0.249,60.473 C10.504,278.339,0,291.007,0,306.138c0,17.674,14.326,32,32,32h22.252c0-39.307,31.979-71.286,71.286-71.286 c12.595,0,24.428,3.297,34.707,9.052v-69.417L142.25,206.819z"></path> </g> </g> <g> <g> <path d="M301.995,74.561c-4.888-8.729-14.137-14.15-24.14-14.15H136.613c5.117,8.867,4.418,20.507,2.632,30.824h39.416 c8.615-10.736,21.831-17.628,36.636-17.628c14.804,0,28.021,6.892,36.636,17.628h24.074l50.407,90.015 c-0.493-4.596,0.054-9.945,2.447-16.113c2.611-6.727,8.117-12.181,14.736-16.29L301.995,74.561z"></path> </g> </g> <g> <g> <path d="M352.07,260.154c-3.421-4.743-6.068-9.242-8.122-13.501l-40.47,13.681c-11.896,4.025-24.553,0.473-32.751-8.072 c0,67.969,0.052,26.197,0.052,85.876h55.885c0-27.503,15.665-51.4,38.532-63.283C360.825,271.131,356.463,266.245,352.07,260.154z "></path> </g> </g> <g> <g> <path d="M490.667,275.966c0-4.949,0-10.028,0-15.137h-23.202c-11.436,0-20.706-9.27-20.706-20.706 c0-11.436,9.27-20.706,20.706-20.706h20.006c-7.529-20.927-27.547-35.896-51.066-35.896h-20.637 c3.383,11.767,5.348,26.998-1.26,39.26c-5.568,10.331-4.45,31.472-4.45,36.857c0,2.834-0.471,5.526-1.302,8.034 c34.198,5.222,60.48,34.833,60.48,70.468c3.943,0,6.995,0,10.765,0c17.672,0,32-14.328,32-32 C512,292.206,503.094,280.36,490.667,275.966z"></path> </g> </g> <g> <g> <path d="M125.539,289.327c-26.957,0.001-48.81,21.854-48.81,48.811s21.853,48.81,48.81,48.81c13.359,0,25.459-5.371,34.272-14.066 v-69.488C150.997,294.698,138.897,289.327,125.539,289.327z M125.539,357.908c-10.919,0-19.77-8.851-19.77-19.77 s8.851-19.77,19.77-19.77c10.919,0,19.77,8.851,19.77,19.77S136.458,357.908,125.539,357.908z"></path> </g> </g> <g> <g> <path d="M397.949,289.328c-26.957,0-48.81,21.853-48.81,48.81c0,26.957,21.852,48.81,48.81,48.81 c26.957,0,48.81-21.853,48.81-48.81C446.758,311.181,424.906,289.328,397.949,289.328z M397.949,357.908 c-10.919,0-19.77-8.851-19.77-19.77s8.851-19.77,19.77-19.77s19.77,8.851,19.77,19.77S408.868,357.908,397.949,357.908z"></path> </g> </g> <g> <g> <path d="M384.574,159.738c-2.448-2.26-6.1-3.212-10.227-3.212c-11.621,0-26.995,7.553-29.773,14.712 c-1.873,4.827-1.758,8.322-0.671,11.21c13.144,0.327,24.716,8.792,28.945,21.305c4.753,14.058-1.07,29.178-13.161,36.697 c1.569,3.091,3.544,6.362,6.055,9.844c8.994,12.472,16.122,16.696,20.858,16.696c4.271,0,6.597-3.434,6.597-7.353 c0-6.78-1.437-30.186,6.469-44.854C407.572,200.115,393.916,168.361,384.574,159.738z"></path> </g> </g> <g> <g> <path d="M123.24,72.004C120.8,59.525,92.948,52.038,84.177,57.639c-13.97,8.921-3.438,18.865-9.36,29.381 c-5.923,10.516-20.068,17.661-20.289,46.903c-0.154,20.329,5.579,27.099,10.73,27.099c2.259,0,4.406-1.303,5.895-3.335 c2.548-3.478,8.601-12.716,16.538-20.826l-1.148-2.332c-7.641-15.526-1.226-34.374,14.301-42.016 c6.617-3.257,14.104-4.104,21.46-2.291C123.718,82.948,124.069,76.249,123.24,72.004z"></path> </g> </g> <g> <g> <path d="M356.879,209.151c-0.001-0.003-0.002-0.007-0.003-0.01c-2.563-7.571-10.85-11.669-18.409-9.099 c-14.502,4.902-23.759,8.033-38.712,13.087c-4.507-7.356-15.44-25.202-20.63-33.671c-7.251-11.835-20.379-19.185-34.258-19.185 c-83.287,0-60.216-0.155-94.254,0.474c-4.401-8.943-18.447-37.486-22.879-46.493c-3.565-7.248-12.34-10.118-19.448-6.62 c-7.199,3.543-10.163,12.249-6.621,19.447c16.505,33.54,11.631,23.638,26.954,54.773c2.49,5.06,7.758,8.245,13.302,8.11 c37.258-0.689,34.271-0.64,35.182-0.64c0,0.256-0.435,84.692-0.435,249.492c0,9.627,7.805,17.431,17.431,17.431 c9.625,0,17.431-7.804,17.431-17.431c0-14.798,0-110.297,0-125.829h7.526c0,15.538,0,110.994,0,125.829 c0,9.627,7.805,17.431,17.431,17.431c9.627,0,17.431-7.804,17.431-17.431c0-54.87-0.049-180.103-0.051-239.359 c0-0.709,0.471-1.331,1.153-1.524c0.682-0.193,1.41,0.09,1.781,0.694c3.083,5.025,9.717,15.869,24.234,39.564 c3.537,5.771,10.603,8.352,17.041,6.174c31.192-10.545,16.238-5.49,49.694-16.801 C355.383,224.992,359.442,216.736,356.879,209.151z"></path> </g> </g> <g> <g> <circle cx="215.299" cy="120.568" r="30.709"></circle> </g> </g> </g></svg>`,
      image: "images/car-wash.webp",
    },
  ];

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Csilla Demcsák",
      location: "",
      text: "Nagyon profik. Fiatalok, energikusak, jó áron dolgoznak! Nagyon szép és kényelmes volt, hogy a javítást, a gumijavítást és az autótisztítást egyben elvégezhettem.",
      image: null,
    },
    {
      id: 2,
      name: "Helyi idegenvezető",
      location: "",
      text: "Minden dicséret a tulajnak, kivitt minket a reptérre és vissza a parkolóba. Problémánk volt az autón a kerékkel, amit a tulajdonos segítségével megoldottunk. Még egyszer köszönöm és minden ajánlást ehhez a parkolóhoz.",
      image: null,
    },
    {
      id: 3,
      name: "Kubilay Öztürk",
      location: "",
      text: "Minden gördülékeny volt, ajánlom őket!!",
      image: null,
    },
  ];

  // Handler for service card CTA buttons - navigate to booking page with service pre-selected
  function handleServiceAction(serviceId) {
    // Map service IDs to booking service IDs
    const serviceMap = {
      parking: "airportParking",
      washing: "carWash",
    };
    const bookingServiceId = serviceMap[serviceId] || serviceId;
    // Store the service ID in sessionStorage before navigation
    sessionStorage.setItem("preselectedService", bookingServiceId);
    // Navigate to booking page
    navigate("booking");
  }

  function toggleReviewsWidget() {
    showReviewsWidget = !showReviewsWidget;
  }

  onMount(() => {
    // Debug logging
    console.log("Component mounted");

    // Load Elfsight Google Reviews script
    if (!document.querySelector('script[src*="elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Setup animations with ScrollTrigger
    // Services section animation (handled by the shouldAnimate prop)
    const servicesSection = document.querySelector(".services-section");
    if (servicesSection) {
      const st1 = ScrollTrigger.create({
        trigger: servicesSection,
        start: "top 70%",
        onEnter: () => {
          servicesVisible = true;
        },
      });
      scrollTriggers.push(st1);
    }

    // Testimonials section animation
    const testimonialsSection = document.querySelector(".testimonials-section");
    if (testimonialsSection) {
      const st2 = ScrollTrigger.create({
        trigger: testimonialsSection,
        start: "top 70%",
        onEnter: () => {
          testimonialsVisible = true;
        },
      });
      scrollTriggers.push(st2);
    }

    ScrollTrigger.refresh();
  });

  onDestroy(() => {
    scrollTriggers.forEach((trigger) => trigger.kill());
    scrollTriggers = [];
  });
</script>

<section class="hero" bind:this={heroSection}>
  <div class="hero-background">
    <div class="hero-image"></div>
  </div>
  <div class="hero-overlay"></div>
  <div class="container hero-container">
    <div class="hero-flex-wrapper">
      <div class="hero-content">
        <h1>
          {$currentLang === "hu"
            ? "A&T Reptéri Parkoló és Kézi Autómosó"
            : "A&T Airport Parking & Hand Car Wash"}
        </h1>
        <p>
          {$currentLang === "hu"
            ? "Biztonságos repülőtéri parkolás és professzionális autómosó szolgáltatás"
            : "Secure airport parking and professional car wash services"}
        </p>
        <div class="hero-features">
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>{$currentLang === 'hu' ? 'Ingyenes reptéri transzfer (oda-vissza)' : 'Free airport shuttle (round-trip)'}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>{$currentLang === 'hu' ? '0–24 órás kamerás felügyelet és őrzés' : '24/7 camera surveillance & on-site security'}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>{$currentLang === 'hu' ? 'Autómosás és szerviz a parkolás alatt' : 'Car wash & maintenance during parking'}</span>
          </div>
        </div>
      </div>

      <div class="hero-widget-col">
        <HeroBookingWidget {navigate} />
      </div>
    </div>

    <div
      class="scroll-down-indicator"
      on:click={() => {
        const nextSection = document.querySelector(".services-section");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          const nextSection = document.querySelector(".services-section");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      }}
      tabindex="0"
      role="button"
      aria-label={$currentLang === "hu" ? "Görgessen lefelé" : "Scroll down"}
    >
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="scroll-arrows">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</section>

<section class="services-section" id="services">
    <div class="wave-top" style="position: absolute; top: -1px; left: 0; width: 100%; transform: rotate(180deg); z-index: 10;">
    <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" style="display: block; width: calc(100% + 1.3px); height: 80px;">
      <path fill="rgb(253, 251, 238)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
    </svg>
  </div>

  <div class="container">
    <h2 class="section-title">
      {$currentLang === "hu" ? "SZOLGÁLTATÁSOK" : "OUR SERVICES"}
    </h2>
    <p class="section-subtitle">
      {$currentLang === "hu"
        ? "Fedezze fel átfogó szolgáltatásainkat, melyek az Ön járművének minden igényét kielégítik"
        : "Discover our comprehensive services covering all your vehicle needs in one place"}
    </p>

    <div class="services-grid">
      {#each services as service, i}
        <ServiceCard
          svgIcon={service.svgIcon}
          image={service.image}
          title={$currentLang === "hu"
            ? service.id === "parking"
              ? "24/7 REPÜLŐTÉRI PARKOLÁS"
              : "AUTÓMOSÓ"
            : service.id === "parking"
              ? "24/7 AIRPORT PARKING"
              : "CAR WASH"}
          description={$currentLang === "hu"
            ? service.id === "parking"
              ? "Biztonságos parkolóhelyeink 24 órás kamerás megfigyeléssel és szakértő személyzettel várják járművét, maximális biztonságot nyújtva."
              : "Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon."
            : service.id === "parking"
              ? "Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle."
              : "Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful."}
          index={i}
          shouldAnimate={servicesVisible}
          ctaText={$currentLang === "hu" ? "Foglalás" : "Book now"}
          ctaAction={() => handleServiceAction(service.id)}
          color={service.color}
          hoverColor={service.hoverColor}
        />
      {/each}
    </div>
  </div>

    <div class="wave-bottom" style="position: absolute; bottom: -1px; left: 0; width: 100%; z-index: 10;">
    <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" style="display: block; width: calc(100% + 1.3px); height: 80px;">
      <path fill="rgb(253, 251, 238)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
    </svg>
  </div>
</section>

<!-- Airport Parking Pricing Table Section -->
<section class="parking-prices-section" id="parking-prices">
  <div class="container">
    <div class="pricing-header">
      <h2 class="section-title">
        {$currentLang === 'hu' ? 'Reptéri Parkolási Áraink' : 'Airport Parking Prices'}
      </h2>
      <p class="section-subtitle">
        {$currentLang === 'hu'
          ? 'Átlátható árak, ingyenes oda-vissza reptéri transzferrel és 0–24 órás őrzéssel.'
          : 'Transparent rates with free round-trip terminal shuttle and 24/7 on-site security.'}
      </p>
    </div>

    <div class="pricing-table-wrapper">
      <div class="pricing-table-container scrollable-table parking-table-container">
        <table class="pricing-table parking-table">
          <thead>
            <tr>
              <th>{$currentLang === 'hu' ? 'Nap' : 'Day'}</th>
              <th class="normal-price-header">{$currentLang === 'hu' ? 'Normál ár' : 'Normal Price'}</th>
              <th>{$currentLang === 'hu' ? 'Kedvezményes ár' : 'Discounted Price'}</th>
            </tr>
          </thead>
          <tbody>
            {#each parkingPrices as price (price.days)}
              <tr>
                <td class="day-col">
                  <strong>{price.days}</strong> {$currentLang === 'hu' ? 'nap' : (price.days === 1 ? 'day' : 'days')}
                </td>
                <td class="normal-price-col">{price.normal}</td>
                <td class="discount-col">{price.discount}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="table-action-wrap">
        <button class="btn btn-primary" on:click={() => navigate("booking")}>
          {$currentLang === 'hu' ? 'FOGLALJON MOST' : 'BOOK NOW'}
        </button>
      </div>
    </div>
  </div>
</section>

<section class="testimonials-section">
  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <div class="container">
    <h2 class="section-title">
      {$currentLang === "hu" ? "Ügyfeleink Véleménye" : "Customer Testimonials"}
    </h2>



    <div class="widget-container">
      <!-- Elfsight Google Reviews | Untitled Google Reviews -->
      <div class="elfsight-app-f5a37e33-3ebf-4e83-943c-50f49277b06e" data-elfsight-app-lazy></div>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .hero {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
    padding: 100px 0 60px;
    box-sizing: border-box;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/aero.webp");
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    z-index: 1;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.55);
    z-index: 1;
  }

  .hero-container {
    position: relative;
    z-index: 2;
    padding: 0 1.5rem;
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .hero-flex-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2.5rem;
    width: 100%;
  }

  .hero-content {
    flex: 1;
    text-align: left;
    max-width: 600px;
    z-index: 2;
  }

  .hero-content h1 {
    font-size: 3.2rem;
    letter-spacing: -0.02em;
    font-weight: 800;
    margin-bottom: 1.2rem;
    line-height: 1.15;
    color: #ffffff;
    text-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  }

  .hero-content p {
    font-size: 1.18rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    color: #f8fafc;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  .hero-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgb(27, 42, 75);
    color: rgb(253, 251, 238);
    border: 1.5px solid rgba(253, 251, 238, 0.4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    font-size: 0.85rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .hero-widget-col {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    z-index: 3;
  }

  @media (max-width: 992px) {
    .hero {
      height: auto;
      min-height: 100vh;
      padding: 155px 0 70px;
    }

    .hero-flex-wrapper {
      flex-direction: column;
      align-items: center;
      gap: 1.75rem;
    }

    .hero-content {
      text-align: center;
      max-width: 100%;
      padding: 0;
    }

    .hero-content h1 {
      font-size: 2.2rem;
      margin-bottom: 0.8rem;
    }

    .hero-content p {
      font-size: 1rem;
      margin-bottom: 0.8rem;
    }

    .hero-features {
      display: none;
    }

    .hero-widget-col {
      width: 100%;
      justify-content: center;
    }

    .scroll-down-indicator {
      display: none !important;
    }
  }

  /* Scroll down indicator */
  .scroll-down-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 992px) {
    .scroll-down-indicator {
      display: none !important;
    }
  }

  .scroll-down-indicator:hover {
    opacity: 1;
  }

  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid white;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
    margin-bottom: 5px;
  }

  .wheel {
    width: 4px;
    height: 10px;
    background: rgb(253, 251, 238);
    border-radius: 2px;
    animation: mouse-scroll 1.6s cubic-bezier(0.15, 0.41, 0.69, 0.94) infinite;
  }

  .scroll-arrows span {
    display: block;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    transform: rotate(45deg);
    margin: -5px auto 0;
    animation: arrow-scroll 1.6s cubic-bezier(0.15, 0.41, 0.69, 0.94) infinite;
  }

  .scroll-arrows span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .scroll-arrows span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes mouse-scroll {
    0% {
      opacity: 0;
      transform: translateY(-5px);
    }
    20% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(15px);
    }
  }

  @keyframes arrow-scroll {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .section-title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 2.2rem;
    font-weight: 800;
    color: rgb(27, 42, 75);
    position: relative;
  }

  .section-title::after {
    content: "";
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
    color: #64748b;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  /* Services Section */
  .services-section {
    padding: 6rem 2rem;
    background-color: rgb(253, 251, 238);
    position: relative;
  }

  /* Simplified waves for better mobile performance */
  .wave-top,
  .wave-bottom {
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

  .wave-top svg,
  .wave-bottom svg {
    width: 100%;
    height: 100%;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  /* Testimonials Section */
  .testimonials-section {
    padding: 6rem 2rem;
    background-color: rgb(27, 42, 75);
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
    display: none !important;
  }

  /* Parking Pricing Section */
  .parking-prices-section {
    padding: 5.5rem 1.5rem;
    background: rgb(253, 251, 238);
    position: relative;
    z-index: 5;
  }

  .pricing-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
  }

  .pricing-header .section-title {
    font-size: 2.6rem;
    font-weight: 800;
    color: rgb(27, 42, 75);
    margin-bottom: 1.5rem;
  }

  .pricing-header .section-title::after {
    display: none !important;
  }

  .pricing-header .section-subtitle {
    font-size: 1.15rem;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }

  .pricing-table-wrapper {
    max-width: 850px;
    margin: 0 auto;
  }

  .pricing-table-container {
    background: #ffffff;
    border: 1px solid rgba(27, 42, 75, 0.15);
    border-radius: 16px;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .parking-table-container {
    max-height: 500px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .parking-table {
    width: 100%;
    border-collapse: collapse;
  }

  .parking-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: rgb(27, 42, 75);
    color: #ffffff;
    padding: 1.1rem 1.25rem;
    text-align: center;
    font-weight: 700;
    font-size: 1.05rem;
  }

  .parking-table td {
    padding: 0.85rem 1.25rem;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.98rem;
    color: #1e293b;
  }

  .parking-table tbody tr:nth-child(even) {
    background: rgba(253, 251, 238, 0.4);
  }

  .parking-table tbody tr:hover {
    background: rgba(253, 251, 238, 0.85);
  }

  .parking-table .day-col {
    font-weight: 600;
    color: rgb(27, 42, 75);
  }

  .parking-table .normal-price-col {
    text-decoration: line-through;
    color: #94a3b8;
    font-weight: 500;
  }

  .parking-table .discount-col {
    color: #dc2626;
    font-weight: 700;
    font-size: 1.05rem;
  }

  .table-action-wrap {
    margin-top: 2.5rem;
    text-align: center;
  }

  .table-action-wrap .btn {
    padding: 1rem 3.5rem;
    font-size: 1.05rem;
    font-weight: 700;
    background: rgb(27, 42, 75);
    color: #ffffff;
    border-radius: 12px;
    border: none;
    box-shadow: 0 8px 20px rgba(27, 42, 75, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    letter-spacing: 0.03em;
  }

  .table-action-wrap .btn:hover {
    background: rgb(45, 68, 115);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(27, 42, 75, 0.35);
  }

  /* Responsive Styles - Optimized for mobile */
  @media screen and (max-width: 1200px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }

  @media screen and (max-width: 992px) {
    .section-title {
      font-size: 2rem;
    }

    .testimonials-section .section-title {
      font-size: 2.2rem;
    }
  }

  @media screen and (max-width: 768px) {
    .hero {
      min-height: auto;
      padding: 150px 0 60px;
    }

    .hero-content h1 {
      font-size: 2.4rem;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }

    .hero-content p {
      font-size: 1.2rem;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .section-subtitle {
      font-size: 1.1rem;
    }

    .testimonials-section .section-title {
      font-size: 2rem;
    }

    .services-section,
    .testimonials-section,
    .parking-prices-section {
      padding: 3.5rem 1.25rem;
    }

    .wave-top,
    .wave-bottom {
      height: 10px;
    }

    /* Parking table mobile polish */
    .parking-table thead th {
      padding: 0.8rem 0.45rem;
      font-size: 0.85rem;
      white-space: nowrap;
    }

    .parking-table td {
      padding: 0.65rem 0.45rem;
      font-size: 0.88rem;
    }

    .parking-table .day-col {
      white-space: nowrap;
      font-size: 0.88rem;
    }

    .parking-table .day-col strong {
      font-weight: 700;
      font-size: 0.95rem;
    }

    .parking-table .normal-price-col {
      white-space: nowrap;
      font-size: 0.85rem;
    }

    .parking-table .discount-col {
      white-space: nowrap;
      font-size: 0.92rem;
    }

    /* Increased text sizes for mobile */
    :global(.service-card h3) {
      font-size: 1.6rem !important;
    }

    :global(.service-card p) {
      font-size: 1.1rem !important;
      line-height: 1.6 !important;
    }

    :global(.testimonial-card h3) {
      font-size: 1.5rem !important;
    }

    :global(.testimonial-card p) {
      font-size: 1.1rem !important;
      line-height: 1.6 !important;
    }
  }

  @media screen and (max-width: 480px) {
    .hero {
      height: auto;
      min-height: auto;
      padding: 140px 0 50px;
    }
    .hero-content h1 {
      font-size: 1.85rem;
    }

    .hero-content p {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .services-section,
    .testimonials-section,
    .parking-prices-section {
      padding: 3rem 0.85rem;
    }

    .wave-top,
    .wave-bottom {
      height: 5px;
    }

    /* Parking table small mobile polish */
    .parking-table thead th {
      padding: 0.7rem 0.25rem;
      font-size: 0.76rem;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }

    .parking-table td {
      padding: 0.55rem 0.25rem;
      font-size: 0.82rem;
    }

    .parking-table .day-col {
      white-space: nowrap;
      font-size: 0.82rem;
    }

    .parking-table .day-col strong {
      font-size: 0.88rem;
    }

    .parking-table .normal-price-col {
      white-space: nowrap;
      font-size: 0.8rem;
    }

    .parking-table .discount-col {
      white-space: nowrap;
      font-size: 0.85rem;
    }

    /* Even larger text sizes for smaller screens */
    :global(.service-card h3) {
      font-size: 1.8rem !important;
    }

    :global(.service-card p) {
      font-size: 1.2rem !important;
      line-height: 1.6 !important;
    }

    :global(.testimonial-card h3) {
      font-size: 1.6rem !important;
    }

    :global(.testimonial-card p) {
      font-size: 1.2rem !important;
      line-height: 1.6 !important;
    }
  }

  .widget-container {
    max-width: 1000px;
    margin: 3rem auto 0;
    background: rgb(253, 251, 238);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .widget-container {
      padding: 1rem;
      margin: 2rem 1rem 0;
    }
  }
</style>
