<script>
    import { createEventDispatcher } from 'svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    
    // Component props
    export let formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
    
    export let formErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
    
    export let content = {};
    export let currentLang = 'hu';
    export const isSubmitting = false;
    
    // Ensure formData has all required fields initialized
    $: formData = {
      firstName: formData?.firstName || '',
      lastName: formData?.lastName || '',
      email: formData?.email || '',
      phone: formData?.phone || '',
      ...formData // Spread any additional properties
    };
    
    // Handle input changes
    function handleInput(field, value) {
      formData = {
        ...formData,
        [field]: value || ''
      };
      
      // Clear error when user types
      if (formErrors && formErrors[field]) {
        formErrors = {
          ...formErrors,
          [field]: ''
        };
      }
    }
</script>

  
<div class="form-section">
  <h3>{content[currentLang].bookingForm.personalInfo.title}</h3>

  <div class="form-row">
    <div class="form-group">
      <label for="lastName">{content[currentLang].bookingForm.personalInfo.lastName}</label>
      <input
        type="text"
        id="lastName"
        value={formData.lastName}
        on:input={(e) => handleInput('lastName', e.target.value)}
        required
        placeholder={currentLang === 'hu' ? 'Adja meg vezetéknevét' : 'Enter your last name'}
      />
      {#if formErrors.lastName}
        <p class="error-message">{formErrors.lastName}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="firstName">{content[currentLang].bookingForm.personalInfo.firstName}</label>
      <input
        type="text"
        id="firstName"
        value={formData.firstName}
        on:input={(e) => handleInput('firstName', e.target.value)}
        required
        placeholder={currentLang === 'hu' ? 'Adja meg keresztnevét' : 'Enter your first name'}
      />
      {#if formErrors.firstName}
        <p class="error-message">{formErrors.firstName}</p>
      {/if}
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="email">{content[currentLang].bookingForm.personalInfo.email}</label>
      <input
        type="email"
        id="email"
        value={formData.email}
        on:input={(e) => handleInput('email', e.target.value)}
        placeholder={currentLang === 'hu' ? 'Adja meg email címét' : 'Enter your email address'}
      />
      {#if formErrors.email}
        <p class="error-message">{formErrors.email}</p>
      {/if}
    </div>

    <div class="form-group">
      <label for="phone">{content[currentLang].bookingForm.personalInfo.phone}</label>
      <input
        type="tel"
        id="phone"
        value={formData.phone}
        on:input={(e) => handleInput('phone', e.target.value)}
        required
        placeholder={currentLang === 'hu' ? 'Adja meg telefonszámát' : 'Enter your phone number'}
      />
      {#if formErrors.phone}
        <p class="error-message">{formErrors.phone}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .form-section {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .form-section:last-child {
    margin-bottom: 1.5rem;
    padding-bottom: 0;
    border-bottom: none;
  }

  .form-section h3 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: var(--text);
    position: relative;
  }

  .form-section h3::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--primary);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    color: var(--text);
    font-weight: 500;
  }

  input {
    padding: 0.8rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
    width: 100%;
  }

  input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 186, 229, 0.2);
    outline: none;
  }

  .error-message {
    color: #e53e3e;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  /* Responsive styles */
  @media screen and (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .form-section h3 {
      font-size: 1.5rem;
    }

    label {
      font-size: 1.1rem;
    }

    input {
      font-size: 1.1rem;
      padding: 1rem;
    }

    .error-message {
      font-size: 1rem;
    }
  }

  @media screen and (max-width: 480px) {
    .form-section h3 {
      font-size: 1.4rem;
    }

    label {
      font-size: 1rem;
    }

    input {
      font-size: 1rem;
      padding: 0.9rem;
    }

    .error-message {
      font-size: 0.95rem;
    }
  }
</style>