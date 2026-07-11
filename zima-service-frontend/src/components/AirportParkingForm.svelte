<script>
  import { createEventDispatcher } from 'svelte';
  import PersonalInfoForm from './PersonalInfoForm.svelte';
  import PriceCalculator from './PriceCalculator.svelte';
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
    // Airport parking specific
    startDate: formatDate(today),
    startTime: '12:00',
    endDate: formatDate(today),
    endTime: '12:00',
    cars: [{ licensePlate: '', carWashPackage: 'none', passengers: '1' }],
    
    // Personal info (will be bound from PersonalInfoForm)
    firstName: '',
    lastName: '',
    email: '',
    phone: '' // Ensure phone is initialized as empty string
  };
  
  // Ensure formData.phone is always a string to prevent undefined errors
  $: if (formData.phone === undefined) formData.phone = '';
  
  // Make sure formData is reactive
  $: console.log('Form data updated:', formData);
  
  // Form validation
  let formErrors = {
    cars: [{ licensePlate: '', passengers: '' }],
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
    formErrors.cars = formData.cars.map(() => ({ licensePlate: '', passengers: '' }));
    formErrors.firstName = '';
    formErrors.lastName = '';
    formErrors.email = '';
    formErrors.phone = '';
    
    // Validate service-specific fields for each car
    formData.cars.forEach((car, index) => {
      if (!car.licensePlate.trim()) {
        formErrors.cars[index].licensePlate = content[currentLang].bookingForm.airportParking.licensePlateRequired || 'Rendszám megadása kötelező';
        isValid = false;
      }
      
      const numPassengers = parseInt(car.passengers);
      if (isNaN(numPassengers) || numPassengers < 1 || numPassengers > 20) {
        formErrors.cars[index].passengers = content[currentLang].bookingForm.airportParking.passengersRequired || 'Utasok száma kötelező';
        isValid = false;
      }
    });
    
    // Validate personal info fields
    if (!formData.firstName.trim()) {
      formErrors.firstName = content[currentLang].bookingForm.firstNameRequired;
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      formErrors.lastName = content[currentLang].bookingForm.lastNameRequired;
      isValid = false;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      formErrors.email = content[currentLang].bookingForm.emailRequired;
      isValid = false;
    }
    
    if (!formData.phone.trim() || formData.phone.length < 8) {
      formErrors.phone = content[currentLang].bookingForm.phoneRequired;
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
  async function handleSubmit() {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }
    
    isSubmitting = true;
    
    // Create booking details object to pass to the parent component
    const bookingDetails = {
      service: 'airportParking',
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      // Include both nested and root level contact info for compatibility
      contact: {
        email: formData.email,
        phone: formData.phone
      },
      // Also include email/phone at root level
      email: formData.email,
      phone: formData.phone,
      // Date and time information
      date: `${formData.startDate} ${formData.startTime} - ${formData.endDate} ${formData.endTime}`,
      // Include dates and times as separate fields for Google Sheets
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      // Add arrival/departure fields for better readability
      arrivalDate: formData.startDate,
      departureDate: formData.endDate,
      arrivalTime: formData.startTime,
      departureTime: formData.endTime,
      // Other booking details
      // Other booking details
      days: calculatedPrices.parkingDays,
      cars: formData.cars,
      numberOfCars: formData.cars.length,
      licensePlate: formData.cars.map(c => c.licensePlate).join(', '),
      passengers: formData.cars.reduce((sum, car) => sum + parseInt(car.passengers || 0), 0).toString(),
      // Add timestamps
      createdAt: new Date().toISOString()
    };
    
    // Check if any car has a wash package
    const hasCarWash = formData.cars.some(c => c.carWashPackage !== 'none');
    
    if (hasCarWash) {
      bookingDetails.carWashPackage = 'multiple';
      bookingDetails.carWashPackageName = formData.cars
        .filter(c => c.carWashPackage !== 'none')
        .map(c => `${c.licensePlate || 'Car'}: ${content[currentLang].bookingForm.airportParking.carWashOptions[c.carWashPackage]}`)
        .join(', ');
      
      // Use the calculated prices from the PriceCalculator
      bookingDetails.priceBreakdown = {
        parkingTotal: calculatedPrices.parkingTotal,
        carWashStandard: calculatedPrices.carWashStandard,
        carWashDiscount: calculatedPrices.carWashDiscount,
        carWashDiscounted: calculatedPrices.carWashDiscounted
      };
      
      bookingDetails.totalPrice = calculatedPrices.totalPrice;
    } else {
      bookingDetails.carWashPackage = 'none';
      bookingDetails.carWashPackageName = 'None';
      // Only parking, no car wash - still use calculated price
      bookingDetails.priceBreakdown = {
        parkingTotal: calculatedPrices.parkingTotal,
        carWashStandard: 0,
        carWashDiscount: 0,
        carWashDiscounted: 0
      };
      
      bookingDetails.totalPrice = calculatedPrices.totalPrice;
    }

    // The actual API call is handled by the parent component (Booking.svelte)
    // We just need to dispatch the validated booking details
    dispatch('bookingComplete', bookingDetails);
    isSubmitting = false;
  }
  function addCar() {
    if (formData.cars.length < 5) {
      formData.cars = [...formData.cars, { licensePlate: '', carWashPackage: 'none', passengers: '1' }];
      formErrors.cars = [...formErrors.cars, { licensePlate: '', passengers: '' }];
    }
  }

  function removeCar(index) {
    formData.cars = formData.cars.filter((_, i) => i !== index);
    formErrors.cars = formErrors.cars.filter((_, i) => i !== index);
  }
</script>

<form class="booking-form" on:submit|preventDefault>
  <h2 class="form-title">{currentLang === 'hu' ? 'REPÜLŐTÉRI PARKOLÁS FOGLALÁS' : 'AIRPORT PARKING BOOKING'}</h2>
  <div class="form-section">
    <div class="form-row">
      <h3>{content[currentLang].bookingForm.airportParking.dateRange}</h3>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <CustomDatePicker
          value={formData.startDate}
          minDate={formatDate(today)}
          maxDate={formatDate(maxDate)}
          disabledDates={[]}
          label={content[currentLang].bookingForm.airportParking.startDate}
          {currentLang}
          on:change={(e) => {
            formData.startDate = e.detail;
            // Update endDate min if startDate is after endDate
            if (formData.startDate > formData.endDate) {
              formData.endDate = formData.startDate;
            }
          }}
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
        <CustomDatePicker
          value={formData.endDate}
          minDate={formData.startDate || formatDate(today)}
          maxDate={formatDate(maxDate)}
          disabledDates={[]}
          label={content[currentLang].bookingForm.airportParking.endDate}
          {currentLang}
          on:change={(e) => {
            formData.endDate = e.detail;
          }}
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
    
    {#each formData.cars as car, index}
      {#if index > 0}
        <div class="car-header">
          <h4>{currentLang === 'hu' ? `Autó ${index + 1}` : `Car ${index + 1}`}</h4>
          <button type="button" class="remove-car-btn" on:click={() => removeCar(index)}>
            ✕ {currentLang === 'hu' ? 'Eltávolítás' : 'Remove'}
          </button>
        </div>
      {/if}
      <div class="form-row">
        <div class="form-group">
          <label for={`licensePlate_${index}`}>
            {content[currentLang].bookingForm.airportParking.licensePlate} {index > 0 ? `(${index + 1})` : ''}
          </label>
          <input
            type="text"
            id={`licensePlate_${index}`}
            bind:value={car.licensePlate}
            required
            placeholder={currentLang === 'hu' ? 'Adja meg rendszámát' : 'Enter your license plate'}
          />
          {#if formErrors.cars && formErrors.cars[index] && formErrors.cars[index].licensePlate}
            <p class="error-message">{formErrors.cars[index].licensePlate}</p>
          {/if}
        </div>

        <div class="form-group">
          <label for={`passengers_${index}`}>
            {content[currentLang].bookingForm.airportParking.passengers} {index > 0 ? `(${index + 1})` : ''}
          </label>
          <input
            type="number"
            id={`passengers_${index}`}
            bind:value={car.passengers}
            min="1"
            max="20"
            required
            placeholder={currentLang === 'hu' ? 'Adja meg az utasok számát' : 'Enter number of passengers'}
          />
          {#if formErrors.cars && formErrors.cars[index] && formErrors.cars[index].passengers}
            <p class="error-message">{formErrors.cars[index].passengers}</p>
          {/if}
        </div>
      </div>
    {/each}

    {#if formData.cars.length < 5}
      <div class="add-car-container">
        <button type="button" class="add-car-btn" on:click={addCar}>
          + {currentLang === 'hu' ? 'További autó hozzáadása' : 'Add additional cars'}
        </button>
      </div>
    {/if}
    
    <div class="form-row car-wash-addon">
      <h3 style="grid-column: 1 / -1;">{content[currentLang].bookingForm.airportParking.addCarWash}</h3>

      {#each formData.cars as car, index}
        <div class="form-group">
          <label for={`carWashPackage_${index}`}>
            {content[currentLang].bookingForm.airportParking.carWashOptions.title} 
            ({car.licensePlate || (currentLang === 'hu' ? `${index + 1}. autó` : `Car ${index + 1}`)})
          </label>
          <select id={`carWashPackage_${index}`} bind:value={car.carWashPackage}>
            <option value="none">{content[currentLang].bookingForm.airportParking.carWashOptions.none}</option>
            <option value="smartInteriorExterior">{content[currentLang].bookingForm.airportParking.carWashOptions.smartInteriorExterior}</option>
            <option value="premiumInteriorExterior">{content[currentLang].bookingForm.airportParking.carWashOptions.premiumInteriorExterior}</option>
          </select>
        </div>
      {/each}
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
    <button type="button" class="btn btn-primary" on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting 
        ? content[currentLang].bookingForm.processing 
        : content[currentLang].bookingForm.submit}
    </button>
  </div>
</form>

<style>
  .form-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
  }

  .booking-form {
    width: 100%;
  }
  
  .form-section {
    margin-bottom: 4rem;
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
    margin-bottom: 2.5rem;
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
    background-color: rgba(27, 42, 75, 0.7);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  .car-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed rgba(0,0,0,0.1);
  }
  
  .car-header h4 {
    margin: 0;
    color: rgba(27, 42, 75, 0.7);
  }
  
  .remove-car-btn {
    background: none;
    border: none;
    color: #e53e3e;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .remove-car-btn:hover {
    text-decoration: underline;
  }
  
  .add-car-container {
    text-align: center;
  }
  
  .add-car-btn {
    background-color: transparent;
    border: 2px dashed rgb(45, 68, 115);
    color: rgb(45, 68, 115);
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
  }
  
  .add-car-btn:hover {
    background-color: rgba(45, 68, 115, 0.05);
  }
  
  .car-wash-addon {
    margin-top: 0.5rem;
    padding: 1.5rem;
    background-color: rgba(0, 186, 229, 0.05);
    border-left: 3px solid rgba(27, 42, 75, 0.7);
  }
  
  .car-wash-addon h3 {
    margin-bottom: 1rem;
  }
  
  .car-wash-addon h3::after {
    display: none;
  }
  
  label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #475569;
    font-weight: 600;
  }
  
  input, select {
    padding: 1rem 1.25rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
    width: 100%;
  }
  
  input:focus, select:focus {
    border-color: rgb(45, 68, 115);
    background-color: white;
    box-shadow: 0 4px 12px rgba(45, 68, 115, 0.15);
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
    white-space: nowrap;
    max-width: 100%;
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    min-width: 200px;
    background-color: rgb(27, 42, 75);
    border-radius: 50px;
    border: none;
    color: white;
    transition: all 0.3s ease;
  }

  .form-submit button:hover:not(:disabled) {
    background-color: rgb(45, 68, 115);
    transform: translateY(-2px);
  }
  
  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .car-wash-addon {
    transition: all 0.3s ease;
  }
  .car-wash-addon:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  }
</style>