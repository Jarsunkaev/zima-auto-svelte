<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n';
  import { gsap } from 'gsap';
  
  // Add navigate as a prop
  export let navigate;
  // Ensure ScrollTrigger is installed (npm install gsap scrolltrigger)
  // and imported if you want the map animation to trigger on scroll.
  // If you don't want scroll-triggered map animation, remove these lines
  // and the scrollTrigger property from the map's gsap.from call.
  // import { ScrollTrigger } from 'gsap/ScrollTrigger';
  // gsap.registerPlugin(ScrollTrigger);


  let lang;
  // showDirectionsPopup and related functions are removed
  // as we are now directly linking to Google Maps directions

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

  // Contact content translations - UPDATED OPENING HOURS FORMAT BASED ON SCREENSHOT
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
        // Updated content to match screenshot format
        content: '<strong>Parkoló:</strong><br>24/7<br><br><strong>Kézi Autómosó:</strong><br>H-Szo (08:00-18:00)<br><br><strong>Autó Szerviz:</strong><br>H-Szo (08:00-17:00)<br><br><strong>Gumiszerviz:</strong><br>H-Szo (08:00-17:00)'
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
        // Updated content to match screenshot format (translated)
        content: '<strong>Parking:</strong><br>24/7<br><br><strong>Car Wash:</strong><br>Mon-Sat (08:00-18:00)<br><br><strong>Auto Service:</strong><br>Mon-Sat (08:00-17:00)<br><br><strong>Tire Service:</strong><br>Mon-Sat (08:00-17:00)'
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
  let formErrors = {}; // Added formErrors object for client-side validation

  // Function to validate form before submission
  function validateForm() {
    let isValid = true;
    formErrors = {}; // Reset errors

    if (!formData.name.trim()) {
      formErrors.name = $currentLang === 'hu' ? 'Kérjük adja meg a nevét' : 'Please enter your name';
      isValid = false;
    }

    if (!formData.email.trim()) {
      formErrors.email = $currentLang === 'hu' ? 'Kérjük adja meg email címét' : 'Please enter your email address';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = $currentLang === 'hu' ? 'Érvénytelen email cím' : 'Invalid email address';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      formErrors.subject = $currentLang === 'hu' ? 'Kérjük adja meg a tárgyat' : 'Please enter a subject';
      isValid = false;
    }

    if (!formData.message.trim()) {
      formErrors.message = $currentLang === 'hu' ? 'Kérjük írja meg üzenetét' : 'Please enter your message';
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit() {
  if (!validateForm()) {
    errorMessage = $currentLang === 'hu'
      ? 'Kérjük javítsa a hibákat az űrlapon.'
      : 'Please correct the errors in the form.';
    isSuccess = false; // Ensure success message is hidden
    return;
  }

  isSubmitting = true;
  errorMessage = ''; // Clear previous errors

  try {
    const contactData = {
      service: 'contactForm',
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone || '',
      subject: formData.subject || 'Contact Form Inquiry',
      message: formData.message,
      adminEmail: 'ahmedhasimov@zima-auto.com' // Updated admin email
    };

    console.log('Sending contact form data to backend:', contactData);

    // Use environment variable if available, otherwise default to the base URL
    const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev';
    const response = await fetch(`${BACKEND_API_URL}/api/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Contact form submitted successfully:', result);
      
      // Reset form after successful submission
      formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
      formErrors = {}; // Also clear form errors on success

      // Use navigate function for client-side routing to thank you page
      navigate('thankyou');
    } else {
      console.error('Backend reported failure:', response.status, result.message);
      errorMessage = result.message || ($currentLang === 'hu'
        ? 'Hiba történt az üzenet küldése során. Kérjük, próbálja újra később.'
        : 'An error occurred while sending your message. Please try again later.');
      isSuccess = false;
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    errorMessage = $currentLang === 'hu'
      ? 'Hiba történt a szerverhez való kapcsolódás során. Kérjük, próbálja újra később.'
      : 'An error occurred while connecting to the server. Please try again later.';
    isSuccess = false;
  } finally {
    isSubmitting = false;
  }
}

  // Function to open Google Maps directions to Zima Auto
  // This function is now directly called by the button on the contact page
  function openGoogleMapsDirections() {
    // Using the specific URL that initiates directions to Zima Auto
    window.open('https://www.google.com/maps/place/Zima+Auto+Airport+Parking+-+Aut%C3%B3szerv%C3%ADz+-+Gumiszerv%C3%ADz+-+K%C3%A9zi+aut%C3%B3mos%C3%B3/@47.4099403,19.2301139,17z/data=!3m1!4b1!4m6!3m5!1s0x4741c1ece824d30f:0x632898beef8d5983!8m2!3d47.4099403!4d19.2326888!16s%2Fg%2F11vyx0730g?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D', '_blank');
  }

  // Removed functions for popup (toggleDirectionsPopup, closeDirectionsPopup, openGoogleMaps, openWaze)
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
          <p><a href="tel:+36705550588" class="contact-link">{content[$currentLang].phone.content}</a></p>
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
          <p><a href="mailto:info@zima-auto.com" class="contact-link">{content[$currentLang].email.content}</a></p>
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
          <p>{@html content[$currentLang].hours.content}</p>
        </div>
      </div>
    </div>

    <div class="contact-form-container">
      <h2>{content[$currentLang].form.title}</h2>

      {#if isSuccess}
        <div class="success-message">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#0088cc" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
          </svg>
          <p>{content[$currentLang].form.success}</p>
        </div>
        {#if errorMessage}
           <p class="error-message" style="text-align: center; margin-top: 1rem;">{errorMessage}</p>
        {/if}
      {:else}
        {#if errorMessage && !formErrors.name && !formErrors.email && !formErrors.subject && !formErrors.message}
           <p class="error-message" style="text-align: center; margin-bottom: 1.5rem;">{errorMessage}</p>
        {/if}
        <form class="contact-form" on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="name">{content[$currentLang].form.name}</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              required
              placeholder={$currentLang === 'hu' ? 'Adja meg a nevét' : 'Enter your name'}
              aria-invalid={formErrors.name ? 'true' : 'false'}
            />
            {#if formErrors.name}
              <p class="error-message">{formErrors.name}</p>
            {/if}
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">{content[$currentLang].form.email}</label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                placeholder={$currentLang === 'hu' ? 'Adja meg email címét' : 'Enter your email address'}
                aria-invalid={formErrors.email ? 'true' : 'false'}
              />
               {#if formErrors.email}
                <p class="error-message">{formErrors.email}</p>
              {/if}
            </div>

            <div class="form-group">
              <label for="phone">{content[$currentLang].form.phone}</label>
              <input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                placeholder={$currentLang === 'hu' ? 'Adja meg telefonszámát' : 'Enter your phone number'}
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
              placeholder={$currentLang === 'hu' ? 'Adja meg a tárgyat' : 'Enter the subject'}
              aria-invalid={formErrors.subject ? 'true' : 'false'}
            />
             {#if formErrors.subject}
              <p class="error-message">{formErrors.subject}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="message">{content[$currentLang].form.message}</label>
            <textarea
              id="message"
              rows="5"
              bind:value={formData.message}
              required
              placeholder={$currentLang === 'hu' ? 'Írja meg üzenetét' : 'Enter your message'}
              aria-invalid={formErrors.message ? 'true' : 'false'}
            ></textarea>
             {#if formErrors.message}
              <p class="error-message">{formErrors.message}</p>
            {/if}
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
       {#if errorMessage && !isSuccess && (formErrors.name || formErrors.email || formErrors.subject || formErrors.message)}
           <p class="error-message" style="text-align: center; margin-top: 1.5rem;">{errorMessage}</p>
        {/if}
    </div>
  </div>
</section>

<section class="map-section">
  <div class="map-container">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2700.102580768995!2d19.230113876877105!3d47.40994027117247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c1ece824d30f%3A0x632898beef8d5983!2sZima%20Auto%20Airport%20Parking%20-%20Aut%C3%B3szerv%C3%ADz%20-%20Gumiszerv%C3%ADz%20-%20K%C3%A9zi%20aut%C3%B3mos%C3%B3!5e0!3m2!1sen!2shu!4v1745609320883!5m2!1sen!2shu"
      width="100%"
      height="450"
      style="border:0;"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Zima Auto location">
    </iframe>
    <button
      class="directions-link"
      on:click={openGoogleMapsDirections}
    >
      {$currentLang === 'hu' ? 'Útvonaltervezés' : 'Get Directions'}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
</section>

<style>
  /* Added styles for form error messages */
  .form-group .error-message {
    color: #dc3545; /* Red color for errors */
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  input[aria-invalid="true"], textarea[aria-invalid="true"] {
      border-color: #dc3545;
  }

  /* Remove unused selectors */
  .info-content p {
    color: var(--text);
    margin-bottom: 1rem;
  }

  .info-content p:first-child {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    .info-content p {
      margin-bottom: 2rem;
    }
  }

  @media (max-width: 480px) {
    .map-section {
      height: 300px;
    }
  }

  /* Keep existing styles */
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
    margin-bottom: 0; /* Default to 0 */
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
    color: var(--primary);
    flex-shrink: 0;
  }

  .info-content h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--text);
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
    padding-bottom: 15px;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
  }

  .contact-form-container h2::after {
    content: '';
    position: absolute;
    bottom: 0;
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
    box-sizing: border-box;
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
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

   .contact-form button:disabled {
       opacity: 0.6;
       cursor: not-allowed;
   }

  .success-message {
    text-align: center;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    color: var(--text);
  }

  .success-message svg {
       fill: var(--primary);
  }

  .success-message p {
    font-size: 1.2rem;
    color: inherit;
  }

   .error-message {
       color: #dc3545; /* Bootstrap danger red */
       font-weight: 500;
   }


  .map-section {
    height: 450px;
    overflow: hidden;
    position: relative;
  }

  .map-container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .map-section iframe {
    display: block;
    width: 100%;
    height: 100%;
  }

  .directions-link {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: #111111;
    color: white;
    padding: 10px 25px 10px 20px; /* Increased right padding */
    border-radius: 5px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 0.9rem; /* Kept font size from original contact page code */
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border: none;
    cursor: pointer;
  }

  .directions-link:hover {
    background-color: #222222;
  }

  /* Responsive Styles */
  @media screen and (max-width: 992px) {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 3rem; /* Space between the info block and the form block */
    }
     /* Explicit margin bottom for the info block when stacked */
    .contact-info {
       margin-bottom: 3rem; /* Match the grid gap for clear separation */
    }

     .contact-form-container h2 {
         left: 50%;
         transform: translateX(-50%);
         text-align: center;
     }
      .contact-form-container h2::after {
         left: 50%;
         transform: translateX(-50%);
     }
  }

  @media screen and (max-width: 768px) {
    .contact-hero h1 {
      font-size: 2.5rem;
    }

    .contact-hero p {
      font-size: 1.2rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .contact-form-container {
      padding: 1.5rem;
    }

    .contact-section {
      padding: 3rem 1.5rem;
    }

    .contact-grid {
      gap: 2rem;
    }

    .info-card {
      padding: 1rem;
    }

    .icon {
      min-width: 40px;
      height: 40px;
    }

    .info-content h3 {
      font-size: 1.2rem;
    }

    .info-content p {
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .contact-form-container h2 {
      font-size: 1.8rem;
      padding-bottom: 10px;
    }

    .contact-form-container h2::after {
      width: 40px;
    }

    label, input, textarea, .contact-form button {
      font-size: 1.1rem;
    }

    .success-message p {
      font-size: 1.2rem;
    }

    .map-section {
      height: 350px;
    }

    .contact-info {
      margin-bottom: 2rem;
    }

    .directions-link {
      bottom: 15px;
      right: 15px;
      padding: 8px 20px 8px 16px;
      font-size: 1.1rem;
    }
  }

   @media screen and (max-width: 480px) {
       .contact-hero h1 {
           font-size: 2.2rem;
       }
       .contact-form-container h2 {
           font-size: 1.6rem;
       }
       .info-card {
           padding: 1rem;
           gap: 1rem;
       }
        .icon {
            min-width: 40px;
            height: 40px;
        }
         .info-content h3 {
             font-size: 1.1rem;
             margin-bottom: 0.3rem;
         }
          .info-content p {
              margin-bottom: 2rem;
              font-size: 1rem;
          }
           label, input, textarea, .contact-form button {
               font-size: 1rem;
           }
            .success-message p {
                font-size: 1.1rem;
            }

       .contact-grid {
          gap: 3rem;
       }
       .contact-info {
          margin-bottom: 1.5rem;
       }
       .contact-section {
          padding: 2rem 1rem;
       }
        .map-section {
          height: 300px;
        }
        .directions-link {
           bottom: 10px;
           right: 10px;
           padding: 6px 18px 6px 12px;
           font-size: 1rem;
       }
   }

   /* Removed styles for directions-popup and navigation-buttons */

  .contact-link {
    color: var(--text);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .contact-link:hover {
    color: var(--primary);
  }
</style>