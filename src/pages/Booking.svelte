<svelte:options tag={null} />

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

  // Import translations
  import { content } from '../lib/i18n/booking-content';

  // State variables
  let currentStep = 1;
  let selectedService = null;
  let showConfirmation = false;
  let bookingDetails = {}; // Stores data for confirmation display
  let isSubmitting = false; // Indicates if backend submission is in progress
  let submitError = null; // Stores error message from backend submission
  let submitSuccess = false; // Indicates successful backend submission

  // Define the backend API URL
  // Ensure this matches your backend server address and port
  const backendApiUrl = 'http://localhost:3001/api/send-booking-emails';

  // Handle service selection (Step 1 -> Step 2)
  function selectService(service) {
    selectedService = service;
    currentStep = 2;
    // Reset submission state and messages when moving to form
    submitError = null;
    submitSuccess = false;
    isSubmitting = false; // Ensure submitting state is false when starting a new form

    // Scroll to the form section for better UX
    setTimeout(() => {
      const bookingFormSection = document.querySelector('.booking-form-section');
      if (bookingFormSection) {
        // Scroll to the top of the form section, offset slightly
        window.scrollTo({
          top: bookingFormSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }, 50); // Small delay to allow DOM to update
  }

  // Go back to service selection (Step 2 -> Step 1)
  function goBack() {
    currentStep = 1;
    selectedService = null; // Reset selected service when going back
    // Clear submission state and messages
    submitError = null;
    submitSuccess = false;
    isSubmitting = false; // Ensure submitting state is false when going back

    // Scroll back to service selection section
    setTimeout(() => {
      const serviceSelectionSection = document.querySelector('.service-selection-section');
      if (serviceSelectionSection) {
        window.scrollTo({
          top: serviceSelectionSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }, 50); // Small delay
  }

  // Handle form submission result from individual service forms
  // This function receives the validated form data from the child components
  async function handleBookingComplete(event) {
    const formData = event.detail; // Data dispatched from the child form component
    console.log('Booking.svelte received bookingComplete event with data:', formData);

    isSubmitting = true; // Start submission process
    submitError = null; // Clear previous errors
    submitSuccess = false; // Reset success state
    showConfirmation = false; // Hide confirmation while submitting

    try {
      // Prepare data structure expected by the backend email endpoint
      // Map fields from the received formData to the backend's expected structure
      const emailData = {
        service: formData.service, // Service type (e.g., 'carWash', 'airportParking')
        customerName: formData.name, // Full name
        // Access email/phone from the nested contact object
        customerEmail: formData.contact?.email,
        customerPhone: formData.contact?.phone,
        date: formData.date, // Date (YYYY-MM-DD or date range string for parking)
        time: formData.time || '', // Time (HH:MM or empty for parking)

        // Fields specific to Airport Parking (may be undefined for other services)
        days: formData.days || null,
        licensePlate: formData.licensePlate || '', // License plate
        carWashPackage: formData.carWashPackage || 'none', // Car wash package for parking
        priceBreakdown: formData.priceBreakdown || null, // Price details for parking
        totalPrice: formData.totalPrice || null, // Total price

        // Fields specific to Auto/Tire Service (may be undefined for other services)
        serviceType: formData.serviceType || '', // Specific type of auto/tire service
        carModel: formData.carModel || '', // Car model
        notes: formData.notes || '', // Additional notes
        tireCount: formData.tireCount || null, // Number of tires for tire service

        // Always include admin email (ensure this is correct)
        adminEmail: 'jarsunkaev@gmail.com'
      };

      console.log('Booking.svelte sending data to backend API:', emailData);

      // Send data to your backend API endpoint
      const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      // Parse the JSON response from the backend
      const result = await response.json();

      if (response.ok) {
        // Backend reported success (status code 2xx)
        console.log('Backend booking process reported successful:', result);
        bookingDetails = formData; // Store the original form data for the confirmation page
        submitSuccess = true; // Set success state
        submitError = null; // Clear any previous error
        showConfirmation = true; // Show the confirmation page
      } else {
        // Backend reported an error (status code not 2xx)
        console.error('Backend booking process reported failure:', response.status, result.message);
        // Display the error message from the backend if available, otherwise a generic one
        submitError = result.message || ($currentLang === 'hu'
          ? 'Hiba történt a foglalás feldolgozása során.'
          : 'An error occurred during booking processing.');
        submitSuccess = false; // Ensure success state is false
      }
    } catch (error) {
      // An error occurred during the fetch request itself (e.g., network error)
      console.error('Error submitting booking request to backend:', error);
      submitError = $currentLang === 'hu'
        ? 'Hiba történt a szerverhez való kapcsolódás során.'
        : 'An error occurred while connecting to the server.';
      submitSuccess = false; // Ensure success state is false
    } finally {
      // This block always runs after try/catch
      isSubmitting = false; // End submission process
       // If submission was successful, scroll to top to show confirmation
       if (submitSuccess) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
       }
    }
  }

  // Reset booking process to the initial state (Step 1)
  function resetBooking() {
    selectedService = null;
    currentStep = 1;
    showConfirmation = false;
    submitError = null;
    submitSuccess = false;
    isSubmitting = false; // Ensure submitting state is false
    bookingDetails = {}; // Clear previous booking details
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  }

   // Scroll to top on mount
   onMount(() => {
       window.scrollTo({ top: 0, behavior: 'smooth' });
   });

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
             {content[$currentLang].bookingForm[selectedService]?.title || ''}
          </h2>
        </div>

        <div class="booking-form-container">
          {#if submitError}
            <p class="error-message">{submitError}</p>
          {:else if isSubmitting}
            <p class="submitting-message">{$currentLang === 'hu' ? 'Foglalás feldolgozása, kérjük várjon...' : 'Processing booking, please wait...'}</p>
          {/if}

          {#if selectedService === 'airportParking'}
            <AirportParkingForm
              {content}
              currentLang={$currentLang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'carWash'}
            <CarWashForm
              {content}
              currentLang={$currentLang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'autoService'}
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
  /* Remove unused CSS selector */
  .error-message {
    color: #dc3545; /* Red */
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .submitting-message {
    color: #007bff; /* Blue */
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
    background-color: var(--secondary); /* Use your secondary color variable */
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
    color: var(--text); /* Use your text color variable */
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem 0;
  }

   .back-button svg {
       stroke: currentColor; /* Ensure SVG color matches button text color */
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
    background-color: var(--light); /* Use your light color variable */
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  /* Responsive Styles */
  @media screen and (max-width: 992px) {
    .booking-hero h1 {
      font-size: 2.5rem;
    }

    .booking-hero p {
      font-size: 1.1rem;
    }
  }

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