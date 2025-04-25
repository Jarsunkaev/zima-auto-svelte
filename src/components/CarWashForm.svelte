<script>
    import { createEventDispatcher } from 'svelte';
    import PersonalInfoForm from './PersonalInfoForm.svelte';
    import TimeSlotSelector from './TimeSlotSelector.svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    
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
      phone: ''
    };
    
    // Form validation
    let formErrors = {
      bookingTime: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
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
    
    // Handle time selection from TimeSlotSelector
    function handleTimeSelected(event) {
      formData.bookingTime = event.detail;
      formErrors.bookingTime = ''; // Clear error on selection
    }
    
    // Form validation function
    function validateForm() {
      let isValid = true;
      
      // Reset time slot error
      formErrors.bookingTime = '';
      
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
          time: formData.bookingTime
        };
        
        isSubmitting = false;
        
        // Dispatch event to notify parent component
        dispatch('bookingComplete', bookingDetails);
      }, 1500);
    }
  </script>
  
  <form class="booking-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-section">
      <div class="form-row">
        <div class="form-group">
          <label for="bookingDate">{content[currentLang].bookingForm.carWash.date}</label>
          <input
            type="date"
            id="bookingDate"
            bind:value={formData.bookingDate}
            min={formatDate(today)}
            max={formatDate(maxDate)}
            required
          />
        </div>
      </div>
      
      <!-- Replace the existing TimeSlotSelector component with this -->
      <TimeSlotSelector 
        selectedTime={formData.bookingTime} 
        content={content} 
        currentLang={currentLang} 
        errorMessage={formErrors.bookingTime}
        formType="carWash"
        date={formData.bookingDate}
        on:timeSelected={handleTimeSelected}
      />
    
    <!-- Personal Info Form Component -->
    <PersonalInfoForm 
      bind:formData={formData}
      bind:formErrors={formErrors}
      content={content}
      currentLang={currentLang}
      {isSubmitting}
    />
    
    <div class="form-submit">
      <button type="submit" class="submit-button" disabled={isSubmitting}>
        {#if isSubmitting}
          <LoadingSpinner size="1rem" color="white" />
          <span>{content[currentLang].bookingForm.processing}</span>
        {:else}
          {content[currentLang].bookingForm.submit}
        {/if}
      </button>
    </div>
  </form>
  
  <style>
    .booking-form {
      width: 100%;
    }
    
    .form-section {
      margin-bottom: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .form-row {
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.5rem;
    }
    
    label {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
      color: var(--text);
      font-weight: 500;
    }
    
    input {
      padding: 0.8rem 1rem;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      font-size: 1rem;
      transition: all 0.3s ease;
      font-family: inherit;
      width: 100%;
    }
    
    input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(0, 186, 229, 0.2);
      outline: none;
    }
    
    .form-submit {
      text-align: center;
      margin-top: 2rem;
    }
    
    .submit-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2.5rem;
      font-size: 1rem;
      font-weight: 600;
      min-width: 200px;
      background-color: var(--primary);
      color: white;
      border: none;
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
  </style>