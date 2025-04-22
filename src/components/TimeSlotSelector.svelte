<script>
  // Component props
  export let selectedTime = '';
  export let content = {};
  export let currentLang = 'hu';
  export let errorMessage = '';
  export let formType = '';
  export let date = ''; // New prop for the selected date
  
  // Import Svelte utilities
  import { createEventDispatcher, onMount } from 'svelte';
  
  // Define the dispatch function
  const dispatch = createEventDispatcher();
  
  // All possible time slots
  const allTimeSlots = {
    morning: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00']
  };
  
  // State for available/unavailable slots
  let availableTimeSlots = { ...allTimeSlots };
  let unavailableTimeSlots = [];
  let isLoading = false;
  let errorFetching = '';
  
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
      
      // In a real application, use the actual API URL
      const apiUrl = `/api/available-slots?date=${date}&service=${service}`;
      
      console.log(`Fetching available slots from: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update unavailable slots
        unavailableTimeSlots = data.unavailableSlots || [];
        
        // Filter the slots to show only available ones
        const morningSlots = allTimeSlots.morning.filter(
          time => !unavailableTimeSlots.includes(time)
        );
        
        const afternoonSlots = allTimeSlots.afternoon.filter(
          time => !unavailableTimeSlots.includes(time)
        );
        
        availableTimeSlots = {
          morning: morningSlots,
          afternoon: afternoonSlots
        };
        
        // If the previously selected time is no longer available, clear it
        if (selectedTime && unavailableTimeSlots.includes(selectedTime)) {
          selectedTime = '';
          dispatch('timeSelected', '');
        }
      } else {
        errorFetching = data.message || 'Failed to fetch available slots';
      }
    } catch (err) {
      console.error('Error fetching available time slots:', err);
      errorFetching = 'Could not fetch available time slots. Please try again.';
    } finally {
      isLoading = false;
    }
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
    fetchAvailableSlots();
  }
  
  // Also fetch on mount
  onMount(() => {
    if (date) {
      fetchAvailableSlots();
    }
  });
</script>

<div class="form-row">
  <h4>
    {content[currentLang].bookingForm[formType]?.time || 'Select a time'}
  </h4>

  {#if isLoading}
    <div class="loading-indicator">
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
      <div class="time-slot-group">
        <h5>{content[currentLang].bookingForm.timeSlots.morning}</h5>
        <div class="time-slots">
          {#each allTimeSlots.morning as time}
            <button
              type="button"
              class="time-slot {selectedTime === time ? 'selected' : ''} {unavailableTimeSlots.includes(time) ? 'unavailable' : ''}"
              on:click={() => selectTimeSlot(time)}
              disabled={unavailableTimeSlots.includes(time)}
            >
              {time}
            </button>
          {/each}
        </div>
      </div>

      <div class="time-slot-group">
        <h5>{content[currentLang].bookingForm.timeSlots.afternoon}</h5>
        <div class="time-slots">
          {#each allTimeSlots.afternoon as time}
            <button
              type="button"
              class="time-slot {selectedTime === time ? 'selected' : ''} {unavailableTimeSlots.includes(time) ? 'unavailable' : ''}"
              on:click={() => selectTimeSlot(time)}
              disabled={unavailableTimeSlots.includes(time)}
            >
              {time}
            </button>
          {/each}
        </div>
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
  }

  /* Time slots */
  .time-slots-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .time-slot-group h5 {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
    color: var(--text);
  }

  .time-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.8rem;
  }

  .time-slot {
    padding: 0.6rem 0.5rem;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
  }

  .time-slot:hover:not(.unavailable) {
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  .time-slot.selected {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .time-slot.unavailable {
    background-color: #f0f0f0;
    color: #aaa;
    cursor: not-allowed;
    border-color: #ddd;
    text-decoration: line-through;
  }

  .time-slot.unavailable:hover {
    transform: none;
    border-color: #ddd;
  }

  .error-message {
    color: #e53e3e;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .loading-indicator, .error-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-radius: 5px;
    margin: 1rem 0;
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
    padding: 0.4rem 1rem;
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
    }
  }
</style>