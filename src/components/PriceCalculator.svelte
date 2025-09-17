<script>
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  // Import the language store
  import { currentLang } from '../lib/i18n';

  // --- Component Props ---
  export let formData = { // Default structure for safety
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    carWashPackage: 'none'
  };
  export let calculateDays; // Function from parent (AirportParkingForm)
  export const content = {}; // Receive the content object from parent component
  // Get the currently selected language from the store, don't use a prop
  let currentLanguage;
  currentLang.subscribe(value => {
    currentLanguage = value;
  });

  // --- Event Dispatcher ---
  const dispatch = createEventDispatcher();

  // --- Pricing Data (Hardcoded) ---
  const parkingPrices = [
    { days: 1, normal: 7500, discount: 6200 }, { days: 2, normal: 8200, discount: 6900 },
    { days: 3, normal: 9000, discount: 7700 }, { days: 4, normal: 9800, discount: 8700 },
    { days: 5, normal: 10500, discount: 9300 }, { days: 6, normal: 11200, discount: 10200 },
    { days: 7, normal: 12500, discount: 11200 }, { days: 8, normal: 14000, discount: 11700 },
    { days: 9, normal: 15500, discount: 12200 }, { days: 10, normal: 16000, discount: 12700 },
    { days: 11, normal: 17000, discount: 13100 }, { days: 12, normal: 17600, discount: 13600 },
    { days: 13, normal: 18000, discount: 14200 }, { days: 14, normal: 18500, discount: 14600 },
    { days: 15, normal: 19000, discount: 15000 }, { days: 16, normal: 19500, discount: 15400 },
    { days: 17, normal: 20000, discount: 15700 }, { days: 18, normal: 20500, discount: 16100 },
    { days: 19, normal: 21000, discount: 16500 }, { days: 20, normal: 21500, discount: 16900 },
    { days: 21, normal: 22000, discount: 17300 }, { days: 22, normal: 22500, discount: 17700 },
    { days: 23, normal: 23000, discount: 18100 }, { days: 24, normal: 23500, discount: 18500 },
    { days: 25, normal: 24000, discount: 18900 }, { days: 26, normal: 24500, discount: 19300 },
    { days: 27, normal: 25000, discount: 19700 }, { days: 28, normal: 25500, discount: 20200 },
    { days: 29, normal: 26000, discount: 20200 }, { days: 30, normal: 26000, discount: 20200 }
    // Prices beyond 30 days use the 30-day price based on calculation logic
  ];
  const carWashPricing = {
    none: 0,
    smartInteriorExterior: 8900,
    premiumInteriorExterior: 11900
  };

  // --- Reactive Variables ---
  let currentDays = 0;
  let parkingTotal = 0;
  let carWashStandardPrice = 0;
  let carWashDiscountAmount = 0;
  let carWashDiscountedPrice = 0;
  let totalPrice = 0;
  let hasValidDates = false; // Tracks if date/time inputs have values

  // --- Dispatch Price Update ---
  function dispatchPriceUpdate() {
    // Ensure all values are numbers before dispatching
    const dataToDispatch = {
      parkingDays: currentDays,
      parkingTotal: parkingTotal || 0,
      carWashStandard: carWashStandardPrice || 0,
      carWashDiscount: carWashDiscountAmount || 0,
      carWashDiscounted: carWashDiscountedPrice || 0,
      totalPrice: totalPrice || 0,
      hasValidDates: hasValidDates,
      isValidDuration: currentDays > 0 // Flag indicating calculated days > 0
    };
    dispatch('priceUpdated', dataToDispatch);
  }

  // --- Core Calculation Logic ---
  function calculatePrices() {
    // Calculate days using the function passed from the parent
    if (typeof calculateDays === 'function') {
      currentDays = calculateDays();
    } else {
      currentDays = 0;
      console.error("PriceCalculator: 'calculateDays' prop is not a function!");
    }

    // Check if essential date/time data is present
    hasValidDates = !!(formData.startDate && formData.endDate && formData.startTime && formData.endTime);

    // Parking Total Calculation
    parkingTotal = 0; // Reset
    if (currentDays > 0) {
        // Find the correct price tier, or use the last one if days exceed the defined tiers
        let priceTier = parkingPrices[Math.min(currentDays, parkingPrices.length) - 1];
        // Use the 'discount' price from the tier
        parkingTotal = priceTier ? priceTier.discount : 0;
    } else {
        parkingTotal = 0; // Explicitly zero if duration is not positive
    }

    // Car Wash Price Calculation
    const packageKey = formData.carWashPackage || 'none';
    carWashStandardPrice = carWashPricing[packageKey] ?? 0; // Use nullish coalescing

    // Calculate discount only if a valid package is selected
    if (carWashStandardPrice > 0) {
      carWashDiscountAmount = Math.round(carWashStandardPrice * 0.20); // 20% discount
      carWashDiscountedPrice = carWashStandardPrice - carWashDiscountAmount;
    } else {
      carWashDiscountAmount = 0;
      carWashDiscountedPrice = 0;
    }

    // Total Price Calculation
    totalPrice = (parkingTotal || 0) + (carWashDiscountedPrice || 0);
  }

  // --- Reactivity ---
  // Recalculate whenever relevant formData or the language changes
  $: {
    // Check if formData and calculateDays exist before calculating
    if (formData && typeof calculateDays === 'function') {
        calculatePrices();
    }
  }

  // --- Lifecycle Hooks ---
  onMount(() => {
    // Perform initial calculation when component mounts
    calculatePrices();
    // Dispatch initial prices after the first calculation
    dispatchPriceUpdate();
  });

  // Use afterUpdate to ensure DOM is potentially updated *before* dispatching new prices.
  afterUpdate(() => {
    // The reactive block ($:) already calls calculatePrices.
    // We just need to dispatch the results after Svelte has processed updates.
    dispatchPriceUpdate();
  });

  // --- Formatting Function ---
  function formatCurrency(amount) {
    const numericAmount = typeof amount === 'number' ? amount : 0;
    // Format based on current language
    return new Intl.NumberFormat(currentLanguage === 'hu' ? 'hu-HU' : 'en-US', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  }

</script>

<div class="price-summary">
  <div class="price-calculation">
    <p>
      <span>{currentLanguage === 'hu' ? 'Időtartam' : 'Duration'}:</span>
      <span>{currentDays} {currentLanguage === 'hu' ? 'nap' : 'days'}</span>
    </p>

    <p>
      <span>{currentLanguage === 'hu' ? 'Parkolás díj' : 'Parking Total'}:</span>
      <span>{formatCurrency(parkingTotal)}</span>
    </p>

    {#if formData.carWashPackage !== 'none' && carWashStandardPrice > 0}
      <p class="car-wash-price">
        <span>{currentLanguage === 'hu' ? 'Autómosó díj (alap)' : 'Car Wash Fee (Standard)'}:</span>
        <span>{formatCurrency(carWashStandardPrice)}</span>
      </p>
      {#if carWashDiscountAmount > 0}
        <p>
          <span>{currentLanguage === 'hu' ? 'Autómosó kedvezmény (20%)' : 'Car Wash Discount (20%)'}:</span>
          <span style="color: #e53e3e;">- {formatCurrency(carWashDiscountAmount)}</span>
        </p>
      {/if}
      <p>
        <span>{currentLanguage === 'hu' ? 'Autómosó díj (kedvezményes)' : 'Car Wash Fee (Discounted)'}:</span>
        <span>{formatCurrency(carWashDiscountedPrice)}</span>
      </p>
    {/if}

    <p class="total-price-line">
      <span>{currentLanguage === 'hu' ? 'Végösszeg' : 'Total'}:</span>
      <span class="total-price">{formatCurrency(totalPrice)}</span>
    </p>

    {#if hasValidDates && currentDays <= 0}
      <p class="error-message" style="text-align:center; margin-top: 1rem;">
        {currentLanguage === 'hu' 
          ? 'Érvénytelen dátum vagy időtartam. Kérjük, ellenőrizze az érkezési és távozási időpontokat.'
          : 'Invalid date or duration. Please check arrival and departure dates/times.'}
      </p>
    {/if}
  </div>
</div>

<style>
  /* Styles remain the same as previously provided */
  .price-summary {
    background-color: rgba(0, 186, 229, 0.05); /* Light blue background */
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 1.5rem;
    transition: all 0.3s ease;
  }

  .price-calculation {
    font-size: 1.1rem; /* Base font size for summary */
    font-weight: 500;
    color: var(--text); /* Use CSS variable for text color */
  }

  .price-calculation p {
    margin-bottom: 0.5rem; /* Spacing between lines */
    display: flex;
    justify-content: space-between; /* Label left, value right */
    align-items: center;
  }

  /* Style for labels (left side) */
  .price-calculation p span:first-child {
    font-weight: normal;
    color: var(--text-light); /* Lighter text for labels */
    font-size: 1rem; /* Slightly smaller label font */
    padding-right: 1rem; /* Space between label and value */
    text-align: left;
  }

  /* Style for values (right side) */
  .price-calculation p span:last-child {
    font-weight: 500;
    color: var(--text);
    font-size: 1.1rem; /* Match base font size */
    text-align: right;
  }

  /* Add separation for car wash details */
  .car-wash-price {
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px dashed rgba(0, 0, 0, 0.1); /* Dashed separator */
  }

  /* Style for the total price line */
  .total-price-line {
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1); /* Solid separator */
    font-weight: 700; /* Bold total label */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Ensure total label is bold and sized correctly */
  .total-price-line span:first-child {
      font-weight: 700; /* Explicitly bold */
      color: var(--text);
      font-size: 1.1rem; /* Match base font size */
  }

  /* Style for the final total price value */
  .total-price {
    font-size: 1.3rem; /* Larger font for total */
    font-weight: 700; /* Bold total value */
    color: var(--primary); /* Use primary color for emphasis */
  }

  /* Error message style */
  .error-message {
    color: #e53e3e; /* Standard error red */
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 1rem;
    text-align: center;
  }

  /* Responsive adjustments */
  @media screen and (max-width: 768px) {
    .price-calculation p span:first-child { font-size: 0.9rem; }
    .price-calculation p span:last-child { font-size: 1rem; }
    .total-price-line span:first-child { font-size: 1rem; }
    .total-price { font-size: 1.2rem; }
  }
</style>