<script>
  import { onMount } from 'svelte';
  import { currentLang } from '../lib/i18n';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';

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
  let lang = 'hu'; // Local state for current language

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  // Define the backend API URL
  // Using environment variable if available, otherwise default to the base URL
  // Use local backend for development, production backend for production
const isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const BACKEND_API_URL = isDevelopment ? 'http://localhost:3001' : (import.meta.env.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev');
  const backendApiUrl = `${BACKEND_API_URL}/api/send-booking-emails`;

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

    // Validate required fields
    if (!formData.contact?.email && !formData.email) {
      console.error('Email is required');
      submitError = 'Email is required';
      isSubmitting = false;
      return;
    }

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
        // Ensure email is available at root level for backward compatibility
        email: formData.contact?.email || formData.email,
        // Access email/phone from the nested contact object or root level
        customerEmail: formData.contact?.email || formData.email,
        customerPhone: formData.contact?.phone || formData.phone,
        // Include phone at root level for compatibility
        phone: formData.contact?.phone || formData.phone,
        date: formData.date, // Date (YYYY-MM-DD or date range string for parking)
        time: formData.time || '', // Time (HH:MM or empty for parking)

        // Include all date-related fields for better backend processing
        startDate: formData.startDate || formData.date?.split(' ')[0],
        endDate: formData.endDate || formData.date?.split(' ')[3],
        startTime: formData.startTime || formData.time || '12:00',
        endTime: formData.endTime || formData.time || '12:00',

        // Fields specific to Airport Parking (may be undefined for other services)
        days: formData.days || (formData.service === 'airportParking' ? 1 : null),
        licensePlate: formData.licensePlate || '', // License plate
        carWashPackage: formData.carWashPackage || 'none', // Car wash package for parking
        priceBreakdown: formData.priceBreakdown || {}, // Price details for parking
        totalPrice: formData.totalPrice || 0, // Total price

        // Fields specific to Auto/Tire Service (may be undefined for other services)
        serviceType: formData.serviceType || '', // Specific type of auto/tire service
        carModel: formData.carModel || '', // Car model
        notes: formData.notes || '', // Additional notes
        tireCount: formData.tireCount || (formData.service === 'tireService' ? 4 : null),
        passengers: formData.passengers || 1, // Number of passengers

        // Always include admin email
        adminEmail: 'ahmedhasimov@zima-auto.com',
        
        // Add timestamps
        createdAt: new Date().toISOString()
      };

      console.log('Sending booking data to backend API:', emailData);

      // Use the environment variable for the API URL with fallback - ensure no trailing slash
      // Use local backend for development, production backend for production
const isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
let apiUrl = isDevelopment ? 'http://localhost:3001' : (import.meta.env.VITE_BACKEND_API_URL || 'https://zima-auto-backend.fly.dev');
      apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl; // Remove trailing slash if present
      console.log('Using API URL:', apiUrl);
      
      // Use the send-booking-emails endpoint directly
      const endpoint = `${apiUrl}/send-booking-emails`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      // Handle response
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      // Parse the JSON response from the backend
      const result = await response.json();
      console.log('Backend response:', result);

      // Handle successful response
      if (result.success && result.data) {
        console.log('Booking successful:', result);
        submitSuccess = true;
        showConfirmation = true;
        
        // Extract data from the response
        const { data } = result;
        
        // Ensure we have all required fields for the confirmation
        bookingDetails = { 
          ...emailData,
          // Use response data first, fallback to form data
          id: data.id || 'N/A',
          referenceNumber: data.referenceNumber || data.id || 'N/A',
          bookingDate: new Date().toLocaleDateString(),
          bookingTime: new Date().toLocaleTimeString(),
          // Ensure name is available at root level for confirmation page
          name: emailData.customerName || emailData.contact?.name || emailData.name || data.contact?.name || '',
          // Ensure contact info is properly structured with fallbacks
          contact: {
            name: data.contact?.name || emailData.contact?.name || emailData.customerName || emailData.name || '',
            email: data.contact?.email || emailData.contact?.email || emailData.email || '',
            phone: data.contact?.phone || emailData.contact?.phone || emailData.phone || '',
            ...emailData.contact
          }
        };
        
        console.log('Booking details prepared:', bookingDetails);
        
        // Scroll to the confirmation section for better UX
        setTimeout(() => {
          const confirmationSection = document.querySelector('.confirmation-section');
          if (confirmationSection) {
            window.scrollTo({
              top: confirmationSection.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        throw new Error(result.message || 'Unknown error from server');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Set error message for display to user
      submitError = error.message || 'Hiba történt a foglalás során. Kérjük, próbálja újra később.';
      
      // Log additional error details for debugging
      console.error('Error details:', error);
      submitError = lang === 'hu'
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
    <h1>{content[lang].title}</h1>
    <p>{content[lang].subtitle}</p>
  </div>
</section>

{#if !showConfirmation}
  {#if currentStep === 1}
    <ServiceSelection
      {content}
      currentLang={lang}
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
            {lang === 'hu' ? 'Vissza' : 'Back'}
          </button>

        </div>

        <div class="booking-form-container">
          {#if submitError}
            <p class="error-message">{submitError}</p>
          {:else if isSubmitting}
            <div class="submitting-overlay">
              <LoadingSpinner size="2rem" color="var(--primary)" />
              <p class="submitting-message">
                {lang === 'hu' ? 'Foglalás feldolgozása, kérjük várjon...' : 'Processing booking, please wait...'}
              </p>
            </div>
          {/if}

          {#if selectedService === 'airportParking'}
            <AirportParkingForm
              {content}
              currentLang={lang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'carWash'}
            <CarWashForm
              {content}
              currentLang={lang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'autoService'}
            <AutoServiceForm
              {content}
              currentLang={lang}
              on:bookingComplete={handleBookingComplete}
            />
          {:else if selectedService === 'tireService'}
            <TireServiceForm
              {content}
              currentLang={lang}
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
    currentLang={lang}
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

  .submitting-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .submitting-message {
    margin-top: 1rem;
    font-size: 1.1rem;
    color: var(--text);
    text-align: center;
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
  }

  @media screen and (max-width: 480px) {
    .booking-hero h1 {
      font-size: 1.8rem;
    }
    .booking-form-container {
      padding: 1rem;
    }
  }
</style>