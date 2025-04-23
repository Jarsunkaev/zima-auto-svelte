<script>
  // Component props
  export let selectedTime = '';
  export let content = {};
  export let currentLang = 'hu';
  export let errorMessage = '';
  export let formType = '';
  export let date = ''; // Selected date
  
  // Import Svelte utilities
  import { createEventDispatcher, onMount } from 'svelte';
  
  // Define the dispatch function
  const dispatch = createEventDispatcher();
  
  // Business hours configuration (matches server-side configuration)
  const businessHours = {
    // Format: [opening hour, closing hour] in 24-hour format
    'carWash': [8, 18],       // 8:00 - 18:00
    'autoService': [8, 17],   // 8:00 - 17:00
    'tireService': [8, 17],   // 8:00 - 17:00
    'airportParking': [0, 24] // 24/7 service
  };
  
  // Generate time slots based on business hours for the service type
  function generateTimeSlots(service) {
    const slots = {
      morning: [],
      afternoon: []
    };
    
    const [openingHour, closingHour] = businessHours[service] || [8, 17]; // Default to 8-17 if service not found
    
    // Generate slots every 30 minutes from opening to closing time
    for (let hour = openingHour; hour < closingHour; hour++) {
      const time00 = `${hour.toString().padStart(2, '0')}:00`;
      const time30 = `${hour.toString().padStart(2, '0')}:30`;
      
      // Add slots to morning or afternoon based on the hour
      if (hour < 12) {
        // Morning slots
        slots.morning.push(time00);
        if (hour < closingHour - 1 || (hour === closingHour - 1 && closingHour % 1 === 0)) {
          slots.morning.push(time30);
        }
      } else {
        // Afternoon slots
        slots.afternoon.push(time00);
        if (hour < closingHour - 1 || (hour === closingHour - 1 && closingHour % 1 === 0)) {
          slots.afternoon.push(time30);
        }
      }
    }
    
    return slots;
  }
  
  // State for available/unavailable slots
  let allTimeSlots = { morning: [], afternoon: [] };
  let unavailableTimeSlots = [];
  let isLoading = false;
  let errorFetching = '';
  
  // Update all time slots based on service type
  $: allTimeSlots = generateTimeSlots(formType);
  
  // Function to fetch available slots from the backend
  async function fetchAvailableSlots() {
    if (!date || !formType) return;
    
    isLoading = true;
    errorFetching = '';
    
    try {
      // Map component formType to service type for the API
      const serviceMap = {
        carWash: 'carWash',
        autoService: 'autoService',
        tireService: 'tireService'
      };
      
      const service = serviceMap[formType] || formType;
      
      console.log(`Fetching available slots for: ${service} on ${date}`);
      
      // Use hardcoded URL for simplicity - replace with your actual backend URL
      const apiUrl = `http://localhost:3001/api/available-slots?date=${date}&service=${service}`;
      
      console.log('API URL:', apiUrl);
      
      // Make the API request
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data from API:', data);
      
      if (data.success) {
        // Update unavailable slots
        unavailableTimeSlots = data.unavailableSlots || [];
        
        console.log('Received unavailable time slots:', unavailableTimeSlots);
        
        // If the previously selected time is no longer available, clear it
        if (selectedTime && unavailableTimeSlots.includes(selectedTime)) {
          selectedTime = '';
          dispatch('timeSelected', '');
        }
      } else {
        console.error('API returned error:', data.message);
        errorFetching = data.message || 'Failed to fetch available slots';
      }
    } catch (err) {
      console.error('Error fetching available time slots:', err);
      // Fall back to mock implementation
      errorFetching = 'Could not connect to server. Using mock data instead.';
      
      // Mock implementation - generate random unavailable slots
      unavailableTimeSlots = generateMockUnavailableSlots(date, formType);
      
      console.log('Using mock unavailable time slots:', unavailableTimeSlots);
      
      // If the previously selected time is no longer available, clear it
      if (selectedTime && unavailableTimeSlots.includes(selectedTime)) {
        selectedTime = '';
        dispatch('timeSelected', '');
      }
    } finally {
      isLoading = false;
    }
  }
  
  // Mock function to generate unavailable slots based on date and service
  function generateMockUnavailableSlots(dateStr, service) {
    // Create a deterministic but seemingly random set of unavailable slots
    // by using the hash of the date + service string
    const seed = simpleHash(`${dateStr}-${service}`);
    const rng = createSeededRandom(seed);
    
    // Different services have different typical availability patterns
    const unavailableSlotsCount = {
      'carWash': 5, // Car wash has fewer unavailable slots (high capacity)
      'autoService': 10, // Auto service has more unavailable slots (limited technicians)
      'tireService': 8  // Tire service has medium unavailability 
    };
    
    // Get number of slots to mark as unavailable
    const count = unavailableSlotsCount[service] || 7;
    
    // Create a pool of all time slots
    const allSlotsArray = [...allTimeSlots.morning, ...allTimeSlots.afternoon];
    
    // Pick random slots to mark as unavailable
    const unavailable = [];
    for (let i = 0; i < count; i++) {
      if (allSlotsArray.length === 0) break;
      
      const index = Math.floor(rng() * allSlotsArray.length);
      unavailable.push(allSlotsArray[index]);
      allSlotsArray.splice(index, 1); // Remove this slot from the pool
    }
    
    return unavailable;
  }
  
  // Simple string hash function for seeding random generation
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
  
  // Create a seeded random number generator
  function createSeededRandom(seed) {
    return function() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }
  
  // Function to update the selected time and dispatch an event
  function selectTimeSlot(time) {
    if (unavailableTimeSlots.includes(time)) return; // Do nothing if slot is unavailable
    
    selectedTime = time;
    // Dispatch a custom event to notify the parent component
    dispatch('timeSelected', time);
  }
  
  // Fetch available slots when the date changes
  $: if (date) {
    console.log('Date changed, fetching slots for date:', date);
    fetchAvailableSlots();
  }
  
  // Also fetch on mount
  onMount(() => {
    console.log('TimeSlotSelector mounted. Date:', date, 'Form type:', formType);
    if (date) {
      fetchAvailableSlots();
    }
  });
</script>

<div class="form-row">
  <h4>
    {content[currentLang].bookingForm[formType]?.time || 'Select a time'}
  </h4>

  {#if !date}
    <div class="info-message">
      {currentLang === 'hu' ? 'Kérjük, előbb válasszon dátumot' : 'Please select a date first'}
    </div>
  {:else if isLoading}
    <div class="loading-indicator">
      <div class="loading-spinner"></div>
      <span>{currentLang === 'hu' ? 'Időpontok betöltése...' : 'Loading available times...'}</span>
    </div>
  {:else if errorFetching}
    <div class="error-indicator">
      <span>{errorFetching}</span>
      <button type="button" class="retry-button" on:click={fetchAvailableSlots}>
        {currentLang === 'hu' ? 'Újra próbál' : 'Try again'}
      </button>
    </div>
  {:else}
    <div class="time-slots-container">
      <!-- Morning slots -->
      <div class="time-slot-group">
        <h5>{content[currentLang].bookingForm.timeSlots.morning}</h5>
        
        {#if allTimeSlots.morning.length === 0}
          <p class="no-slots-message">{currentLang === 'hu' ? 'Nincs elérhető időpont' : 'No available slots'}</p>
        {:else}
          <div class="time-slots">
            {#each allTimeSlots.morning as time}
              <button
                type="button"
                class="time-slot {selectedTime === time ? 'selected' : ''} {unavailableTimeSlots.includes(time) ? 'unavailable' : ''}"
                on:click={() => selectTimeSlot(time)}
                disabled={unavailableTimeSlots.includes(time)}
                aria-label="{time} {unavailableTimeSlots.includes(time) ? (currentLang === 'hu' ? '- nem elérhető' : '- unavailable') : ''}"
              >
                {time}
                {#if unavailableTimeSlots.includes(time)}
                  <span class="status-indicator unavailable-indicator"></span>
                {:else}
                  <span class="status-indicator available-indicator"></span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Afternoon slots -->
      <div class="time-slot-group">
        <h5>{content[currentLang].bookingForm.timeSlots.afternoon}</h5>
        
        {#if allTimeSlots.afternoon.length === 0}
          <p class="no-slots-message">{currentLang === 'hu' ? 'Nincs elérhető időpont' : 'No available slots'}</p>
        {:else}
          <div class="time-slots">
            {#each allTimeSlots.afternoon as time}
              <button
                type="button"
                class="time-slot {selectedTime === time ? 'selected' : ''} {unavailableTimeSlots.includes(time) ? 'unavailable' : ''}"
                on:click={() => selectTimeSlot(time)}
                disabled={unavailableTimeSlots.includes(time)}
                aria-label="{time} {unavailableTimeSlots.includes(time) ? (currentLang === 'hu' ? '- nem elérhető' : '- unavailable') : ''}"
              >
                {time}
                {#if unavailableTimeSlots.includes(time)}
                  <span class="status-indicator unavailable-indicator"></span>
                {:else}
                  <span class="status-indicator available-indicator"></span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    
    <div class="legend">
      <div class="legend-item">
        <span class="legend-indicator available-indicator"></span>
        <span>{currentLang === 'hu' ? 'Elérhető' : 'Available'}</span>
      </div>
      <div class="legend-item">
        <span class="legend-indicator unavailable-indicator"></span>
        <span>{currentLang === 'hu' ? 'Foglalt' : 'Unavailable'}</span>
      </div>
      <div class="legend-item">
        <span class="legend-indicator selected-indicator"></span>
        <span>{currentLang === 'hu' ? 'Kiválasztott' : 'Selected'}</span>
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
</div>

<style>
  .form-row {
    margin-bottom: 1.5rem;
  }

  .form-row h4 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--text);
    font-weight: 600;
  }

  /* Time slots */
  .time-slots-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }

  .time-slot-group h5 {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
    color: var(--text);
    font-weight: 600;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.5rem;
  }

  .time-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.8rem;
  }

  .time-slot {
    position: relative;
    padding: 0.6rem 0.5rem;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
  }

  .time-slot:hover:not(.unavailable) {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .time-slot.selected {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
    font-weight: 600;
  }

  .time-slot.unavailable {
    background-color: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
    border-color: #ddd;
  }

  .time-slot.unavailable:hover {
    transform: none;
    border-color: #ddd;
    box-shadow: none;
  }

  /* Indicators */
  .status-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
  }

  .available-indicator {
    background-color: #4CAF50; /* Green */
  }

  .unavailable-indicator {
    background-color: #F44336; /* Red */
  }

  .selected-indicator {
    background-color: var(--primary);
  }

  /* Legend */
  .legend {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
    padding: 0.8rem;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 5px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-light);
  }

  .legend-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  /* Message styles */
  .error-message {
    color: #e53e3e;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .info-message {
    text-align: center;
    color: var(--text-light);
    background-color: rgba(0, 0, 0, 0.03);
    padding: 1.5rem;
    border-radius: 5px;
    font-style: italic;
    margin: 1rem 0;
  }

  .no-slots-message {
    text-align: center;
    color: var(--text-light);
    font-style: italic;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 5px;
    font-size: 0.9rem;
  }

  /* Loading indicator */
  .loading-indicator, .error-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-radius: 5px;
    margin: 1rem 0;
    gap: 1rem;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 186, 229, 0.2);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-indicator span {
    color: var(--text-light);
    font-size: 0.95rem;
  }

  .error-indicator {
    color: #e53e3e;
    gap: 0.8rem;
  }

  .retry-button {
    background-color: transparent;
    border: 1px solid #e53e3e;
    color: #e53e3e;
    padding: 0.5rem 1.2rem;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-button:hover {
    background-color: #e53e3e;
    color: white;
  }

  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .time-slots-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .legend {
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
    }
  }
</style>