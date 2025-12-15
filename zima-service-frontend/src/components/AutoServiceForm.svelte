<script>
  import { createEventDispatcher } from 'svelte';
  import PersonalInfoForm from './PersonalInfoForm.svelte';
  import TimeSlotSelector from './TimeSlotSelector.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import CustomDatePicker from './CustomDatePicker.svelte';

  const dispatch = createEventDispatcher();

  export let content;
  export let currentLang;

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Allow bookings 3 months in advance

  let formData = {
    serviceType: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    carModel: '',
    licensePlate: '',
    notes: '',
    acceptPrivacy: false
  };

  let errors = {};
  let isSubmitting = false;

  // Utility functions
  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // Generate disabled dates (weekends - Saturdays and Sundays) for the next 3 months
  function generateDisabledDates() {
    const disabled = [];
    const start = new Date(today);
    const end = new Date(maxDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = date.getDay();
      if (day === 0 || day === 6) { // Sunday or Saturday
        disabled.push(formatDate(date));
      }
    }
    
    return disabled;
  }

  // Handle date change from custom datepicker
  function handleDateChange(event) {
    formData.date = event.detail;
    errors.date = '';
  }

  $: disabledDates = generateDisabledDates();
  
    // Create service types with reactive changes on language toggle
    $: serviceTypes = [
      { value: 'maintenance', label: content[currentLang].bookingForm.autoService.serviceOptions.maintenance },
      { value: 'repair', label: content[currentLang].bookingForm.autoService.serviceOptions.repair },
      { value: 'diagnostic', label: content[currentLang].bookingForm.autoService.serviceOptions.diagnostic },
      { value: 'other', label: content[currentLang].bookingForm.autoService.serviceOptions.other }
    ];
  
    function validateForm() {
      errors = {};
      let isValid = true;
  
      if (!formData.serviceType) {
        errors.serviceType = currentLang === 'hu' ? 'Kérjük válasszon szolgáltatást' : 'Please select a service type';
        isValid = false;
      }
  
      if (!formData.date) {
        errors.date = currentLang === 'hu' ? 'Kérjük válasszon dátumot' : 'Please select a date';
        isValid = false;
      }

    if (!formData.time) {
      errors.time = currentLang === 'hu' ? 'Kérjük válasszon időpontot' : 'Please select a time';
      isValid = false;
    }

    if (!formData.firstName) {
      errors.firstName = currentLang === 'hu' ? 'Kérjük adja meg a keresztnevét' : 'Please enter your first name';
      isValid = false;
    }

    if (!formData.lastName) {
      errors.lastName = currentLang === 'hu' ? 'Kérjük adja meg a vezetéknevét' : 'Please enter your last name';
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = currentLang === 'hu' ? 'Kérjük adja meg telefonszámát' : 'Please enter your phone number';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = currentLang === 'hu' ? 'Kérjük adja meg email címét' : 'Please enter your email address';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = currentLang === 'hu' ? 'Érvénytelen email cím' : 'Invalid email address';
      isValid = false;
    }

    return isValid;
  }

  function handleTimeSelected(event) {
    formData.time = event.detail;
    errors.time = ''; // Clear error when time is selected
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;
    try {
      const bookingData = {
        service: 'autoService',
        serviceType: formData.serviceType,
        date: formData.date,
        time: formData.time,
        name: `${formData.lastName} ${formData.firstName}`,
        contact: {
          email: formData.email,
          phone: formData.phone
        },
        carModel: formData.carModel,
        licensePlate: formData.licensePlate,
        notes: formData.notes,
        // Add admin email for backend
        adminEmail: 'jarsunkaev@gmail.com'
      };
      
      dispatch('bookingComplete', bookingData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="booking-form">
  <h2 class="form-title">{currentLang === 'hu' ? 'AUTÓSZERVIZ IDŐPONTFOGLALÁS' : 'AUTO SERVICE BOOKING'}</h2>
  <div class="form-section">
    <h3>{content[currentLang].bookingForm.autoService.serviceType}</h3>
    <div class="service-types">
      {#each serviceTypes as type}
        <label class="service-type-option">
          <input
            type="radio"
            name="serviceType"
            value={type.value}
            bind:group={formData.serviceType}
          />
          <span>{type.label}</span>
        </label>
      {/each}
    </div>
    {#if errors.serviceType}
      <p class="error-message">{errors.serviceType}</p>
    {/if}
  </div>

  <div class="form-section">
    <h3>{content[currentLang].bookingForm.autoService.dateTime || 'Select Date & Time'}</h3>
    <div class="date-time-selector">
      <CustomDatePicker
        value={formData.date}
        minDate={formatDate(today)}
        maxDate={formatDate(maxDate)}
        disabledDates={[]}
        disableSundays={true}
        label={content[currentLang].bookingForm.carWash.date || 'Date'}
        errorMessage={errors.date}
        {currentLang}
        on:change={handleDateChange}
      />
    </div>
  </div>

  <!-- Replace the existing TimeSlotSelector component with this -->
  <div class="time-slot-container" class:error={errors.time}>
      <TimeSlotSelector
      selectedTime={formData.time}
      {content}
      {currentLang}
      formType="autoService"
      date={formData.date}
      on:timeSelected={handleTimeSelected}
      />
      {#if errors.time}
      <p class="error-message">{errors.time}</p>
      {/if}
  </div>

  <div class="form-section">
    <PersonalInfoForm 
      bind:formData={formData}
      bind:formErrors={errors}
      content={content}
      currentLang={currentLang}
      {isSubmitting}
    />
  </div>

  <div class="form-section">
    <h3>{content[currentLang].bookingForm.autoService.carDetails || 'Car Details'}</h3>
    <div class="form-group">
      <label for="carModel">{content[currentLang].bookingForm.autoService.carModel || 'Car Model'}</label>
      <input
        type="text"
        id="carModel"
        bind:value={formData.carModel}
        placeholder={content[currentLang].bookingForm.autoService.carModelPlaceholder || 'e.g. Toyota Corolla 2018'}
      />
    </div>
    <div class="form-group">
      <label for="licensePlate">{content[currentLang].bookingForm.autoService.licensePlate || 'License Plate'}</label>
      <input
        type="text"
        id="licensePlate"
        bind:value={formData.licensePlate}
        placeholder={currentLang === 'hu' ? 'Adja meg rendszámát' : 'Enter your license plate'}
      />
    </div>
  </div>

  <div class="form-section">
    <h3>{content[currentLang].bookingForm.autoService.notes || 'Additional Notes'}</h3>
    <div class="form-group">
      <textarea
        id="notes"
        bind:value={formData.notes}
        rows="4"
        placeholder={currentLang === 'hu' ? 'További megjegyzések (opcionális)' : 'Additional notes (optional)'}
      ></textarea>
    </div>
  </div>

  <div class="form-section">
    <div class="form-group privacy-checkbox">
      <label class="checkbox-label">
        <input
          type="checkbox"
          bind:checked={formData.acceptPrivacy}
          required
        />
        <span>
          {currentLang === 'hu' ? 'Elfogadom az ' : 'I accept the '}
          <a href="/privacy" class="privacy-link">
            {currentLang === 'hu' ? 'Adatvédelmi irányelveket' : 'Privacy Policy'}
          </a>
        </span>
      </label>
      {#if errors.acceptPrivacy}
        <p class="error-message">{errors.acceptPrivacy}</p>
      {/if}
    </div>
  </div>

  <div class="form-actions">
    <button
      type="submit"
      class="submit-button"
      disabled={isSubmitting}
    >
      {#if isSubmitting}
        <LoadingSpinner size="1rem" color="white" />
        <span>{currentLang === 'hu' ? 'Feldolgozás...' : 'Processing...'}</span>
      {:else}
        {content[currentLang].bookingForm.submit}
      {/if}
    </button>
  </div>
</form>

<style>
  .form-title {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .form-section h3 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .booking-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .form-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    width: 100%;
  }

  .form-section h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--text);
  }

  .service-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .service-type-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .service-type-option:hover {
    border-color: var(--primary);
    background-color: rgba(0, 186, 229, 0.05);
  }

  .service-type-option input[type="radio"] {
    margin: 0;
  }

  .date-time-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .time-slot-container {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }

  .error {
    border-color: #dc3545;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .privacy-checkbox {
    margin-top: 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.95rem;
  }

  .checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
  }

  .privacy-link {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .privacy-link:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }

  .form-actions {
    margin-top: 2rem;
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
    max-width: 300px;
  }

  .submit-button:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media screen and (max-width: 768px) {
    .booking-form {
      max-width: 100%;
    }

    .service-types {
      grid-template-columns: 1fr;
    }

    .form-section {
      padding: 1.25rem;
    }
    
    .submit-button {
      width: 100%;
      max-width: none;
    }
  }

  @media screen and (max-width: 480px) {
    .form-section {
      padding: 1rem;
    }
  }
</style>