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

// Import your email utility functions from the email service
const EmailService = require('./utils/emailService');
const emailService = EmailService.getInstance();
const { getGoogleCalendarClient, addEventToCalendar, checkTimeSlotAvailability } = require('./utils/googleCalendar');

// Check for email service configuration
if (!process.env.RESEND_API_KEY) {
    console.error('❌ CRITICAL: Missing Resend API key!');
    console.error('Email functionality may be limited.');
}

// Email service is ready

// Update your redirects object to consistently use hash-based routing
const redirects = {
  // Hungarian URLs
  '/hu': '/#home',  // Redirect /hu to /#home since your site defaults to Hungarian
  '/hu/book-online': '/#booking',
  '/hu/about-us': '/#about',
  '/hu/price-page': '/#services',
  '/hu/services': '/#services',
  '/hu/contact-us': '/#contact',
  
  // English URLs
  '/en': '/#home',  // Redirect /en to /#home since Hungarian is default
  '/en/book-online': '/#booking',
  '/en/about-us': '/#about',
  '/en/price-page': '/#services',
  '/en/services': '/#services',
  '/en/contact-us': '/#contact',
  
  // Root redirects
  '/book-online': '/#booking',
  '/about-us': '/#about',
  '/price-page': '/#services',
  '/services': '/#services',
  '/contact-us': '/#contact'
};

// Mapping of valid hash routes
const validHashRoutes = ['home', 'about', 'services', 'contact', 'booking', 'privacy'];

// Update your redirect routes to use the custom domain and hash-based routing
Object.keys(redirects).forEach(oldPath => {
  app.get(oldPath, (req, res) => {
    // Construct the full URL with your custom domain
    const customDomain = process.env.CUSTOM_DOMAIN || 'https://zima-auto.com';
    const newPath = redirects[oldPath];
    
    // Extract the hash from the new path
    const hash = newPath.replace('/#', '');
    
    // Validate the hash route
    let validHash = hash;
    if (!validHashRoutes.includes(hash)) {
      console.warn(`Invalid hash route attempted: ${hash}, defaulting to home`);
      validHash = 'home';
    }
    
    const redirectUrl = `${customDomain}/#${validHash}`;
    
    console.log(`Redirect: ${oldPath} -> ${redirectUrl}`);
    
    // Use HTML redirect to ensure hash is preserved
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        <script>
          // Ensure hash routing works correctly
          window.location.href = '${redirectUrl}';
        </script>
      </head>
      <body>Redirecting to ${validHash} page...</body>
      </html>
    `);
  });
});

// --- Middleware ---
// Set up CORS - In production, replace with your actual Svelte frontend URL
app.use(cors({
  origin: [
    'https://zima-auto.com',
    'https://www.zima-auto.com',
    'https://zima-auto-frontend.fly.dev',
    'http://localhost:5173',  // Development
    'http://localhost:4173'   // Preview
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle OPTIONS preflight requests
app.options('*', cors());

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

// --- Timezone Handling Functions ---

/**
 * Adjusts a date and time accounting for timezone differences between
 * user's local time and server/Google Calendar time
 * 
 * @param {string} dateStr - The date in YYYY-MM-DD format
 * @param {string} timeStr - The time in HH:MM format
 * @returns {Date} - The adjusted Date object
 */
function adjustTimeForCalendar(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    console.error('Missing date or time for timezone adjustment', { dateStr, timeStr });
    return null;
  }

  try {
    // Create a date object from the given date and time strings
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // When creating a Calendar event, Google interprets the times in the
    // timezone specified in the event, which in our case is 'Europe/Budapest'
    // We need to ensure the time shown in Google Calendar matches what the user selected
    
    // Google Calendar expects times in ISO format with the specified timezone
    // Using the ISO format ensures Google Calendar interprets it correctly
    const eventDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    
    console.log(`Adjusted time for calendar: ${dateStr} ${timeStr} -> ${eventDate.toISOString()}`);
    return eventDate;
  } catch (error) {
    console.error('Error adjusting time for calendar:', error);
    return null;
  }
}

/**
 * Parses the date range string for airport parking bookings
 * and returns the adjusted start and end dates/times for Google Calendar
 * 
 * @param {string} dateRangeStr - Combined date string from frontend, e.g. "2023-05-01 14:00 - 2023-05-05 16:00"
 * @returns {Object} - Object containing parsed and adjusted start/end dates and times
 */
function parseAirportParkingDateRange(dateRangeStr) {
  try {
    if (!dateRangeStr || typeof dateRangeStr !== 'string') {
      console.error('Invalid date range string:', dateRangeStr);
      return null;
    }

    // Split the string by " - " delimiter
    const parts = dateRangeStr.split(' - ');
    if (parts.length !== 2) {
      console.error('Failed to split date range by " - ":', dateRangeStr);
      return null;
    }

    // Parse start date and time
    const [startDateStr, startTimeStr] = parts[0].split(' ');
    // Parse end date and time
    const [endDateStr, endTimeStr] = parts[1].split(' ');

    // Validate the parsed parts
    if (!startDateStr || !startTimeStr || !endDateStr || !endTimeStr) {
      console.error('Failed to parse date range components:', dateRangeStr);
      return null;
    }

    // Adjust dates and times for Google Calendar
    const startDate = adjustTimeForCalendar(startDateStr, startTimeStr);
    const endDate = adjustTimeForCalendar(endDateStr, endTimeStr);

    if (!startDate || !endDate) {
      console.error('Failed to adjust dates for calendar');
      return null;
    }

    return {
      startDate,
      endDate,
      // Also include the original parsed strings for reference
      startDateStr,
      startTimeStr,
      endDateStr,
      endTimeStr
    };
  } catch (error) {
    console.error('Error parsing airport parking date range:', error);
    return null;
  }
}

// --- Routes ---

// API Endpoint to test Mailjet email service
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('Testing Mailjet connection...');
    const result = await testMailjetConnection();
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully to info@zima-auto.com',
      result: result
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed: ' + error.message,
      error: String(error)
    });
  }
});

// API Endpoint to fetch available time slots
app.get('/api/available-slots', async (req, res) => {
  try {
    const { date, service, tzOffset, tzName } = req.query;

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
    const busySlots = await checkTimeSlotAvailability(calendar, date, service, allSlots);

    // Log the timezone information if available (for debugging)
    if (tzOffset || tzName) {
      console.log(`Timezone info received - Offset: ${tzOffset}, Name: ${tzName}`);
    }

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
      // Call the correctly imported function from mailjet module
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

    // Add detailed logging for booking data
    console.log('====== EMAIL DEBUGGING ======');
    console.log('1. Receiving booking data for service:', bookingData.service);
    console.log('2. Customer email:', bookingData.customerEmail || 
                (bookingData.contact && bookingData.contact.email) || "MISSING!");
    
    // Add detailed logging for airport parking
    if (bookingData.service === 'airportParking') {
      console.log('======= AIRPORT PARKING BOOKING =======');
      console.log('Full booking data:', JSON.stringify(bookingData, null, 2));
      // Log the received date field from the frontend
      console.log('Received Date field:', bookingData.date);
      console.log('Received Time field:', bookingData.time); // This will likely be empty for parking
      console.log('======================================');
    } else {
      // Log regular service booking details
      console.log(`======= ${bookingData.service?.toUpperCase()} BOOKING =======`);
      console.log('Received Date:', bookingData.date);
      console.log('Received Time:', bookingData.time);
      console.log('Service Type:', bookingData.serviceType || 'Standard');
      console.log('======================================');
    }

    // Log timezone info from request if available
    if (bookingData.timezone) {
      console.log('======= TIMEZONE INFO =======');
      console.log('Timezone data:', JSON.stringify(bookingData.timezone, null, 2));
      console.log('===========================');
    }

    // Validate required fields
    if (!bookingData || !bookingData.service) {
      console.error('Received invalid booking data: Missing core fields', bookingData);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in booking data'
      });
    }

    // Add booking to Google Calendar with special handling for airport parking
    try {
      // Get Google Calendar client
      const calendar = await getGoogleCalendarClient();

      // Handle airport parking differently than other services
      if (bookingData.service === 'airportParking') {
        console.log('Processing airport parking booking for Google Calendar');

        // Parse and adjust the airport parking date range
        const dateTimeInfo = parseAirportParkingDateRange(bookingData.date);
        
        if (dateTimeInfo) {
          // Format customer name
          const customerName = bookingData.customerName || bookingData.name;

          console.log(`Adding airport parking to calendar from ${dateTimeInfo.startDate.toISOString()} to ${dateTimeInfo.endDate.toISOString()} for ${customerName}`);

          // Create a modified version of the booking data with the adjusted times
          const modifiedBookingData = {
            ...bookingData,
            startDate: dateTimeInfo.startDateStr,
            startTime: dateTimeInfo.startTimeStr,
            endDate: dateTimeInfo.endDateStr,
            endTime: dateTimeInfo.endTimeStr,
            // Add the adjusted dates for Google Calendar
            calendarStartTime: dateTimeInfo.startDate,
            calendarEndTime: dateTimeInfo.endDate
          };

          // Add event to Google Calendar, passing the modified booking data
          const eventId = await addEventToCalendar(
            calendar,
            bookingData.service,
            dateTimeInfo.startDateStr,
            dateTimeInfo.startTimeStr,
            customerName,
            modifiedBookingData
          );

          console.log(`Successfully added airport parking booking to Google Calendar with event ID: ${eventId}`);

          // Add the event ID to the booking data for reference
          bookingData.eventId = eventId;
        } else {
          console.warn('Failed to parse airport parking date range - not adding to calendar');
        }
      }
      // Handle other service bookings (car wash, auto service, tire service)
      else if (bookingData.date && bookingData.time && bookingData.service) {
        console.log(`Processing service booking (${bookingData.service}) for Google Calendar`);
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

        // Adjust the time for Google Calendar
        const adjustedDateTime = adjustTimeForCalendar(bookingData.date, bookingData.time);
        
        if (adjustedDateTime) {
          // Create a modified version of the booking data with the adjusted time
          const modifiedBookingData = {
            ...bookingData,
            // Keep the original date and time
            date: bookingData.date,
            time: bookingData.time,
            // Add the adjusted date for Google Calendar
            calendarDateTime: adjustedDateTime
          };

          // Add event to Google Calendar using the modified booking data
          const eventId = await addEventToCalendar(
            calendar,
            bookingData.service,
            bookingData.date,
            bookingData.time,
            customerName,
            modifiedBookingData
          );

          console.log(`Added booking to Google Calendar with event ID: ${eventId}`);

          // Add the event ID to the booking data for reference
          bookingData.eventId = eventId;
        } else {
          console.warn('Failed to adjust time for calendar - using original date/time');
          
          // Fallback to using the original date/time if adjustment fails
          const eventId = await addEventToCalendar(
            calendar,
            bookingData.service,
            bookingData.date,
            bookingData.time,
            customerName,
            bookingData
          );

          console.log(`Added booking to Google Calendar with event ID (fallback): ${eventId}`);
          bookingData.eventId = eventId;
        }
      } else {
        console.warn('Booking is missing date/time or service fields - not adding to calendar', bookingData);
      }
    } catch (calendarError) {
      console.error('Error during Google Calendar operation:', calendarError);
      console.error('Calendar Error Details:', calendarError);
      // We continue even if calendar fails - emails are more important
    }

    // Send Emails (this happens regardless of calendar success/failure in this setup)
    console.log("3. Attempting to send emails via Mailjet");
    try {
      await emailService.sendBookingConfirmationEmails(bookingData);
      console.log("4. ✅ Emails sent successfully via Mailjet");
    } catch (emailError) {
      console.error("4. ❌ Email sending failed:", emailError);
      console.error("Detailed email error:", JSON.stringify(emailError, null, 2));
      
      // Return the email error to the client for easier debugging
      return res.status(500).json({
        success: false,
        message: 'Email sending failed: ' + emailError.message,
        emailError: String(emailError)
      });
    }

    // Respond to Frontend
    res.status(200).json({
      success: true,
      message: 'Booking processed successfully'
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

// --- Serve frontend from a separate deployment ---
// Proxy requests to your frontend application
const proxy = require('express-http-proxy');

// Proxy all routes to the frontend, preserving the original path
app.use('/', proxy(process.env.FRONTEND_URL || 'https://zima-auto-frontend.fly.dev', {
  proxyReqPathResolver: function (req) {
    // Keep the original URL path when proxying
    return req.url;
  },
  userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    // Log proxied requests for debugging
    console.log(`Proxying request: ${userReq.method} ${userReq.url} -> frontend`);
    return proxyResData;
  }
}));

// Contact Form Submission Route
app.post('/contact', express.json(), async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Send contact form emails
    try {
      await emailService.sendContactFormEmails({ name, email, message });
      
      console.log('Contact form submission processed successfully');
      
      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully'
      });
    } catch (emailError) {
      console.error('Error sending contact form emails:', emailError);
      
      res.status(500).json({
        success: false,
        message: 'Failed to send contact form emails',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Unexpected error in contact form submission:', error);
    
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

// --- Start Server ---
app.listen(port, '0.0.0.0', () => {
  console.log(`Zima Auto Email Backend running on http://0.0.0.0:${port}`);
  
  // Log startup information
  console.log('Server Configuration:');
  console.log(`- Port: ${port}`);
  console.log(`- Email Service: Mailjet`);
  console.log(`- Mailjet API Key Configured: ${!!process.env.MAILJET_API_KEY}`);
  console.log(`- Google Calendar API Configured: ${!!process.env.GOOGLE_CALENDAR_CREDENTIALS}`);
  console.log(`- Frontend Proxy URL: ${process.env.FRONTEND_URL || 'https://zima-auto-frontend.fly.dev'}`);
  console.log(`- Custom Domain: ${process.env.CUSTOM_DOMAIN || 'https://zima-auto.com'}`);
  console.log('Server is ready to handle requests.');
});