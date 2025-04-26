// zima-auto-backend/utils/googleCalendar.js
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');

// Read the service account key
async function getServiceAccountCredentials() {
  try {
    // In production, you would use environment variables or a secure key management system
    // For development, we'll look for a credentials file
    let credentials;

    // Try loading from environment variable first
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      try {
         credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
         console.log('Loaded Google Calendar credentials from environment variable.');
      } catch (parseError) {
         console.error('Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON:', parseError);
         throw new Error('Failed to parse Google Calendar credentials JSON from environment variable');
      }
    } else {
      // Fallback to loading from file
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                            path.join(__dirname, '../credentials/service-account.json');

      console.log('Attempting to load Google Calendar credentials from file:', credentialsPath);
      const content = await fs.readFile(credentialsPath);
      credentials = JSON.parse(content);
      console.log('Loaded Google Calendar credentials from file.');
    }

    // Basic check for required fields
    if (!credentials || !credentials.client_email || !credentials.private_key) {
        throw new Error('Missing required fields (client_email or private_key) in credentials');
    }

    return credentials;
  } catch (error) {
    console.error('Error loading service account credentials:', error);
    throw new Error('Failed to load Google Calendar credentials: ' + error.message);
  }
}

/*
* Returns the Google Calendar color ID for each service type
* Google Calendar color IDs:
* 1: Lavender (light purple)
* 2: Sage (light green)
* 3: Grape (purple)
* 4: Flamingo (light red)
* 5: Banana (yellow)
* 6: Tangerine (orange)
* 7: Peacock (teal)
* 8: Graphite (gray)
* 9: Blueberry (blue)
* 10: Basil (green)
* 11: Tomato (red)
*/
function getServiceColorId(service) {
 switch (service) {
   case 'airportParking':
     return '9'; // Blueberry (blue) for airport parking
   case 'carWash':
     return '7'; // Peacock (teal) for car wash
   case 'autoService':
     return '11'; // Tomato (red) for auto service
   case 'tireService':
     return '10'; // Basil (green) for tire service
   default:
     return '1'; // Default to Lavender
 }
}

// Initialize Google Calendar client
async function getGoogleCalendarClient() {
  try {
    // If we're in development mode and want to skip actual Google Calendar integration
    if (process.env.SKIP_CALENDAR_INTEGRATION === 'true') {
      console.warn('Skipping Google Calendar integration (SKIP_CALENDAR_INTEGRATION is true)');
      return {
        events: {
          // Mock methods for testing
          list: async (params) => {
             console.log('MOCK CALENDAR: events.list called with params:', params);
             return { data: { items: [] } };
          },
          insert: async (params) => {
             console.log('MOCK CALENDAR: events.insert called with params:', params);
             return { data: { id: 'mock-event-id-' + Date.now() } };
          }
        }
      };
    }

    const credentials = await getServiceAccountCredentials();

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const client = await auth.getClient();

    // Use the Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth: client });
    console.log('Google Calendar client initialized.');

    return calendar;
  } catch (error) {
    console.error('Error initializing Google Calendar client:', error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

// Get the calendar ID for a specific service (using the same calendar for all services)
function getCalendarId(service) {
  // Use environment variable for calendar ID
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
      console.error('GOOGLE_CALENDAR_ID environment variable is not set!');
      // Fallback or throw error depending on how critical calendar integration is
      return 'jarsunkaev@gmail.com'; // Fallback to a default, but HIGHLY recommend using env var
  }
   console.log(`Using Calendar ID: ${calendarId}`);
   return calendarId;
}

// Format service name for display (optional, for event summary/description)
function formatServiceName(serviceId, language = 'en') {
  if (language === 'hu') {
    switch (serviceId) {
      case 'airportParking': return 'Reptéri Parkolás';
      case 'carWash': return 'Autómosó';
      case 'autoService': return 'Autószerviz';
      case 'tireService': return 'Gumiszerviz';
      default: return serviceId;
    }
  } else { // Default to English
    switch (serviceId) {
      case 'airportParking': return 'Airport Parking';
      case 'carWash': return 'Car Wash';
      case 'autoService': return 'Auto Service';
      case 'tireService': return 'Tire Service';
      default: return serviceId;
    }
  }
}

/**
 * Add a booking to Google Calendar
 * @param {Object} calendar - Google Calendar client
 * @param {string} service - Service type (airportParking, carWash, autoService, tireService)
 * @param {string} date - Booking date in YYYY-MM-DD format (start date for parking)
 * @param {string} time - Booking time in HH:MM format (start time for parking)
 * @param {string} customerName - Customer's name
 * @param {Object} bookingData - Complete booking data, including endDate and endTime for parking
 * @returns {string} Event ID of the created calendar event
 */
async function addEventToCalendar(calendar, service, date, time, customerName, bookingData) {
  try {
    const calendarId = getCalendarId(service);
     if (!calendarId || calendarId === 'jarsunkaev@gmail.com') {
        console.warn('Using default or missing GOOGLE_CALENDAR_ID. Please set the environment variable.');
    }

    // Log detailed information for debugging
    console.log(`Attempting to add event to calendar: service=${service}, date=${date}, time=${time}`);
    console.log(`Customer: ${customerName}`);
    console.log('Booking Data passed to addEventToCalendar:', JSON.stringify(bookingData, null, 2));

    let event;

    // Special case for airport parking - uses start and end date/times
    if (service === 'airportParking') {
      console.log('Creating airport parking calendar event');

      // Ensure we have the required start and end dates/times from bookingData
      const startDate = bookingData.startDate;
      const startTime = bookingData.startTime;
      const endDate = bookingData.endDate;
      const endTime = bookingData.endTime;

      if (!startDate || !startTime || !endDate || !endTime) {
        const errorMessage = 'Airport parking booking is missing required start/end date/time fields in bookingData.';
        console.error(errorMessage, { startDate, startTime, endDate, endTime });
        throw new Error(errorMessage); // Throw error to indicate failure
      }

      // Parse dates and times
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
      const [startHour, startMinute] = startTime.split(':').map(Number);

      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      // Create start and end time objects (using UTC for consistency, will be displayed in calendar's timezone)
      // Note: Month is 0-indexed in Date constructor
      const eventStart = new Date(Date.UTC(startYear, startMonth - 1, startDay, startHour, startMinute));
      const eventEnd = new Date(Date.UTC(endYear, endMonth - 1, endDay, endHour, endMinute));

       // Basic validation: ensure end time is after start time
       if (eventEnd <= eventStart) {
           const errorMessage = 'Airport parking end time must be after start time.';
           console.error(errorMessage, { eventStart, eventEnd });
           throw new Error(errorMessage);
       }

      console.log(`Airport Parking Event Time Range (UTC): ${eventStart.toISOString()} to ${eventEnd.toISOString()}`);

      // Create description with all relevant details
      let description = `Service: ${formatServiceName(service, 'en')} / ${formatServiceName(service, 'hu')}\n`;
      description += `Customer: ${customerName}\n`;
      description += `Email: ${bookingData.customerEmail || bookingData.contact?.email || 'Not provided'}\n`;
      description += `Phone: ${bookingData.customerPhone || bookingData.contact?.phone || 'Not provided'}\n\n`;
      description += `Duration: ${bookingData.days} days\n`;

      if (bookingData.licensePlate) description += `License Plate: ${bookingData.licensePlate}\n`;
      if (bookingData.passengers) description += `Passengers: ${bookingData.passengers}\n`;
      if (bookingData.carWashPackage && bookingData.carWashPackage !== 'none') {
        description += `Car Wash Package: ${bookingData.carWashPackage}\n`;
        // Include price breakdown details if available
        if (bookingData.priceBreakdown) {
             description += `  Parking Total: ${bookingData.priceBreakdown.parkingTotal} HUF\n`;
             description += `  Car Wash Standard: ${bookingData.priceBreakdown.carWashStandard} HUF\n`;
             if (bookingData.priceBreakdown.carWashDiscount) description += `  Car Wash Discount: ${bookingData.priceBreakdown.carWashDiscount} HUF\n`;
             if (bookingData.priceBreakdown.carWashDiscounted) description += `  Car Wash Discounted: ${bookingData.priceBreakdown.carWashDiscounted} HUF\n`;
        }
      } else if (bookingData.priceBreakdown && bookingData.priceBreakdown.parkingTotal) {
           // Include parking total if no car wash package
            description += `  Parking Total: ${bookingData.priceBreakdown.parkingTotal} HUF\n`;
      }

      if (bookingData.totalPrice) {
        description += `Total Price: ${bookingData.totalPrice} HUF\n`;
      }
       if (bookingData.notes) description += `Notes: ${bookingData.notes}\n`;


      // Create airport parking event resource
      event = {
        summary: `${formatServiceName(service)} - ${customerName}`,
        description,
        start: {
          dateTime: eventStart.toISOString(),
          timeZone: 'Europe/Budapest', // Ensure timezone is correct for display
        },
        end: {
          dateTime: eventEnd.toISOString(),
          timeZone: 'Europe/Budapest', // Ensure timezone is correct for display
        },
        // Add event color based on service type
        colorId: getServiceColorId(service),
        // Metadata
        extendedProperties: {
          private: {
            service,
            customerEmail: bookingData.customerEmail || bookingData.contact?.email || '',
            customerPhone: bookingData.customerPhone || bookingData.contact?.phone || '',
            bookingReference: `ZIMA-${Date.now().toString(36).toUpperCase()}` // Simple unique reference
          }
        }
      };
      console.log('Airport Parking Event Object:', JSON.stringify(event, null, 2));


    }
    // Handle all other services (car wash, auto service, tire service) - use date and time fields
    else {
      console.log(`Creating regular service calendar event for ${service}`);

      // Parse date and time
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);

      // *** MODIFICATION START: Create event start time in the specified timezone (Europe/Budapest) ***
      // Using Date constructor with components is generally safer than parsing strings without timezone
      // Note: Month is 0-indexed in Date constructor (month - 1)
      // Note: This creates a Date object representing the local time in Europe/Budapest
      // We then convert it to ISOString for the API, explicitly setting the timezone in the resource.
      const eventStart = new Date(year, month - 1, day, hour, minute, 0); // Year, Month (0-11), Day, Hour, Minute, Second
      // *** MODIFICATION END: Create event start time in the specified timezone (Europe/Budapest) ***


      // *** MODIFICATION START: Set specific durations based on service type ***
      const durationMinutes =
        service === 'carWash' ? 30 :      // Car wash is 30 minutes
        service === 'autoService' ? 60 :   // Auto service is 60 minutes (1 hour)
        service === 'tireService' ? 60 :   // Tire service is 60 minutes (1 hour)
        30; // Default duration if service not matched
      // *** MODIFICATION END: Set specific durations based on service type ***


      // Calculate event end time
      const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60000);

      console.log(`Regular Service Event Time Range (UTC): ${eventStart.toISOString()} to ${eventEnd.toISOString()}`);
      // >>> Add these log lines for debugging <<<
      console.log(`Event Start Date object value (Local Time): ${eventStart.toString()}`);
      console.log(`Event End Date object value (Local Time): ${eventEnd.toString()}`);


      // Create description
      let description = `Service: ${formatServiceName(service, 'en')} / ${formatServiceName(service, 'hu')}\n`;
      description += `Customer: ${customerName}\n`;
      description += `Email: ${bookingData.customerEmail || bookingData.contact?.email || 'Not provided'}\n`;
      description += `Phone: ${bookingData.customerPhone || bookingData.contact?.phone || 'Not provided'}\n\n`;

      // Add service-specific details from bookingData
      switch (service) {
        case 'autoService':
          if (bookingData.serviceType) description += `Service Type: ${bookingData.serviceType}\n`;
          if (bookingData.carModel) description += `Car Model: ${bookingData.carModel}\n`;
          if (bookingData.licensePlate) description += `License Plate: ${bookingData.licensePlate}\n`;
          if (bookingData.notes) description += `Notes: ${bookingData.notes}\n`;
          break;

        case 'tireService':
          if (bookingData.serviceType) description += `Service Type: ${bookingData.serviceType}\n`;
          if (bookingData.carModel) description += `Car Model: ${bookingData.carModel}\n`;
          if (bookingData.licensePlate) description += `License Plate: ${bookingData.licensePlate}\n`;
          if (bookingData.tireCount !== null && bookingData.tireCount !== undefined) description += `Number of Tires: ${bookingData.tireCount}\n`;
          if (bookingData.notes) description += `Notes: ${bookingData.notes}\n`;
          break;

        case 'carWash':
          // Note: Car wash details like package might be in bookingData if not specifically handled in description before
          if (bookingData.carModel) description += `Car Model: ${bookingData.carModel}\n`;
          if (bookingData.licensePlate) description += `License Plate: ${bookingData.licensePlate}\n`;
          // If car wash package is sent directly in bookingData for carWash service
          if (bookingData.carWashPackage && bookingData.carWashPackage !== 'none') description += `Car Wash Package: ${bookingData.carWashPackage}\n`;
          if (bookingData.notes) description += `Notes: ${bookingData.notes}\n`;
          break;
          // Add cases for other services if needed
      }
       if (bookingData.totalPrice) {
        description += `Total Price: ${bookingData.totalPrice} HUF\n`;
      }


      // Create regular service event resource
      event = {
        summary: `${formatServiceName(service)} - ${customerName}`,
        description,
        start: {
          dateTime: eventStart.toISOString(), // Send ISO string
          timeZone: 'Europe/Budapest', // Explicitly set timezone
        },
        end: {
          dateTime: eventEnd.toISOString(), // Send ISO string
          timeZone: 'Europe/Budapest', // Explicitly set timezone
        },
        // Add event color based on service type
        colorId: getServiceColorId(service),
        // Metadata
        extendedProperties: {
          private: {
            service, // Store the service type here for filtering
            customerEmail: bookingData.customerEmail || bookingData.contact?.email || '',
            customerPhone: bookingData.customerPhone || bookingData.contact?.phone || '',
             bookingReference: `ZIMA-${Date.now().toString(36).toUpperCase()}`
          }
        }
      };
      // >>> Add this log line for debugging <<<
       console.log('Event object sent to Google Calendar:', JSON.stringify(event, null, 2));
    }

     // *** Common part for both service types: Inserting the event ***
     console.log(`Inserting event into calendar ${calendarId}...`);
     const response = await calendar.events.insert({
        calendarId,
        resource: event,
      });

     console.log(`Successfully added event: ${response.data.id}`);
     return response.data.id; // Return the created event ID

  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    // Re-throw the error so the calling function knows it failed
    throw error;
  }
}

// Check time slot availability in Google Calendar
// MODIFICATION START: Filter events by service type
async function checkTimeSlotAvailability(calendar, date, service) {
  try {
    const calendarId = getCalendarId(service);
     if (!calendarId || calendarId === 'jarsunkaev@gmail.com') {
        console.warn('Using default or missing GOOGLE_CALENDAR_ID when checking availability. Please set the environment variable.');
    }
    console.log(`Checking availability for service "${service}" on ${date} in calendar ${calendarId}`);

    // Parse the date to create start and end times for the query
    const [year, month, day] = date.split('-').map(Number);

    // Create start and end of the day in UTC for the calendar query
    // Google Calendar API expects RFC3339 timestamps (ISO 8601 with UTC offset or Z)
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); // Use 999ms for end of the day

    console.log(`Fetching events from ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    // Get the events for the day
    const response = await calendar.events.list({
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true, // Expand recurring events
      orderBy: 'startTime',
       // We could try filtering here, but API list filtering is limited.
       // Filtering after fetching is more reliable based on extended properties.
    });

    const events = response.data.items;
    console.log(`Found ${events.length} events for the day.`);

    // *** MODIFICATION START: Filter events to only include those matching the current service ***
    // This ensures that a Car Wash booking doesn't block an Auto Service slot.
    const relevantEvents = events.filter(event =>
      event.extendedProperties &&
      event.extendedProperties.private &&
      event.extendedProperties.private.service === service // Filter by service type stored when creating the event
    );
     console.log(`Found ${relevantEvents.length} events relevant to service "${service}".`);
    // *** MODIFICATION END: Filter events to only include those matching the current service ***


    // Generate all possible time slots for this service based on business hours
    const timeSlots = generateTimeSlots(service);
    console.log(`Generated ${timeSlots.length} possible time slots for ${service}.`);


    // Mark busy slots based on relevant events
    const busySlots = [];

    relevantEvents.forEach(event => { // Iterate through FILTERED events
      // Get the event start and end times
      // Use the dateTime for timed events, or date for all-day (though our bookings are timed)
      const eventStart = new Date(event.start.dateTime || event.start.date);
      const eventEnd = new Date(event.end.dateTime || event.end.date);

       console.log(`Checking against event: ${event.summary} from ${eventStart.toISOString()} to ${eventEnd.toISOString()}`);

      // Check which generated time slots overlap with the event
      timeSlots.forEach(slot => {
        // Parse the slot time and create a Date object for comparison (using the booking date)
        const [slotHour, slotMinute] = slot.split(':').map(Number);
        // Create Date object for the START of the time slot (using UTC for consistency with event times)
        // Need to create this Date object in the same timezone context as the eventStart/eventEnd for accurate comparison
        // Using the same approach as event creation for consistency
        const slotStart = new Date(year, month - 1, day, slotHour, slotMinute, 0); // Local time in Europe/Budapest context

        // Calculate the END time of the 30-minute slot
        const slotDurationMinutes = 30; // Our defined slot interval for display/checking

        // A time slot is considered busy if it overlaps with the event.
        // Overlap exists if the event starts before the slot ends AND the event ends after the slot starts.
        // This is a standard way to check for time range overlap.
        if (eventStart < new Date(slotStart.getTime() + slotDurationMinutes * 60000) && eventEnd > slotStart) {
           console.log(`  - Slot ${slot} (from ${slotStart.toISOString()} to ${new Date(slotStart.getTime() + slotDurationMinutes * 60000).toISOString()}) OVERLAPS.`);
          if (!busySlots.includes(slot)) {
            busySlots.push(slot);
          }
        } else {
            console.log(`  - Slot ${slot} (from ${slotStart.toISOString()} to ${new Date(slotStart.getTime() + slotDurationMinutes * 60000).toISOString()}) does NOT overlap.`);
        }
      });
    });

    console.log('Determined busy slots:', busySlots);
    return busySlots; // Return the list of busy time slot strings

  } catch (error) {
    console.error('Error checking time slot availability:', error);
    // In case of error, log and return an empty array to avoid blocking all time slots
    // but the frontend might show an error if fetchAvailableSlots failed.
    return [];
  }
}

// Generate time slots for a service based on its business hours
// This function is also used by the frontend component
function generateTimeSlots(service) {
  const businessHours = {
    // Format: [opening hour, closing hour] in 24-hour format
    'carWash': [8, 18],       // 8:00 - 18:00
    'autoService': [8, 17],   // 8:00 - 17:00
    'tireService': [8, 17],   // 8:00 - 17:00
    'airportParking': [0, 24] // 24/7 service
  };

  const slots = [];
  const [openingHour, closingHour] = businessHours[service] || [8, 17]; // Default to 8-17 if service not found

  // Generate slots every 30 minutes from opening hour up to, but not including, closing hour
  // Corrected loop condition to iterate by 0.5 hours (30 minutes)
  for (let hour = openingHour; hour < closingHour; hour += 0.5) {
       const hourPart = Math.floor(hour);
       const minutePart = (hour % 1) * 60; // This will be 0 or 30
       const timeSlot = `${hourPart.toString().padStart(2, '0')}:${minutePart.toString().padStart(2, '0')}`;
       slots.push(timeSlot);
  }


  return slots.sort(); // Sort slots chronologically
}


module.exports = {
  getGoogleCalendarClient,
  addEventToCalendar,
  checkTimeSlotAvailability,
  generateTimeSlots, // Export generateTimeSlots for frontend use or consistency
  getServiceColorId // Exported just in case
};
