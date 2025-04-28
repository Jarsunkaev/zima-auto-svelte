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
        throw new Error(errorMessage);
      }

      // Parse dates and times
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
      const [startHour, startMinute] = startTime.split(':').map(Number);

      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      // Create start and end time objects with Budapest timezone (UTC+2)
      const eventStart = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
      const eventEnd = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);

      // Format dates in ISO string with timezone offset
      const startDateTime = eventStart.toISOString();
      const endDateTime = eventEnd.toISOString();

      event = {
        summary: `${formatServiceName(service, 'hu')} - ${customerName}`,
        description: `Parkolás: ${startDate} ${startTime} - ${endDate} ${endTime}\nÜgyfél: ${customerName}\nEmail: ${bookingData.contact?.email || 'N/A'}\nTelefon: ${bookingData.contact?.phone || 'N/A'}\nRendszám: ${bookingData.licensePlate || 'N/A'}\nAutó típus: ${bookingData.carModel || 'N/A'}`,
        start: {
          dateTime: startDateTime,
          timeZone: 'Europe/Budapest'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Europe/Budapest'
        },
        colorId: getServiceColorId(service)
      };
    } else {
      // Handle other services (car wash, auto service, tire service)
      console.log('Creating service calendar event');

      // Parse date and time
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);

      // Create event time with Budapest timezone (UTC+2)
      const eventTime = new Date(year, month - 1, day, hour, minute);

      // Format date in ISO string with timezone offset
      const eventDateTime = eventTime.toISOString();

      // Calculate end time (1 hour duration for services)
      const endTime = new Date(eventTime);
      endTime.setHours(endTime.getHours() + 1);
      const endDateTime = endTime.toISOString();

      event = {
        summary: `${formatServiceName(service, 'hu')} - ${customerName}`,
        description: `Időpont: ${date} ${time}\nÜgyfél: ${customerName}\nEmail: ${bookingData.contact?.email || 'N/A'}\nTelefon: ${bookingData.contact?.phone || 'N/A'}\nRendszám: ${bookingData.licensePlate || 'N/A'}\nAutó típus: ${bookingData.carModel || 'N/A'}\nMegjegyzés: ${bookingData.notes || 'N/A'}`,
        start: {
          dateTime: eventDateTime,
          timeZone: 'Europe/Budapest'
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Europe/Budapest'
        },
        colorId: getServiceColorId(service)
      };
    }

    // Add the event to the calendar
    const response = await calendar.events.insert({
      calendarId,
      resource: event
    });

    console.log('Event added to calendar:', response.data);
    return response.data.id;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
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
