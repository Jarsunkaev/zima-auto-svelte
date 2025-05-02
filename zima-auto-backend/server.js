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
const port = process.env.PORT || 3001;

// Import utility functions
const { sendBookingConfirmationEmails, sendContactEmails } = require('./utils/email');
// Import calendar utils (NOTE: generateTimeSlots removed from calendar utils export)
const { getGoogleCalendarClient, addEventToCalendar, checkTimeSlotAvailability } = require('./utils/googleCalendar');

// --- Middleware ---
app.use(cors({
  // Make sure this matches your EXACT frontend deployment URL in production
  origin: process.env.FRONTEND_URL || 'https://zima-auto-frontend.fly.dev',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors()); // Handle preflight requests
app.use(express.json());

// --- Business Hours Configuration ---
const businessHours = {
  'carWash': [8, 18], 'autoService': [8, 17], 'tireService': [8, 17], 'airportParking': [0, 24]
};

// Time slot duration in minutes
const timeSlotDuration = 30; // Kept for reference if needed elsewhere

// --- Generate time slots based on business hours ---
// THIS is now the single source of truth for generating potential slots
function generateTimeSlots(service) {
  const slots = [];
  const [openingHour, closingHour] = businessHours[service] || [8, 17];
  for (let hour = openingHour; hour < closingHour; hour += 0.5) {
       const hourPart = Math.floor(hour);
       const minutePart = (hour % 1) * 60;
       const timeSlot = `${hourPart.toString().padStart(2, '0')}:${minutePart.toString().padStart(2, '0')}`;
       slots.push(timeSlot);
  }
  return slots.sort();
}

// --- Routes ---

// API Endpoint to fetch available time slots
app.get('/api/available-slots', async (req, res) => {
  try {
    const { date, service } = req.query;
    if (!date || !service) return res.status(400).json({ success: false, message: 'Missing required parameters: date and service' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ success: false, message: 'Invalid date format. Expected YYYY-MM-DD' });
    const validServices = ['carWash', 'autoService', 'tireService', 'airportParking'];
    if (!validServices.includes(service)) return res.status(400).json({ success: false, message: 'Invalid service type' });

    // *** Generate potential slots HERE in server.js ***
    const allPotentialSlots = generateTimeSlots(service);

    // Get Google Calendar client
    const calendar = await getGoogleCalendarClient();

    // *** Pass potential slots INTO checkTimeSlotAvailability ***
    const busySlots = await checkTimeSlotAvailability(calendar, date, service, allPotentialSlots);

    // Respond with the busy slots
    res.status(200).json({
      success: true,
      unavailableSlots: busySlots, // Send the list determined by the calendar check
      message: 'Available slots retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching available time slots: ' + error.message });
  }
});

// API Endpoint for Contact Form
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const contactData = req.body;
    console.log('======= CONTACT FORM SUBMISSION =======\n', JSON.stringify(contactData, null, 2), '\n======================================');
    if (!contactData?.customerName || !contactData?.customerEmail || !contactData?.message) {
      return res.status(400).json({ success: false, message: 'Missing required contact fields' });
    }
    console.log('Processing contact form submission');
    await sendContactEmails(contactData); // Assumes this function exists and works
    console.log('Contact form emails sent successfully.');
    res.status(200).json({ success: true, message: 'Contact form processed successfully' });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send message.' });
  }
});

// API Endpoint to handle booking data, sending emails, and adding to calendar
app.post('/api/send-booking-emails', async (req, res) => {
  try {
    const bookingData = req.body;
    if (!bookingData?.customerName || !bookingData?.customerEmail || !bookingData?.service) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' });
    }
    console.log(`Received booking for service: ${bookingData.service}`);
    if (bookingData.service === 'airportParking') {
         console.log('======= AIRPORT PARKING BOOKING =======\n', JSON.stringify(bookingData, null, 2), '\n======================================');
    }

    // --- Calendar Integration ---
    let calendarEventId = null; // To store event ID if created
    try {
      const calendar = await getGoogleCalendarClient();
      let dateForCalendar, timeForCalendar, endDateForCalendar, endTimeForCalendar;

      // Handle airport parking dates/times
      if (bookingData.service === 'airportParking') {
        if (bookingData.date && typeof bookingData.date === 'string') {
          const parts = bookingData.date.split(' - ');
          if (parts.length === 2) {
            const [startDateStr, endDateStr] = parts;
            const [startDatePart, startTimePart] = startDateStr.split(' ');
            const [endDatePart, endTimePart] = endDateStr.split(' ');
            if (startDatePart && startTimePart && endDatePart && endTimePart && /^\d{4}-\d{2}-\d{2}$/.test(startDatePart) && /^\d{2}:\d{2}$/.test(startTimePart) && /^\d{4}-\d{2}-\d{2}$/.test(endDatePart) && /^\d{2}:\d{2}$/.test(endTimePart)) {
              dateForCalendar = startDatePart; timeForCalendar = startTimePart;
              endDateForCalendar = endDatePart; endTimeForCalendar = endTimePart;
            }
          }
        }
        if (!dateForCalendar) console.error('Failed to parse airport parking dates:', bookingData.date);
      }
      // Handle other services dates/times
      else if (bookingData.date && bookingData.time) {
        dateForCalendar = bookingData.date;
        timeForCalendar = bookingData.time;
        // Check availability BEFORE adding event for non-parking services
        const allSlots = generateTimeSlots(bookingData.service); // Generate slots for the service
        const busySlots = await checkTimeSlotAvailability(calendar, bookingData.date, bookingData.service, allSlots);
        if (busySlots.includes(bookingData.time)) {
          console.warn(`Booking conflict: Slot ${bookingData.time} for ${bookingData.service} on ${bookingData.date} is busy.`);
          return res.status(409).json({ success: false, message: 'The selected time slot is no longer available. Please choose another time.' });
        }
      }

      // Add event if we have valid date/time info
      if (dateForCalendar && timeForCalendar) {
        calendarEventId = await addEventToCalendar(
          calendar, bookingData.service, dateForCalendar, timeForCalendar,
          bookingData.customerName,
          { // Pass necessary details to addEventToCalendar
            ...bookingData,
            // Ensure specific date/time fields are passed if needed by addEventToCalendar
            startDate: dateForCalendar, // Primarily for parking
            startTime: timeForCalendar, // Primarily for parking
            endDate: endDateForCalendar, // Primarily for parking
            endTime: endTimeForCalendar  // Primarily for parking
          }
        );
        console.log(`Added event to calendar, ID: ${calendarEventId}`);
        bookingData.eventId = calendarEventId; // Add eventId back to data for emails
      } else {
         console.warn(`Skipping calendar event creation due to missing/invalid date/time for service ${bookingData.service}`);
      }

    } catch (calendarError) {
      console.error('Error during Google Calendar operation:', calendarError.message);
      // Log the error but continue to send email confirmation
    }

    // --- Email Sending ---
    try {
      await sendBookingConfirmationEmails(bookingData);
      console.log('Booking confirmation emails sent successfully.');
    } catch (emailError) {
      console.error('Error sending booking confirmation emails:', emailError.message);
      // Optional: Decide if email failure is critical. Maybe log and still return success?
    }

    // Respond to Frontend
    res.status(200).json({
      success: true,
      message: 'Booking processed successfully' // Provide generic success
    });

  } catch (error) {
    console.error('Error processing booking request:', error);
    res.status(500).json({ success: false, message: error.message || 'An unexpected error occurred' });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Zima Auto Backend running on http://localhost:${port}`);
});