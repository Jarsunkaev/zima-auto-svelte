<script>
  import { currentLang } from '../lib/i18n';

  export let navigate;

  // Pricing Data (discounted online prices matching standard tier)
  const parkingPrices = [
    { days: 1, discount: 6700 }, { days: 2, discount: 7400 },
    { days: 3, discount: 8200 }, { days: 4, discount: 9200 },
    { days: 5, discount: 9800 }, { days: 6, discount: 10700 },
    { days: 7, discount: 11700 }, { days: 8, discount: 12200 },
    { days: 9, discount: 12700 }, { days: 10, discount: 13200 },
    { days: 11, discount: 13600 }, { days: 12, discount: 14100 },
    { days: 13, discount: 14700 }, { days: 14, discount: 15100 },
    { days: 15, discount: 15500 }, { days: 16, discount: 15900 },
    { days: 17, discount: 16200 }, { days: 18, discount: 16600 },
    { days: 19, discount: 17000 }, { days: 20, discount: 17400 },
    { days: 21, discount: 17800 }, { days: 22, discount: 18200 },
    { days: 23, discount: 18600 }, { days: 24, discount: 19000 },
    { days: 25, discount: 19400 }, { days: 26, discount: 19800 },
    { days: 27, discount: 20200 }, { days: 28, discount: 20700 },
    { days: 29, discount: 20700 }, { days: 30, discount: 20700 }
  ];

  function formatDate(d) {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  const today = new Date();
  const defaultDeparture = new Date();
  defaultDeparture.setDate(today.getDate() + 3);

  let startDate = formatDate(today);
  let startTime = '10:00';
  let endDate = formatDate(defaultDeparture);
  let endTime = '18:00';

  // Support multiple vehicles
  let cars = [
    { licensePlate: '', passengers: '2' }
  ];

  let validationError = '';

  function addCar() {
    if (cars.length < 5) {
      cars = [...cars, { licensePlate: '', passengers: '2' }];
    }
  }

  function removeCar(index) {
    if (cars.length > 1) {
      cars = cars.filter((_, i) => i !== index);
    }
  }

  // Generate 30-minute intervals for time dropdown
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      timeOptions.push(`${hh}:${mm}`);
    }
  }

  // Calculate days reactively
  function calculateDays(sDate, sTime, eDate, eTime) {
    if (!sDate || !eDate || !sTime || !eTime) return 0;
    const start = new Date(`${sDate}T${sTime}:00Z`);
    const end = new Date(`${eDate}T${eTime}:00Z`);

    if (end <= start) {
      if (sDate === eDate && sTime >= eTime) return 1;
      if (new Date(eDate) < new Date(sDate)) return 0;
    }

    const diffMilliseconds = end - start;
    const diffHours = diffMilliseconds / (1000 * 60 * 60);
    const days = Math.ceil(diffHours / 24);
    return days > 0 ? days : 1;
  }

  $: currentDays = calculateDays(startDate, startTime, endDate, endTime);

  $: calculatedPrice = (() => {
    if (currentDays <= 0) return 0;
    const tier = parkingPrices[Math.min(currentDays, parkingPrices.length) - 1];
    const baseDiscount = tier ? tier.discount : 0;
    return baseDiscount * cars.length;
  })();

  function handleSubmit() {
    validationError = '';
    if (!startDate || !endDate) {
      validationError = $currentLang === 'hu'
        ? 'Kérjük, válassza ki az érkezési és távozási dátumot!'
        : 'Please select arrival and departure dates!';
      return;
    }

    const formattedCars = cars.map(c => ({
      licensePlate: (c.licensePlate || '').toUpperCase().trim(),
      carWashPackage: 'none',
      passengers: String(c.passengers || '1')
    }));

    const prefillData = {
      startDate,
      startTime,
      endDate,
      endTime,
      cars: formattedCars,
      licensePlate: formattedCars[0]?.licensePlate || '',
      passengers: formattedCars[0]?.passengers || '1',
      days: currentDays,
      estimatedPrice: calculatedPrice
    };

    sessionStorage.setItem('prefillParkingBooking', JSON.stringify(prefillData));
    sessionStorage.setItem('preselectedService', 'airportParking');

    if (typeof navigate === 'function') {
      navigate('booking');
    } else {
      window.location.hash = '#booking';
    }
  }
</script>

<div class="hero-booking-widget">
  <div class="widget-header">
    <div class="widget-title-wrap">
      <h3>
        {$currentLang === 'hu' ? 'Parkolóhely Foglalás' : 'Reserve Your Parking Spot'}
      </h3>
      <p class="widget-subtitle">
        {$currentLang === 'hu' ? 'Azonnali online árkalkuláció' : 'Instant online price calculation'}
      </p>
    </div>
    <span class="widget-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      {$currentLang === 'hu' ? '0–24 Őrzött' : '24/7 Secure'}
    </span>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="widget-form">
    <!-- Arrival Date & Time -->
    <div class="form-row">
      <div class="form-group flex-2">
        <label for="hero-start-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {$currentLang === 'hu' ? 'Érkezés a parkolóba*' : 'Arrival at parking lot*'}
        </label>
        <input
          id="hero-start-date"
          type="date"
          bind:value={startDate}
          min={formatDate(today)}
          required
        />
      </div>
      <div class="form-group flex-1">
        <label for="hero-start-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {$currentLang === 'hu' ? 'Időpont*' : 'Time*'}
        </label>
        <div class="select-wrapper">
          <select id="hero-start-time" bind:value={startTime}>
            {#each timeOptions as time}
              <option value={time}>{time}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Departure Date & Time -->
    <div class="form-row">
      <div class="form-group flex-2">
        <label for="hero-end-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {$currentLang === 'hu' ? 'Távozás a parkolóból*' : 'Leaving from parking lot*'}
        </label>
        <input
          id="hero-end-date"
          type="date"
          bind:value={endDate}
          min={startDate || formatDate(today)}
          required
        />
      </div>
      <div class="form-group flex-1">
        <label for="hero-end-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {$currentLang === 'hu' ? 'Időpont*' : 'Time*'}
        </label>
        <div class="select-wrapper">
          <select id="hero-end-time" bind:value={endTime}>
            {#each timeOptions as time}
              <option value={time}>{time}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Vehicles List with Multi-Vehicle Support -->
    <div class="vehicles-wrapper">
      {#each cars as car, i (i)}
        <div class="vehicle-item" class:multiple={cars.length > 1}>
          {#if cars.length > 1}
            <div class="vehicle-item-header">
              <span class="vehicle-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                {i + 1}. {$currentLang === 'hu' ? 'Jármű' : 'Vehicle'}
              </span>
              <button
                type="button"
                class="remove-vehicle-btn"
                on:click={() => removeCar(i)}
                title={$currentLang === 'hu' ? 'Eltávolítás' : 'Remove'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>{$currentLang === 'hu' ? 'Törlés' : 'Remove'}</span>
              </button>
            </div>
          {/if}

          <div class="form-row">
            <div class="form-group flex-2">
              <label for={`hero-license-plate-${i}`}>
                {#if cars.length === 1}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                {/if}
                {$currentLang === 'hu' ? (cars.length > 1 ? 'Rendszám' : '1. Jármű rendszám') : (cars.length > 1 ? 'Plate number' : '1. Vehicle plate')}
              </label>
              <div class="plate-input-wrapper">
                <div class="eu-badge">
                  <img src="/images/euflag.svg" alt="EU" class="eu-flag-svg" />
                </div>
                <input
                  id={`hero-license-plate-${i}`}
                  type="text"
                  placeholder={$currentLang === 'hu' ? 'pl. ABC-123' : 'e.g. ABC-123'}
                  bind:value={car.licensePlate}
                  style="text-transform: uppercase;"
                />
              </div>
            </div>

            <div class="form-group flex-1">
              <label for={`hero-passengers-${i}`}>
                {#if cars.length === 1}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                {/if}
                {$currentLang === 'hu' ? 'Utasok' : 'Passengers'}
              </label>
              <div class="select-wrapper">
                <select id={`hero-passengers-${i}`} bind:value={car.passengers}>
                  <option value="1">1 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="2">2 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="3">3 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="4">4 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="5">5 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="6">6 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="7">7 {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                  <option value="8">8+ {$currentLang === 'hu' ? 'fő' : 'pers.'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      {/each}

      {#if cars.length < 5}
        <button type="button" class="add-vehicle-btn" on:click={addCar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>{$currentLang === 'hu' ? 'További jármű hozzáadása' : 'Add another vehicle'}</span>
        </button>
      {/if}
    </div>

    <!-- Price Summary Box -->
    <div class="price-box">
      <div class="price-info">
        <span class="days-label">
          {currentDays} {$currentLang === 'hu' ? 'nap' : (currentDays === 1 ? 'day' : 'days')}
          {#if cars.length > 1}
            • {cars.length} {$currentLang === 'hu' ? 'autó' : 'cars'}
          {/if}
        </span>
        <div class="price-amount-wrap">
          <span class="price-label">{$currentLang === 'hu' ? 'Kedvezményes ár:' : 'Discounted price:'}</span>
          <span class="price-value">
            {calculatedPrice > 0 ? calculatedPrice.toLocaleString('hu-HU') + ' Ft' : '---'}
          </span>
        </div>
      </div>
      <div class="price-perks">
        <span>✓ {$currentLang === 'hu' ? 'Ingyenes reptéri transzfer' : 'Free airport shuttle'}</span>
      </div>
    </div>

    {#if validationError}
      <div class="error-text">{validationError}</div>
    {/if}

    <!-- CTA Button in AT Group Dark Blue -->
    <button type="submit" class="widget-submit-btn">
      <span>{$currentLang === 'hu' ? 'FOGLALÁS FOLYTATÁSA' : 'CONTINUE BOOKING'}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  </form>
</div>

<style>
  .hero-booking-widget {
    background: rgba(253, 251, 238, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(27, 42, 75, 0.15);
    border-radius: 20px;
    padding: 1.85rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35), 0 0 1px rgba(27, 42, 75, 0.2);
    color: rgb(27, 42, 75);
    width: 100%;
    max-width: 480px;
    box-sizing: border-box;
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hero-booking-widget:hover {
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.42), 0 0 1px rgba(27, 42, 75, 0.3);
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
    padding-bottom: 0.85rem;
    border-bottom: 1px solid rgba(27, 42, 75, 0.12);
  }

  .widget-title-wrap h3 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
    color: rgb(27, 42, 75);
    letter-spacing: -0.01em;
  }

  .widget-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.82rem;
    color: #4a5568;
    font-weight: 500;
  }

  .widget-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(27, 42, 75, 0.08);
    color: rgb(27, 42, 75);
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    border: 1px solid rgba(27, 42, 75, 0.2);
    white-space: nowrap;
  }

  .widget-badge svg {
    color: rgb(27, 42, 75);
  }

  .widget-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    display: flex;
    gap: 0.85rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  .flex-1 {
    flex: 1;
    min-width: 0;
  }

  .flex-2 {
    flex: 1.7;
    min-width: 0;
  }

  .form-group label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: rgb(27, 42, 75);
  }

  .form-group label svg {
    color: rgb(27, 42, 75);
    flex-shrink: 0;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1.5px solid rgba(27, 42, 75, 0.22);
    border-radius: 10px;
    font-size: 0.92rem;
    color: rgb(27, 42, 75);
    background: #ffffff;
    box-sizing: border-box;
    transition: all 0.25s ease;
    outline: none;
    font-family: inherit;
    font-weight: 500;
  }

  .form-group input[type="date"] {
    color-scheme: light;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    height: 44px;
    min-height: 44px;
    padding: 0 0.85rem;
    line-height: 44px;
    background-color: #ffffff;
    cursor: pointer;
  }

  .form-group input[type="date"]::-webkit-date-and-time-value {
    text-align: left;
    min-height: 1.4em;
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    line-height: normal;
  }

  .form-group input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.75;
    margin: auto 0;
    vertical-align: middle;
  }

  .form-group input:focus,
  .form-group select:focus {
    border-color: rgb(27, 42, 75);
    box-shadow: 0 0 0 3px rgba(27, 42, 75, 0.15);
  }

  /* Custom dropdown styling with unclipped chevron */
  .select-wrapper {
    position: relative;
    width: 100%;
  }

  .select-wrapper select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 2.3rem !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%231b2a4b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 14px 14px;
    cursor: pointer;
  }

  .select-wrapper select option {
    background: #ffffff;
    color: rgb(27, 42, 75);
    padding: 0.5rem;
  }

  /* License plate wrapper with ONLY EU flag image (no H) */
  .plate-input-wrapper {
    display: flex;
    align-items: stretch;
    border: 1.5px solid rgba(27, 42, 75, 0.22);
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
    transition: all 0.25s ease;
  }

  .plate-input-wrapper:focus-within {
    border-color: rgb(27, 42, 75);
    box-shadow: 0 0 0 3px rgba(27, 42, 75, 0.15);
  }

  .eu-badge {
    background: rgb(0, 0, 153);
    padding: 0 0.55rem;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    flex-shrink: 0;
  }

  .eu-flag-svg {
    width: 28px;
    height: 100%;
    max-height: 22px;
    object-fit: contain;
    display: block;
  }

  .plate-input-wrapper input {
    border: none;
    border-radius: 0;
    padding: 0.7rem 0.85rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    background: transparent;
    color: rgb(27, 42, 75);
  }

  .plate-input-wrapper input:focus {
    box-shadow: none;
    background: transparent;
  }

  /* Multi-vehicle list & cards */
  .vehicles-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .vehicle-item.multiple {
    background: rgba(255, 255, 255, 0.65);
    border: 1.5px solid rgba(27, 42, 75, 0.15);
    border-radius: 12px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .vehicle-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.35rem;
    border-bottom: 1px dashed rgba(27, 42, 75, 0.15);
  }

  .vehicle-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: rgb(27, 42, 75);
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .remove-vehicle-btn {
    background: transparent;
    border: none;
    color: #dc2626;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0.2rem 0.45rem;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.2s ease;
  }

  .remove-vehicle-btn:hover {
    background: rgba(220, 38, 38, 0.1);
  }

  .add-vehicle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    background: transparent;
    border: 1.5px dashed rgba(27, 42, 75, 0.35);
    color: rgb(27, 42, 75);
    border-radius: 10px;
    padding: 0.55rem 0.85rem;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .add-vehicle-btn:hover {
    background: rgba(27, 42, 75, 0.08);
    border-color: rgb(27, 42, 75);
  }

  /* Price summary box */
  .price-box {
    background: rgba(27, 42, 75, 0.06);
    border: 1px solid rgba(27, 42, 75, 0.15);
    border-radius: 14px;
    padding: 0.95rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .price-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .days-label {
    background: rgb(27, 42, 75);
    color: #ffffff;
    padding: 0.3rem 0.75rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .price-amount-wrap {
    display: flex;
    align-items: baseline;
    gap: 0.45rem;
  }

  .price-label {
    font-size: 0.82rem;
    color: #4a5568;
    font-weight: 600;
  }

  .price-value {
    font-size: 1.45rem;
    font-weight: 800;
    color: rgb(27, 42, 75);
  }

  .price-perks {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    font-size: 0.76rem;
    color: rgb(27, 42, 75);
    font-weight: 600;
    border-top: 1px dashed rgba(27, 42, 75, 0.18);
    padding-top: 0.5rem;
  }

  .error-text {
    color: #dc2626;
    font-size: 0.82rem;
    font-weight: 600;
    text-align: center;
  }

  /* Submit CTA Button in AT Group Dark Blue */
  .widget-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.95rem 1.5rem;
    background: rgb(27, 42, 75);
    color: #ffffff;
    border: none;
    border-radius: 12px;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(27, 42, 75, 0.3);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .widget-submit-btn:hover {
    background: rgb(45, 68, 115);
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(27, 42, 75, 0.4);
  }

  .widget-submit-btn:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .hero-booking-widget {
      padding: 1.35rem;
      border-radius: 16px;
      max-width: 100%;
    }

    .widget-title-wrap h3 {
      font-size: 1.2rem;
    }

    .form-row {
      flex-direction: row;
      gap: 0.6rem;
    }

    .price-value {
      font-size: 1.25rem;
    }

    .widget-submit-btn {
      padding: 0.85rem 1.25rem;
      font-size: 0.98rem;
    }
  }

  @media (max-width: 540px) {
    .hero-booking-widget {
      padding: 1.15rem;
    }

    .widget-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .widget-title-wrap h3 {
      font-size: 1.12rem;
    }

    .widget-badge {
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      flex-shrink: 0;
    }

    .form-row {
      flex-direction: column;
      gap: 0.65rem;
    }

    .flex-1,
    .flex-2 {
      flex: none;
      width: 100%;
    }
  }
</style>
