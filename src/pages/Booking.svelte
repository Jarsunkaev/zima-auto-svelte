<!-- Fix for invisible services and additional booking form fields -->
<script>
    import { onMount } from 'svelte';
    import { currentLang, t } from '../lib/i18n';
    import { gsap } from 'gsap';
    import { fade } from 'svelte/transition';
    
    // Language handling
    let lang;
    currentLang.subscribe(value => {
      lang = value;
    });
    
    // Booking translations
    const content = {
      hu: {
        title: 'FOGLALÁS',
        subtitle: 'Foglaljon időpontot szolgáltatásainkra gyorsan és egyszerűen',
        serviceSelection: {
          title: 'VÁLASSZON SZOLGÁLTATÁST',
          description: 'Válassza ki a kívánt szolgáltatást az alábbi opciók közül'
        },
        services: {
          airportParking: {
            title: 'REPTÉRI PARKOLÁS',
            description: 'Biztonságos parkolás a repülőtér közelében, 24/7 felügyelettel'
          },
          carWash: {
            title: 'AUTÓMOSÓ',
            description: 'Professzionális autómosó szolgáltatások'
          },
          autoService: {
            title: 'AUTÓSZERVIZ',
            description: 'Teljes körű autószerviz és karbantartás'
          },
          tireService: {
            title: 'GUMISZERVIZ',
            description: 'Gumiabroncs csere, javítás és tárolás'
          }
        },
        bookingForm: {
          airportParking: {
            title: 'REPTÉRI PARKOLÁS FOGLALÁS',
            dateRange: 'Parkolási időszak',
            startDate: 'Érkezési dátum',
            startTime: 'Érkezési idő',
            endDate: 'Távozási dátum',
            endTime: 'Távozási idő',
            licensePlate: 'Rendszám',
            licensePlateRequired: 'A rendszám megadása kötelező',
            priceInfo: 'Napi díj: 2 500 Ft',
            totalPrice: 'Teljes összeg',
            days: 'nap',
            passengers: 'Utasok száma',
            passengersRequired: 'Az utasok számának megadása kötelező',
            addCarWash: 'Szeretne kedvezményes autómosást a parkolással?',
            carWashOptions: {
              title: 'Autómosó csomag',
              none: 'Nem kérek',
              smartExterior: 'SMART - Külső mosás (2000 Ft)',
              smartInterior: 'SMART - Belső takarítás (2000 Ft)',
              smartFull: 'SMART - Teljes (3500 Ft)',
              premiumExterior: 'PRÉMIUM - Külső mosás (3000 Ft)',
              premiumInterior: 'PRÉMIUM - Belső takarítás (3000 Ft)',
              premiumFull: 'PRÉMIUM - Teljes (5000 Ft)'
            }
          },
          carWash: {
            title: 'AUTÓMOSÓ IDŐPONTFOGLALÁS',
            date: 'Válasszon dátumot',
            time: 'Válasszon időpontot'
          },
          autoService: {
            title: 'AUTÓSZERVIZ IDŐPONTFOGLALÁS',
            date: 'Válasszon dátumot',
            time: 'Válasszon időpontot',
            serviceType: 'Szerviz típusa',
            serviceOptions: {
              maintenance: 'Általános karbantartás',
              repair: 'Javítás',
              diagnostic: 'Diagnosztika',
              other: 'Egyéb'
            },
            description: 'Probléma leírása (opcionális)'
          },
          tireService: {
            title: 'GUMISZERVIZ IDŐPONTFOGLALÁS',
            date: 'Válasszon dátumot',
            time: 'Válasszon időpontot',
            serviceType: 'Szolgáltatás típusa',
            serviceOptions: {
              change: 'Gumiabroncs csere',
              repair: 'Javítás',
              balancing: 'Kerékkiegyensúlyozás',
              storage: 'Gumitárolás'
            }
          },
          personalInfo: {
            title: 'SZEMÉLYES ADATOK',
            firstName: 'Keresztnév',
            firstNameRequired: 'Keresztnév megadása kötelező',
            lastName: 'Vezetéknév',
            lastNameRequired: 'Vezetéknév megadása kötelező',
            email: 'Email cím',
            emailInvalid: 'Érvénytelen email cím',
            phone: 'Telefonszám',
            phoneRequired: 'Telefonszám megadása kötelező',
            phoneInvalid: 'Érvénytelen telefonszám'
          },
          submit: 'FOGLALÁS MEGERŐSÍTÉSE',
          processing: 'Feldolgozás...',
          timeSlots: {
            morning: 'Délelőtt',
            afternoon: 'Délután'
          }
        },
        confirmation: {
          title: 'FOGLALÁS MEGERŐSÍTVE',
          subtitle: 'Köszönjük a foglalását!',
          details: 'Foglalás részletei',
          service: 'Szolgáltatás',
          date: 'Dátum',
          time: 'Időpont',
          name: 'Név',
          contactInfo: 'Elérhetőség',
          emailSent: 'A foglalás részleteit elküldtük az email címére.',
          return: 'Vissza a főoldalra'
        }
      },
      en: {
        title: 'BOOKING',
        subtitle: 'Book our services quickly and easily',
        serviceSelection: {
          title: 'SELECT A SERVICE',
          description: 'Choose the service you need from the options below'
        },
        services: {
          airportParking: {
            title: 'AIRPORT PARKING',
            description: 'Secure parking near the airport with 24/7 surveillance'
          },
          carWash: {
            title: 'CAR WASH',
            description: 'Professional car washing services'
          },
          autoService: {
            title: 'AUTO SERVICE',
            description: 'Complete auto service and maintenance'
          },
          tireService: {
            title: 'TIRE SERVICE',
            description: 'Tire replacement, repair, and storage'
          }
        },
        bookingForm: {
          airportParking: {
            title: 'AIRPORT PARKING BOOKING',
            dateRange: 'Parking period',
            startDate: 'Arrival date',
            startTime: 'Arrival time',
            endDate: 'Departure date',
            endTime: 'Departure time',
            licensePlate: 'License plate',
            licensePlateRequired: 'License plate is required',
            priceInfo: 'Daily rate: 2 500 HUF',
            totalPrice: 'Total price',
            days: 'days',
            passengers: 'Number of passengers',
            passengersRequired: 'Number of passengers is required',
            addCarWash: 'Would you like a discounted car wash with your parking?',
            carWashOptions: {
              title: 'Car wash package',
              none: 'No, thanks',
              smartExterior: 'SMART - Exterior only (2000 HUF)',
              smartInterior: 'SMART - Interior only (2000 HUF)',
              smartFull: 'SMART - Full service (3500 HUF)',
              premiumExterior: 'PREMIUM - Exterior only (3000 HUF)',
              premiumInterior: 'PREMIUM - Interior only (3000 HUF)',
              premiumFull: 'PREMIUM - Full service (5000 HUF)'
            }
          },
          carWash: {
            title: 'CAR WASH APPOINTMENT',
            date: 'Select a date',
            time: 'Select a time'
          },
          autoService: {
            title: 'AUTO SERVICE APPOINTMENT',
            date: 'Select a date',
            time: 'Select a time',
            serviceType: 'Service type',
            serviceOptions: {
              maintenance: 'General maintenance',
              repair: 'Repair',
              diagnostic: 'Diagnostics',
              other: 'Other'
            },
            description: 'Problem description (optional)'
          },
          tireService: {
            title: 'TIRE SERVICE APPOINTMENT',
            date: 'Select a date',
            time: 'Select a time',
            serviceType: 'Service type',
            serviceOptions: {
              change: 'Tire replacement',
              repair: 'Repair',
              balancing: 'Wheel balancing',
              storage: 'Tire storage'
            }
          },
          personalInfo: {
            title: 'PERSONAL INFORMATION',
            firstName: 'First name',
            firstNameRequired: 'First name is required',
            lastName: 'Last name',
            lastNameRequired: 'Last name is required',
            email: 'Email address',
            emailInvalid: 'Invalid email address',
            phone: 'Phone number',
            phoneRequired: 'Phone number is required',
            phoneInvalid: 'Invalid phone number'
          },
          submit: 'CONFIRM BOOKING',
          processing: 'Processing...',
          timeSlots: {
            morning: 'Morning',
            afternoon: 'Afternoon'
          }
        },
        confirmation: {
          title: 'BOOKING CONFIRMED',
          subtitle: 'Thank you for your booking!',
          details: 'Booking details',
          service: 'Service',
          date: 'Date',
          time: 'Time',
          name: 'Name',
          contactInfo: 'Contact information',
          emailSent: 'Booking details have been sent to your email address.',
          return: 'Return to homepage'
        }
      }
    };
    
    // Available time slots for services (except airport parking)
    const timeSlots = {
      morning: ['08:00', '09:00', '10:00', '11:00', '12:00'],
      afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00']
    };
    
    // State variables
    let currentStep = 1;
    let selectedService = null;
    let showConfirmation = false;
    let isSubmitting = false;
    let servicesLoaded = false; // Track if services have been displayed properly
    
    // Car wash pricing
    const carWashPricing = {
      smartExterior: 2000,
      smartInterior: 2000,
      smartFull: 3500,
      premiumExterior: 3000,
      premiumInterior: 3000,
      premiumFull: 5000
    };
    
    // Calendar data
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Allow bookings 3 months in advance
    
    // Form data
    let formData = {
      // Personal info
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      
      // Airport parking specific
      startDate: formatDate(today),
      startTime: '12:00',
      endDate: formatDate(today),
      endTime: '12:00',
      licensePlate: '',
      passengers: '1',
      carWashPackage: 'none',
      
      // Other services
      bookingDate: formatDate(today),
      bookingTime: '',
      serviceType: '',
      description: ''
    };
    
    // Form validation
    let formErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licensePlate: '',
      passengers: '',
      bookingTime: ''
    };
    
    let bookingDetails = {};
    
    // Utility functions
    function formatDate(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      
      return [year, month, day].join('-');
    }
    
    function parseDate(dateString) {
      return new Date(dateString);
    }
    
    function calculateDays() {
      if (!formData.startDate || !formData.endDate) return 0;
      
      const start = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const end = new Date(`${formData.endDate}T${formData.endTime || '00:00'}`);
      
      // Return 1 for same-day parking
      if (start.toDateString() === end.toDateString()) return 1;
      
      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Handle partial days - consider any partial day as a full day for pricing
      return days;
    }
    
    function calculatePrice() {
      const days = calculateDays();
      const dailyRate = 2500; // HUF
      const parkingTotal = days * dailyRate;
      
      // Add car wash price if selected
      let carWashPrice = 0;
      if (formData.carWashPackage !== 'none') {
        carWashPrice = carWashPricing[formData.carWashPackage];
      }
      
      return parkingTotal + carWashPrice;
    }
    
    function formatCurrency(amount) {
      return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(amount);
    }
    
    // Event handlers
    function selectService(service) {
      selectedService = service;
      currentStep = 2;
      
      // Reset form data when changing service
      formData = {
        ...formData,
        bookingTime: '',
        serviceType: '',
        description: '',
        carWashPackage: 'none'
      };
      
      // Scroll to the top of the form
      window.scrollTo({
        top: document.querySelector('.booking-form-section').offsetTop - 100,
        behavior: 'smooth'
      });
    }
    
    function goBack() {
      if (currentStep > 1) {
        currentStep--;
      }
    }
    
    function validateForm() {
      let isValid = true;
      
      // Reset errors
      formErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licensePlate: '',
        passengers: '',
        bookingTime: ''
      };
      
      // Validate personal info
      if (!formData.firstName.trim()) {
        formErrors.firstName = content[$currentLang].bookingForm.personalInfo.firstNameRequired;
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        formErrors.lastName = content[$currentLang].bookingForm.personalInfo.lastNameRequired;
        isValid = false;
      }
      
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        formErrors.email = content[$currentLang].bookingForm.personalInfo.emailInvalid;
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        formErrors.phone = content[$currentLang].bookingForm.personalInfo.phoneRequired;
        isValid = false;
      } else if (!/^(\+?[0-9]{8,15})$/.test(formData.phone.trim().replace(/\s/g, ''))) {
        formErrors.phone = content[$currentLang].bookingForm.personalInfo.phoneInvalid;
        isValid = false;
      }
      
      // Validate service-specific fields
      if (selectedService === 'airportParking') {
        if (!formData.licensePlate.trim()) {
          formErrors.licensePlate = content[$currentLang].bookingForm.airportParking.licensePlateRequired;
          isValid = false;
        }
        
        if (!formData.passengers || parseInt(formData.passengers) < 1) {
          formErrors.passengers = content[$currentLang].bookingForm.airportParking.passengersRequired;
          isValid = false;
        }
        
        // Ensure end date is not before start date
        if (parseDate(formData.endDate) < parseDate(formData.startDate)) {
          formData.endDate = formData.startDate;
        }
      } else {
        // For other services, a time slot must be selected
        if (!formData.bookingTime) {
          formErrors.bookingTime = 'Please select a time slot';
          isValid = false;
        }
      }
      
      return isValid;
    }
    
    function handleSubmit() {
      if (!validateForm()) return;
      
      isSubmitting = true;
      
      // In a real implementation, this would send data to a server
      setTimeout(() => {
        // Prepare booking details for confirmation screen
        bookingDetails = {
          service: selectedService,
          name: `${formData.lastName} ${formData.firstName}`,
          contact: {
            email: formData.email,
            phone: formData.phone
          }
        };
        
        if (selectedService === 'airportParking') {
          bookingDetails.date = `${formData.startDate} ${formData.startTime} - ${formData.endDate} ${formData.endTime}`;
          bookingDetails.days = calculateDays();
          bookingDetails.totalPrice = calculatePrice();
          bookingDetails.licensePlate = formData.licensePlate;
          bookingDetails.passengers = formData.passengers;
          
          if (formData.carWashPackage !== 'none') {
            bookingDetails.carWashPackage = formData.carWashPackage;
            bookingDetails.carWashPrice = carWashPricing[formData.carWashPackage];
          }
        } else {
          bookingDetails.date = formData.bookingDate;
          bookingDetails.time = formData.bookingTime;
          if (formData.serviceType) {
            bookingDetails.serviceType = formData.serviceType;
          }
          if (formData.description) {
            bookingDetails.description = formData.description;
          }
        }
        
        // Here you would send emails to customer and info@zima-auto.com
        
        isSubmitting = false;
        showConfirmation = true;
      }, 1500);
    }
    
    // Form data reset function
    function resetForm() {
      formData = {
        // Personal info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        
        // Airport parking specific
        startDate: formatDate(today),
        startTime: '12:00',
        endDate: formatDate(today),
        endTime: '12:00',
        licensePlate: '',
        passengers: '1',
        carWashPackage: 'none',
        
        // Other services
        bookingDate: formatDate(today),
        bookingTime: '',
        serviceType: '',
        description: ''
      };
      
      formErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licensePlate: '',
        passengers: '',
        bookingTime: ''
      };
    }
    
    function resetBooking() {
      selectedService = null;
      currentStep = 1;
      showConfirmation = false;
      resetForm();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Fix for services visibility on load
    onMount(() => {
      // Ensure services are visible on page load
      setTimeout(() => {
        servicesLoaded = true;
        
        // Animate elements with a slight delay to ensure proper rendering
        gsap.from('.service-card', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3
        });
      }, 100);
    });
</script>

<section class="booking-hero">
  <div class="container">
    <h1>{content[$currentLang].title}</h1>
    <p>{content[$currentLang].subtitle}</p>
  </div>
</section>

{#if !showConfirmation}
  <!-- Service Selection -->
  {#if currentStep === 1}
    <section class="service-selection-section">
      <div class="container">
        <h2 class="section-title">{content[$currentLang].serviceSelection.title}</h2>
        <p class="section-subtitle">{content[$currentLang].serviceSelection.description}</p>
        
        <!-- Services grid with visibility fix -->
        <div class="services-grid" class:visible={servicesLoaded}>
          <!-- Airport Parking -->
          <div class="service-card" on:click={() => selectService('airportParking')} on:keydown={(e) => e.key === 'Enter' && selectService('airportParking')} tabindex="0" role="button">
            <div class="service-icon">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9 9h2v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9 12h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13 9h2v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13 12h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3>{content[$currentLang].services.airportParking.title}</h3>
            <p>{content[$currentLang].services.airportParking.description}</p>
            <div class="service-action">
              <span>{$currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          
          <!-- Car Wash -->
          <div class="service-card" on:click={() => selectService('carWash')} on:keydown={(e) => e.key === 'Enter' && selectService('carWash')} tabindex="0" role="button">
            <div class="service-icon">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="m9.5 7.5-2 9.5L9 15.5l1.5 2L12 9l1.5 7.5.5-2.5 2.5.5-2-9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3>{content[$currentLang].services.carWash.title}</h3>
            <p>{content[$currentLang].services.carWash.description}</p>
            <div class="service-action">
              <span>{$currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          
          <!-- Auto Service -->
          <div class="service-card" on:click={() => selectService('autoService')} on:keydown={(e) => e.key === 'Enter' && selectService('autoService')} tabindex="0" role="button">
            <div class="service-icon">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3>{content[$currentLang].services.autoService.title}</h3>
            <p>{content[$currentLang].services.autoService.description}</p>
            <div class="service-action">
              <span>{$currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          
          <!-- Tire Service -->
          <div class="service-card" on:click={() => selectService('tireService')} on:keydown={(e) => e.key === 'Enter' && selectService('tireService')} tabindex="0" role="button">
            <div class="service-icon">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 19v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="m19 12 3 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="m2 12 3 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3>{content[$currentLang].services.tireService.title}</h3>
            <p>{content[$currentLang].services.tireService.description}</p>
            <div class="service-action">
              <span>{$currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  {:else if currentStep === 2}
    <!-- Booking Form Section -->
    <section class="booking-form-section">
      <div class="container">
        <div class="booking-header">
          <button class="back-button" on:click={goBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {$currentLang === 'hu' ? 'Vissza' : 'Back'}
          </button>
          
          <h2 class="form-title">
            {#if selectedService === 'airportParking'}
              {content[$currentLang].bookingForm.airportParking.title}
            {:else if selectedService === 'carWash'}
              {content[$currentLang].bookingForm.carWash.title}
            {:else if selectedService === 'autoService'}
              {content[$currentLang].bookingForm.autoService.title}
            {:else if selectedService === 'tireService'}
              {content[$currentLang].bookingForm.tireService.title}
            {/if}
          </h2>
        </div>
        
        <div class="booking-form-container">
          <form class="booking-form" on:submit|preventDefault={handleSubmit}>
            <!-- Service specific form fields -->
            <div class="form-section">
              {#if selectedService === 'airportParking'}
                <!-- Airport Parking Form -->
                <div class="form-row">
                  <h3>{content[$currentLang].bookingForm.airportParking.dateRange}</h3>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="startDate">{content[$currentLang].bookingForm.airportParking.startDate}</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      bind:value={formData.startDate} 
                      min={formatDate(today)} 
                      max={formatDate(maxDate)}
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="startTime">{$currentLang === 'hu' ? 'Érkezési idő' : 'Arrival time'}</label>
                    <input 
                      type="time" 
                      id="startTime" 
                      bind:value={formData.startTime} 
                      required
                    />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="endDate">{content[$currentLang].bookingForm.airportParking.endDate}</label>
                    <input 
                      type="date" 
                      id="endDate" 
                      bind:value={formData.endDate} 
                      min={formData.startDate} 
                      max={formatDate(maxDate)}
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="endTime">{$currentLang === 'hu' ? 'Távozási idő' : 'Departure time'}</label>
                    <input 
                      type="time" 
                      id="endTime" 
                      bind:value={formData.endTime} 
                      required
                    />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="licensePlate">{content[$currentLang].bookingForm.airportParking.licensePlate}</label>
                    <input 
                      type="text" 
                      id="licensePlate" 
                      bind:value={formData.licensePlate} 
                      required
                    />
                    {#if formErrors.licensePlate}
                      <p class="error-message">{formErrors.licensePlate}</p>
                    {/if}
                  </div>
                  
                  <!-- New passenger number input -->
                  <div class="form-group">
                    <label for="passengers">{content[$currentLang].bookingForm.airportParking.passengers}</label>
                    <input 
                      type="number" 
                      id="passengers" 
                      bind:value={formData.passengers} 
                      min="1"
                      max="20"
                      required
                    />
                    {#if formErrors.passengers}
                      <p class="error-message">{formErrors.passengers}</p>
                    {/if}
                  </div>
                </div>
                
                <!-- New car wash add-on section -->
                <div class="form-row car-wash-addon">
                  <h3>{content[$currentLang].bookingForm.airportParking.addCarWash}</h3>
                  
                  <div class="form-group">
                    <label for="carWashPackage">{content[$currentLang].bookingForm.airportParking.carWashOptions.title}</label>
                    <select id="carWashPackage" bind:value={formData.carWashPackage}>
                      <option value="none">{content[$currentLang].bookingForm.airportParking.carWashOptions.none}</option>
                      <option value="smartExterior">{content[$currentLang].bookingForm.airportParking.carWashOptions.smartExterior}</option>
                      <option value="smartInterior">{content[$currentLang].bookingForm.airportParking.carWashOptions.smartInterior}</option>
                      <option value="smartFull">{content[$currentLang].bookingForm.airportParking.carWashOptions.smartFull}</option>
                      <option value="premiumExterior">{content[$currentLang].bookingForm.airportParking.carWashOptions.premiumExterior}</option>
                      <option value="premiumInterior">{content[$currentLang].bookingForm.airportParking.carWashOptions.premiumInterior}</option>
                      <option value="premiumFull">{content[$currentLang].bookingForm.airportParking.carWashOptions.premiumFull}</option>
                    </select>
                  </div>
                </div>
                
                <div class="price-summary">
                  <p class="price-info">{content[$currentLang].bookingForm.airportParking.priceInfo}</p>
                  <div class="price-calculation">
                    <p>
                      <span>{calculateDays()} {content[$currentLang].bookingForm.airportParking.days}</span> × 
                      <span>2 500 Ft</span> = 
                      <span>{formatCurrency(calculateDays() * 2500)}</span>
                    </p>
                    
                    {#if formData.carWashPackage !== 'none'}
                      <p class="car-wash-price">
                        <span>{content[$currentLang].bookingForm.airportParking.carWashOptions.title}:</span>
                        <span>{formatCurrency(carWashPricing[formData.carWashPackage])}</span>
                      </p>
                      <p class="total-price-line">
                        <span>{$currentLang === 'hu' ? 'Végösszeg' : 'Total'}:</span>
                        <span class="total-price">{formatCurrency(calculatePrice())}</span>
                      </p>
                    {:else}
                      <p class="total-price-line">
                        <span>{$currentLang === 'hu' ? 'Végösszeg' : 'Total'}:</span>
                        <span class="total-price">{formatCurrency(calculatePrice())}</span>
                      </p>
                    {/if}
                  </div>
                </div>
              {:else}
                <!-- Other Services Form (Car Wash, Auto Service, Tire Service) -->
                <div class="form-row">
                  <div class="form-group">
                    <label for="bookingDate">
                      {#if selectedService === 'carWash'}
                        {content[$currentLang].bookingForm.carWash.date}
                      {:else if selectedService === 'autoService'}
                        {content[$currentLang].bookingForm.autoService.date}
                      {:else}
                        {content[$currentLang].bookingForm.tireService.date}
                      {/if}
                    </label>
                    <input 
                      type="date" 
                      id="bookingDate" 
                      bind:value={formData.bookingDate} 
                      min={formatDate(today)} 
                      max={formatDate(maxDate)}
                      required
                    />
                  </div>
                </div>
                
                <div class="form-row">
                  <h4>
                    {#if selectedService === 'carWash'}
                      {content[$currentLang].bookingForm.carWash.time}
                    {:else if selectedService === 'autoService'}
                      {content[$currentLang].bookingForm.autoService.time}
                    {:else}
                      {content[$currentLang].bookingForm.tireService.time}
                    {/if}
                  </h4>
                  
                  <div class="time-slots-container">
                    <div class="time-slot-group">
                      <h5>{content[$currentLang].bookingForm.timeSlots.morning}</h5>
                      <div class="time-slots">
                        {#each timeSlots.morning as time}
                          <button 
                            type="button"
                            class="time-slot {formData.bookingTime === time ? 'selected' : ''}"
                            on:click={() => formData.bookingTime = time}
                          >
                            {time}
                          </button>
                        {/each}
                      </div>
                    </div>
                    
                    <div class="time-slot-group">
                      <h5>{content[$currentLang].bookingForm.timeSlots.afternoon}</h5>
                      <div class="time-slots">
                        {#each timeSlots.afternoon as time}
                          <button 
                            type="button"
                            class="time-slot {formData.bookingTime === time ? 'selected' : ''}"
                            on:click={() => formData.bookingTime = time}
                          >
                            {time}
                          </button>
                        {/each}
                      </div>
                    </div>
                  </div>
                  
                  {#if formErrors.bookingTime}
                    <p class="error-message">{formErrors.bookingTime}</p>
                  {/if}
                </div>
                
                {#if selectedService === 'autoService'}
                  <!-- Auto Service specific fields -->
                  <div class="form-row">
                    <div class="form-group">
                      <label for="serviceType">{content[$currentLang].bookingForm.autoService.serviceType}</label>
                      <select id="serviceType" bind:value={formData.serviceType}>
                        <option value=""></option>
                        <option value="maintenance">{content[$currentLang].bookingForm.autoService.serviceOptions.maintenance}</option>
                        <option value="repair">{content[$currentLang].bookingForm.autoService.serviceOptions.repair}</option>
                        <option value="diagnostic">{content[$currentLang].bookingForm.autoService.serviceOptions.diagnostic}</option>
                        <option value="other">{content[$currentLang].bookingForm.autoService.serviceOptions.other}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label for="description">{content[$currentLang].bookingForm.autoService.description}</label>
                      <textarea id="description" rows="3" bind:value={formData.description}></textarea>
                    </div>
                  </div>
                {:else if selectedService === 'tireService'}
                  <!-- Tire Service specific fields -->
                  <div class="form-row">
                    <div class="form-group">
                      <label for="serviceType">{content[$currentLang].bookingForm.tireService.serviceType}</label>
                      <select id="serviceType" bind:value={formData.serviceType}>
                        <option value=""></option>
                        <option value="change">{content[$currentLang].bookingForm.tireService.serviceOptions.change}</option>
                        <option value="repair">{content[$currentLang].bookingForm.tireService.serviceOptions.repair}</option>
                        <option value="balancing">{content[$currentLang].bookingForm.tireService.serviceOptions.balancing}</option>
                        <option value="storage">{content[$currentLang].bookingForm.tireService.serviceOptions.storage}</option>
                      </select>
                    </div>
                  </div>
                {/if}
              {/if}
            </div>
            
            <!-- Personal Information -->
            <div class="form-section">
              <h3>{content[$currentLang].bookingForm.personalInfo.title}</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="lastName">{content[$currentLang].bookingForm.personalInfo.lastName}</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    bind:value={formData.lastName} 
                    required
                  />
                  {#if formErrors.lastName}
                    <p class="error-message">{formErrors.lastName}</p>
                  {/if}
                </div>
                
                <div class="form-group">
                  <label for="firstName">{content[$currentLang].bookingForm.personalInfo.firstName}</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    bind:value={formData.firstName} 
                    required
                  />
                  {#if formErrors.firstName}
                    <p class="error-message">{formErrors.firstName}</p>
                  {/if}
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="email">{content[$currentLang].bookingForm.personalInfo.email}</label>
                  <input 
                    type="email" 
                    id="email" 
                    bind:value={formData.email}
                  />
                  {#if formErrors.email}
                    <p class="error-message">{formErrors.email}</p>
                  {/if}
                </div>
                
                <div class="form-group">
                  <label for="phone">{content[$currentLang].bookingForm.personalInfo.phone}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    bind:value={formData.phone} 
                    required
                  />
                  {#if formErrors.phone}
                    <p class="error-message">{formErrors.phone}</p>
                  {/if}
                </div>
              </div>
            </div>
            
            <div class="form-submit">
              <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? content[$currentLang].bookingForm.processing : content[$currentLang].bookingForm.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  {/if}
{:else}
  <!-- Confirmation Page -->
  <section class="confirmation-section" transition:fade={{ duration: 300 }}>
    <div class="container">
      <div class="confirmation-container">
        <div class="confirmation-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4 12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h2>{content[$currentLang].confirmation.title}</h2>
        <p class="confirmation-subtitle">{content[$currentLang].confirmation.subtitle}</p>
        
        <div class="confirmation-details">
          <h3>{content[$currentLang].confirmation.details}</h3>
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">{content[$currentLang].confirmation.service}:</span>
              <span class="detail-value">
                {#if bookingDetails.service === 'airportParking'}
                  {content[$currentLang].services.airportParking.title}
                {:else if bookingDetails.service === 'carWash'}
                  {content[$currentLang].services.carWash.title}
                {:else if bookingDetails.service === 'autoService'}
                  {content[$currentLang].services.autoService.title}
                {:else if bookingDetails.service === 'tireService'}
                  {content[$currentLang].services.tireService.title}
                {/if}
              </span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">{content[$currentLang].confirmation.date}:</span>
              <span class="detail-value">
                {#if bookingDetails.service === 'airportParking'}
                  {$currentLang === 'hu' ? 'Érkezés' : 'Arrival'}: {bookingDetails.date.split(' - ')[0]}<br>
                  {$currentLang === 'hu' ? 'Távozás' : 'Departure'}: {bookingDetails.date.split(' - ')[1]}
                {:else}
                  {bookingDetails.date}
                {/if}
              </span>
            </div>
            
            {#if bookingDetails.time}
              <div class="detail-item">
                <span class="detail-label">{content[$currentLang].confirmation.time}:</span>
                <span class="detail-value">{bookingDetails.time}</span>
              </div>
            {/if}
            
            {#if bookingDetails.serviceType}
              <div class="detail-item">
                <span class="detail-label">{$currentLang === 'hu' ? 'Szolgáltatás típusa' : 'Service type'}:</span>
                <span class="detail-value">
                  {#if bookingDetails.service === 'autoService'}
                    {#if bookingDetails.serviceType === 'maintenance'}
                      {content[$currentLang].bookingForm.autoService.serviceOptions.maintenance}
                    {:else if bookingDetails.serviceType === 'repair'}
                      {content[$currentLang].bookingForm.autoService.serviceOptions.repair}
                    {:else if bookingDetails.serviceType === 'diagnostic'}
                      {content[$currentLang].bookingForm.autoService.serviceOptions.diagnostic}
                    {:else}
                      {content[$currentLang].bookingForm.autoService.serviceOptions.other}
                    {/if}
                  {:else if bookingDetails.service === 'tireService'}
                    {#if bookingDetails.serviceType === 'change'}
                      {content[$currentLang].bookingForm.tireService.serviceOptions.change}
                    {:else if bookingDetails.serviceType === 'repair'}
                      {content[$currentLang].bookingForm.tireService.serviceOptions.repair}
                    {:else if bookingDetails.serviceType === 'balancing'}
                      {content[$currentLang].bookingForm.tireService.serviceOptions.balancing}
                    {:else}
                      {content[$currentLang].bookingForm.tireService.serviceOptions.storage}
                    {/if}
                  {/if}
                </span>
              </div>
            {/if}
            
            {#if bookingDetails.licensePlate}
              <div class="detail-item">
                <span class="detail-label">{content[$currentLang].bookingForm.airportParking.licensePlate}:</span>
                <span class="detail-value">{bookingDetails.licensePlate}</span>
              </div>
            {/if}
            
            {#if bookingDetails.passengers}
              <div class="detail-item">
                <span class="detail-label">{content[$currentLang].bookingForm.airportParking.passengers}:</span>
                <span class="detail-value">{bookingDetails.passengers}</span>
              </div>
            {/if}
            
            {#if bookingDetails.days}
              <div class="detail-item">
                <span class="detail-label">{$currentLang === 'hu' ? 'Időtartam' : 'Duration'}:</span>
                <span class="detail-value">{bookingDetails.days} {content[$currentLang].bookingForm.airportParking.days}</span>
              </div>
            {/if}
            
            {#if bookingDetails.carWashPackage && bookingDetails.carWashPackage !== 'none'}
              <div class="detail-item">
                <span class="detail-label">{content[$currentLang].bookingForm.airportParking.carWashOptions.title}:</span>
                <span class="detail-value">
                  {content[$currentLang].bookingForm.airportParking.carWashOptions[bookingDetails.carWashPackage]}
                </span>
              </div>
            {/if}
            
            {#if bookingDetails.totalPrice}
              <div class="detail-item">
                <span class="detail-label">{content[$currentLang].bookingForm.airportParking.totalPrice}:</span>
                <span class="detail-value">{formatCurrency(bookingDetails.totalPrice)}</span>
              </div>
            {/if}
            
            <div class="detail-item">
              <span class="detail-label">{content[$currentLang].confirmation.name}:</span>
              <span class="detail-value">{bookingDetails.name}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">{content[$currentLang].confirmation.contactInfo}:</span>
              <span class="detail-value">
                {bookingDetails.contact.phone}
                {#if bookingDetails.contact.email}
                  <br>{bookingDetails.contact.email}
                {/if}
              </span>
            </div>
          </div>
        </div>
        
        <p class="email-notice">{content[$currentLang].confirmation.emailSent}</p>
        
        <div class="confirmation-actions">
          <button class="btn btn-primary" on:click={resetBooking}>
            {content[$currentLang].confirmation.return}
          </button>
        </div>
      </div>
    </div>
  </section>
{/if}
  
<style>
  .booking-hero {
    background-color: var(--secondary);
    color: white;
    padding: 8rem 2rem 5rem;
    text-align: center;
  }
  
  .booking-hero h1 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  
  .booking-hero p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
  }
  
  /* Service Selection Section */
  .service-selection-section {
    padding: 5rem 2rem;
    background-color: var(--light);
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.2rem;
    position: relative;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--primary);
  }
  
  .section-subtitle {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 3rem;
    color: var(--text-light);
    font-size: 1.1rem;
  }
  
  /* Services grid fix for visibility issues */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
    width: 100%;
    opacity: 0; /* Start invisible */
    transition: opacity 0.6s ease;
  }
  
  .services-grid.visible {
    opacity: 1; /* Fade in when marked as visible */
  }
  
  .service-card {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 280px;
  }
  
  .service-card:hover,
  .service-card:focus {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    outline: none;
  }
  
  .service-card:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
    border-radius: 10px;
    margin-bottom: 1.2rem;
    color: white;
    transition: all 0.3s ease;
  }
  
  .service-card:hover .service-icon {
    transform: scale(1.1);
  }
  
  .service-card h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: var(--text);
  }
  
  .service-card p {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-light);
    margin-bottom: 1.2rem;
    flex-grow: 1;
  }
  
  .service-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    font-weight: 600;
    font-size: 0.85rem;
    margin-top: auto;
  }
  
  /* Booking Form Section */
  .booking-form-section {
    padding: 5rem 2rem;
    background-color: white;
  }
  
  .booking-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem 0;
  }
  
  .back-button:hover,
  .back-button:focus {
    color: var(--primary);
    transform: translateX(-5px);
    outline: none;
  }
  
  .form-title {
    margin-left: 2rem;
    font-size: 1.8rem;
    flex-grow: 1;
    text-align: center;
  }
  
  .booking-form-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: var(--light);
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }
  
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
    margin-bottom: 1.5rem;
  }
  
  .form-row h4 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--text);
  }
  
  .form-row.date-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .car-wash-addon {
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: rgba(0, 186, 229, 0.05);
    border-radius: 8px;
    border-left: 3px solid var(--primary);
  }
  
  .car-wash-addon h3 {
    grid-column: 1 / -1;
    margin-bottom: 1rem;
  }
  
  .car-wash-addon h3::after {
    display: none;
  }
  
  label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    color: var(--text);
    font-weight: 500;
  }
  
  input, select, textarea {
    padding: 0.8rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
    width: 100%;
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 186, 229, 0.2);
    outline: none;
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .error-message {
    color: #e53e3e;
    font-size: 0.85rem;
    margin-top: 0.5rem;
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
  
  /* Price summary */
  .price-summary {
    background-color: rgba(0, 186, 229, 0.05);
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .price-info {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    color: var(--text);
  }
  
  .price-calculation {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text);
  }
  
  .price-calculation p {
    margin-bottom: 0.5rem;
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
  }
  
  .total-price {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary);
  }
  
  /* Form Submit */
  .form-submit {
    text-align: center;
    margin-top: 2rem;
  }
  
  .form-submit button {
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    min-width: 200px;
  }
  
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
  @media screen and (max-width: 1200px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media screen and (max-width: 992px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media screen and (max-width: 768px) {
    .booking-hero h1 {
      font-size: 2.2rem;
    }
    
    .booking-hero p {
      font-size: 1rem;
    }
    
    .section-title {
      font-size: 1.8rem;
    }
    
    .services-grid {
      grid-template-columns: 1fr;
    }
    
    .booking-form-container {
      padding: 1.5rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .time-slots-container {
      grid-template-columns: 1fr;
    }
    
    .details-grid {
      grid-template-columns: 1fr;
    }
    
    .confirmation-container {
      padding: 2rem 1.5rem;
    }
    
    .confirmation-details {
      padding: 1.5rem;
    }
  }
</style>