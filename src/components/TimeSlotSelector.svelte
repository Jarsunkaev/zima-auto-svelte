<script>
  // Component props
  export let selectedTime = '';
  export let content = {};
  export let currentLang = 'hu';
  export let errorMessage = '';
  export let formType = '';
  export let date = ''; // Selected date in 'YYYY-MM-DD' format

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
    const [openingHour, closingHour] = businessHours[service] || [8, 17]; // Default to 8-17

    // Handle 24h service edge case (0 to 24 means 0 to 23:xx)
    const endHour = closingHour === 24 ? 23 : closingHour -1;

    for (let hour = openingHour; hour <= endHour; hour++) {
      const time00 = `${hour.toString().padStart(2, '0')}:00`;
      const time30 = `${hour.toString().padStart(2, '0')}:30`;

      if (hour < closingHour) { // Ensure we don't go past closing hour exactly
         if (hour < 12) {
            slots.morning.push(time00);
            // Add 30 min slot unless it's exactly the closing hour
            if (hour < closingHour - 1 || (hour === closingHour -1 && businessHours[service]?.[1] % 1 !== 0.5)) {
                 // Special check for 24h service to include 23:30
                 if (closingHour === 24 || hour < closingHour - 1 || (hour === closingHour -1 && businessHours[service]?.[1] % 1 === 0)) {
                    slots.morning.push(time30);
                 }
            }
         } else {
            slots.afternoon.push(time00);
            // Add 30 min slot unless it's exactly the closing hour
             if (closingHour === 24 || hour < closingHour - 1 || (hour === closingHour -1 && businessHours[service]?.[1] % 1 === 0)) {
                slots.afternoon.push(time30);
             }
         }
      }
    }
     // Special case for 24hr service to include 23:30 if needed, handled above now
     // Ensure closingHour:00 is not added if businessHours ends on the hour like 17:00

    return slots;
  }

  // State for available/unavailable slots
  let allTimeSlots = { morning: [], afternoon: [] };
  let unavailableTimeSlots = [];
  let isLoading = false;
  let errorFetching = '';

  // NEW: State for slots filtered for display (hiding past slots for today)
  let displayableMorningSlots = [];
  let displayableAfternoonSlots = [];

  // --- Helper function to get today's date string ---
  function getTodaysDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // --- End Helper ---

  // --- Reactive block for recalculating displayable slots ---
  $: {
    // Regenerate all slots based on business hours whenever formType changes
    allTimeSlots = generateTimeSlots(formType);

    const todayString = getTodaysDateString();
    const isToday = date === todayString; // Check if selected date is today

    let filterHour = -1;
    let filterMinute = -1;

    if (isToday) {
      const now = new Date();
      filterHour = now.getHours();
      filterMinute = now.getMinutes();
      console.log(`Filtering past slots for today (${date}). Current time: ${filterHour}:${filterMinute.toString().padStart(2, '0')}`);
    } else {
      // console.log('Selected date is not today, showing all generated slots for date:', date);
    }

    // Filter function: returns true if the slot should be displayed
    const filterSlot = (time) => {
      if (!isToday) return true; // Not today, show all generated slots

      const [hour, minute] = time.split(':').map(Number);

      // Keep the slot if its start time is >= current time
      return hour > filterHour || (hour === filterHour && minute >= filterMinute);
    };

    // Apply filter to get the slots we actually want to display
    displayableMorningSlots = allTimeSlots.morning.filter(filterSlot);
    displayableAfternoonSlots = allTimeSlots.afternoon.filter(filterSlot);

    // Note: Fetching available slots (isLoading, unavailableTimeSlots)
    // is handled by the separate `$: if (date)` block below.
    // This block focuses only on filtering based on the current time for today.
  }
  // --- End Reactive block ---


  // Function to fetch available slots from the backend (remains the same)
  async function fetchAvailableSlots() {
    if (!date || !formType) return;

    isLoading = true;
    errorFetching = '';

    try {
      const serviceMap = { carWash: 'carWash', autoService: 'autoService', tireService: 'tireService' };
      const service = serviceMap[formType] || formType;
      console.log(`Workspaceing unavailable slots for: ${service} on ${date}`);
      const apiUrl = `http://localhost:3001/api/available-slots?date=${date}&service=${service}`; // Replace with your actual URL
      console.log('API URL:', apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        // Don't throw error here if you want mock data fallback
        // throw new Error(`API returned status ${response.status}`);
        errorFetching = `API returned status ${response.status}. Using mock data.`; // Set error message
        // Use mock data on API failure
         unavailableTimeSlots = generateMockUnavailableSlots(date, formType);
         console.log('Using mock unavailable time slots due to API error:', unavailableTimeSlots);
      } else {
          const data = await response.json();
          console.log('Received data from API:', data);
          if (data.success) {
            unavailableTimeSlots = data.unavailableSlots || [];
            console.log('Received unavailable time slots:', unavailableTimeSlots);
            // Clear selection if it became unavailable
            if (selectedTime && unavailableTimeSlots.includes(selectedTime)) {
              selectedTime = '';
              dispatch('timeSelected', '');
            }
          } else {
            console.error('API returned error:', data.message);
            errorFetching = data.message || 'Failed to fetch available slots';
             unavailableTimeSlots = generateMockUnavailableSlots(date, formType); // Use mock data on logical API error
             console.log('Using mock unavailable time slots due to API logic error:', unavailableTimeSlots);
          }
      }
    } catch (err) {
      console.error('Error fetching available time slots:', err);
      errorFetching = 'Could not connect to server. Using mock data instead.';
      // Use mock data on network/fetch error
      unavailableTimeSlots = generateMockUnavailableSlots(date, formType);
      console.log('Using mock unavailable time slots due to fetch catch:', unavailableTimeSlots);
      // Clear selection if it became unavailable (based on mock data)
      if (selectedTime && unavailableTimeSlots.includes(selectedTime)) {
        selectedTime = '';
        dispatch('timeSelected', '');
      }
    } finally {
      isLoading = false;
    }
  }

  // Mock function to generate unavailable slots (remains the same)
  function generateMockUnavailableSlots(dateStr, service) {
    const seed = simpleHash(`${dateStr}-${service}`);
    const rng = createSeededRandom(seed);
    const unavailableSlotsCount = { 'carWash': 5, 'autoService': 10, 'tireService': 8 };
    const count = unavailableSlotsCount[service] || 7;
    // Important: Mock should operate on ALL potential slots, not just displayable ones
    const allGeneratedSlots = [...generateTimeSlots(service).morning, ...generateTimeSlots(service).afternoon];
    const unavailable = [];
    for (let i = 0; i < count; i++) {
      if (allGeneratedSlots.length === 0) break;
      const index = Math.floor(rng() * allGeneratedSlots.length);
      unavailable.push(allGeneratedSlots[index]);
      allGeneratedSlots.splice(index, 1);
    }
    return unavailable;
  }

  // Simple string hash function (remains the same)
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  // Create a seeded random number generator (remains the same)
  function createSeededRandom(seed) {
    return function() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }

  // Function to update the selected time and dispatch an event (remains the same)
  function selectTimeSlot(time) {
    if (unavailableTimeSlots.includes(time)) return;
    selectedTime = time;
    dispatch('timeSelected', time);
  }

  // Fetch available slots when the date changes (existing logic)
  $: if (date && formType) { // Added formType check as it influences slots
    console.log('Date or FormType changed, fetching slots for date:', date, 'and type:', formType);
    fetchAvailableSlots();
  }

  // Also fetch on mount (existing logic)
  onMount(() => {
    console.log('TimeSlotSelector mounted. Date:', date, 'Form type:', formType);
    if (date && formType) {
      fetchAvailableSlots();
    }
    // Initial calculation of displayable slots happens via the main reactive block ($:)
  });
</script>

<div class="form-row">
  <h4>
    {content?.[currentLang]?.bookingForm?.[formType]?.time || (currentLang === 'hu' ? 'Időpont kiválasztása' : 'Select a time')}
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
  {:else if errorFetching && !unavailableTimeSlots.length}
    <div class="error-indicator">
       <span>{errorFetching}</span>
       <button type="button" class="retry-button" on:click={fetchAvailableSlots}>
         {currentLang === 'hu' ? 'Újra próbál' : 'Try again'}
       </button>
     </div>
  {:else}
     {#if errorFetching}
        <div class="warning-message">
            {errorFetching}
        </div>
     {/if}
    <div class="time-slots-container">
      <div class="time-slot-group">
        <h5>{content?.[currentLang]?.bookingForm?.timeSlots?.morning || (currentLang === 'hu' ? 'Délelőtt' : 'Morning')}</h5>

        {#if displayableMorningSlots.length === 0}
          <p class="no-slots-message">{currentLang === 'hu' ? 'Nincs elérhető délelőtti időpont' : 'No morning slots available'}</p>
        {:else}
          <div class="time-slots">
            {#each displayableMorningSlots as time (time)}
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

      <div class="time-slot-group">
         <h5>{content?.[currentLang]?.bookingForm?.timeSlots?.afternoon || (currentLang === 'hu' ? 'Délután' : 'Afternoon')}</h5>

        {#if displayableAfternoonSlots.length === 0}
          <p class="no-slots-message">{currentLang === 'hu' ? 'Nincs elérhető délutáni időpont' : 'No afternoon slots available'}</p>
        {:else}
          <div class="time-slots">
             {#each displayableAfternoonSlots as time (time)}
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
        <span>{content?.[currentLang]?.bookingForm?.legend?.available || (currentLang === 'hu' ? 'Elérhető' : 'Available')}</span>
      </div>
      <div class="legend-item">
        <span class="legend-indicator unavailable-indicator"></span>
        <span>{content?.[currentLang]?.bookingForm?.legend?.unavailable || (currentLang === 'hu' ? 'Foglalt' : 'Unavailable')}</span>
      </div>
      <div class="legend-item">
        <span class="legend-indicator selected-indicator"></span>
        <span>{content?.[currentLang]?.bookingForm?.legend?.selected || (currentLang === 'hu' ? 'Kiválasztott' : 'Selected')}</span>
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
    color: var(--text, #333);
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
    color: var(--text, #333);
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
    color: var(--text, #333); /* Ensure text color contrasts with default bg */
    line-height: 1.3; /* Ensure text doesn't touch indicator */
  }

  .time-slot:hover:not(.unavailable):not(:disabled) {
    border-color: var(--primary, #00baf9);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .time-slot.selected {
    background-color: var(--primary, #00baf9);
    color: white;
    border-color: var(--primary, #00baf9);
    font-weight: 600;
  }

  .time-slot.unavailable,
  .time-slot:disabled { /* Style disabled state same as unavailable */
    background-color: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
    border-color: #ddd;
  }

   .time-slot.unavailable:hover,
   .time-slot:disabled:hover {
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

   /* Selected indicator is implicitly handled by the main button style */
   /* We need a specific one for the legend though */
   .selected-indicator {
    background-color: var(--primary, #00baf9);
  }


  /* Legend */
  .legend {
    display: flex;
    justify-content: center;
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    gap: 1rem 1.5rem; /* Row and column gap */
    margin-top: 1.5rem; /* More space */
    padding: 0.8rem;
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.05); /* Subtle border */
    border-radius: 5px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-light, #666);
  }

  .legend-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0; /* Prevent shrinking */
  }

  /* Message styles */
  .error-message {
    color: #e53e3e; /* Red */
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

   .warning-message {
       color: #dd6b20; /* Orange */
       background-color: #fffaf0; /* Light orange background */
       border: 1px solid #fed7d7; /* Orange border */
       padding: 0.8rem 1rem;
       border-radius: 4px;
       font-size: 0.9rem;
       margin-bottom: 1rem;
       text-align: center;
   }


  .info-message {
    text-align: center;
    color: var(--text-light, #666);
    background-color: rgba(0, 0, 0, 0.03);
    padding: 1.5rem;
    border-radius: 5px;
    font-style: italic;
    margin: 1rem 0;
  }

  .no-slots-message {
    text-align: center;
    color: var(--text-light, #666);
    font-style: italic;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 5px;
    font-size: 0.9rem;
    min-height: 40px; /* Ensure it takes some space */
    display: flex;
    align-items: center;
    justify-content: center;
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
    min-height: 100px; /* Ensure minimum height */
    gap: 1rem;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 186, 229, 0.2);
    border-top-color: var(--primary, #00baf9);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-indicator span {
    color: var(--text-light, #666);
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
      grid-template-columns: 1fr; /* Stack morning/afternoon */
      gap: 2rem;
    }

    .legend {
      flex-direction: row; /* Keep horizontal but allow wrap */
      justify-content: space-around; /* Better spacing when wrapped */
      gap: 0.8rem 1rem;
    }

     .time-slots {
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); /* Slightly smaller buttons */
        gap: 0.6rem;
     }
      .time-slot {
          font-size: 0.85rem;
          padding: 0.5rem 0.4rem;
      }

  }
</style>