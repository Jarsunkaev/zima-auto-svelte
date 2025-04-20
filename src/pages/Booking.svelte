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
          totalPrice: 'Teljes összeg',
          days: 'nap',
          passengers: 'Utasok száma',
          passengersRequired: 'Az utasok számának megadása kötelező',
          addCarWash: 'Szeretne kedvezményes autómosást a parkolással?',
          carWashOptions: {
            title: 'Autómosó csomag',
            none: 'Nem kérek',
            // --- UPDATED: Translations for combined options with placeholder standard prices ---
            smartInteriorExterior: 'SMART - Belső és Külső (ÁR Ft)', // --- UPDATE REQUIRED: Insert actual combined SMART price
            premiumInteriorExterior: 'PRÉMIUM - Belső és Külső (ÁR Ft)' // --- UPDATE REQUIRED: Insert actual combined PREMIUM price
          },
          // --- UPDATED: New text for price summary lines based on new logic ---
          parkingTotal: 'Parkolás díj', // Using the discounted rate
          carWashStandard: 'Autómosó díj (alap)',
          carWashDiscount: 'Autómosó kedvezmény (20%)',
          carWashDiscounted: 'Autómosó díj (kedvezményes)'
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
        },
         // --- ADDED: Translation for time slot error ---
        selectTimeSlot: 'Válasszon időpontot'
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
          totalPrice: 'Total price',
          days: 'days',
          passengers: 'Number of passengers',
          passengersRequired: 'Number of passengers is required',
          addCarWash: 'Would you like a discounted car wash with your parking?',
          carWashOptions: {
            title: 'Car wash package',
            none: 'No, thanks',
            // --- UPDATED: Translations for combined options with placeholder standard prices ---
            smartInteriorExterior: 'SMART - Interior and Exterior (PRICE HUF)', // --- UPDATE REQUIRED: Insert actual combined SMART price
            premiumInteriorExterior: 'PREMIUM - Interior and Exterior (PRICE HUF)' // --- UPDATE REQUIRED: Insert actual combined PREMIUM price
          },
           // --- UPDATED: New text for price summary lines based on new logic ---
          parkingTotal: 'Parking fee', // Using the discounted rate
          carWashStandard: 'Car wash fee (standard)',
          carWashDiscount: 'Car wash discount (20%)',
          carWashDiscounted: 'Car wash fee (discounted)'
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
        },
        // --- ADDED: Translation for time slot error ---
        selectTimeSlot: 'Please select a time slot'
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

  // Car wash pricing - Holds STANDARD combined prices
  const carWashPricing = {
    none: 0, // No car wash
    smartInteriorExterior: 0, // --- UPDATE REQUIRED: Insert actual STANDARD combined SMART price
    premiumInteriorExterior: 0 // --- UPDATE REQUIRED: Insert actual STANDARD combined PREMIUM price
  };

  // --- UPDATED: Function to get the DISCOUNTED daily parking rate ---
  function getDiscountedDailyParkingRate(days) {
    // --- UPDATE REQUIRED: Implement your logic here to return the DISCOUNTED daily rate
    // based on the number of 'days' from your parking price list table.
    // This function should NOT apply the 20% discount; the rate returned is already discounted.
    // Example placeholder logic (replace with your actual DISCOUNTED pricing tiers):
    if (days <= 1) return 2400; // Example DISCOUNTED rate for 1 day (assuming < 24 hours might still be a day)
    if (days <= 3) return 2240; // Example DISCOUNTED rate for up to 3 days
    if (days <= 7) return 2000; // Example DISCOUNTED rate for up to 7 days
    if (days <= 14) return 1760; // Example DISCOUNTED rate for up to 14 days
    return 1600; // Example DISCOUNTED rate for longer stays
  }

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
    // --- UPDATED: Default selected car wash option ---
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
    // Ensure timezone issues are minimized by using UTC or adjusting based on known timezone
    const [year, month, day] = dateString.split('-').map(Number);
    // Using UTC avoids timezone shifts based on user's browser
    return new Date(Date.UTC(year, month - 1, day));
  }

   // --- Calculate days correctly considering arrival/departure times and partial days ---
   function calculateDays() {
      if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) return 0;

      // Parse dates and times in a consistent manner (e.g., as UTC)
      const start = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
      const end = new Date(`${formData.endDate}T${formData.endTime}:00Z`);

      // If end time is before or same as start time, it's 0 days duration (unless it spans midnight)
      if (end <= start) {
           // If end is same day or prior, but start and end dates are different, this indicates an issue or overnight.
           // The logic below handles spanning midnight by calculating total hours.
           // If start and end are identical or end is before start on the same day, duration is effectively 0 for pricing.
           if (formData.startDate === formData.endDate && formData.startTime >= formData.endTime) {
                console.warn("Departure time is before or same as arrival time on the same day. Assuming minimum 1 day if date is valid.");
                // Even if end time is before start time on the same day, it's often treated as a 1-day booking
                // if the arrival date is valid. Let's return 1 day if the start date is valid (not in past).
                 const todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
                 if (start >= todayStart) return 1;
                 return 0; // If start date is in the past, duration is 0.
           }
           // If end date is before start date, it's an invalid range.
           if (parseDate(formData.endDate) < parseDate(formData.startDate)) {
                console.error("Departure date is before arrival date.");
                return 0; // Invalid range results in 0 days
           }
      }


      const diffMilliseconds = end - start;
      const diffHours = diffMilliseconds / (1000 * 60 * 60);

      // Consider any part of a day as a full day for pricing
      // Use Math.ceil to round up to the nearest whole day.
      const days = Math.ceil(diffHours / 24);

      // Ensure a minimum of 1 day if start date is not in the past and end > start
      const todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
       if (days <= 0 && end > start && start >= todayStart) {
           return 1;
       }

      return days > 0 ? days : 0; // Return 0 if days is not positive
  }


  // --- ADDED: Function to calculate total parking price using the discounted rate ---
  function calculateParkingTotal() {
      const days = calculateDays();
      if (days <= 0) return 0; // Ensure at least 1 day for calculation
      const dailyRate = getDiscountedDailyParkingRate(days); // Use the already discounted rate
      return days * dailyRate;
  }

   // --- ADDED: Function to get the standard price of the selected car wash ---
   function getStandardCarWashPrice() {
       const packageKey = formData.carWashPackage;
       // Ensure the selected car wash package key exists in carWashPricing
       if (packageKey !== 'none' && carWashPricing.hasOwnProperty(packageKey)) {
           return carWashPricing[packageKey];
       }
       return 0; // Return 0 if no car wash or package not found
   }

  // --- ADDED: Function to calculate the car wash discount amount ---
   function calculateCarWashDiscount() {
       const standardPrice = getStandardCarWashPrice();
       return standardPrice * 0.20; // 20% discount on the standard car wash price
   }

  // --- ADDED: Function to calculate the discounted car wash price ---
   function calculateDiscountedCarWashPrice() {
       const standardPrice = getStandardCarWashPrice();
       const discount = calculateCarWashDiscount();
       return standardPrice - discount;
   }


  // --- UPDATED: Calculate total price (Discounted Parking + Discounted Car Wash) ---
  function calculatePrice() {
    const parkingTotal = calculateParkingTotal(); // Use the calculated parking total
    const discountedCarWashPrice = calculateDiscountedCarWashPrice(); // Use the calculated discounted car wash price

    return parkingTotal + discountedCarWashPrice;
  }


  function formatCurrency(amount) {
    // Ensure the amount is treated as a number before formatting
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(numericAmount);
  }


  // Event handlers
  function selectService(service) {
    selectedService = service;
    currentStep = 2;

    // Reset form data when changing service
    formData = {
      // Preserve personal info perhaps? Or reset all? Resetting all for simplicity here.
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
      // --- UPDATED: Reset car wash package to none ---
      carWashPackage: 'none',

      // Other services
      bookingDate: formatDate(today),
      bookingTime: '',
      serviceType: '',
      description: ''
    };
     // Also reset form errors
     formErrors = {
         firstName: '',
         lastName: '',
         email: '',
         phone: '',
         licensePlate: '',
         passengers: '',
         bookingTime: ''
     };


    // Scroll to the top of the form
    // Use a slight delay to ensure the element is visible/rendered
     setTimeout(() => {
         const bookingFormSection = document.querySelector('.booking-form-section');
         if (bookingFormSection) {
              window.scrollTo({
                  top: bookingFormSection.offsetTop - 100,
                  behavior: 'smooth'
              });
         } else {
              // Fallback if the section isn't found immediately
               window.scrollTo({ top: 0, behavior: 'smooth' });
         }
     }, 50); // Small delay
  }

  function goBack() {
    if (currentStep > 1) {
      currentStep--;
      // Scroll back to the service selection or top
       setTimeout(() => {
          const serviceSelectionSection = document.querySelector('.service-selection-section');
          if (serviceSelectionSection && currentStep === 1) {
               window.scrollTo({
                   top: serviceSelectionSection.offsetTop - 100,
                   behavior: 'smooth'
               });
          } else {
               // If going back within the form, scroll to the top of the form
               const bookingFormSection = document.querySelector('.booking-form-section');
               if (bookingFormSection) {
                    window.scrollTo({
                        top: bookingFormSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
               } else {
                    // Fallback to top of the page
                     window.scrollTo({ top: 0, behavior: 'smooth' });
               }
          }
       }, 50);
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

      // Validate passengers is a number and within range
      const numPassengers = parseInt(formData.passengers);
      if (isNaN(numPassengers) || numPassengers < 1 || numPassengers > 20) {
         formErrors.passengers = content[$currentLang].bookingForm.airportParking.passengersRequired; // You might want a more specific message here
         isValid = false;
      }


      // --- Basic validation for date range ---
       const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
       const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00Z`);
       const todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)); // Start of today UTC

       // Ensure start date is not in the past (checking against start of today UTC)
       if (startDateTime < todayStart) {
            console.error("Arrival date cannot be in the past.");
            isValid = false;
            // Consider adding a specific error message to formErrors and displaying it
            // e.g., formErrors.startDate = "Arrival date cannot be in the past."; (requires error display for startDate)
       }

       // Ensure end date/time is not before start date/time
       if (endDateTime < startDateTime) {
           console.error("Departure date/time cannot be before arrival date/time.");
           isValid = false;
           // Consider adding a specific error message to formErrors and displaying it
            // e.g., formErrors.endDate = "Departure date/time cannot be before arrival date/time."; (requires error display for endDate)
       }

        // Ensure at least one day is booked (calculateDays accounts for partial days >= 1)
        if (calculateDays() <= 0 && startDateTime < endDateTime) {
             // This case should ideally not happen with calculateDays >= 1 for end > start,
             // but adding a safeguard. If start and end are the same datetime, days is 1.
             console.error("Booking duration must be at least one day.");
             isValid = false;
             // Consider adding a specific error message to formErrors
        }


    } else {
      // For other services, a time slot must be selected
      if (!formData.bookingTime) {
        formErrors.bookingTime = content[$currentLang].bookingForm.selectTimeSlot;
        isValid = false;
      }
    }

    return isValid;
  }

  function handleSubmit() {
    if (!validateForm()) {
        // Scroll to the first error message if validation fails
         setTimeout(() => {
             const firstError = document.querySelector('.error-message');
             if (firstError) {
                 firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
             } else {
                  // Fallback to top of the form if no specific error message element found
                   const bookingFormSection = document.querySelector('.booking-form-section');
                   if (bookingFormSection) {
                        window.scrollTo({
                            top: bookingFormSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                   }
             }
         }, 50);
        return;
    }

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

        // --- UPDATED: Pass detailed price breakdown based on new logic ---
        const standardCarWashPrice = getStandardCarWashPrice();
        const carWashDiscount = calculateCarWashDiscount();
        const discountedCarWashPrice = calculateDiscountedCarWashPrice();

        bookingDetails.priceBreakdown = {
             parkingTotal: calculateParkingTotal(), // This is already discounted
             carWashStandard: standardCarWashPrice,
             carWashDiscount: carWashDiscount,
             carWashDiscounted: discountedCarWashPrice
        };
        bookingDetails.totalPrice = calculatePrice(); // Calculate final total
        bookingDetails.licensePlate = formData.licensePlate;
        bookingDetails.passengers = formData.passengers;

        if (formData.carWashPackage !== 'none') {
          // Use the key for lookup in translations on confirmation page
          bookingDetails.carWashPackage = formData.carWashPackage;
           // Optionally store the displayed name for confirmation clarity
           bookingDetails.carWashPackageName = content[$currentLang].bookingForm.airportParking.carWashOptions[formData.carWashPackage];
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
      console.log("Booking Data:", bookingDetails); // Log booking data for debugging

      isSubmitting = false;
      showConfirmation = true;

       // Scroll to the top of the confirmation section
        setTimeout(() => {
           const confirmationSection = document.querySelector('.confirmation-section');
           if (confirmationSection) {
                window.scrollTo({
                    top: confirmationSection.offsetTop - 100,
                    behavior: 'smooth'
                });
           } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
           }
        }, 50);

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
      // --- UPDATED: Reset car wash package to none ---
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
    // The timeout ensures the DOM is ready and elements are rendered
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
    }, 100); // A small delay (e.g., 50ms or 100ms) can help with initial rendering issues
  });
</script>

<section class="booking-hero">
<div class="container">
  <h1>{content[$currentLang].title}</h1>
  <p>{content[$currentLang].subtitle}</p>
</div>
</section>

{#if !showConfirmation}
{#if currentStep === 1}
  <section class="service-selection-section">
    <div class="container">
      <h2 class="section-title">{content[$currentLang].serviceSelection.title}</h2>
      <p class="section-subtitle">{content[$currentLang].serviceSelection.description}</p>

      <div class="services-grid" class:visible={servicesLoaded}>
        <div class="service-card" on:click={() => selectService('airportParking')} on:keydown={(e) => e.key === 'Enter' && selectService('airportParking')} tabindex="0" role="button">
          <div class="service-icon">
            <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8ZM12,12H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></g></svg>
          </div>
          <h3>{content[$currentLang].services.airportParking.title}</h3>
          <p>{content[$currentLang].services.airportParking.description}</p>
          <div class="service-action">
            <span>{$currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
            <svg fill="#ffffff" viewBox="-4.8 -4.8 33.60 33.60" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></g></svg>
          </div>
        </div>

        <div class="service-card" on:click={() => selectService('carWash')} on:keydown={(e) => e.key === 'Enter' && selectService('carWash')} tabindex="0" role="button">
          <div class="service-icon">
             <svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M142.25,206.819c-11.982,0.247-23.234-6.299-28.755-17.521l-2.751-5.591H62.71l1.296-5.894 c-5.764-0.319-11.242-2.802-15.533-7.128c-4.972-5.008-8.189-12.11-9.732-21.491l-14.374,65.334l0.249,60.473 C10.504,278.339,0,291.007,0,306.138c0,17.674,14.326,32,32,32h22.252c0-39.307,31.979-71.286,71.286-71.286 c12.595,0,24.428,3.297,34.707,9.052v-69.417L142.25,206.819z"></path> </g> </g> <g> <g> <path d="M301.995,74.561c-4.888-8.729-14.137-14.15-24.14-14.15H136.613c5.117,8.867,4.418,20.507,2.632,30.824h39.416 c8.615-10.736,21.831-17.628,36.636-17.628c14.804,0,28.021,6.892,36.636,17.628h24.074l50.407,90.015 c-0.493-4.596,0.054-9.945,2.447-16.113c2.611-6.727,8.117-12.181,14.736-16.29L301.995,74.561z"></path> </g> </g> <g> <g> <path d="M352.07,260.154c-3.421-4.743-6.068-9.242-8.122-13.501l-40.47,13.681c-11.896,4.025-24.553,0.473-32.751-8.072 c0,67.969,0.052,26.197,0.052,85.876h55.885c0-27.503,15.665-51.4,38.532-63.283C360.825,271.131,356.463,266.245,352.07,260.154z "></path> </g> </g> <g> <g> <path d="M490.667,275.966c0-4.949,0-10.028,0-15.137h-23.202c-11.436,0-20.706-9.27-20.706-20.706 c0-11.436,9.27-20.706,20.706-20.706h20.006c-7.529-20.927-27.547-35.896-51.066-35.896h-20.637 c3.383,11.767,5.348,26.998-1.26,39.26c-5.568,10.331-4.45,31.472-4.45,36.857c0,2.834-0.471,5.526-1.302,8.034 c34.198,5.222,60.48,34.833,60.48,70.468c3.943,0,6.995,0,10.765,0c17.672,0,32-14.328,32-32 C512,292.206,503.094,280.36,490.667,275.966z"></path> </g> </g> <g> <g> <path d="M125.539,289.327c-26.957,0.001-48.81,21.854-48.81,48.811s21.853,48.81,48.81,48.81c13.359,0,25.459-5.371,34.272-14.066 v-69.488C150.997,294.698,138.897,289.327,125.539,289.327z M125.539,357.908c-10.919,0-19.77-8.851-19.77-19.77 s8.851-19.77,19.77-19.77c10.919,0,19.77,8.851,19.77,19.77S136.458,357.908,125.539,357.908z"></path> </g> </g> <g> <g> <path d="M397.949,289.328c-26.957,0-48.81,21.853-48.81,48.81c0,26.957,21.852,48.81,48.81,48.81 c26.957,0,48.81-21.853,48.81-48.81C446.758,311.181,424.906,289.328,397.949,289.328z M397.949,357.908 c-10.919,0-19.77-8.851-19.77-19.77s8.851-19.77,19.77-19.77s19.77,8.851,19.77,19.77S408.868,357.908,397.949,357.908z"></path> </g> </g> <g> <g> <path d="M384.574,159.738c-2.448-2.26-6.1-3.212-10.227-3.212c-11.621,0-26.995,7.553-29.773,14.712 c-1.873,4.827-1.758,8.322-0.671,11.21c13.144,0.327,24.716,8.792,28.945,21.305c4.753,14.058-1.07,29.178-13.161,36.697 c1.569,3.091,3.544,6.362,6.055,9.844c8.994,12.472,16.122,16.696,20.858,16.696c4.271,0,6.597-3.434,6.597-7.353 c0-6.78-1.437-30.186,6.469-44.854C407.572,200.115,393.916,168.361,384.574,159.738z"></path> </g> </g> <g> <g> <path d="M123.24,72.004C120.8,59.525,92.948,52.038,84.177,57.639c-13.97,8.921-3.438,18.865-9.36,29.381 c-5.923,10.516-20.068,17.661-20.289,46.903c-0.154,20.329,5.579,27.099,10.73,27.099c2.259,0,4.406-1.303,5.895-3.335 c2.548-3.478,8.601-12.716,16.538-20.826l-1.148-2.332c-7.641-15.526-1.226-34.374,14.301-42.016 c6.617-3.257,14.104-4.104,21.46-2.291C123.718,82.948,124.069,76.249,123.24,72.004z"></path> </g> </g> <g> <g> <path d="M356.879,209.151c-0.001-0.003-0.002-0.007-0.003-0.01c-2.563-7.571-10.85-11.669-18.409-9.099 c-14.502,4.902-23.759,8.033-38.712,13.087c-4.507-7.356-15.44-25.202-20.63-33.671c-7.251-11.835-20.379-19.185-34.258-19.185 c-83.287,0-60.216-0.155-94.254,0.474c-4.401-8.943-18.447-37.486-22.879-46.493c-3.565-7.248-12.34-10.118-19.448-6.62 c-7.199,3.543-10.163,12.249-6.621,19.447c16.505,33.54,11.631,23.638,26.954,54.773c2.49,5.06,7.758,8.245,13.302,8.11 c37.258-0.689,34.271-0.64,35.182-0.64c0,0.256-0.435,84.692-0.435,249.492c0,9.627,7.805,17.431,17.431,17.431 c9.625,0,17.431-7.804,17.431-17.431c0-14.798,0-110.297,0-125.829h7.526c0,15.538,0,110.994,0,125.829 c0,9.627,7.805,17.431,17.431,17.431c9.627,0,17.431-7.804,17.431-17.431c0-54.87-0.049-180.103-0.051-239.359 c0-0.709,0.471-1.331,1.153-1.524c0.682-0.193,1.41,0.09,1.781,0.694c3.083,5.025,9.717,15.869,24.234,39.564 c3.537,5.771,10.603,8.352,17.041,6.174c31.192-10.545,16.238-5.49,49.694-16.801 C355.383,224.992,359.442,216.736,356.879,209.151z"></path> </g> </g> <g> <g> <circle cx="215.299" cy="120.568" r="30.709"></circle> </g> </g> </g></svg>
            </div>
            <h3>{content[$currentLang].services.carWash.title}</h3>
            <p>{content[$currentLang].services.carWash.description}</p>
            <div class="service-action">
              <span>{$currentLang === 'hu' ? 'Foglalás' : 'Book Now'}</span>
              <svg fill="#ffffff" viewBox="-4.8 -4.8 33.60 33.60" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></g></svg>
            </div>
          </div>

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
            <div class="form-section">
              {#if selectedService === 'airportParking'}
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

                <div class="form-row car-wash-addon">
                  <h3>{content[$currentLang].bookingForm.airportParking.addCarWash}</h3>

                  <div class="form-group">
                    <label for="carWashPackage">{content[$currentLang].bookingForm.airportParking.carWashOptions.title}</label>
                    <select id="carWashPackage" bind:value={formData.carWashPackage}>
                      <option value="none">{content[$currentLang].bookingForm.airportParking.carWashOptions.none}</option>
                       <option value="smartInteriorExterior">{content[$currentLang].bookingForm.airportParking.carWashOptions.smartInteriorExterior}</option>
                      <option value="premiumInteriorExterior">{content[$currentLang].bookingForm.airportParking.carWashOptions.premiumInteriorExterior}</option>
                    </select>
                  </div>
                </div>

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
              {:else}
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
                  {bookingDetails.carWashPackageName}
                </span>
              </div>
            {/if}

            {#if bookingDetails.priceBreakdown}
               <div class="detail-item">
                 <span class="detail-label">{content[$currentLang].bookingForm.airportParking.parkingTotal}:</span>
                 <span class="detail-value">{formatCurrency(bookingDetails.priceBreakdown.parkingTotal)}</span>
               </div>
               {#if bookingDetails.priceBreakdown.carWashStandard > 0}
                   <div class="detail-item">
                     <span class="detail-label">{content[$currentLang].bookingForm.airportParking.carWashStandard}:</span>
                     <span class="detail-value">{formatCurrency(bookingDetails.priceBreakdown.carWashStandard)}</span>
                   </div>
                    <div class="detail-item">
                     <span class="detail-label">{content[$currentLang].bookingForm.airportParking.carWashDiscount}:</span>
                     <span class="detail-value" style="color: #e53e3e;">- {formatCurrency(bookingDetails.priceBreakdown.carWashDiscount)}</span>
                   </div>
                   <div class="detail-item">
                    <span class="detail-label">{content[$currentLang].bookingForm.airportParking.carWashDiscounted}:</span>
                    <span class="detail-value">{formatCurrency(bookingDetails.priceBreakdown.carWashDiscounted)}</span>
                   </div>
               {/if}
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
  /* Your existing CSS styles */
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
  /* The 'visible' class and opacity transition are handled by the onMount GSAP animation */
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
    width: 60px; /* You can adjust this */
    height: 60px; /* You can adjust this */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
    border-radius: 10px;
    margin-bottom: 1.2rem;
    color: white;
    transition: all 0.3s ease;
  }

  /* --- Note on SVG Fitting --- */
  /* To make SVGs fit nicely within the .service-icon div,
     ensure the SVGs themselves have appropriate viewBox attributes
     and remove any hardcoded width/height on the SVG element if
     you want the CSS to control their size. The CSS for .service-icon
     (width, height, display, justify-content, align-items) already
     provides a containing box. The SVGs inside should typically have
     `display: block; width: 100%; height: 100%;` to fill their container
     while respecting their aspect ratio based on the viewBox.
  */
   .service-icon svg {
      display: block;
      width: 100%;
      height: 100%;
      /* Optional: add max-width/max-height if you don't want them to fill the box */
      /* object-fit: contain; /* Helps if aspect ratio differs */
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
     .form-title {
         margin-left: 1rem;
         font-size: 1.5rem;
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

    .booking-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .back-button {
        margin-bottom: 1rem;
    }

    .form-title {
        margin-left: 0;
        text-align: left;
        font-size: 1.5rem;
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

   @media screen and (max-width: 480px) {
       .booking-hero h1 {
           font-size: 1.8rem;
       }
        .section-title {
           font-size: 1.5rem;
       }
       .form-title {
           font-size: 1.3rem;
       }
       .booking-form-container {
           padding: 1rem;
       }
       .form-section {
           padding-bottom: 1.5rem;
       }
       .form-section h3 {
           font-size: 1.2rem;
           margin-bottom: 1rem;
       }
       .confirmation-container h2 {
           font-size: 1.5rem;
       }
        .confirmation-details h3 {
           font-size: 1.2rem;
       }
       .detail-value {
           font-size: 1rem;
       }
   }
</style>