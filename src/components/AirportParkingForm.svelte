

<script>
  import { createEventDispatcher } from 'svelte';
  import PersonalInfoForm from './PersonalInfoForm.svelte';
  import PriceCalculator from './PriceCalculator.svelte';
  
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
    // Airport parking specific
    startDate: formatDate(today),
    startTime: '12:00',
    endDate: formatDate(today),
    endTime: '12:00',
    licensePlate: '',
    passengers: '1',
    carWashPackage: 'none',
    
    // Personal info (will be bound from PersonalInfoForm)
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };
  
  // Form validation
  let formErrors = {
    licensePlate: '',
    passengers: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };
  
  let isSubmitting = false;
  
  // Price calculation data - this will be updated by the PriceCalculator component
  let calculatedPrices = {
    parkingDays: 0,
    parkingTotal: 0,
    carWashStandard: 0,
    carWashDiscount: 0,
    carWashDiscounted: 0,
    totalPrice: 0
  };
  
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
  
  function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
  
  // Calculate days correctly considering arrival/departure times
  function calculateDays() {
    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) return 0;

    // Parse dates and times in a consistent manner (e.g., as UTC)
    const start = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
    const end = new Date(`${formData.endDate}T${formData.endTime}:00Z`);

    // Handle edge cases and validation
    if (end <= start) {
      if (formData.startDate === formData.endDate && formData.startTime >= formData.endTime) {
        const todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        if (start >= todayStart) return 1;
        return 0;
      }
      if (parseDate(formData.endDate) < parseDate(formData.startDate)) {
        return 0;
      }
    }

    const diffMilliseconds = end - start;
    const diffHours = diffMilliseconds / (1000 * 60 * 60);
    const days = Math.ceil(diffHours / 24);
    
    // Ensure minimum 1 day if valid
    const todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    if (days <= 0 && end > start && start >= todayStart) {
      return 1;
    }

    return days > 0 ? days : 0;
  }
  
  // Form validation function
  function validateForm() {
    let isValid = true;
    
    // Reset specific errors
    formErrors.licensePlate = '';
    formErrors.passengers = '';
    
    // Validate service-specific fields
    if (!formData.licensePlate.trim()) {
      formErrors.licensePlate = content[currentLang].bookingForm.airportParking.licensePlateRequired;
      isValid = false;
    }
    
    // Validate passengers is a number and within range
    const numPassengers = parseInt(formData.passengers);
    if (isNaN(numPassengers) || numPassengers < 1 || numPassengers > 20) {
      formErrors.passengers = content[currentLang].bookingForm.airportParking.passengersRequired;
      isValid = false;
    }
    
    // Basic validation for date range
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00Z`);
    const todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    
    // Ensure start date is not in the past
    if (startDateTime < todayStart) {
      isValid = false;
    }
    
    // Ensure end date/time is not before start date/time
    if (endDateTime < startDateTime) {
      isValid = false;
    }
    
    // Ensure at least one day is booked
    if (calculateDays() <= 0 && startDateTime < endDateTime) {
      isValid = false;
    }
    
    return isValid;
  }
  
  // This function will be called when the PriceCalculator updates prices
  function handlePriceUpdate(event) {
    calculatedPrices = event.detail;
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
        service: 'airportParking',
        name: `${formData.lastName} ${formData.firstName}`,
        contact: {
          email: formData.email,
          phone: formData.phone
        },
        date: `${formData.startDate} ${formData.startTime} - ${formData.endDate} ${formData.endTime}`,
        days: calculatedPrices.parkingDays,
        licensePlate: formData.licensePlate,
        passengers: formData.passengers
      };
      
      // For car wash package, if selected
      if (formData.carWashPackage !== 'none') {
        bookingDetails.carWashPackage = formData.carWashPackage;
        bookingDetails.carWashPackageName = content[currentLang].bookingForm.airportParking.carWashOptions[formData.carWashPackage];
        
        // Use the calculated prices from the PriceCalculator
        bookingDetails.priceBreakdown = {
          parkingTotal: calculatedPrices.parkingTotal,
          carWashStandard: calculatedPrices.carWashStandard,
          carWashDiscount: calculatedPrices.carWashDiscount,
          carWashDiscounted: calculatedPrices.carWashDiscounted
        };
        
        bookingDetails.totalPrice = calculatedPrices.totalPrice;
      } else {
        // Only parking, no car wash - still use calculated price
        bookingDetails.priceBreakdown = {
          parkingTotal: calculatedPrices.parkingTotal,
          carWashStandard: 0,
          carWashDiscount: 0,
          carWashDiscounted: 0
        };
        
        bookingDetails.totalPrice = calculatedPrices.totalPrice;
      }
      
      isSubmitting = false;
      
      // Dispatch event to notify parent component
      dispatch('bookingComplete', bookingDetails);
    }, 1500);
  }
</script>

<form class="booking-form" on:submit|preventDefault={handleSubmit}>
  <div class="form-section">
    <div class="form-row">
      <h3>{content[currentLang].bookingForm.airportParking.dateRange}</h3>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="startDate">{content[currentLang].bookingForm.airportParking.startDate}</label>
        <input
          type="date"
          id="startDate"
          bind:value={formData.startDate}
          min={formatDate(today)}
          max={formatDate(maxDate)}
          required
        />
      </div>

      <div class="form-group">
        <label for="startTime">{currentLang === 'hu' ? 'Érkezési idő' : 'Arrival time'}</label>
        <input
          type="time"
          id="startTime"
          bind:value={formData.startTime}
          required
        />
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="endDate">{content[currentLang].bookingForm.airportParking.endDate}</label>
        <input
          type="date"
          id="endDate"
          bind:value={formData.endDate}
          min={formData.startDate}
          max={formatDate(maxDate)}
          required
        />
      </div>

      <div class="form-group">
        <label for="endTime">{currentLang === 'hu' ? 'Távozási idő' : 'Departure time'}</label>
        <input
          type="time"
          id="endTime"
          bind:value={formData.endTime}
          required
        />
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="licensePlate">{content[currentLang].bookingForm.airportParking.licensePlate}</label>
        <input
          type="text"
          id="licensePlate"
          bind:value={formData.licensePlate}
          required
          placeholder={currentLang === 'hu' ? 'Adja meg rendszámát' : 'Enter your license plate'}
        />
        {#if formErrors.licensePlate}
          <p class="error-message">{formErrors.licensePlate}</p>
        {/if}
      </div>

      <div class="form-group">
        <label for="passengers">{content[currentLang].bookingForm.airportParking.passengers}</label>
        <input
          type="number"
          id="passengers"
          bind:value={formData.passengers}
          min="1"
          max="20"
          required
          placeholder={currentLang === 'hu' ? 'Adja meg az utasok számát' : 'Enter number of passengers'}
        />
        {#if formErrors.passengers}
          <p class="error-message">{formErrors.passengers}</p>
        {/if}
      </div>
    </div>
    
    <div class="form-row car-wash-addon">
      <h3>{content[currentLang].bookingForm.airportParking.addCarWash}</h3>

      <div class="form-group">
        <label for="carWashPackage">{content[currentLang].bookingForm.airportParking.carWashOptions.title}</label>
        <select id="carWashPackage" bind:value={formData.carWashPackage}>
          <option value="none">{content[currentLang].bookingForm.airportParking.carWashOptions.none}</option>
          <option value="smartInteriorExterior">{content[currentLang].bookingForm.airportParking.carWashOptions.smartInteriorExterior}</option>
          <option value="premiumInteriorExterior">{content[currentLang].bookingForm.airportParking.carWashOptions.premiumInteriorExterior}</option>
        </select>
      </div>
    </div>
    
    <!-- Use the Price Calculator Component with event forwarding -->
    <PriceCalculator 
      formData={formData} 
      calculateDays={calculateDays} 
      content={content}
      currentLang={currentLang}
      on:priceUpdated={handlePriceUpdate}
    />
  </div>
  
  <!-- Use Personal Info Form Component -->
  <PersonalInfoForm 
    bind:formData={formData}
    bind:formErrors={formErrors}
    content={content}
    currentLang={currentLang}
  />
  
  <div class="form-submit">
    <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
      {isSubmitting 
        ? content[currentLang].bookingForm.processing 
        : content[currentLang].bookingForm.submit}
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .form-row h3 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: var(--text);
    position: relative;
    grid-column: 1 / -1;
  }
  
  .form-row h3::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--primary);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  .car-wash-addon {
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: rgba(0, 186, 229, 0.05);
    border-radius: 8px;
    border-left: 3px solid var(--primary);
  }
  
  .car-wash-addon h3 {
    margin-bottom: 1rem;
  }
  
  .car-wash-addon h3::after {
    display: none;
  }
  
  label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    color: var(--text);
    font-weight: 500;
  }
  
  input, select {
    padding: 0.8rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
    width: 100%;
  }
  
  input:focus, select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 186, 229, 0.2);
    outline: none;
  }
  
  .error-message {
    color: #e53e3e;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
  
  .form-submit {
    text-align: center;
    margin-top: 2rem;
  }
  
  .form-submit button {
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    min-width: 200px;
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>