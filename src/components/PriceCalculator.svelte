<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { currentLang } from '../lib/i18n'; // Assuming this store provides 'hu' or 'en'

  // Component props
  export let formData = { // Provide default structure
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    carWashPackage: 'none'
  };
  export let calculateDays; // Function passed from parent to calculate duration
  export let content; // Object with localized strings

  // Initialize event dispatcher
  const dispatch = createEventDispatcher();

  // --- Pricing Data (Keep this updated based on your services page) ---

  // Parking price tiers (Assuming these are TOTAL prices for the duration)
  const parkingPrices = [
    // { days: N, normal: TOTAL_NORMAL_PRICE, discount: TOTAL_DISCOUNT_PRICE }
    { days: 1, normal: 7500, discount: 5500 },
    { days: 2, normal: 8200, discount: 6200 },
    { days: 3, normal: 9000, discount: 7000 },
    { days: 4, normal: 9800, discount: 8000 },
    { days: 5, normal: 10500, discount: 8600 },
    { days: 6, normal: 11200, discount: 9500 },
    { days: 7, normal: 12500, discount: 10500 },
    { days: 8, normal: 14000, discount: 11000 },
    { days: 9, normal: 15500, discount: 11500 },
    { days: 10, normal: 16000, discount: 12000 },
    { days: 11, normal: 17000, discount: 12400 },
    { days: 12, normal: 17600, discount: 12900 },
    { days: 13, normal: 18000, discount: 13500 },
    { days: 14, normal: 18500, discount: 13900 },
    { days: 15, normal: 19000, discount: 14300 },
    { days: 16, normal: 19500, discount: 14700 },
    { days: 17, normal: 20000, discount: 15000 },
    { days: 18, normal: 20500, discount: 15400 },
    { days: 19, normal: 21000, discount: 15800 },
    { days: 20, normal: 21500, discount: 16200 },
    { days: 21, normal: 22000, discount: 16600 },
    { days: 22, normal: 22500, discount: 17000 },
    { days: 23, normal: 23000, discount: 17400 },
    { days: 24, normal: 23500, discount: 17800 },
    { days: 25, normal: 24000, discount: 18200 },
    { days: 26, normal: 24500, discount: 18600 },
    { days: 27, normal: 25000, discount: 19000 },
    { days: 28, normal: 25500, discount: 19500 },
    { days: 29, normal: 26000, discount: 19500 }, // Price stays same for day 29 & 30
    { days: 30, normal: 26000, discount: 19500 }
  ];

  // Car wash pricing - Standard prices
  const carWashPricing = {
    none: 0, // No car wash
    smartInteriorExterior: 8900, // SMART combined price for personal car
    premiumInteriorExterior: 11900 // PREMIUM combined price for personal car
    // Add other packages if needed
  };

  // --- Reactive Variables ---
  // These will hold the calculated values and update the UI automatically
  let currentDays = 0;
  let parkingTotal = 0;
  let carWashStandardPrice = 0;
  let carWashDiscountAmount = 0;
  let carWashDiscountedPrice = 0;
  let totalPrice = 0;
  let hasValidDates = false; // To control error message visibility

  // --- Core Calculation Logic ---

  // Recalculate everything whenever relevant form data changes
  $: {
    // Defensive check: Ensure calculateDays is a function before calling
    if (typeof calculateDays === 'function') {
      currentDays = calculateDays();
    } else {
      currentDays = 0;
      console.error("calculateDays prop is not a function!");
    }

    // Determine if all date/time fields are filled (for error message logic)
    hasValidDates = !!(formData.startDate && formData.endDate && formData.startTime && formData.endTime);

    // --- Calculate Parking Total ---
    if (currentDays <= 0) {
      parkingTotal = 0;
    } else {
      let priceTier;
      // Find the price tier for the calculated number of days
      // The array index is days - 1 because arrays are 0-indexed
      if (currentDays <= parkingPrices.length) {
        priceTier = parkingPrices[currentDays - 1];
      } else {
        // If duration exceeds max defined days, use the price for the last defined tier
        priceTier = parkingPrices[parkingPrices.length - 1];
      }
      // Use the discount price for that duration (assuming prices are total, not per day)
      parkingTotal = priceTier ? priceTier.discount : 0;
    }

    // --- Calculate Car Wash Price ---
    const packageKey = formData.carWashPackage || 'none'; // Default to 'none' if undefined
    carWashStandardPrice = carWashPricing.hasOwnProperty(packageKey) ? carWashPricing[packageKey] : 0;

    if (carWashStandardPrice > 0) {
      // Calculate 20% discount
      carWashDiscountAmount = Math.round(carWashStandardPrice * 0.20);
      // Calculate final discounted price
      carWashDiscountedPrice = carWashStandardPrice - carWashDiscountAmount;
    } else {
      // No car wash selected or invalid package
      carWashDiscountAmount = 0;
      carWashDiscountedPrice = 0;
    }

    // --- Calculate Total Price ---
    totalPrice = parkingTotal + carWashDiscountedPrice;

    // --- Dispatch Event with Updated Prices ---
    // This allows parent components to access the detailed breakdown
    dispatch('priceUpdated', {
      parkingDays: currentDays,
      parkingTotal: parkingTotal,
      carWashStandard: carWashStandardPrice,
      carWashDiscount: carWashDiscountAmount,
      carWashDiscounted: carWashDiscountedPrice,
      totalPrice: totalPrice,
      hasValidDates: hasValidDates, // Pass validity status
      isValidDuration: currentDays > 0 // Pass duration validity
    });

  } // End of reactive block $:

  // --- Formatting Function ---
  function formatCurrency(amount) {
    // Ensure amount is a number, default to 0 if not
    const numericAmount = typeof amount === 'number' ? amount : 0;
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  }

  // --- Get Localized Content Safely ---
  function getLocalizedText(key, fallback) {
    try {
      // Navigate through the content object based on the key path
      const keys = key.split('.');
      let result = content[$currentLang];
      for (const k of keys) {
        result = result[k];
        if (result === undefined) throw new Error(); // Key path not found
      }
      return result;
    } catch (e) {
      console.warn(`Localization key not found: ${key} for lang ${$currentLang}`);
      return fallback || key; // Return fallback or the key itself
    }
  }

</script>

<div class="price-summary">
  <div class="price-calculation">
    <p>
      <span>{$currentLang === 'hu' ? 'Időtartam' : 'Duration'}:</span>
      <span>{currentDays} {getLocalizedText('bookingForm.airportParking.days', 'days')}</span>
    </p>

    <p>
      <span>{getLocalizedText('bookingForm.airportParking.parkingTotal', 'Parking Total')}:</span>
      <span>{formatCurrency(parkingTotal)}</span>
    </p>

    {#if formData.carWashPackage !== 'none' && carWashStandardPrice > 0}
      <p class="car-wash-price">
        <span>{getLocalizedText('bookingForm.airportParking.carWashStandard', 'Car Wash (Standard)')}:</span>
        <span>{formatCurrency(carWashStandardPrice)}</span>
      </p>
      {#if carWashDiscountAmount > 0}
      <p>
        <span>{getLocalizedText('bookingForm.airportParking.carWashDiscount', 'Discount (20%)')}:</span>
        <span style="color: #e53e3e;">- {formatCurrency(carWashDiscountAmount)}</span>
      </p>
      {/if}
      <p>
        <span>{getLocalizedText('bookingForm.airportParking.carWashDiscounted', 'Car Wash (Discounted)')}:</span>
        <span>{formatCurrency(carWashDiscountedPrice)}</span>
      </p>
    {/if}

    <p class="total-price-line">
      <span>{$currentLang === 'hu' ? 'Végösszeg' : 'Total'}:</span>
      <span class="total-price">{formatCurrency(totalPrice)}</span>
    </p>

    {#if hasValidDates && currentDays <= 0}
      <p class="error-message" style="text-align:center; margin-top: 1rem;">
        {$currentLang === 'hu' ? 'Érvénytelen dátum vagy időtartam. Kérjük, ellenőrizze a dátumokat és időpontokat.' : 'Invalid date or duration. Please check arrival and departure dates/times.'}
      </p>
    {/if}
  </div>
</div>

<style>
  /* Price summary */
  .price-summary {
    background-color: rgba(0, 186, 229, 0.05);
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 1.5rem;
    transition: all 0.3s ease;
  }

  .price-calculation {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text);
  }

  .price-calculation p {
    margin-bottom: 0.5rem;
    display: flex; /* Use flexbox for alignment */
    justify-content: space-between; /* Space out label and value */
    align-items: center;
  }

  .price-calculation p span:first-child {
    font-weight: normal; /* Make labels less bold than values */
    color: var(--text-light);
    font-size: 1rem;
    padding-right: 1rem; /* Add some space between label and value */
    text-align: left;
  }

  .price-calculation p span:last-child {
    font-weight: 500;
    color: var(--text);
    font-size: 1.1rem;
    text-align: right;
  }

  .car-wash-price {
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
  }

  .total-price-line {
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .total-price-line span:first-child {
      font-weight: 700; /* Make total label bold */
      color: var(--text); /* Ensure it's not light */
      font-size: 1.1rem; /* Match other value sizes */
  }

  .total-price {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary); /* Use primary color for emphasis */
  }

  .error-message {
    color: #e53e3e; /* Red color for errors */
    font-size: 0.9rem; /* Slightly smaller font */
    font-weight: 500;
    margin-top: 1rem; /* Add space above the error */
    text-align: center;
  }

  @media screen and (max-width: 768px) {
    .price-calculation p span:first-child {
      font-size: 0.9rem;
    }
    .price-calculation p span:last-child {
      font-size: 1rem;
    }
    .total-price-line span:first-child {
        font-size: 1rem;
    }
    .total-price {
      font-size: 1.2rem;
    }
  }
</style>