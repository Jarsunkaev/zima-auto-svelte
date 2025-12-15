<script>
  import { fade } from 'svelte/transition';

  // Component props
  export let bookingDetails = {};
  export let content = {};
  export let currentLang;
  export let resetBooking;

  // Format currency in Hungarian format
  function formatCurrency(amount) {
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

<section class="confirmation-section" transition:fade={{ duration: 300 }}>
  <div class="container">
    <div class="confirmation-container">
      <div class="confirmation-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <h2>{content[currentLang].confirmation.title}</h2>
      <p class="confirmation-subtitle">{content[currentLang].confirmation.subtitle}</p>

      <div class="confirmation-details">
        <h3>{content[currentLang].confirmation.details}</h3>

        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">{content[currentLang].confirmation.service}:</span>
            <span class="detail-value">
              {#if bookingDetails.service === 'airportParking'}
                {content[currentLang].services.airportParking.title}
              {:else if bookingDetails.service === 'carWash'}
                {content[currentLang].services.carWash.title}
              {:else if bookingDetails.service === 'autoService'}
                {content[currentLang].services.autoService.title}
              {:else if bookingDetails.service === 'tireService'}
                {content[currentLang].services.tireService.title}
              {/if}
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-label">{content[currentLang].confirmation.date}:</span>
            <span class="detail-value">
              {#if bookingDetails.service === 'airportParking'}
                {currentLang === 'hu' ? 'Érkezés' : 'Arrival'}: {bookingDetails.date.split(' - ')[0]}<br>
                {currentLang === 'hu' ? 'Távozás' : 'Departure'}: {bookingDetails.date.split(' - ')[1]}
              {:else}
                {bookingDetails.date}
              {/if}
            </span>
          </div>

          {#if bookingDetails.time}
            <div class="detail-item">
              <span class="detail-label">{content[currentLang].confirmation.time}:</span>
              <span class="detail-value">{bookingDetails.time}</span>
            </div>
          {/if}

          {#if bookingDetails.serviceType}
            <div class="detail-item">
              <span class="detail-label">{currentLang === 'hu' ? 'Szolgáltatás típusa' : 'Service type'}:</span>
              <span class="detail-value">
                {#if bookingDetails.service === 'autoService'}
                  {#if bookingDetails.serviceType === 'maintenance'}
                    {content[currentLang].bookingForm.autoService.serviceOptions.maintenance}
                  {:else if bookingDetails.serviceType === 'repair'}
                    {content[currentLang].bookingForm.autoService.serviceOptions.repair}
                  {:else if bookingDetails.serviceType === 'diagnostic'}
                    {content[currentLang].bookingForm.autoService.serviceOptions.diagnostic}
                  {:else}
                    {content[currentLang].bookingForm.autoService.serviceOptions.other}
                  {/if}
                {:else if bookingDetails.service === 'tireService'}
                  {#if bookingDetails.serviceType === 'change'}
                    {content[currentLang].bookingForm.tireService.serviceOptions.change}
                  {:else if bookingDetails.serviceType === 'repair'}
                    {content[currentLang].bookingForm.tireService.serviceOptions.repair}
                  {:else if bookingDetails.serviceType === 'balancing'}
                    {content[currentLang].bookingForm.tireService.serviceOptions.balancing}
                  {:else}
                    {content[currentLang].bookingForm.tireService.serviceOptions.storage}
                  {/if}
                {/if}
              </span>
            </div>
          {/if}

          {#if bookingDetails.licensePlate}
            <div class="detail-item">
              <span class="detail-label">{content[currentLang].bookingForm.airportParking.licensePlate}:</span>
              <span class="detail-value">{bookingDetails.licensePlate}</span>
            </div>
          {/if}

          {#if bookingDetails.passengers}
            <div class="detail-item">
              <span class="detail-label">{content[currentLang].bookingForm.airportParking.passengers}:</span>
              <span class="detail-value">{bookingDetails.passengers}</span>
            </div>
          {/if}

          {#if bookingDetails.days}
            <div class="detail-item">
              <span class="detail-label">{currentLang === 'hu' ? 'Időtartam' : 'Duration'}:</span>
              <span class="detail-value">{bookingDetails.days} {content[currentLang].bookingForm.airportParking.days}</span>
            </div>
          {/if}

          {#if bookingDetails.carWashPackage && bookingDetails.carWashPackage !== 'none'}
            <div class="detail-item">
              <span class="detail-label">{content[currentLang].bookingForm.airportParking.carWashOptions.title}:</span>
              <span class="detail-value">
                {bookingDetails.carWashPackageName}
              </span>
            </div>
          {/if}

          {#if bookingDetails.priceBreakdown}
            <div class="detail-item">
              <span class="detail-label">{content[currentLang].bookingForm.airportParking.parkingTotal}:</span>
              <span class="detail-value">{formatCurrency(bookingDetails.priceBreakdown.parkingTotal)}</span>
            </div>
            {#if bookingDetails.priceBreakdown.carWashStandard > 0}
              <div class="detail-item">
                <span class="detail-label">{content[currentLang].bookingForm.airportParking.carWashStandard}:</span>
                <span class="detail-value">{formatCurrency(bookingDetails.priceBreakdown.carWashStandard)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{content[currentLang].bookingForm.airportParking.carWashDiscount}:</span>
                <span class="detail-value" style="color: #e53e3e;">- {formatCurrency(bookingDetails.priceBreakdown.carWashDiscount)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{content[currentLang].bookingForm.airportParking.carWashDiscounted}:</span>
                <span class="detail-value">{formatCurrency(bookingDetails.priceBreakdown.carWashDiscounted)}</span>
              </div>
            {/if}
          {/if}

          {#if bookingDetails.totalPrice !== undefined}
            <div class="detail-item total-price-item">
              <span class="detail-label">{content[currentLang].bookingForm.airportParking.totalPrice}:</span>
              <span class="detail-value total-price-value">{formatCurrency(bookingDetails.totalPrice)}</span>
            </div>
          {/if}

          <div class="detail-item">
            <span class="detail-label">{content[currentLang].confirmation.name}:</span>
            <span class="detail-value">{bookingDetails.name || bookingDetails.customerName || bookingDetails.contact?.name || ''}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">{content[currentLang].confirmation.contactInfo}:</span>
            <span class="detail-value">
              {bookingDetails.contact?.phone || bookingDetails.phone || ''}
              {#if bookingDetails.contact?.email || bookingDetails.email}
                <br>{bookingDetails.contact?.email || bookingDetails.email}
              {/if}
            </span>
          </div>
        </div>
      </div>

      <p class="email-notice">{content[currentLang].confirmation.emailSent}</p>

      <div class="confirmation-actions">
        <button class="btn btn-primary" on:click={resetBooking}>
          {content[currentLang].confirmation.return}
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  /* Confirmation Section */
  .confirmation-section {
    padding: 6rem 2rem;
    background-color: white;
  }

  .confirmation-container {
    max-width: 700px;
    margin: 0 auto;
    background-color: var(--light);
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    width: 100%;
  }

  .confirmation-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e6f7ff;
    border-radius: 50%;
    margin: 0 auto 2rem;
    color: var(--primary);
  }

  .confirmation-container h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--text);
  }

  .confirmation-subtitle {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 2.5rem;
  }

  .confirmation-details {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    text-align: left;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
  }

  .confirmation-details h3 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: var(--text);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 1rem;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .detail-item {
    margin-bottom: 1rem;
  }
  
  .total-price-item {
    grid-column: span 2;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 2px solid rgba(0, 186, 229, 0.2);
  }

  .detail-label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 0.3rem;
  }

  .detail-value {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text);
  }
  
  .total-price-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary);
  }

  .email-notice {
    font-size: 1rem;
    color: var(--text-light);
    margin-bottom: 2rem;
  }

  .confirmation-actions {
    margin-top: 1rem;
  }

  .confirmation-actions button {
    padding: 0.8rem 2rem;
  }

  /* Responsive Styles */
  @media screen and (max-width: 768px) {
    .confirmation-section {
      padding: 4rem 1rem;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }
    
    .total-price-item {
      grid-column: 1;
    }

    .confirmation-container {
      max-width: 100%;
      padding: 2rem 1rem;
    }

    .confirmation-details {
      padding: 1.5rem 1rem;
    }
  }

  @media screen and (max-width: 480px) {
    .confirmation-section {
      padding: 3rem 0.5rem;
    }

    .confirmation-container {
      padding: 1.5rem 0.75rem;
      border-radius: 8px;
    }

    .confirmation-container h2 {
      font-size: 1.5rem;
    }
    
    .confirmation-details {
      padding: 1.25rem 0.75rem;
      border-radius: 6px;
    }

    .confirmation-details h3 {
      font-size: 1.2rem;
    }
    
    .detail-value {
      font-size: 1rem;
    }
    
    .total-price-value {
      font-size: 1.2rem;
    }

    .detail-label {
      font-size: 0.8rem;
    }
  }
</style>