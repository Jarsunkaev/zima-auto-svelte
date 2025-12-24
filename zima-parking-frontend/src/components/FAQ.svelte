<script>
  import { quintOut } from "svelte/easing";
  import { fade, slide } from "svelte/transition";
  import { currentLang, t } from "../lib/i18n/index.js";

  export let faqs = [];
  export let showHeader = true;
  export let eyebrow = "";
  export let headline = "";
  export let description = "";
  export let maxItems = null;
  export let transparent = false;
  export let useContainer = true;

  $: displayedFaqs = maxItems ? faqs.slice(0, maxItems) : faqs;
  $: activeIndex = 0;

  $: headlineText =
    headline ||
    ($currentLang === "hu"
      ? "Gyakran Ismételt Kérdések"
      : "Frequently Asked Questions");
  $: descriptionText =
    description ||
    ($currentLang === "hu"
      ? "Villámgyors válaszok parkolásról, szervizről és foglalásról."
      : "Quick answers about parking, servicing and booking with us.");

  function toggleFaq(index) {
    activeIndex = activeIndex === index ? null : index;
  }
</script>

<section class="faq-section" class:transparent class:no-padding={!useContainer}>
  <div class={useContainer ? "container" : "faq-wrapper"}>
    {#if showHeader}
      <div class="faq-header" in:fade>
        {#if eyebrow}
          <span class="eyebrow">{eyebrow}</span>
        {/if}
        <h2>{headlineText}</h2>
        <p>{descriptionText}</p>
      </div>
    {/if}

    <div class="faq-grid">
      {#each displayedFaqs as faq, index}
        <article
          class={`faq-card ${activeIndex === index ? "open" : ""}`}
          in:fade={{ duration: 200, delay: index * 60 }}
        >
          <button
            class="faq-toggle"
            on:click={() => toggleFaq(index)}
            aria-expanded={activeIndex === index}
            aria-controls={`faq-${index}`}
          >
            <div class="question-meta">
              {#if faq.category}
                <span class="pill">
                  {$currentLang === "hu" && faq.categoryHu
                    ? faq.categoryHu
                    : faq.category}
                </span>
              {/if}
              <h3>
                {$currentLang === "hu" && faq.questionHu
                  ? faq.questionHu
                  : faq.question}
              </h3>
            </div>

            <div class={`chevron ${activeIndex === index ? "open" : ""}`}>
              <span></span>
              <span></span>
            </div>
          </button>

          {#if activeIndex === index}
            <div
              id={`faq-${index}`}
              class="answer"
              transition:slide={{ duration: 200, easing: quintOut }}
            >
              <p>
                {$currentLang === "hu" && faq.answerHu
                  ? faq.answerHu
                  : faq.answer}
              </p>

              {#if faq.note || faq.noteHu}
                <div class="note">
                  {$currentLang === "hu" && faq.noteHu ? faq.noteHu : faq.note}
                </div>
              {/if}
            </div>
          {/if}
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .faq-section {
    position: relative;
    padding: 5rem 0;
    background: var(--light);
  }

  .faq-section.transparent {
    background: transparent;
  }

  .faq-section.no-padding {
    padding: 0;
  }

  .faq-wrapper {
    width: 100%;
  }

  .faq-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .faq-header h2 {
    font-size: 2.75rem;
    color: var(--secondary);
    margin-bottom: 1.25rem;
    font-weight: 700;
  }

  .faq-header p {
    color: var(--text-light);
    max-width: 700px;
    margin: 0 auto;
    font-size: 1.15rem;
    line-height: 1.6;
  }

  .eyebrow {
    display: inline-block;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    background: color-mix(in srgb, var(--primary), transparent 90%);
    color: var(--primary);
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .faq-grid {
    display: grid;
    gap: 1.25rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-card {
    background: var(--white);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  }

  .faq-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: var(--primary);
  }

  .faq-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
  }

  .question-meta {
    flex: 1;
    padding-right: 1.5rem;
  }

  .question-meta h3 {
    font-size: 1.3rem;
    color: var(--secondary);
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
  }

  .pill {
    display: inline-block;
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    background: #f0f4f8;
    color: #64748b;
    margin-bottom: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .chevron {
    width: 24px;
    height: 24px;
    position: relative;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .chevron span {
    position: absolute;
    background: var(--primary);
    border-radius: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }

  .chevron span:nth-child(1) {
    width: 14px;
    height: 2px;
  }

  .chevron span:nth-child(2) {
    width: 2px;
    height: 14px;
  }

  .chevron.open span:nth-child(2) {
    height: 0;
  }

  .answer {
    padding: 0 1.75rem 1.75rem;
    color: #4b5563;
    line-height: 1.7;
    font-size: 1.05rem;
  }

  .note {
    margin-top: 1.25rem;
    padding: 1.25rem;
    background: color-mix(in srgb, var(--primary), transparent 95%);
    border-left: 3px solid var(--primary);
    border-radius: 6px;
    font-size: 0.95rem;
    color: var(--secondary);
  }

  @media (max-width: 768px) {
    .faq-header h2 {
      font-size: 2.2rem;
    }

    .question-meta h3 {
      font-size: 1.15rem;
    }
  }
</style>
