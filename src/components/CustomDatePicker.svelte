<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let value = ''; // Selected date in YYYY-MM-DD format
  export let minDate = '';
  export let maxDate = '';
  export let disabledDates = []; // Array of date strings that should be disabled
  export let disableSundays = false; // If true, disable all Sundays
  export let disableWeekends = false; // If true, disable all weekends (Sat & Sun)
  export let label = '';
  export let errorMessage = '';
  export let currentLang = 'hu';

  const dispatch = createEventDispatcher();

  let isOpen = false;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let calendarRef;
  let calendarDays = [];

  // Month names in Hungarian and English
  const monthNames = {
    hu: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  const dayNames = {
    hu: ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V'], // Monday to Sunday
    en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] // Monday to Sunday
  };

  // Update calendar view when value changes
  $: if (value) {
    const date = new Date(value + 'T00:00:00');
    if (!isNaN(date.getTime())) {
      currentMonth = date.getMonth();
      currentYear = date.getFullYear();
    }
  }

  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  function isDateDisabled(date) {
    const dateStr = formatDate(date);
    
    // Check if before min date
    if (minDate && dateStr < minDate) return true;
    
    // Check if after max date
    if (maxDate && dateStr > maxDate) return true;
    
    // Check if in disabled dates array
    if (disabledDates.includes(dateStr)) return true;
    
    // Check day-of-week restrictions (dynamic, works for any month)
    const dayOfWeek = date.getDay();
    
    // Disable Sundays (day 0)
    if (disableSundays && dayOfWeek === 0) return true;
    
    // Disable weekends (Saturday = 6, Sunday = 0)
    if (disableWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) return true;
    
    return false;
  }

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month, year) {
    const firstDay = new Date(year, month, 1);
    // Adjust: Sunday = 0, Monday = 1, etc. - but we want Monday first
    let day = firstDay.getDay() - 1;
    if (day < 0) day = 6; // Sunday becomes 6 (last in week)
    return day;
  }

  function getCalendarDays() {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }

    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = formatDate(date);
      days.push({
        date,
        dateStr,
        day,
        isCurrentMonth: true,
        isToday: dateStr === formatDate(new Date()),
        isSelected: dateStr === value,
        isDisabled: isDateDisabled(date)
      });
    }

    return days;
  }

  function selectDate(date) {
    if (isDateDisabled(date)) return;
    
    const dateStr = formatDate(date);
    value = dateStr;
    dispatch('change', dateStr);
    isOpen = false;
  }

  function previousMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    // Force recalculation of calendar days
    calendarDays = getCalendarDays();
  }

  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    // Force recalculation of calendar days
    calendarDays = getCalendarDays();
  }

  function handleClickOutside(event) {
    if (calendarRef && !calendarRef.contains(event.target)) {
      isOpen = false;
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });

  // Reactive statement to recalculate calendar days when month/year changes
  $: {
    if (currentMonth !== undefined && currentYear !== undefined) {
      calendarDays = getCalendarDays();
    }
  }
  $: displayMonth = monthNames[currentLang]?.[currentMonth] || monthNames.en[currentMonth];
  $: displayYear = currentYear;

  // Format display value
  $: displayValue = value ? (() => {
    const date = new Date(value + 'T00:00:00');
    const day = date.getDate();
    const month = monthNames[currentLang]?.[date.getMonth()] || monthNames.en[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  })() : '';
</script>

<div class="custom-datepicker" class:error={errorMessage} bind:this={calendarRef}>
  {#if label}
    <label class="datepicker-label">{label}</label>
  {/if}
  
  <div class="datepicker-input-wrapper">
    <button
      type="button"
      class="datepicker-input"
      class:has-value={value}
      on:click={(e) => {
        e.stopPropagation();
        isOpen = !isOpen;
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="datepicker-display">{displayValue || (currentLang === 'hu' ? 'Válasszon dátumot' : 'Select a date')}</span>
    </button>
  </div>

  {#if isOpen}
    <div class="datepicker-calendar">
      <div class="calendar-header">
        <button type="button" class="calendar-nav-button" on:click={previousMonth} aria-label="Previous month">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="calendar-month-year">
          <span class="calendar-month">{displayMonth}</span>
          <span class="calendar-year">{displayYear}</span>
        </div>
        
        <button type="button" class="calendar-nav-button" on:click={nextMonth} aria-label="Next month">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="calendar-weekdays">
        {#each dayNames[currentLang] || dayNames.en as dayName}
          <div class="calendar-weekday">{dayName}</div>
        {/each}
      </div>

      <div class="calendar-days">
        {#each calendarDays as dayData}
          {#if dayData.date}
            <button
              type="button"
              class="calendar-day"
              class:today={dayData.isToday}
              class:selected={dayData.isSelected}
              class:disabled={dayData.isDisabled}
              disabled={dayData.isDisabled}
              on:click={() => selectDate(dayData.date)}
              aria-label="Select date {dayData.dateStr}"
            >
              {dayData.day}
            </button>
          {:else}
            <div class="calendar-day-empty"></div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
</div>

<style>
  .custom-datepicker {
    position: relative;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .datepicker-label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text);
    font-weight: 500;
    font-size: 0.95rem;
  }

  .datepicker-input-wrapper {
    position: relative;
  }

  .datepicker-input {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: inherit;
    background-color: white;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .datepicker-input:hover {
    border-color: var(--primary);
  }

  .datepicker-input.has-value {
    color: var(--text);
  }

  .datepicker-input svg {
    color: var(--text-light);
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  .datepicker-display {
    flex: 1;
    color: var(--text);
  }

  .datepicker-input:not(.has-value) .datepicker-display {
    color: var(--text-light);
  }

  .custom-datepicker.error .datepicker-input {
    border-color: #dc3545;
  }

  .datepicker-calendar {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    padding: 0.6rem;
    animation: slideDown 0.2s ease;
    width: fit-content;
    min-width: 280px;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .calendar-nav-button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .calendar-nav-button svg {
    width: 12px;
    height: 12px;
  }

  .calendar-nav-button:hover {
    background: var(--light);
    border-color: var(--primary);
    color: var(--primary);
  }

  .calendar-nav-button:active {
    transform: scale(0.95);
  }

  .calendar-month-year {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .calendar-month {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
  }

  .calendar-year {
    font-size: 0.7rem;
    color: var(--text-light);
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.15rem;
    margin-bottom: 0.4rem;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .calendar-weekday {
    text-align: center;
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--text-light);
    padding: 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.15rem;
    max-width: 300px;
    margin: 0 auto;
  }

  .calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 5px;
    background: white;
    color: var(--text);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    min-height: 28px;
    max-width: 36px;
    margin: 0 auto;
  }

  .calendar-day:hover:not(.disabled) {
    background: var(--light);
    border-color: var(--primary);
    transform: scale(1.05);
  }

  .calendar-day.today {
    border-color: var(--primary);
    font-weight: 700;
    background: rgba(0, 186, 229, 0.1);
  }

  .calendar-day.selected {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    font-weight: 700;
  }

  .calendar-day.selected:hover {
    background: var(--primary-dark);
  }

  .calendar-day.disabled {
    color: var(--gray);
    background: var(--light);
    cursor: not-allowed;
    opacity: 0.5;
    position: relative;
  }

  .calendar-day.disabled:hover {
    transform: none;
    border-color: transparent;
  }

  .calendar-day.disabled::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 1px;
    background: var(--gray);
  }

  .calendar-day-empty {
    aspect-ratio: 1;
    min-height: 28px;
    max-width: 36px;
    margin: 0 auto;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  /* Mobile responsive */
  @media screen and (max-width: 768px) {
    .datepicker-calendar {
      left: 50%;
      transform: translateX(-50%);
      right: auto;
      padding: 0.6rem;
      width: calc(100vw - 2rem);
      max-width: 320px;
      min-width: 280px;
    }

    .calendar-day {
      min-height: 34px;
      font-size: 0.8rem;
    }

    .calendar-weekday {
      font-size: 0.65rem;
      padding: 0.25rem 0;
    }

    .calendar-nav-button {
      width: 30px;
      height: 30px;
    }
    
    .calendar-nav-button svg {
      width: 12px;
      height: 12px;
    }

    .calendar-month {
      font-size: 0.85rem;
    }
    
    .calendar-days {
      max-width: 100%;
    }
    
    .calendar-weekdays {
      max-width: 100%;
    }
    
    .calendar-header {
      max-width: 100%;
    }
  }

  @media screen and (max-width: 480px) {
    .datepicker-input {
      padding: 0.55rem 0.7rem;
      font-size: 0.85rem;
    }

    .datepicker-input svg {
      width: 14px;
      height: 14px;
    }

    .calendar-day {
      min-height: 32px;
      font-size: 0.75rem;
    }

    .calendar-weekday {
      font-size: 0.6rem;
    }
  }
</style>
