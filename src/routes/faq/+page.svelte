<script>
  import FAQ from '../../components/FAQ.svelte';
  import { faqContent, allFaqs } from '$lib/faq-content';
  import { currentLang, t } from '$lib/i18n';
  import { fade } from 'svelte/transition';

  const categories = [
    { id: 'all', name: 'All', nameHu: 'Összes' },
    { id: 'general', name: 'General', nameHu: 'Általános' },
    { id: 'parking', name: 'Parking', nameHu: 'Parkolás' },
    { id: 'services', name: 'Services', nameHu: 'Szerviz' },
    { id: 'booking', name: 'Booking', nameHu: 'Foglalás' }
  ];

  let activeCategory = 'all';
  $: filteredFaqs = activeCategory === 'all' ? allFaqs : (faqContent[activeCategory] || []);
</script>

<main class="faq-page">
  <section class="faq-hero">
    <div class="hero-copy" in:fade>
      <span class="eyebrow">
        {$currentLang === 'hu' ? 'Segítünk eligazodni' : 'We help you navigate'}
      </span>
      <h1>{$currentLang === 'hu' ? 'Gyakori kérdések' : 'Frequently asked questions'}</h1>
      <p>
        {$currentLang === 'hu'
          ? 'Mindennapi kérdések parkolással, szervizzel és foglalással kapcsolatban – egy helyen, átláthatóan.'
          : 'Everyday questions about parking, servicing and booking – clear, concise, and in one place.'}
      </p>
      <div class="hero-actions">
        <a href="/contact" class="primary">
          {t('faq.contactButton', 'Contact us')}
        </a>
        <a href="/" class="ghost">
          {$currentLang === 'hu' ? 'Vissza a főoldalra' : 'Back to home'}
        </a>
      </div>
    </div>
    <div class="hero-card" in:fade={{ delay: 120 }}>
      <div class="stat">
        <strong>24/7</strong>
        <span>{$currentLang === 'hu' ? 'Biztonság & támogatás' : 'Security & support'}</span>
      </div>
      <div class="stat">
        <strong>2 min</strong>
        <span>{$currentLang === 'hu' ? 'Gyors válaszok' : 'Snappy answers'}</span>
      </div>
      <div class="stat">
        <strong>+{allFaqs.length}</strong>
        <span>{$currentLang === 'hu' ? 'Hasznos tipp' : 'Helpful tips'}</span>
      </div>
    </div>
  </section>

  <section class="faq-body">
    <div class="filter-bar" in:fade={{ delay: 80 }}>
      {#each categories as category}
        <button
          class:active={activeCategory === category.id}
          on:click={() => activeCategory = category.id}
        >
          {$currentLang === 'hu' ? category.nameHu : category.name}
        </button>
      {/each}
    </div>

    <FAQ
      faqs={filteredFaqs}
      showHeader={false}
      accentColor="#00bae5"
    />

    <div class="cta-panel" in:fade={{ delay: 100 }}>
      <div>
        <p class="eyebrow soft">
          {$currentLang === 'hu' ? 'Mégsem talált választ?' : 'Didn’t find your answer?'}
        </p>
        <h3>
          {$currentLang === 'hu'
            ? 'Írjon nekünk, 1 órán belül reagálunk munkaidőben.'
            : 'Message us — we respond within an hour during business times.'}
        </h3>
      </div>
      <div class="cta-actions">
        <a href="mailto:info@atgroup.hu" class="primary">
          info@atgroup.hu
        </a>
        <a href="tel:+36705550588" class="ghost">
          +36 70 555 0588
        </a>
      </div>
    </div>
  </section>
</main>

<style>
  .faq-page {
    min-height: 100vh;
    background: #f7f8fb;
    color: #0f172a;
  }

  .faq-hero {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3.5rem 1.25rem 1.5rem;
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr 0.9fr;
    align-items: center;
  }

  .hero-copy h1 {
    font-size: clamp(2.4rem, 3.2vw, 3.1rem);
    margin: 0.4rem 0;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .hero-copy p {
    color: #4b5563;
    max-width: 640px;
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.1rem;
    flex-wrap: wrap;
  }

  .hero-card {
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    border-radius: 16px;
    padding: 1.25rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    box-shadow: 0 12px 28px -18px rgba(15, 23, 42, 0.18);
  }

  .stat {
    padding: 0.9rem;
    border-radius: 12px;
    background: #f8fafc;
    text-align: center;
    border: 1px solid rgba(15, 23, 42, 0.05);
  }

  .stat strong {
    display: block;
    font-size: 1.45rem;
    color: #0f172a;
  }

  .stat span {
    color: #4b5563;
    font-size: 0.95rem;
  }

  .faq-body {
    background: #f8fafc;
    color: #0f172a;
    margin-top: 0.5rem;
  }

  .filter-bar {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .filter-bar button {
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: white;
    color: #0f172a;
    padding: 0.55rem 1rem;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .filter-bar button.active {
    background: #0ea5e9;
    color: white;
    border-color: #0ea5e9;
    box-shadow: 0 10px 25px -10px rgba(14, 165, 233, 0.45);
  }

  .cta-panel {
    max-width: 1100px;
    margin: 2rem auto 0;
    background: white;
    border-radius: 18px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    padding: 1.5rem 1.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .cta-panel h3 {
    margin: 0.35rem 0 0;
    color: #0f172a;
  }

  .cta-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(34, 211, 238, 0.14);
    color: #22d3ee;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  .eyebrow.soft {
    background: rgba(14, 165, 233, 0.12);
    color: #0ea5e9;
  }

  .primary,
  .ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.65rem 1.1rem;
    border-radius: 12px;
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .primary {
    background: linear-gradient(120deg, #0ea5e9, #00bae5);
    color: white;
    box-shadow: 0 12px 30px -12px rgba(14, 165, 233, 0.55);
  }

  .primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px -14px rgba(14, 165, 233, 0.65);
  }

  .ghost {
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .ghost:hover {
    transform: translateY(-2px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 10px 24px -14px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 960px) {
    .faq-hero {
      grid-template-columns: 1fr;
      padding-top: 3rem;
    }

    .hero-card {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .cta-panel {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
