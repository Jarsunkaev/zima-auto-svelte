<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';
  import { fade } from 'svelte/transition';

  export let lang;
  
  // Content for both languages
  const content = {
    hu: {
      title: "Köszönjük üzenetét!",
      subtitle: "Hamarosan felvesszük Önnel a kapcsolatot.",
      message: "Üzenetét sikeresen elküldtük csapatunknak. Munkatársaink a lehető leghamarabb válaszolnak.",
      backButton: "Vissza a kapcsolat oldalra"
    },
    en: {
      title: "Thank you for your message!",
      subtitle: "We'll get back to you shortly.",
      message: "Your message has been successfully sent to our team. Our staff will respond as soon as possible.",
      backButton: "Back to contact page"
    }
  };
  
  onMount(() => {
    // Scroll to top when thank you page is shown
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>

<section class="thankyou-section" in:fade={{ duration: 600, delay: 200 }}>
  <div class="container">
    <div class="thankyou-content">
      <div class="success-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <h1>{content[lang].title}</h1>
      <p class="subtitle">{content[lang].subtitle}</p>
      
      <div class="message-box">
        <p>{content[lang].message}</p>
      </div>
      
      <a href="/contact" class="back-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {content[lang].backButton}
      </a>
    </div>
  </div>
</section>

<style>
  .thankyou-section {
    padding: 6rem 2rem;
    background-color: #13151a;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
  
  .thankyou-content {
    max-width: 700px;
    margin: 0 auto;
    background-color: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  }
  
  .success-icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
    background-color: rgba(0, 186, 229, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary, #00bae5);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--text, #333);
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: var(--text-light, #666);
    margin-bottom: 2rem;
  }
  
  .message-box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .message-box p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--text, #333);
  }
  
 
  
  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background-color: transparent;
    border: 1px solid var(--primary, #00bae5);
    color: var(--primary, #00bae5);
    border-radius: 50px;
    padding: 0.8rem 1.8rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }
  
  .back-button:hover {
    background-color: var(--primary, #00bae5);
    color: white;
    transform: translateY(-2px);
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .thankyou-section {
      padding: 4rem 1.5rem;
      padding-bottom: 6rem;
    }
    
    .thankyou-content {
      padding: 2rem 1.5rem;
    }
    
    .success-icon {
      width: 100px;
      height: 100px;
      margin-bottom: 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
    }
    
    .message-box {
      padding: 1.5rem;
    }
    
    .message-box p {
      font-size: 1rem;
    }
  }
  
  @media screen and (max-width: 480px) {
    .thankyou-section {
      padding: 3rem 1rem;
      padding-bottom: 6rem;
    }
    
    .thankyou-content {
      padding: 1.5rem 1rem;
    }
    
    .success-icon {
      width: 80px;
      height: 80px;
    }
    
    h1 {
      font-size: 1.8rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
  }
</style>