// utils/googleCalendar.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Target timezone for all Google Calendar events
const CALENDAR_TIMEZONE = 'Europe/Budapest';

/**
 * Get an authenticated Google Calendar client
 * 
 * @returns {Promise<calendar_v3.Calendar>} The authenticated Google Calendar client
 */
async function getGoogleCalendarClient() {
  try {
    // Path to credentials file 
    const keyPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS || 'google-credentials.json');
    
    // Check if the file exists
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Google credentials file not found at: ${keyPath}`);
    }

    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    
    // Set up JWT auth client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );
    
    // Create the calendar client
    const calendar = google.calendar({ version: 'v3', auth });
    
    return calendar;
  } catch (error) {
    console.error('Error creating Google Calendar client:', error);
    throw error;
  }
}

/**
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
      return '6'; // Blueberry (blue) for airport parking
    case 'carWash':
      return '1'; // Peacock (teal) for car wash
    case 'autoService':
      return '8'; // Tomato (red) for auto service
    case 'tireService':
      return '5'; // Basil (green) for tire service
    default:
      return '1'; // Default to Lavender
  }
}

/**
 * Add an event to Google Calendar
 * 
 * @param {calendar_v3.Calendar} calendar - The Google Calendar client
 * @param {string} service - The type of service being booked
 * @param {string} date - The date of the booking (YYYY-MM-DD)
 * @param {string} time - The time of the booking (HH:MM)
 * @param {string} customerName - The name of the customer
 * @param {Object} bookingData - Additional booking details
 * @returns {Promise<string>} The ID of the created event
 */
async function addEventToCalendar(calendar, service, date, time, customerName, bookingData) {
  try {
    // Set event title based on service type
    let summary;
    let description = '';
    let startDateTime;
    let endDateTime;
    let eventDuration = 60; // Default duration in minutes

    // Get the service-specific duration in minutes
    switch (service) {
      case 'carWash':
        eventDuration = 60; // 1 hour for car wash
        break;
      case 'autoService':
        eventDuration = 120; // 2 hours for auto service
        break;
      case 'tireService':
        eventDuration = 60; // 1 hour for tire service
        break;
      case 'airportParking':
        // For airport parking, we use the date range directly
        break;
    }

    // For airport parking, handle start and end times specially
    if (service === 'airportParking') {
      // Check if we have calendarStartTime and calendarEndTime from server.js timezone adjustments
      if (bookingData.calendarStartTime && bookingData.calendarEndTime) {
        // Use pre-adjusted Date objects
        startDateTime = bookingData.calendarStartTime;
        endDateTime = bookingData.calendarEndTime;
      } 
      // Fallback to parsing from strings if we don't have adjusted dates
      else if (bookingData.startDate && bookingData.startTime && bookingData.endDate && bookingData.endTime) {
        const [startYear, startMonth, startDay] = bookingData.startDate.split('-').map(Number);
        const [startHour, startMinute] = bookingData.startTime.split(':').map(Number);
        startDateTime = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
        
        const [endYear, endMonth, endDay] = bookingData.endDate.split('-').map(Number);
        const [endHour, endMinute] = bookingData.endTime.split(':').map(Number);
        endDateTime = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);
      } 
      // Last resort fallback - shouldn't reach here if server.js is working correctly
      else {
        console.error('Missing date/time fields for airport parking - using defaults');
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);
        
        startDateTime = new Date(year, month - 1, day, hour, minute);
        // Default end time is 3 days later
        endDateTime = new Date(startDateTime.getTime() + (3 * 24 * 60 * 60 * 1000));
      }

      // Format summary and description for airport parking
      summary = `Airport Parking - ${bookingData.licensePlate || 'No plate'}`;
      description = `
Customer: ${customerName}
Phone: ${bookingData.customerPhone || 'Not provided'}
Email: ${bookingData.customerEmail || 'Not provided'}
License Plate: ${bookingData.licensePlate || 'Not provided'}
Passengers: ${bookingData.passengers || 'Not specified'}
Car Wash Included: ${bookingData.carWashPackage !== 'none' ? 'Yes' : 'No'}
${bookingData.notes ? `Notes: ${bookingData.notes}` : ''}
`;
    } 
    // For other services (not airport parking)
    else {
      // Check if we have a pre-adjusted calendarDateTime from server.js timezone adjustments
      if (bookingData.calendarDateTime) {
        startDateTime = bookingData.calendarDateTime;
      } 
      // Fallback to parsing from date and time strings
      else {
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);
        startDateTime = new Date(year, month - 1, day, hour, minute);
      }
      
      // Calculate end time based on event duration
      endDateTime = new Date(startDateTime.getTime() + (eventDuration * 60 * 1000));

      // Format summary and description based on service type
      switch (service) {
        case 'carWash':
          summary = `Car Wash - ${customerName}`;
          description = `
Customer: ${customerName}
Phone: ${bookingData.customerPhone || 'Not provided'}
Email: ${bookingData.customerEmail || 'Not provided'}
${bookingData.notes ? `Notes: ${bookingData.notes}` : ''}
`;
          break;
          
        case 'autoService':
          summary = `Auto Service - ${bookingData.serviceType || 'General'} - ${customerName}`;
          description = `
Customer: ${customerName}
Service Type: ${bookingData.serviceType || 'Not specified'}
Car Model: ${bookingData.carModel || 'Not provided'}
License Plate: ${bookingData.licensePlate || 'Not provided'}
Phone: ${bookingData.customerPhone || 'Not provided'}
Email: ${bookingData.customerEmail || 'Not provided'}
${bookingData.notes ? `Notes: ${bookingData.notes}` : ''}
`;
          break;
          
        case 'tireService':
          summary = `Tire Service - ${bookingData.serviceType || 'General'} - ${customerName}`;
          description = `
Customer: ${customerName}
Service Type: ${bookingData.serviceType || 'Not specified'}
Tire Count: ${bookingData.tireCount || 'Not specified'}
Car Model: ${bookingData.carModel || 'Not provided'}
License Plate: ${bookingData.licensePlate || 'Not provided'}
Phone: ${bookingData.customerPhone || 'Not provided'}
Email: ${bookingData.customerEmail || 'Not provided'}
${bookingData.notes ? `Notes: ${bookingData.notes}` : ''}
`;
          break;
      }
    }

    // Convert the dates to ISO strings for Google Calendar
    const startISO = startDateTime.toISOString();
    const endISO = endDateTime.toISOString();

    console.log(`Creating calendar event: ${summary}`);
    console.log(`Start: ${startISO} (${startDateTime})`);
    console.log(`End: ${endISO} (${endDateTime})`);
    console.log(`Timezone: ${CALENDAR_TIMEZONE}`);
    console.log(`Color: ${getServiceColorId(service)}`);

    // Create the event
    const event = {
      summary,
      description,
      start: {
        dateTime: startISO,
        timeZone: CALENDAR_TIMEZONE,
      },
      end: {
        dateTime: endISO,
        timeZone: CALENDAR_TIMEZONE,
      },
      // Add color based on service type
      colorId: getServiceColorId(service),
      // You can add additional fields like reminders, attendees, etc. here
    };

    // Insert the event
    const response = await calendar.events.insert({
      calendarId: 'primary', // Using the primary calendar
      resource: event,
    });

    console.log(`Event created: ${response.data.htmlLink}`);
    return response.data.id; // Return the event ID
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    throw error;
  }
}

/**
 * Check availability of time slots for a specific date and service
 * 
 * @param {calendar_v3.Calendar} calendar - The Google Calendar client
 * @param {string} date - The date to check (YYYY-MM-DD)
 * @param {string} service - The service type to check
 * @returns {Promise<string[]>} List of unavailable time slots
 */
async function checkTimeSlotAvailability(calendar, date, service) {
  try {
    // Create start and end of day timestamps
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0).toISOString();
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59).toISOString();

    // Query Google Calendar for events on this day
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    const unavailableSlots = [];

    // Only get the events that contain this service type in the summary or description
    const serviceEvents = events.filter(event => {
      const summary = event.summary?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      
      switch (service) {
        case 'carWash':
          return summary.includes('car wash');
        case 'autoService':
          return summary.includes('auto service');
        case 'tireService':
          return summary.includes('tire service');
        case 'airportParking':
          return summary.includes('airport parking');
        default:
          return false;
      }
    });

    // For each service event, mark all overlapping time slots as unavailable
    for (const event of serviceEvents) {
      // Skip events without start or end times
      if (!event.start?.dateTime || !event.end?.dateTime) continue;

      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      // Generate all time slots based on the service's business hours
      const allSlots = generateTimeSlots(service);

      // For each possible time slot, check if it overlaps with any event
      for (const slot of allSlots) {
        const [slotHour, slotMinute] = slot.split(':').map(Number);
        const slotStart = new Date(year, month - 1, day, slotHour, slotMinute);
        
        // Determine slot end time based on service type
        let slotDurationMinutes = 30; // Default slot duration
        switch (service) {
          case 'carWash':
            slotDurationMinutes = 60; // 1 hour for car wash
            break;
          case 'autoService':
            slotDurationMinutes = 120; // 2 hours for auto service
            break;
          case 'tireService':
            slotDurationMinutes = 60; // 1 hour for tire service
            break;
        }
        
        const slotEnd = new Date(slotStart.getTime() + slotDurationMinutes * 60 * 1000);

        // Check if this slot overlaps with the event
        if (
          (slotStart >= eventStart && slotStart < eventEnd) || // Slot starts during event
          (slotEnd > eventStart && slotEnd <= eventEnd) || // Slot ends during event
          (slotStart <= eventStart && slotEnd >= eventEnd) // Slot completely contains event
        ) {
          // This slot is unavailable
          if (!unavailableSlots.includes(slot)) {
            unavailableSlots.push(slot);
          }
        }
      }
    }

    return unavailableSlots.sort();
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    throw error;
  }
}

// Helper function to generate time slots
function generateTimeSlots(service) {
  const slots = [];
  const businessHours = {
    'carWash': [8, 18],       // 8:00 - 18:00
    'autoService': [8, 17],   // 8:00 - 17:00
    'tireService': [8, 17],   // 8:00 - 17:00
    'airportParking': [0, 24] // 24/7 service
  };
  
  const [openingHour, closingHour] = businessHours[service] || [8, 17];
  
  for (let hour = openingHour; hour < closingHour; hour += 0.5) {
    const hourPart = Math.floor(hour);
    const minutePart = (hour % 1) * 60; // This will be 0 or 30
    const timeSlot = `${hourPart.toString().padStart(2, '0')}:${minutePart.toString().padStart(2, '0')}`;
    slots.push(timeSlot);
  }
  
  return slots.sort();
}

module.exports = {
  getGoogleCalendarClient,
  addEventToCalendar,
  checkTimeSlotAvailability,
  generateTimeSlots
};