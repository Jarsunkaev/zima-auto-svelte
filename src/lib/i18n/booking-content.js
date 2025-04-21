// src/lib/booking-content.js
// Translations content for the booking page and its components

export const content = {
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
            smartInteriorExterior: 'SMART - Belső és Külső (8900 Ft)',
            premiumInteriorExterior: 'PRÉMIUM - Belső és Külső (12000 Ft)'
          },
          parkingTotal: 'Parkolás díj',
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
            smartInteriorExterior: 'SMART - Interior and Exterior (8900 HUF)',
            premiumInteriorExterior: 'PREMIUM - Interior and Exterior (12000 HUF)'
          },
          parkingTotal: 'Parking fee',
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