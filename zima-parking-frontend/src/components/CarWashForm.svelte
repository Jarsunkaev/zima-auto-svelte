<script>
    import { createEventDispatcher } from 'svelte';
    import PersonalInfoForm from './PersonalInfoForm.svelte';
    import TimeSlotSelector from './TimeSlotSelector.svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import CustomDatePicker from './CustomDatePicker.svelte';
    
    // Component props
    export let content = {};
    export let currentLang = 'hu';
    
    // Initialize event dispatcher
    const dispatch = createEventDispatcher();
    
    // Calendar data
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Allow bookings 3 months in advance
    
    // Form data
    let formData = {
      // Car wash specific
      bookingDate: formatDate(today),
      bookingTime: '',
      
      // Personal info (will be bound from PersonalInfoForm)
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      acceptPrivacy: false
    };
    
    // Form validation
    let formErrors = {
      bookingTime: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      acceptPrivacy: ''
    };
    
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
    
    // Handle date change from custom datepicker
    function handleDateChange(event) {
      formData.bookingDate = event.detail;
      formErrors.bookingDate = '';
    }
    
    // Handle time selection from TimeSlotSelector
    function handleTimeSelected(event) {
      formData.bookingTime = event.detail;
      formErrors.bookingTime = ''; // Clear error on selection
    }
    
    // Form validation function
    function validateForm() {
      let isValid = true;
      
      // Reset errors
      formErrors.bookingTime = '';
      
      // Validate date is selected
      if (!formData.bookingDate) {
        formErrors.bookingDate = currentLang === 'hu' 
          ? 'Kérjük válasszon dátumot' 
          : 'Please select a date';
        isValid = false;
      }
      
      // Validate time slot is selected
      if (!formData.bookingTime) {
        formErrors.bookingTime = content[currentLang].bookingForm.selectTimeSlot;
        isValid = false;
      }
      
      return isValid;
    }
    
    // Handle form submission
    function handleSubmit() {
      if (!validateForm()) {
        // Scroll to the first error message if validation fails
        setTimeout(() => {
          const firstError = document.querySelector('.error-message');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
        return;
      }
      
      isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        // Create booking details object to pass to the parent component
        const bookingDetails = {
          service: 'carWash',
          name: `${formData.lastName} ${formData.firstName}`,
          contact: {
            email: formData.email,
            phone: formData.phone
          },
          date: formData.bookingDate,
          time: formData.bookingTime,
          notes: formData.notes
        };
        
        isSubmitting = false;
        
        // Dispatch event to notify parent component
        dispatch('bookingComplete', bookingDetails);
      }, 1500);
    }
  </script>
  
  <form class="booking-form" on:submit|preventDefault={handleSubmit}>
    <h2 class="form-title">{currentLang === 'hu' ? 'AUTÓMOSÁS IDŐPONTFOGLALÁS' : 'CAR WASH BOOKING'}</h2>
    <div class="form-section">
      <h3>{content[currentLang].bookingForm.carWash.dateTime || (currentLang === 'hu' ? 'Időpont kiválasztása' : 'Select Date & Time')}</h3>
      <div class="date-time-selector">
        <CustomDatePicker
          value={formData.bookingDate}
          minDate={formatDate(today)}
          maxDate={formatDate(maxDate)}
          disabledDates={[]}
          disableSundays={true}
          label={content[currentLang].bookingForm.carWash.date || (currentLang === 'hu' ? 'Dátum' : 'Date')}
          errorMessage={formErrors.bookingDate}
          {currentLang}
          on:change={handleDateChange}
        />
      </div>
    </div>
    
    <TimeSlotSelector 
      selectedTime={formData.bookingTime} 
      content={content} 
      currentLang={currentLang} 
      errorMessage={formErrors.bookingTime}
      formType="carWash"
      date={formData.bookingDate}
      on:timeSelected={handleTimeSelected}
    />
    
    <PersonalInfoForm 
      bind:formData={formData}
      bind:formErrors={formErrors}
      content={content}
      currentLang={currentLang}
      {isSubmitting}
    />
    
    <div class="form-section">
      <h3>{content[currentLang]?.bookingForm?.carWash?.notes || (currentLang === 'hu' ? 'Megjegyzés' : 'Additional Notes')}</h3>
      <div class="form-group">
        <textarea
          id="notes"
          bind:value={formData.notes}
          rows="4"
          placeholder={currentLang === 'hu' ? 'Megjegyzés, speciális kérések (opcionális)' : 'Special requests or additional notes (optional)'}
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
        {#if formErrors.acceptPrivacy}
          <p class="error-message">{formErrors.acceptPrivacy}</p>
        {/if}
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="submit-button" disabled={isSubmitting}>
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
      font-size: 1.5rem;
      font-weight: bold;
      text-transform: uppercase;
    }

    .form-section h3 {
      text-align: center;
      margin-bottom: 3rem;
    padding-bottom: 2rem;
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
      width: 100%;
    }
    
    .form-section h3 {
      font-size: 1.3rem;
      margin-bottom: 2rem;
      color: var(--text);
      position: relative;
    }

    .form-section h3::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: rgba(27, 42, 75, 0.7);
    }
    
  
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group:last-child {
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #475569;
    font-weight: 600;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
    }
    
    input:focus, textarea:focus {
      border-color: rgb(45, 68, 115);
    background-color: white;
      outline: none;
      box-shadow: 0 4px 12px rgba(45, 68, 115, 0.15);
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    
    .privacy-checkbox {
      margin-top: 1rem;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
    
    .privacy-link {
      color: rgba(27, 42, 75, 0.7);
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
      background-color: rgb(27, 42, 75);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 50px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      width: 100%;
      max-width: 400px;
    white-space: nowrap;
    }
    
    .submit-button:hover:not(:disabled) {
      background-color: rgb(45, 68, 115);
    }
    
    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @media screen and (max-width: 768px) {
      .booking-form {
        max-width: 100%;
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
  
  .form-submit button {
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    min-width: 200px;
    background-color: rgb(45, 68, 115);
    border-radius: 50px;
    border: none;
    color: white;
    transition: all 0.3s ease;
  }

  .form-submit button:hover:not(:disabled) {
    background-color: rgb(45, 68, 115);
    transform: translateY(-2px);
  }

  .service-option, .package-option {
    transition: all 0.3s ease;
  }
  .service-option:hover, .package-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  }
</style>