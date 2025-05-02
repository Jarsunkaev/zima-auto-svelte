const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
// Add moment-timezone for proper timezone handling
const moment = require('moment-timezone');

// Read the service account key
async function getServiceAccountCredentials() {
  try {
    let credentials;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        console.log('Loaded Google Calendar credentials from environment variable.');
      } catch (parseError) {
        console.error('Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON:', parseError);
        throw new Error('Failed to parse Google Calendar credentials JSON from environment variable');
      }
    } else {
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../credentials/service-account.json');
      console.log('Attempting to load Google Calendar credentials from file:', credentialsPath);
      const content = await fs.readFile(credentialsPath);
      credentials = JSON.parse(content);
      console.log('Loaded Google Calendar credentials from file.');
    }
    if (!credentials || !credentials.client_email || !credentials.private_key) {
      throw new Error('Missing required fields (client_email or private_key) in credentials');
    }
    return credentials;
  } catch (error) {
    console.error('Error loading service account credentials:', error);
    throw new Error('Failed to load Google Calendar credentials: ' + error.message);
  }
}

// Map service types to Calendar color IDs
function getServiceColorId(service) {
  switch (service) {
    case 'airportParking': return '9';
    case 'carWash':        return '7';
    case 'autoService':    return '11';
    case 'tireService':    return '10';
    default:               return '1';
  }
}

// Initialize Google Calendar client
async function getGoogleCalendarClient() {
  try {
    if (process.env.SKIP_CALENDAR_INTEGRATION === 'true') {
      console.warn('Skipping Google Calendar integration (SKIP_CALENDAR_INTEGRATION is true)');
      return {
        events: {
          list: async (params) => ({ data: { items: [] } }),
          insert: async (params) => ({ data: { id: 'mock-event-id-' + Date.now() } })
        }
      };
    }
    const credentials = await getServiceAccountCredentials();
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/calendar'] });
    const client = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: client });
    console.log('Google Calendar client initialized.');
    return calendar;
  } catch (error) {
    console.error('Error initializing Google Calendar client:', error);
    throw error;
  }
}

// Retrieve calendar ID from environment or fallback
function getCalendarId(service) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.error('GOOGLE_CALENDAR_ID environment variable is not set! Falling back to default.');
    // IMPORTANT: Replace with your actual default calendar ID if needed
    return 'ahmedhasimov@zima-auto.com'; // Default calendar ID
  }
  // console.log(`Using Calendar ID: ${calendarId} for service ${service}`); // Log less frequently maybe
  return calendarId;
}

// Format service names for display
function formatServiceName(id, lang = 'en') {
  const map = {
    en: { airportParking: 'Airport Parking', carWash: 'Car Wash', autoService: 'Auto Service', tireService: 'Tire Service' },
    hu: { airportParking: 'Reptéri Parkolás', carWash: 'Autómosó', autoService: 'Autószerviz', tireService: 'Gumiszerviz' }
  };
  return (map[lang] && map[lang][id]) || id;
}

/**
 * Add a booking event with correct Europe/Budapest timezone handling
 */
async function addEventToCalendar(calendar, service, date, time, customerName, bookingData) {
  try {
    const calendarId = getCalendarId(service);
    console.log(`Attempting to add event: service=${service}, date=${date}, time=${time}, customer=${customerName}`);
    // console.log('Booking Data for Calendar:', bookingData); // Reduce logging noise maybe

    let event;
    const timeZone = 'Europe/Budapest'; // Define target timezone

    if (service === 'airportParking') {
      const { startDate, startTime, endDate, endTime, customerEmail, customerPhone, days, licensePlate, passengers, carWashPackage, priceBreakdown, totalPrice, notes } = bookingData;
      if (!startDate || !startTime || !endDate || !endTime) throw new Error('Missing required start/end date/time for airport parking');

      event = {
        summary: `${formatServiceName(service, 'hu')} - ${customerName}`, // Keep HU first for primary display
        description:
          `Service: ${formatServiceName(service, 'en')} / ${formatServiceName(service,'hu')}\n` +
          `Customer: ${customerName}\nEmail: ${customerEmail || 'N/A'}\nPhone: ${customerPhone || 'N/A'}\n` +
          `Duration: ${days || 'N/A'} days\n` +
          (licensePlate ? `License Plate: ${licensePlate}\n` : '') +
          (passengers   ? `Passengers: ${passengers}\n` : '') +
          (carWashPackage && carWashPackage!=='none' ? `Car Wash Package: ${carWashPackage}\n` : '') +
          (priceBreakdown ? `Price Breakdown:\n${Object.entries(priceBreakdown).map(([k,v])=>`  ${k}: ${v} HUF`).join('\n')}\n` : '') +
          (totalPrice ? `Total Price: ${totalPrice} HUF\n` : '') +
          (notes ? `Notes: ${notes}\n` : ''),
        start: { dateTime: `${startDate}T${startTime}:00`, timeZone: timeZone },
        end:   { dateTime: `${endDate}T${endTime}:00`,     timeZone: timeZone },
        colorId: getServiceColorId(service),
        extendedProperties: { private: { service: service, customerEmail: customerEmail, customerPhone: customerPhone, bookingReference: `ZIMA-${Date.now().toString(36).toUpperCase()}` } }
      };
    } else {
      // Determine duration based on service
      const durationMinutes = service === 'carWash' ? 30 : 60; // 30 mins for wash, 60 for others

      // Construct ISO string parts
      const [startHour, startMinute] = time.split(':').map(Number);
      const startDateTimeStr = `${date}T${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;

      // Calculate end time robustly using Date object (it handles date rollovers)
      // IMPORTANT: Construct the date components explicitly to avoid local timezone interpretation issues here.
      const [year, month, day] = date.split('-').map(Number);
      const dtStart = new Date(Date.UTC(year, month - 1, day, startHour, startMinute)); // Use UTC base
      const dtEnd = new Date(dtStart.getTime() + durationMinutes * 60 * 1000);

      // Format end date/time back to ISO string parts in UTC - Google Calendar handles the timezone conversion
      const endDateTimeStr = dtEnd.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss

      let description=
        `Service: ${formatServiceName(service, 'en')} / ${formatServiceName(service,'hu')}\n`+
        `Customer: ${customerName}\nEmail: ${bookingData.customerEmail||'N/A'}\nPhone: ${bookingData.customerPhone||'N/A'}\n`;
      // Add other relevant fields from bookingData
      ['serviceType','carModel','licensePlate','tireCount','notes'].forEach(f=>{if(bookingData[f]!=null && bookingData[f] !== '') description+=`${f.charAt(0).toUpperCase()+f.slice(1)}: ${bookingData[f]}\n`;});

      event={
          summary:`${formatServiceName(service, 'hu')} - ${customerName}`,
          description,
          start:{ dateTime: startDateTimeStr, timeZone: timeZone }, // Tell Google the start time is in Budapest time
          end:{ dateTime: endDateTimeStr, timeZone: timeZone },     // Tell Google the end time is in Budapest time
          colorId:getServiceColorId(service),
          extendedProperties:{ private:{ service: service, bookingReference:`ZIMA-${Date.now().toString(36).toUpperCase()}`}}
      };
    }

    const response=await calendar.events.insert({calendarId, resource:event});
    console.log('Event created:', response.data.id);
    return response.data.id;
  } catch(error) {
    console.error(`Error adding event to Google Calendar (Service: ${service}, Date: ${date}, Time: ${time}):`, error.message);
    // Optionally re-throw or handle specific errors (e.g., quota limits)
    throw error;
  }
}

/**
 * Check time slot availability using UTC for comparison.
 * ACCEPTS the list of potential slots generated by the server.
 */
async function checkTimeSlotAvailability(calendar, date, service, allPotentialSlots) { // Added allPotentialSlots param
  try {
    const calendarId = getCalendarId(service);
    console.log(`Checking availability for ${service} on ${date} against ${allPotentialSlots.length} potential slots`);
    
    // Use moment-timezone to properly handle timezone conversions
    const tz = 'Europe/Budapest';
    
    // Create range for the day in Budapest timezone
    const startOfDay = moment.tz(`${date} 00:00:00`, tz);
    const endOfDay = moment.tz(`${date} 23:59:59`, tz);
    
    // Convert to UTC for the calendar query
    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();
    
    console.log(`Querying Calendar from ${timeMin} to ${timeMax}`);
    
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: tz // Ask Google to return times relative to Budapest
    });

    const events = response.data.items || [];
    // Filter only events specifically booked for *this* service via our system
    const relevantEvents = events.filter(event => event.extendedProperties?.private?.service === service);
    console.log(`Found ${relevantEvents.length} relevant existing events for ${service} on ${date}.`);

    const busySlots = [];
    const timeSlotDurationMinutes = 30; // 30 minutes per slot

    relevantEvents.forEach(event => {
      const eventStart = event.start.dateTime || event.start.date;
      const eventEnd = event.end.dateTime || event.end.date;
      
      // Convert event times to Budapest timezone
      const eventStartLocal = moment.tz(eventStart, tz);
      const eventEndLocal = moment.tz(eventEnd, tz);
      
      // Convert to HH:mm format for the local time
      const eventStartTime = eventStartLocal.format('HH:mm');
      const eventEndTime = eventEndLocal.format('HH:mm');
      
      console.log(`Event: ${event.summary} (${eventStartTime} - ${eventEndTime})`);

      allPotentialSlots.forEach(slot => {
        if (busySlots.includes(slot)) return; // Already marked as busy

        const [slotHour, slotMinute] = slot.split(':').map(Number);
        
        // Create slot times in Budapest timezone
        const slotStart = moment.tz(`${date} ${slot}:00`, tz);
        const slotEnd = moment(slotStart).add(timeSlotDurationMinutes, 'minutes');
        
        // Check for overlap using moment's comparison methods
        // Overlap condition: Event starts before slot ends AND Event ends after slot starts
        if (eventStartLocal.isBefore(slotEnd) && eventEndLocal.isAfter(slotStart)) {
          console.log(`Overlap found: Slot ${slot} overlaps with Event`);
          busySlots.push(slot);
        }
      });
    });

    // Remove duplicates just in case (though the inner check should prevent them)
    const uniqueBusySlots = [...new Set(busySlots)];
    console.log(`Calculated busy slots for ${service} on ${date}:`, uniqueBusySlots);
    return uniqueBusySlots;

  } catch (error) {
    console.error(`Error checking time slot availability (Service: ${service}, Date: ${date}):`, error.message);
    // Log full error for more details if needed
    // console.error(error);
    return []; // Return empty array on error to avoid blocking all slots
  }
}

// REMOVED duplicate generateTimeSlots function

module.exports = {
    getGoogleCalendarClient,
    addEventToCalendar,
    checkTimeSlotAvailability,
    // generateTimeSlots, // Removed from export
    getServiceColorId
};