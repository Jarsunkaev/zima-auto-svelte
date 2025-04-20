<script>
    import { currentLang } from '../lib/i18n';
  
    // Component props
    export let formData = {};
    export let calculateDays;
    export let content;
  
    // Car wash pricing - Holds STANDARD combined prices
    const carWashPricing = {
      none: 0, // No car wash
      smartInteriorExterior: 12000, // STANDARD combined SMART price
      premiumInteriorExterior: 18000 // STANDARD combined PREMIUM price
    };
  
    // --- Function to get the DISCOUNTED daily parking rate ---
    function getDiscountedDailyParkingRate(days) {
      // This function returns the ALREADY DISCOUNTED daily rate based on the days
      // Replace with your actual DISCOUNTED pricing tiers
      if (days <= 1) return 2400; // DISCOUNTED rate for 1 day
      if (days <= 3) return 2240; // DISCOUNTED rate for 2-3 days
      if (days <= 7) return 2000; // DISCOUNTED rate for 4-7 days
      if (days <= 14) return 1760; // DISCOUNTED rate for 8-14 days
      return 1600; // DISCOUNTED rate for 15+ days
    }
  
    // --- Function to calculate total parking price using the discounted rate ---
    export function calculateParkingTotal() {
      const days = calculateDays();
      if (days <= 0) return 0; // Ensure at least 1 day for calculation
      const dailyRate = getDiscountedDailyParkingRate(days); // Use the already discounted rate
      return days * dailyRate;
    }
  
    // --- Function to get the standard price of the selected car wash ---
    export function getStandardCarWashPrice() {
      const packageKey = formData.carWashPackage;
      if (packageKey !== 'none' && carWashPricing.hasOwnProperty(packageKey)) {
        return carWashPricing[packageKey];
      }
      return 0; // Return 0 if no car wash or package not found
    }
  
    // --- Function to calculate the car wash discount amount (20%) ---
    export function calculateCarWashDiscount() {
      const standardPrice = getStandardCarWashPrice();
      return standardPrice * 0.20; // 20% discount on the standard car wash price
    }
  
    // --- Function to calculate the discounted car wash price ---
    export function calculateDiscountedCarWashPrice() {
      const standardPrice = getStandardCarWashPrice();
      const discount = calculateCarWashDiscount();
      return standardPrice - discount;
    }
  
    // --- Calculate total price (Discounted Parking + Discounted Car Wash) ---
    export function calculatePrice() {
      const parkingTotal = calculateParkingTotal(); // Use the calculated parking total
      const discountedCarWashPrice = calculateDiscountedCarWashPrice(); // Use the calculated discounted car wash price
      return parkingTotal + discountedCarWashPrice;
    }
  
    // Format currency in Hungarian format
    export function formatCurrency(amount) {
      // Ensure the amount is treated as a number before formatting
      const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
      return new Intl.NumberFormat('hu-HU', { 
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
        <span>{$currentLang === 'hu' ? 'Időtartam' : 'Duration'}:</span>
        <span>{calculateDays()} {content[$currentLang].bookingForm.airportParking.days}</span>
      </p>
  
      <p>
        <span>{content[$currentLang].bookingForm.airportParking.parkingTotal}:</span>
        <span>{formatCurrency(calculateParkingTotal())}</span>
      </p>
  
      {#if formData.carWashPackage !== 'none'}
        <p class="car-wash-price">
          <span>{content[$currentLang].bookingForm.airportParking.carWashStandard}:</span>
          <span>{formatCurrency(getStandardCarWashPrice())}</span>
        </p>
        <p>
          <span>{content[$currentLang].bookingForm.airportParking.carWashDiscount}:</span>
          <span style="color: #e53e3e;">- {formatCurrency(calculateCarWashDiscount())}</span> 
        </p>
        <p>
          <span>{content[$currentLang].bookingForm.airportParking.carWashDiscounted}:</span>
          <span>{formatCurrency(calculateDiscountedCarWashPrice())}</span>
        </p>
      {/if}
  
      <p class="total-price-line">
        <span>{$currentLang === 'hu' ? 'Végösszeg' : 'Total'}:</span>
        <span class="total-price">{formatCurrency(calculatePrice())}</span>
      </p>
      
      {#if calculateDays() <= 0 && (formData.startDate && formData.endDate && formData.startTime && formData.endTime)}
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
    }
    
    .price-calculation p span:last-child {
      font-weight: 500;
      color: var(--text);
      font-size: 1.1rem;
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
  
    .total-price {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--primary);
    }
  
    .error-message {
      color: #e53e3e;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
  
    @media screen and (max-width: 768px) {
      .price-calculation p span:first-child {
        font-size: 0.9rem;
      }
      .price-calculation p span:last-child {
        font-size: 1rem;
      }
      .total-price {
        font-size: 1.2rem;
      }
    }
  </style>