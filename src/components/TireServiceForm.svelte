<svelte:options tag={null} />

<script>
    import { createEventDispatcher } from 'svelte';
    import PersonalInfoForm from './PersonalInfoForm.svelte';
    import TimeSlotSelector from './TimeSlotSelector.svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
  
    const dispatch = createEventDispatcher();
  
    export let content;
    export let currentLang;
  
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
      tireCount: 4,
      notes: ''
    };
  
    let errors = {};
    let isSubmitting = false;
  
    // Create service types with reactive changes on language toggle
    $: serviceTypes = [
      { value: 'change', label: content[currentLang].bookingForm.tireService.serviceOptions.change },
      { value: 'repair', label: content[currentLang].bookingForm.tireService.serviceOptions.repair },
      { value: 'balancing', label: content[currentLang].bookingForm.tireService.serviceOptions.balancing },
      { value: 'storage', label: content[currentLang].bookingForm.tireService.serviceOptions.storage }
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
          service: 'tireService',
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
          tireCount: formData.tireCount,
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
    <div class="form-section">
      <h3>{content[currentLang].bookingForm.tireService.serviceType}</h3>
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
      <h3>{content[currentLang].bookingForm.tireService.dateTime || 'Select Date & Time'}</h3>
      <div class="date-time-selector">
        <label for="booking-date">
          {content[currentLang].bookingForm.carWash.date || 'Date'}
        </label>
        <input
          id="booking-date"
          type="date"
          bind:value={formData.date}
          min={new Date().toISOString().split('T')[0]}
          class:error={errors.date}
        />
        {#if errors.date}
          <p class="error-message">{errors.date}</p>
        {/if}
      </div>
    </div>
  
    <!-- Replace the existing TimeSlotSelector component with this -->
    <div class="time-slot-container" class:error={errors.time}>
        <TimeSlotSelector
        selectedTime={formData.time}
        {content}
        {currentLang}
        formType="tireService"
        date={formData.date}
        on:timeSelected={handleTimeSelected}
        />
        {#if errors.time}
        <p class="error-message">{errors.time}</p>
        {/if}
    </div>
  
    <div class="form-section">
      <h3>{content[currentLang].bookingForm.personalInfo.title}</h3>
      <PersonalInfoForm 
        bind:formData={formData}
        bind:formErrors={errors}
        content={content}
        currentLang={currentLang}
        {isSubmitting}
      />
    </div>
  
    <div class="form-section">
      <h3>{content[currentLang].bookingForm.tireService.carDetails || 'Car Details'}</h3>
      <div class="form-group">
        <label for="carModel">{content[currentLang].bookingForm.tireService.carModel || 'Car Model'}</label>
        <input
          type="text"
          id="carModel"
          bind:value={formData.carModel}
          placeholder={content[currentLang].bookingForm.tireService.carModelPlaceholder || 'e.g. Toyota Corolla 2018'}
        />
      </div>
      <div class="form-group">
        <label for="licensePlate">{content[currentLang].bookingForm.tireService.licensePlate || 'License Plate'}</label>
        <input
          type="text"
          id="licensePlate"
          bind:value={formData.licensePlate}
          placeholder={content[currentLang].bookingForm.tireService.licensePlatePlaceholder || 'e.g. ABC-123'}
        />
      </div>
      <div class="form-group">
        <label for="tireCount">{content[currentLang].bookingForm.tireService.tireCount || 'Number of Tires'}</label>
        <select id="tireCount" bind:value={formData.tireCount}>
          <option value="2">2</option>
          <option value="4">4</option>
        </select>
      </div>
    </div>
  
    <div class="form-section">
      <h3>{content[currentLang].bookingForm.tireService.notes || 'Additional Notes'}</h3>
      <div class="form-group">
        <textarea
          bind:value={formData.notes}
          placeholder={content[currentLang].bookingForm.tireService.notesPlaceholder || 'Any special requests or additional information'}
          rows="4"
        ></textarea>
      </div>
    </div>
  
    <div class="form-actions">
      <button type="submit" class="submit-button" disabled={isSubmitting}>
        {#if isSubmitting}
          <LoadingSpinner size="1rem" color="white" />
          <span>{isSubmitting ? (currentLang === 'hu' ? 'Feldolgozás...' : 'Processing...') : content[currentLang].bookingForm.submit}</span>
        {:else}
          {content[currentLang].bookingForm.submit}
        {/if}
      </button>
    </div>
  </form>
  
  <style>
    .booking-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  
    .form-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  
    .form-section h3 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: var(--text);
    }
  
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
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
  
    input[type="date"],
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    select,
    textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
    }
  
    input[type="date"].error,
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
  
    .form-actions {
      margin-top: 2rem;
      text-align: center;
    }
  
    .submit-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .submit-button:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }
  
    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  
    @media screen and (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
  
      .service-types {
        grid-template-columns: 1fr;
      }
  
      .form-section {
        padding: 1rem;
      }
    }
  </style>