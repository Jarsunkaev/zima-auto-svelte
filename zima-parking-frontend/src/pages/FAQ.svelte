<script>
  import FAQ from '../components/FAQ.svelte';
  import { faqContent, allFaqs } from '../lib/faq-content';
  import { currentLang, t } from '../lib/i18n/index.js';
  import { fade } from 'svelte/transition';

  const categories = [
    { id: 'all', name: 'All', nameHu: 'Összes' },
    { id: 'general', name: 'General', nameHu: 'Általános' },
    { id: 'parking', name: 'Parking', nameHu: 'Parkolás' },
    { id: 'services', name: 'Services', nameHu: 'Szolgáltatások' },
    { id: 'booking', name: 'Booking', nameHu: 'Foglalás' }
  ];

  let activeCategory = 'all';
  $: filteredFaqs = activeCategory === 'all' ? allFaqs : (faqContent[activeCategory] || []);
</script>

<main class="faq-page">
  <section class="faq-header-section">
    <div class="container">
      <h1>
        {$currentLang === 'hu' ? 'GYAKRAN ISMÉTELT KÉRDÉSEK' : 'FREQUENTLY ASKED QUESTIONS'}
      </h1>
      <p class="subtitle">
        {$currentLang === 'hu' 
          ? 'Minden, amit a A&T Group parkolásáról és autóápolásáról tudnia kell.'
          : 'Everything you need to know about parking and car care at A&T Group.'}
      </p>
    </div>
  </section>

  <section class="faq-content">
    <div class="container">
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

      <div class="contact-cta">
        <h3>
          {$currentLang === 'hu'
            ? 'Nem találta a választ? Vegye fel velünk a kapcsolatot!'
            : 'Can\'t find what you\'re looking for? Contact us!'}
        </h3>
        <div class="cta-buttons">
          <a href="tel:+36705550588" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            +36 70 555 0588
          </a>
          <a href="mailto:info@atgroup.hu" class="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            info@atgroup.hu
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  .faq-page {
    min-height: 100vh;
    background: var(--light);
  }

  .faq-header-section {
    padding: 8rem 2rem 4rem;
    background: var(--secondary);
    color: white;
    text-align: center;
  }

  .faq-header-section h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: 1px;
  }

  .faq-header-section .subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .faq-content {
    padding: 4rem 0;
    background: var(--light);
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .filter-bar button {
    border: 2px solid var(--primary);
    background: white;
    color: var(--primary);
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-bar button:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 186, 229, 0.3);
  }

  .filter-bar button.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 186, 229, 0.4);
  }

  .contact-cta {
    margin-top: 4rem;
    padding: 3rem 2rem;
    background: white;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .contact-cta h3 {
    font-size: 1.8rem;
    color: var(--secondary);
    margin-bottom: 2rem;
    font-weight: 600;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-buttons .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .cta-buttons .btn svg {
    width: 20px;
    height: 20px;
  }

  .cta-buttons .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
  }

  .cta-buttons .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 186, 229, 0.4);
  }

  .cta-buttons .btn-secondary {
    background: white;
    color: var(--secondary);
    border: 2px solid var(--secondary);
  }

  .cta-buttons .btn-secondary:hover {
    background: var(--secondary);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    .faq-header-section {
      padding: 7rem 1.5rem 3rem;
    }

    .faq-content {
      padding: 3rem 0;
    }

    .filter-bar {
      padding: 0 1rem;
    }

    .filter-bar button {
      padding: 0.6rem 1.2rem;
      font-size: 0.85rem;
    }

    .contact-cta {
      padding: 2rem 1.5rem;
    }

    .contact-cta h3 {
      font-size: 1.4rem;
    }

    .cta-buttons {
      flex-direction: column;
      width: 100%;
    }

    .cta-buttons .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>

