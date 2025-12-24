<script>
  import FAQ from '../components/FAQ.svelte';
  import { faqContent, allFaqs } from '../lib/faq-content';
  import { currentLang, t } from '../lib/i18n/index.js';
  import { fade } from 'svelte/transition';

  const categories = [
    { id: 'all', name: 'All', nameHu: 'Összes' },
    { id: 'parking', name: 'Parking', nameHu: 'Parkolás' },
    { id: 'services', name: 'Car care', nameHu: 'Autóápolás' },
    { id: 'booking', name: 'Booking', nameHu: 'Foglalás' }
  ];

  let activeCategory = 'all';
  $: filteredFaqs = activeCategory === 'all' ? allFaqs : (faqContent[activeCategory] || []);
</script>

<main class="faq-page">
  <section class="faq-hero">
    <div class="hero-copy" in:fade>
      <span class="eyebrow">
        {$currentLang === 'hu' ? 'GYIK' : 'FAQ'}
      </span>
      <h1>{t('faq.title', 'Frequently Asked Questions')}</h1>
      <p>
        {t('faq.subtitle', 'Everything you need to know about parking and car care at Zima.')}
      </p>
      <div class="hero-actions">
        <a class="primary" href="/booking">
          {$currentLang === 'hu' ? 'Foglalás indítása' : 'Start booking'}
        </a>
        <a class="ghost" href="/contact">
          {t('faq.contactButton', 'Contact us')}
        </a>
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
          {t('faq.contactCta', 'Need a quick answer?')}
        </p>
        <h3>
          {$currentLang === 'hu'
            ? 'Hívjon vagy írjon, 1 órán belül reagálunk.'
            : 'Call or email us — we respond within an hour.'}
        </h3>
      </div>
      <div class="cta-actions">
        <a href="tel:+36705550588" class="primary">+36 70 555 0588</a>
        <a href="mailto:info@zima-auto.com" class="ghost">info@zima-auto.com</a>
      </div>
    </div>
  </section>
</main>

<style>
  .faq-page {
    min-height: 100vh;
    background: #f8fafc;
    color: #0f172a;
  }

  .faq-hero {
    max-width: 1100px;
    margin: 0 auto;
    padding: 4rem 1.25rem 2rem;
  }

  .hero-copy h1 {
    font-size: clamp(2.2rem, 3vw, 2.8rem);
    margin: 0.4rem 0;
    letter-spacing: -0.02em;
  }

  .hero-copy p {
    color: #475569;
    max-width: 640px;
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1.2rem;
  }

  .faq-body {
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  }

  .filter-bar {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.25rem 0.5rem;
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
    margin: 2rem auto;
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
    background: rgba(14, 165, 233, 0.12);
    color: #0ea5e9;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  .eyebrow.soft {
    background: rgba(14, 165, 233, 0.1);
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
    background: white;
    border: 1px solid rgba(15, 23, 42, 0.08);
    color: #0f172a;
  }

  .ghost:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px -14px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 960px) {
    .cta-panel {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>

