<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { currentLang, t } from "../lib/i18n";
  import FAQ from "../components/FAQ.svelte";
  import { faqContent } from "../lib/faq-content";
  import { gsap } from "gsap";

  // Combine all FAQs
  const allFaqs = [
    ...faqContent.general,
    ...faqContent.parking,
    ...faqContent.services,
    ...faqContent.booking,
  ];

  const categories = [
    { id: "all", name: "All", nameHu: "Összes" },
    { id: "general", name: "General", nameHu: "Általános" },
    { id: "parking", name: "Parking", nameHu: "Parkolás" },
    { id: "services", name: "Services", nameHu: "Szerviz" },
    { id: "booking", name: "Booking", nameHu: "Foglalás" },
  ];

  let activeCategory = "all";
  $: filteredFaqs =
    activeCategory === "all" ? allFaqs : faqContent[activeCategory] || [];

  // Standard anchor tags are fine for navigation if router is not strictly enforcing prop usage.

  onMount(() => {
    // GSAP animations for hero elements
    gsap.from(".faq-hero h1", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
    });

    gsap.from(".faq-hero p", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
    });

    // Animate stats
    gsap.from(".stat", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.6,
    });
  });
</script>

<section class="faq-hero">
  <div class="hero-background"></div>
  <div class="container relative z-10">
    <h1>
      {$currentLang === "hu"
        ? "GYAKORI KÉRDÉSEK"
        : "FREQUENTLY ASKED QUESTIONS"}
    </h1>
    <p>
      {$currentLang === "hu"
        ? "Minden válasz egy helyen – parkolás, szerviz, foglalás."
        : "All answers in one place – parking, service, booking."}
    </p>
  </div>
  <div class="hero-wave">
    <svg preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
    </svg>
  </div>
</section>

<section class="faq-content-section">
  <div class="container">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat">
        <strong>24/7</strong>
        <span
          >{$currentLang === "hu"
            ? "Biztonság & támogatás"
            : "Security & support"}</span
        >
      </div>

      <div class="stat">
        <strong>+{allFaqs.length}</strong>
        <span>{$currentLang === "hu" ? "Hasznos tipp" : "Helpful tips"}</span>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      {#each categories as category}
        <button
          class:active={activeCategory === category.id}
          on:click={() => (activeCategory = category.id)}
        >
          {$currentLang === "hu" ? category.nameHu : category.name}
        </button>
      {/each}
    </div>

    <!-- FAQ List Wrapper -->
    <div class="faq-list-wrapper">
      <FAQ
        faqs={filteredFaqs}
        showHeader={false}
        accentColor="#00bae5"
        transparent={true}
        useContainer={false}
      />
    </div>
  </div>
</section>

<!-- CTA Section (Matching Home/Services design) -->
<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2>
        {$currentLang === "hu"
          ? "Nem találta meg a választ?"
          : "Didn't find the answer?"}
      </h2>
      <p class="cta-subtitle">
        {$currentLang === "hu"
          ? "Lépjen kapcsolatba velünk, és segítünk minden kérdésben!"
          : "Contact us and we will help you with any questions!"}
      </p>
      <a href="/contact" class="btn btn-outline">
        {$currentLang === "hu" ? "Kapcsolatfelvétel" : "Contact Us"}
      </a>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  /* Hero Section */
  .faq-hero {
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

  .faq-hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .faq-hero p {
    font-size: 1.35rem;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.85;
    line-height: 1.6;
    font-weight: 300;
    color: white;
  }

  /* Content Section */
  .faq-content-section {
    background-color: rgb(253, 251, 238);
    padding: 2rem 2rem 6rem;
    min-height: 50vh;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 900px;
    margin: 0 auto 3rem;
  }

  .stat {
    text-align: center;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  .stat:hover {
    transform: translateY(-5px);
    background: white;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }

  .stat strong {
    display: block;
    font-size: 1.8rem;
    color: var(--secondary);
    margin-bottom: 0.5rem;
  }

  .stat span {
    color: #a0aec0;
    font-size: 0.95rem;
  }

  /* Filter Bar */
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .filter-bar button {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #a0aec0;
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .filter-bar button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .filter-bar button.active {
    background: #00bae5;
    color: white;
    border-color: #00bae5;
    box-shadow: 0 4px 12px rgba(0, 186, 229, 0.3);
  }

  /* CTA Section */
  .cta-section {
    padding: 5rem 2rem;
    background-color: rgb(27, 42, 75); /* Slightly darker/different shade */
    color: white;
    text-align: center;
    position: relative;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .cta-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(30, 10, 60, 0.5),
      rgba(13, 13, 30, 0.5)
    );
    z-index: 0;
  }

  .cta-content {
    position: relative;
    z-index: 1;
  }

  .cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-subtitle {
    font-size: 1.1rem;
    color: #a0aec0;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .btn-outline {
    display: inline-block;
    padding: 1rem 2.5rem;
    border: 2px solid white;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    background: transparent;
  }

  .btn-outline:hover {
    background: rgb(253, 251, 238);
    color: rgb(27, 42, 75);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .faq-hero h1 {
      font-size: 2.2rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat {
      padding: 1rem;
    }

    .cta-section h2 {
      font-size: 2rem;
    }
  }
</style>
