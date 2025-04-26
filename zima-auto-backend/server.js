// zima-auto-backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Use port from env or default to 3001

// Import your email utility functions (Corrected Import)
const { sendBookingConfirmationEmails, sendContactEmails } = require('./utils/email'); // <-- FIX HERE
const { getGoogleCalendarClient, addEventToCalendar, checkTimeSlotAvailability } = require('./utils/googleCalendar');

// --- Middleware ---
// Set up CORS - In production, replace with your actual Svelte frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Default to all origins in development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON request bodies

// --- Business Hours Configuration ---
const businessHours = {
  // Format: [opening hour, closing hour] in 24-hour format
  'carWash': [8, 18],       // 8:00 - 18:00
  'autoService': [8, 17],   // 8:00 - 17:00
  'tireService': [8, 17],   // 8:00 - 17:00
  'airportParking': [0, 24] // 24/7 service
};

// Time slot duration in minutes (30 minutes) - This defines the granularity of slots shown on frontend
const timeSlotDuration = 30;

// --- Generate time slots based on business hours ---
// This function generates the list of 30-minute intervals to display on the frontend.
// It does NOT determine booking duration, which is handled in addEventToCalendar.
function generateTimeSlots(service) {
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


// --- Routes ---

// API Endpoint to fetch available time slots
app.get('/api/available-slots', async (req, res) => {
  try {
    const { date, service } = req.query;

    // Validate required parameters
    if (!date || !service) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: date and service are required'
      });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Expected YYYY-MM-DD'
      });
    }

    // Validate service type
    const validServices = ['carWash', 'autoService', 'tireService', 'airportParking'];
    if (!validServices.includes(service)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service type. Expected one of: ' + validServices.join(', ')
      });
    }

    // Get Google Calendar client
    const calendar = await getGoogleCalendarClient();

    // Generate all possible time slots for this service (frontend also does this)
    const allSlots = generateTimeSlots(service);

    // Get busy slots from Google Calendar - checkTimeSlotAvailability now filters by service
    const busySlots = await checkTimeSlotAvailability(calendar, date, service);

    // Respond with the busy slots
    res.status(200).json({
      success: true,
      unavailableSlots: busySlots,
      message: 'Available slots retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching available time slots: ' + error.message
    });
  }
});

// API Endpoint for Contact Form
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const contactData = req.body;

    // Log detailed info for debugging
    console.log('======= CONTACT FORM SUBMISSION =======');
    console.log('Contact data:', JSON.stringify(contactData, null, 2));
    console.log('======================================');

    // Validate required fields
    if (!contactData || !contactData.customerName || !contactData.customerEmail || !contactData.message) {
      console.error('Received invalid contact data: Missing core fields', contactData);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in contact data'
      });
    }

    console.log('Processing contact form submission');

    // Send emails
    try {
      // Call the correctly imported function
      await sendContactEmails(contactData);
      console.log('Contact form emails sent successfully.');
    } catch (emailError) {
      console.error('Error sending contact form emails:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send contact form emails: ' + emailError.message
      });
    }

    // Respond to Frontend
    res.status(200).json({
      success: true,
      message: 'Contact form processed successfully'
    });

  } catch (error) {
    console.error('Error processing contact form submission:', error);

    // Return a general error response for unhandled errors
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred while processing the contact form'
    });
  }
});

// API Endpoint to handle booking data, sending emails, and adding to calendar
app.post('/api/send-booking-emails', async (req, res) => {
  try {
    const bookingData = req.body;

    // Add detailed logging for airport parking
    if (bookingData.service === 'airportParking') {
      console.log('======= AIRPORT PARKING BOOKING =======');
      console.log('Full booking data:', JSON.stringify(bookingData, null, 2));
      // Log the received date field from the frontend
      console.log('Received Date field:', bookingData.date);
      console.log('Received Time field:', bookingData.time); // This will likely be empty for parking
      console.log('======================================');
    }

    // Validate required fields
    if (!bookingData || !bookingData.customerName || !bookingData.customerEmail || !bookingData.service) {
      console.error('Received invalid booking data: Missing core fields', bookingData);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in booking data'
      });
    }

    console.log('Received booking data for service:', bookingData.service);

    // Add booking to Google Calendar with special handling for airport parking
    try {
      // Get Google Calendar client
      const calendar = await getGoogleCalendarClient();

      let dateForCalendar, timeForCalendar, endDateForCalendar, endTimeForCalendar;

      // Handle airport parking differently than other services
      if (bookingData.service === 'airportParking') {
        console.log('Processing airport parking booking for Google Calendar');

        // *** MODIFICATION START: Parse the combined date string for Airport Parking ***
        if (bookingData.date && typeof bookingData.date === 'string') {
            const parts = bookingData.date.split(' - ');
            if (parts.length === 2) {
                const [startDateStr, endDateStr] = parts;
                const [startDatePart, startTimePart] = startDateStr.split(' ');
                const [endDatePart, endTimePart] = endDateStr.split(' ');

                // Basic validation of parsed parts
                if (startDatePart && startTimePart && endDatePart && endTimePart &&
                    /^\d{4}-\d{2}-\d{2}$/.test(startDatePart) && /^\d{2}:\d{2}$/.test(startTimePart) &&
                    /^\d{4}-\d{2}-\d{2}$/.test(endDatePart) && /^\d{2}:\d{2}$/.test(endTimePart)
                   ) {
                    dateForCalendar = startDatePart;
                    timeForCalendar = startTimePart;
                    endDateForCalendar = endDatePart;
                    endTimeForCalendar = endTimePart;
                    console.log(`Successfully Parsed Dates & Times: Start Date=${dateForCalendar}, Start Time=${timeForCalendar}, End Date=${endDateForCalendar}, End Time=${endTimeForCalendar}`);
                } else {
                    console.error('Failed to parse date string components or format is invalid:', bookingData.date);
                }
            } else {
                console.error('Failed to split date string by " - ":', bookingData.date);
            }
        } else {
            console.error('Airport parking booking data.date is missing or not a string');
        }
        // *** MODIFICATION END: Parse the combined date string for Airport Parking ***


        if (dateForCalendar && timeForCalendar && endDateForCalendar && endTimeForCalendar) {
          // Format customer name
          const customerName = bookingData.customerName || bookingData.name;

          console.log(`Adding airport parking to calendar: ${dateForCalendar} ${timeForCalendar} to ${endDateForCalendar} ${endTimeForCalendar} for ${customerName}`);

          // Add event to Google Calendar, passing parsed dates/times within bookingData
          const eventId = await addEventToCalendar(
            calendar,
            bookingData.service,
            dateForCalendar, // Use parsed start date
            timeForCalendar, // Use parsed start time
            customerName,
            { // Pass all original booking data plus the parsed date/time fields expected by addEventToCalendar
                ...bookingData,
                startDate: dateForCalendar,
                startTime: timeForCalendar,
                endDate: endDateForCalendar,
                endTime: endTimeForCalendar
            }
          );

          console.log(`Successfully added airport parking booking to Google Calendar with event ID: ${eventId}`);

          // Add the event ID to the booking data for reference
          bookingData.eventId = eventId;
        } else {
            console.warn('Airport parking booking is missing required date/time fields after parsing - not adding to calendar');
             // Depending on your frontend, you might want to return an error here
             // if calendar creation is critical and parsing failed.
        }
      }
      // Handle other service bookings (car wash, auto service, tire service)
      else if (bookingData.date && bookingData.time && bookingData.service) {
        console.log(`Processing service booking (${bookingData.service}) for Google Calendar`);
        // >>> Add this log line to see received date/time for standard services <<<
        console.log(`Received date: ${bookingData.date}, time: ${bookingData.time} for service ${bookingData.service}`);


        // Check if the exact time slot is available for THIS service only
        const busySlots = await checkTimeSlotAvailability(calendar, bookingData.date, bookingData.service);
        if (busySlots.includes(bookingData.time)) {
          console.warn(`Selected time slot ${bookingData.time} for ${bookingData.service} is no longer available.`);
          return res.status(409).json({
            success: false,
            message: 'The selected time slot is no longer available. Please choose another time slot.'
          });
        }

        // Format customer name
        const customerName = bookingData.customerName || bookingData.name;

        // Add event to Google Calendar
        const eventId = await addEventToCalendar(
          calendar,
          bookingData.service,
          bookingData.date,
          bookingData.time,
          customerName,
          bookingData // Pass all booking data for detailed description
        );

        console.log(`Added booking to Google Calendar with event ID: ${eventId}`);

        // Add the event ID to the booking data for reference
        bookingData.eventId = eventId;
      } else {
        console.warn('Booking is missing date/time or service fields - not adding to calendar', bookingData);
         // For other services, date, time, and service are essential.
         // You might want to return an error response here.
      }
    } catch (calendarError) {
      console.error('Error during Google Calendar operation:', calendarError);
      // Log the full error for debugging
      console.error('Calendar Error Details:', calendarError);

      // Don't necessarily fail the entire booking process if calendar integration fails
      // unless it's a critical requirement for all booking types.
      // For now, we log and proceed, but you might adjust this.
      // Returning a 500 here would stop the email sending if calendar fails:
      /*
      return res.status(500).json({
        success: false,
        message: 'An error occurred while integrating with the calendar: ' + calendarError.message
      });
      */
    }

    // Send Emails (this happens regardless of calendar success/failure in this setup)
    try {
        // Call the correctly imported function
        await sendBookingConfirmationEmails(bookingData);
         console.log('Booking confirmation emails sent successfully.');
    } catch (emailError) {
        console.error('Error sending booking confirmation emails:', emailError);
        // Decide if email failure should stop the success response
        // For now, logging the error and continuing to send success response
        // as calendar might have succeeded.
    }


    // Respond to Frontend
    res.status(200).json({
      success: true,
      message: 'Booking processed successfully' // Modify message if calendar/email failed but you still responded success
    });

  } catch (error) {
    console.error('Error processing booking request:', error);

    // Return a general internal server error response for unhandled errors
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred while processing the booking'
    });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Zima Auto Email Backend running on http://localhost:${port}`);
});