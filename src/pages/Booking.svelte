<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';

  // Import component parts
  import ServiceSelection from '../components/ServiceSelection.svelte';
  import AirportParkingForm from '../components/AirportParkingForm.svelte';
  import CarWashForm from '../components/CarWashForm.svelte';
  import AutoServiceForm from '../components/AutoServiceForm.svelte';
  import TireServiceForm from '../components/TireServiceForm.svelte';
  import BookingConfirmation from '../components/BookingConfirmation.svelte';

  // Import translations - KEEPING YOUR ORIGINAL IMPORT
  // NOTE: Ensure this path is correct and booking-content.js exists or is handled
  import { content } from '../lib/i18n/booking-content';

  // State variables
  let currentStep = 1;
  let selectedService = null;
  let showConfirmation = false;
  let bookingDetails = {};
  let isSubmitting = false;
  let submitError = null;
  let submitSuccess = false;

  // Define the backend API URL
  const backendApiUrl = 'http://localhost:3001/api/send-booking-emails';

  // Handle service selection
  function selectService(service) {
    selectedService = service;
    currentStep = 2;
    submitError = null;
    submitSuccess = false;

    // Scroll to the form section
    setTimeout(() => {
      const bookingFormSection = document.querySelector('.booking-form-section');
      if (bookingFormSection) {
        window.scrollTo({
          top: bookingFormSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }, 50);
  }

  // Go back to service selection
  function goBack() {
    currentStep = 1;
    selectedService = null; // Reset selected service when going back
    submitError = null; // <-- Clear error on back
    isSubmitting = false; // <-- Clear submitting state
    // Scroll to service selection
    setTimeout(() => {
      const serviceSelectionSection = document.querySelector('.service-selection-section');
      if (serviceSelectionSection) {
        window.scrollTo({
          top: serviceSelectionSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }, 50);
  }

  // Handle form submission result
  async function handleBookingComplete(event) {
    const finalBookingData = event.detail;
    isSubmitting = true;
    submitError = null;
    submitSuccess = false;
    showConfirmation = false;

    try {
      // Add admin email to the booking data
      const bookingDataWithAdmin = {
        ...finalBookingData,
        adminEmail: 'jarsunkaev@gmail.com'
      };

      const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingDataWithAdmin)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Booking process successful:', result);
        bookingDetails = finalBookingData;
        showConfirmation = true;
        submitSuccess = true;
      } else {
        console.error('Booking process failed on backend:', result.message);
        submitError = result.message || 'An error occurred during booking processing.';
      }
    } catch (error) {
      console.error('Error submitting booking request:', error);
      submitError = 'An error occurred while connecting to the server.';
    } finally {
      isSubmitting = false;
    }
  }

  // Reset booking to start
  function resetBooking() {
    selectedService = null;
    currentStep = 1;
    showConfirmation = false;
    submitError = null;
    submitSuccess = false;
    isSubmitting = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<section class="booking-hero">
  <div class="container">
    <h1>{content[$currentLang].title}</h1>
    <p>{content[$currentLang].subtitle}</p>
  </div>
</section>

{#if !showConfirmation}
  {#if currentStep === 1}
    <ServiceSelection
      {content}
      currentLang={$currentLang}
      onSelectService={selectService}
    />
  {:else if currentStep === 2}
    <section class="booking-form-section">
      <div class="container">
        <div class="booking-header">
          <button class="back-button" on:click={goBack} disabled={isSubmitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {$currentLang === 'hu' ? 'Vissza' : 'Back'}
          </button>

          <h2 class="form-title">
             {content[$currentLang].bookingForm[selectedService]?.title}
          </h2>
        </div>

        <div class="booking-form-container">
          {#if submitError}
            <p class="error-message">{submitError}</p>
          {/if}

          {#if isSubmitting}
            <p class="submitting-message">Processing booking, please wait...</p>
          {:else if selectedService === 'airportParking'}
            <AirportParkingForm
              {content}
              currentLang={$currentLang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'carWash'}
            <CarWashForm  {content}
              currentLang={$currentLang}
              on:bookingComplete={handleBookingComplete}
            /> {:else if selectedService === 'autoService'}
            <AutoServiceForm
              {content}
              currentLang={$currentLang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'tireService'}
            <TireServiceForm
              {content}
              currentLang={$currentLang}
              on:bookingComplete={handleBookingComplete}
            />
          {/if}
        </div>
      </div>
    </section>
  {/if}
{:else}
  <BookingConfirmation
    bookingDetails={bookingDetails}
    {content}
    currentLang={$currentLang}
    resetBooking={resetBooking}
  />
{/if}

<style>
  /* Add styles for success message */
  .success-message {
    color: #28a745;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .error-message {
    color: #dc3545;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .submitting-message {
    color: #007bff;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  /* Disable button when submitting */
  .back-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }

   /* Restore hover/focus styles for non-disabled state */
   .back-button:hover:not(:disabled),
   .back-button:focus:not(:disabled) {
     color: var(--primary);
     transform: translateX(-5px);
     outline: none;
   }


  /* Booking Hero Section */
  .booking-hero {
    background-color: var(--secondary);
    color: white;
    padding: 8rem 2rem 5rem;
    text-align: center;
  }

  .booking-hero h1 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }

  .booking-hero p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
  }

  /* Booking Form Section */
  .booking-form-section {
    padding: 5rem 2rem;
    background-color: white;
  }

  .booking-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem 0;
  }


  .form-title {
    margin-left: 2rem;
    font-size: 1.8rem;
    flex-grow: 1;
    text-align: center;
  }

  .booking-form-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: var(--light);
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  /* Responsive Styles */
  @media screen and (max-width: 768px) {
    .booking-hero h1 {
      font-size: 2.2rem;
    }

    .booking-hero p {
      font-size: 1rem;
    }

    .booking-form-container {
      padding: 1.5rem;
    }

    .booking-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .back-button {
      margin-bottom: 1rem;
    }

    .form-title {
      margin-left: 0;
      text-align: left;
      font-size: 1.5rem;
    }
  }

  @media screen and (max-width: 480px) {
    .booking-hero h1 {
      font-size: 1.8rem;
    }
    .form-title {
      font-size: 1.3rem;
    }
    .booking-form-container {
      padding: 1rem;
    }
  }
</style>