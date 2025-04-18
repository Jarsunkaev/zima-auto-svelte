<script>
    import { onMount } from 'svelte';
    import { currentLang, t } from '../lib/i18n';
    import { gsap } from 'gsap';
    
    let lang;
    
    // Subscribe to language changes
    currentLang.subscribe(value => {
      lang = value;
    });
    
    // Form data
    let formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    
    // Contact content translations
    const content = {
      hu: {
        title: 'KAPCSOLAT',
        subtitle: 'Vegye fel velünk a kapcsolatot, és segítünk mindenben!',
        address: {
          title: 'CÍMÜNK',
          content: 'Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220'
        },
        phone: {
          title: 'TELEFON',
          content: '06 70 555 0588'
        },
        email: {
          title: 'EMAIL',
          content: 'info@zima-auto.com'
        },
        hours: {
          title: 'NYITVATARTÁS',
          content: 'Minden nap: 00:00 - 24:00'
        },
        form: {
          title: 'KÜLDJÖN ÜZENETET',
          name: 'Név',
          email: 'Email',
          phone: 'Telefonszám',
          subject: 'Tárgy',
          message: 'Üzenet',
          button: 'KÜLDÉS',
          success: 'Köszönjük üzenetét! Hamarosan válaszolunk.'
        }
      },
      en: {
        title: 'CONTACT',
        subtitle: 'Get in touch with us and we\'ll help with anything you need!',
        address: {
          title: 'ADDRESS',
          content: 'Next to Vecsés Széchényi Street 62, Plot 0182/55, 2220'
        },
        phone: {
          title: 'PHONE',
          content: '06 70 555 0588'
        },
        email: {
          title: 'EMAIL',
          content: 'info@zima-auto.com'
        },
        hours: {
          title: 'BUSINESS HOURS',
          content: 'Every day: 00:00 - 24:00'
        },
        form: {
          title: 'SEND A MESSAGE',
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          subject: 'Subject',
          message: 'Message',
          button: 'SEND',
          success: 'Thank you for your message! We\'ll get back to you soon.'
        }
      }
    };
    
    // Form submission handling
    let isSubmitting = false;
    let isSuccess = false;
    let errorMessage = '';
    
    function handleSubmit() {
      isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        isSubmitting = false;
        isSuccess = true;
        
        // Reset form after submission
        formData = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        };
      }, 1500);
    }
    
    onMount(() => {
      // Animate elements
      gsap.from('.contact-info div', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.2
      });
      
      gsap.from('.contact-form', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.4
      });
    });
  </script>
  
  <section class="contact-hero">
    <div class="container">
      <h1>{content[$currentLang].title}</h1>
      <p>{content[$currentLang].subtitle}</p>
    </div>
  </section>
  
  <section class="contact-section">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <div class="info-card">
            <div class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>{content[$currentLang].address.title}</h3>
              <p>{content[$currentLang].address.content}</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>{content[$currentLang].phone.title}</h3>
              <p>{content[$currentLang].phone.content}</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>{content[$currentLang].email.title}</h3>
              <p>{content[$currentLang].email.content}</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>{content[$currentLang].hours.title}</h3>
              <p>{content[$currentLang].hours.content}</p>
            </div>
          </div>
        </div>
        
        <div class="contact-form-container">
          <h2>{content[$currentLang].form.title}</h2>
          
          {#if isSuccess}
            <div class="success-message">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#0088cc"/>
              </svg>
              <p>{content[$currentLang].form.success}</p>
            </div>
          {:else}
            <form class="contact-form" on:submit|preventDefault={handleSubmit}>
              <div class="form-group">
                <label for="name">{content[$currentLang].form.name}</label>
                <input 
                  type="text" 
                  id="name" 
                  bind:value={formData.name} 
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="email">{content[$currentLang].form.email}</label>
                  <input 
                    type="email" 
                    id="email" 
                    bind:value={formData.email} 
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="phone">{content[$currentLang].form.phone}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    bind:value={formData.phone}
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="subject">{content[$currentLang].form.subject}</label>
                <input 
                  type="text" 
                  id="subject" 
                  bind:value={formData.subject} 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="message">{content[$currentLang].form.message}</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  bind:value={formData.message} 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : content[$currentLang].form.button}
              </button>
            </form>
          {/if}
        </div>
      </div>
    </div>
  </section>
  
  <section class="map-section">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2696.498750227303!2d19.25289!3d47.43039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDI1JzQ5LjQiTiAxOcKwMTUnMTAuNCJF!5e0!3m2!1sen!2shu!4v1555555555555!5m2!1sen!2shu" 
      width="100%" 
      height="450" 
      style="border:0;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade"
      title="Zima Auto location">
    </iframe>
  </section>
  
  <style>
    .contact-hero {
      background-color: var(--secondary);
      color: white;
      padding: 8rem 2rem 5rem;
      text-align: center;
    }
    
    .contact-hero h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    
    .contact-hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
      opacity: 0.9;
    }
    
    .contact-section {
      padding: 5rem 2rem;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 4rem;
      align-items: start;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .info-card {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 1.5rem;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }
    
    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    }
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 50px;
      height: 50px;
      background-color: rgba(0, 186, 229, 0.1);
      border-radius: 50%;
      color: rgba(0, 186, 229, 1);
    }
    
    .info-content h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    
    .info-content p {
      color: var(--text-light);
      line-height: 1.6;
    }
    
    .contact-form-container {
      background-color: white;
      border-radius: 12px;
      padding: 2.5rem;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
    }
    
    .contact-form-container h2 {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      text-align: center;
      position: relative;
    }
    
    .contact-form-container h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background-color: var(--primary);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text);
    }
    
    input, textarea {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    input:focus, textarea:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.2);
    }
    
    .contact-form button {
      width: 100%;
      padding: 1rem;
      margin-top: 1rem;
      font-size: 1rem;
    }
    
    .success-message {
      text-align: center;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    
    .success-message p {
      font-size: 1.2rem;
      color: var(--text);
    }
    
    .map-section {
      height: 450px;
    }
    
    @media screen and (max-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }
    
    @media screen and (max-width: 768px) {
      .contact-hero h1 {
        font-size: 2.2rem;
      }
      
      .contact-hero p {
        font-size: 1rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .contact-form-container {
        padding: 1.5rem;
      }
    }
  </style>