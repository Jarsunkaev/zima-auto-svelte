<script>
    // Component props
    export let selectedTime = '';
    export let content = {};
    export let currentLang = 'hu';
    export let errorMessage = '';
    
    // Time slots available for selection
    const timeSlots = {
      morning: ['08:00', '09:00', '10:00', '11:00', '12:00'],
      afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00']
    };
    
    // Function to update the selected time and dispatch an event
    function selectTimeSlot(time) {
      selectedTime = time;
      // Dispatch a custom event to notify the parent component
      dispatch('timeSelected', time);
    }
    
    // Import the Svelte dispatch function
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  </script>
  
  <div class="form-row">
    <h4>
      {content[currentLang].bookingForm[$$props.formType]?.time || 'Select a time'}
    </h4>
  
    <div class="time-slots-container">
      <div class="time-slot-group">
        <h5>{content[currentLang].bookingForm.timeSlots.morning}</h5>
        <div class="time-slots">
          {#each timeSlots.morning as time}
            <button
              type="button"
              class="time-slot {selectedTime === time ? 'selected' : ''}"
              on:click={() => selectTimeSlot(time)}
            >
              {time}
            </button>
          {/each}
        </div>
      </div>
  
      <div class="time-slot-group">
        <h5>{content[currentLang].bookingForm.timeSlots.afternoon}</h5>
        <div class="time-slots">
          {#each timeSlots.afternoon as time}
            <button
              type="button"
              class="time-slot {selectedTime === time ? 'selected' : ''}"
              on:click={() => selectTimeSlot(time)}
            >
              {time}
            </button>
          {/each}
        </div>
      </div>
    </div>
  
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
  
    .time-slot:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
  
    .time-slot.selected {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }
  
    .error-message {
      color: #e53e3e;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
  
    /* Responsive styles */
    @media screen and (max-width: 768px) {
      .time-slots-container {
        grid-template-columns: 1fr;
      }
    }
  </style>