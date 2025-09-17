// zima-auto-backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;
const { google } = require('googleapis');

// Import fetch for Node.js compatibility (if not available globally)
let fetch;
if (typeof globalThis.fetch === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = globalThis.fetch;
}

// Load environment variables from .env file
dotenv.config();

// Initialize email service
const EmailService = require('./utils/emailService');
const emailService = EmailService.getInstance();

// Import Google Calendar functions
const { getGoogleCalendarClient, addEventToCalendar, checkTimeSlotAvailability } = require('./utils/googleCalendar');

// --- Google Sheets API integration ---
let sheets;
const SHEET_ID = process.env.SHEET_ID || '1WfGOZdb2mSo9AZYIKjdpkQcESzGHk2zzeSuKkv3XadU';

// Initialize Google Sheets client
async function initializeGoogleSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'credentials/service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const authClient = await auth.getClient();
    const sheetsClient = google.sheets({ version: 'v4', auth: authClient });
    console.log('Google Sheets API initialized successfully');
    return sheetsClient;
  } catch (error) {
    console.error('Error initializing Google Sheets API:', error);
    throw error;
  }
}

const app = express();
const port = process.env.PORT || 3001; // Use port from env or default to 3001

// Initialize server
async function startServer() {
  try {
    // Initialize Google Sheets
    sheets = await initializeGoogleSheets();
    console.log('Google Sheets API initialized successfully');
    
    // Get port from environment or use default
    const serverPort = process.env.PORT || port;
    
    // Create HTTP server
    const server = app.listen(serverPort, '0.0.0.0', () => {
      console.log(`Server running on port ${serverPort}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${serverPort} is already in use. Trying another port...`);
        // Try another port
        const newPort = parseInt(serverPort) + 1;
        server.listen(newPort, '0.0.0.0');
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Configure CORS with more permissive settings for development
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://www.zima-auto.com',
  'https://zima-auto.com',
  'https://zima-auto-frontend.fly.dev',
  'https://zima-auto-backend.fly.dev',
  'https://zima-auto-admin.fly.dev'
];

// CORS middleware with enhanced logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const requestMethod = req.method;
  const requestPath = req.path;
  
  console.log(`[${new Date().toISOString()}] ${requestMethod} ${requestPath} from ${origin || 'unknown origin'}`);
  
  // In development, allow any origin
  if (process.env.NODE_ENV !== 'production' || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Forwarded-For');
    
    if (requestMethod === 'OPTIONS') {
      console.log(`Handling preflight request for path: ${requestPath}`);
      return res.status(200).end();
    }
  } else if (origin) {
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
  }
  
  next();
});

async function saveAirportParking(bookingData) {
  try {
    console.log('Saving airport parking data:', JSON.stringify(bookingData, null, 2));
    
    // Extract data with proper fallbacks and validation
    const { 
      name = '',
      firstName = '',
      lastName = '',
      contact = bookingData.contact || { email: '', phone: '' },
      date = bookingData.date || '', 
      days = bookingData.days || 1, 
      licensePlate = bookingData.licensePlate || '', 
      passengers = bookingData.passengers || 1, 
      carWashPackage = bookingData.carWashPackage || 'none',
      priceBreakdown = bookingData.priceBreakdown || { totalPrice: '0' },
      email = (bookingData.contact && bookingData.contact.email) || bookingData.email || 'N/A',
      phone = (bookingData.contact && bookingData.contact.phone) || bookingData.phone || 'N/A',
      // Additional fields that might be needed
      arrivalDate = bookingData.arrivalDate || bookingData.startDate || '',
      departureDate = bookingData.departureDate || bookingData.endDate || '',
      arrivalTime = bookingData.arrivalTime || bookingData.startTime || '00:00',
      departureTime = bookingData.departureTime || bookingData.endTime || '00:00',
      totalPrice = (bookingData.priceBreakdown && bookingData.priceBreakdown.totalPrice) || bookingData.totalPrice || '0'
    } = bookingData;
    
    // Parse the date range with validation
    let parsedStartDate = '', parsedStartTime = '00:00', parsedEndDate = '', parsedEndTime = '00:00';
    
    if (date) {
      const [startDateStr, endDateStr] = date.split(' - ');
      if (startDateStr) {
        const [datePart, timePart] = startDateStr.split(' ');
        parsedStartDate = datePart;
        parsedStartTime = timePart || '00:00';
      }
      if (endDateStr) {
        const [datePart, timePart] = endDateStr.split(' ');
        parsedEndDate = datePart;
        parsedEndTime = timePart || '00:00';
      } else {
        parsedEndDate = parsedStartDate;
        parsedEndTime = parsedStartTime;
      }
    } else if (arrivalDate && departureDate) {
      // Use separate date fields if date range string is not provided
      parsedStartDate = arrivalDate;
      parsedEndDate = departureDate;
      parsedStartTime = arrivalTime || '00:00';
      parsedEndTime = departureTime || '00:00';
    }
    
    // Use the parsed or provided values
    const startDate = parsedStartDate || arrivalDate;
    const startTime = parsedStartTime || arrivalTime || '00:00';
    const endDate = parsedEndDate || departureDate;
    const endTime = parsedEndTime || departureTime || '00:00';
    
    // Combine first and last name with a space in between, handling all possible name fields
    let fullName = 'Névtelen';
    try {
      // Try to get name from various possible fields
      const possibleNameFields = [
        name,
        [firstName, lastName].filter(Boolean).join(' ').trim(),
        bookingData.contact?.name,
        bookingData.customerName,
        bookingData.contact?.firstName ? 
          [bookingData.contact.lastName, bookingData.contact.firstName].filter(Boolean).join(' ').trim() : 
          bookingData.contact?.lastName || ''
      ];
      
      // Find the first non-empty name
      for (const field of possibleNameFields) {
        if (field && typeof field === 'string' && field.trim()) {
          fullName = field.trim();
          break;
        }
      }
      
      // Ensure we have a valid name
      if (!fullName || fullName === 'Névtelen') {
        console.warn('No valid name found in booking data, using default');
        fullName = 'Névtelen';
      }
    } catch (error) {
      console.error('Error processing name:', error);
      fullName = 'Névtelen';
    }
    
    // Ensure phone number is properly extracted
    let phoneNumber = phone || bookingData.contact?.phone || '';
    // Remove any non-numeric characters from phone number
    phoneNumber = phoneNumber.replace(/\D/g, '').trim();
    
    // Prepare the row data to append to the sheet
    const rowData = [
      new Date().toISOString().split('T')[0], // Date of booking
      fullName,
      email,
      phoneNumber,
      startDate,
      startTime,
      endDate,
      endTime,
      `${startDate} ${startTime}`, // Arrival datetime
      `${endDate} ${endTime}`,     // Departure datetime
      days,
      licensePlate,
      passengers,
      carWashPackage,
      priceBreakdown?.totalPrice || totalPrice,
      'Függőben' // Status
    ];
    
    // Log the incoming data for debugging
    console.log('Processed booking data:', {
      fullName,
      email,
      phone,
      startDate,
      startTime,
      endDate,
      endTime,
      days,
      licensePlate,
      passengers,
      totalPrice: priceBreakdown?.totalPrice || totalPrice,
      arrivalDate: startDate,
      arrivalTime: startTime,
      departureDate: endDate,
      departureTime: endTime
    });
    
    // Get the last row to determine the next ID
    const sheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A2:A', // Only get the ID column to find the max ID
    });
    
    const rows = sheetResponse.data.values || [];
    // Find the maximum ID in the first column (ID column)
    let nextId = 1;
    if (rows.length > 0) {
      const ids = rows.map(row => {
        const id = parseInt(row[0]);
        return !isNaN(id) ? id : 0;
      });
      nextId = Math.max(...ids, 0) + 1;
    }
    
    // Format dates with time for display in the sheet
    const formattedStartDate = startDate && startTime ? `${startDate} ${startTime}` : '';
    const formattedEndDate = endDate && endTime ? `${endDate} ${endTime}` : '';
    
    // Ensure we have valid values for all required fields
    const sheetData = {
      id: nextId,
      name: fullName,
      licensePlate: licensePlate || 'N/A',
      arrival: formattedStartDate,
      departure: formattedEndDate,
      days: parseInt(days) || 1,
      passengers: parseInt(passengers) || 1,
      totalPrice: priceBreakdown?.totalPrice || totalPrice || '0',
      email: email || 'N/A',
      phone: phoneNumber || 'N/A',
      createdAt: new Date().toISOString(),
      status: 'NEM FIZETETT',
      carWashPackage: carWashPackage || 'none'
    };
    
    // Log the data being saved to the sheet
    console.log('Saving to Google Sheets:', JSON.stringify(sheetData, null, 2));
    
    // Format the data for the Google Sheet (array of arrays)
    const values = [
      [
        sheetData.id,                   // ID (auto-incremented)
        sheetData.name,                 // NÉV (combined last and first name)
        sheetData.licensePlate,         // RENDSZÁM
        sheetData.arrival,              // ÉRKEZÉS (date + time)
        sheetData.departure,            // TÁVOZÁS (date + time)
        sheetData.days,                 // HÁNY NAP
        sheetData.passengers,           // HÁNY FŐ
        sheetData.totalPrice,           // ÖSSZEG
        sheetData.email,                // EMAIL
        sheetData.phone,                // TELEFON
        sheetData.createdAt,            // CREATED_AT
        sheetData.status,               // ÁLLAPOT
        sheetData.carWashPackage        // MOSÁS CSOMAG
      ]
    ];
    
    console.log('Formatted values for Google Sheet:', JSON.stringify(values, null, 2));

    // Append the new booking to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values
      }
    });

    console.log('Booking saved to Google Sheets:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error saving booking to Google Sheets:', error);
    throw error;
  }
}


async function updateBookingStatus(bookingId, newStatus) {
  // Read all rows
  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1', // Change if your sheet name is different
  });
  const rows = getRes.data.values;
  const headers = rows[0];
  const idCol = headers.indexOf('ID');
  const statusCol = headers.indexOf('ÁLLAPOT');
  let found = false;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idCol]) === String(bookingId)) {
      // Update the status cell
      const range = `Sheet1!${String.fromCharCode(65 + statusCol)}${i + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: { values: [[newStatus]] },
      });
      found = true;
      break;
    }
  }
  return found;
}

app.use(express.json());

// Forward /bookings to /send-booking-emails for backward compatibility
app.post('/api/bookings', async (req, res) => {
  console.log('Forwarding /api/bookings to /api/send-booking-emails');
  // Simply forward the request to the existing endpoint
  req.url = '/api/send-booking-emails';
  req._parsedUrl.pathname = '/api/send-booking-emails';
  req.originalUrl = '/api/send-booking-emails';
  app.handle(req, res);
});

// Get all bookings from Google Sheet
app.get('/api/bookings', async (req, res) => {
  console.log('Fetching bookings from Google Sheets...');
  try {
    if (!sheets) {
      throw new Error('Google Sheets client not initialized');
    }
    
    console.log('Using Spreadsheet ID:', SHEET_ID);
    
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1',
    }).catch(err => {
      console.error('Google Sheets API Error:', err.message);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
      }
      throw err;
    });
    
    console.log('Successfully fetched data from Google Sheets');
    const rows = getRes.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in the sheet');
      return res.json({ bookings: [] });
    }
    
    const headers = rows[0];
    console.log('Sheet headers:', headers);
    
    const bookings = rows.slice(1).map((row, index) => {
      const obj = {};
      row.forEach((value, i) => {
        obj[headers[i]] = value;
      });
      return obj;
    });
    
    console.log(`Found ${bookings.length} bookings`);
    res.json({ bookings });
    
  } catch (e) {
    console.error('Error in /bookings endpoint:', e);
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: e.message,
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    });
  }
});

// Update booking status
app.post('/api/update-status', async (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });
  try {
    const success = await updateBookingStatus(id, status);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add the missing helper function for contact emails
const sendContactEmails = async (contactData) => {
  try {
    return await emailService.sendContactFormEmails(contactData);
  } catch (error) {
    console.error('Error in sendContactEmails:', error);
    throw error;
  }
};

// Check for email service configuration
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ CRITICAL: Missing SMTP configuration!');
    console.error('Email functionality may be limited.');
} else {
    console.log('✅ SMTP email service configured');
}

// Email service is ready

// Update your redirects object to consistently use path-based routing
const redirects = {
  // Hungarian URLs
  '/hu': '/home',  // Redirect /hu to /home since your site defaults to Hungarian
  '/hu/book-online': '/booking',
  '/hu/about-us': '/about',
  '/hu/price-page': '/services',
  '/hu/services': '/services',
  '/hu/contact-us': '/contact',
  
  // English URLs
  '/en': '/home',  // Redirect /en to /home since Hungarian is default
  '/en/book-online': '/booking',
  '/en/about-us': '/about',
  '/en/price-page': '/services',
  '/en/services': '/services',
  '/en/contact-us': '/contact',
  
  // Root redirects
  '/book-online': '/booking',
  '/about-us': '/about',
  '/price-page': '/services',
  '/contact-us': '/contact',
  '/service-page/reptéri-parkolás-1': '/services',
  '/service-page/airport-parking-5': '/services',
  
  // Additional service page redirects
  '/service-page/reptéri-parkolás-1/': '/services',
  '/service-page/airport-parking-5/': '/services'
};

// Mapping of valid routes
const validRoutes = ['home', 'about', 'services', 'contact', 'booking', 'privacy'];

// Enhanced redirect middleware
app.use((req, res, next) => {
  const originalPath = req.path;
  const originalQuery = req.url.includes('?') ? req.url.split('?')[1] : '';
  
  // Prevent redirect loops
  if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('zima-auto.com')) {
    // Check if this is already a known good route
    if (validRoutes.includes(originalPath.replace('/', '')) || originalPath === '/services') {
      return next();
    }
  }
  
  // Check for known redirects
  if (redirects[originalPath]) {
    const newPath = redirects[originalPath];
    console.log(`Redirecting: ${originalPath} -> ${newPath}`);
    
    // Preserve query parameters if they exist
    const fullRedirectPath = originalQuery ? `${newPath}?${originalQuery}` : newPath;
    return res.redirect(fullRedirectPath);
  }
  
  // Handle service page URLs with potential variations
  const servicePageMatch = originalPath.match(/^\/service-page\/([^/]+)\/?$/i);
  if (servicePageMatch) {
    console.log(`Matched service page: ${originalPath}`);
    
    // Preserve query parameters if they exist
    const fullRedirectPath = originalQuery ? `/services?${originalQuery}` : '/services';
    return res.redirect(fullRedirectPath);
  }
  
  // Handle old /services route specifically
  if (originalPath === '/services') {
    return next();
  }
  
  next();
});

// Update your redirect routes to use the custom domain and path-based routing
Object.keys(redirects).forEach(oldPath => {
  app.get(oldPath, (req, res) => {
    // Construct the full URL with your custom domain
    const customDomain = process.env.CUSTOM_DOMAIN || 'https://zima-auto.com';
    const newPath = redirects[oldPath];
    
    // Validate the route
    let validRoute = newPath.replace('/', '');
    if (!validRoutes.includes(validRoute)) {
      console.warn(`Invalid route attempted: ${validRoute}, defaulting to home`);
      validRoute = 'home';
    }
    
    const redirectUrl = `${customDomain}/${validRoute}`;
    
    console.log(`Redirect: ${oldPath} -> ${redirectUrl}`);
    
    // Use HTML redirect to ensure clean URL is used
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to Zima Auto</title>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #111111;
            color: white;
          }
          .redirect-container {
            text-align: center;
          }
          .loader {
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top: 3px solid #00bae5;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <script>
          // Immediate redirect without letting browser try to render the app
          window.location.replace('${redirectUrl}');
        </script>
      </head>
      <body>
        <div class="redirect-container">
          <div class="loader"></div>
          <p>Redirecting to Zima Auto...</p>
        </div>
      </body>
      </html>
    `);
  });
});

// --- Middleware ---
// CORS is handled at the top of the file

// Handle OPTIONS preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // In development, allow any origin
  if (process.env.NODE_ENV !== 'production' || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Forwarded-For');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
  } else {
    res.status(403).end();
  }
});

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

// API Endpoint to fetch available time slots
app.get('/api/available-slots', async (req, res) => {
  // Enhanced logging for debugging
  console.log('=== AVAILABLE SLOTS REQUEST ===');
  console.log('Request Query:', JSON.stringify(req.query, null, 2));

  try {
    const { date, service, tzOffset, tzName } = req.query;

    // Validate required parameters
    if (!date || !service) {
      console.error('Missing required parameters', { date, service });
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: date and service are required'
      });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('Invalid date format', { date });
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Expected YYYY-MM-DD'
      });
    }

    // Validate service type
    const validServices = ['carWash', 'autoService', 'tireService', 'airportParking'];
    if (!validServices.includes(service)) {
      console.error('Invalid service type', { service, validServices });
      return res.status(400).json({
        success: false,
        message: 'Invalid service type. Expected one of: ' + validServices.join(', ')
      });
    }

    // Generate time slots first - this shouldn't fail
    const allSlots = generateTimeSlots(service);
    console.log(`Generated ${allSlots.length} time slots for service ${service}`);

    // Try to get Google Calendar client
    let calendar;
    let busySlots = [];
    
    try {
      calendar = await getGoogleCalendarClient();
      
      // Try to get busy slots from Google Calendar
      busySlots = await checkTimeSlotAvailability(calendar, date, service, allSlots);
      console.log(`Found ${busySlots.length} busy slots for ${service} on ${date}`);
    } 
    catch (calendarError) {
      console.error('Google Calendar operation failed:', calendarError);
      // Instead of failing with 500, return success with empty unavailable slots
      return res.status(200).json({
        success: true,
        unavailableSlots: [], // Return empty array as fallback
        message: 'Calendar unavailable - using mock data'
      });
    }

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
    console.error('Unhandled error in available-slots endpoint:', error);
    
    // Return success with empty unavailable slots instead of a 500 error
    res.status(200).json({
      success: true,
      unavailableSlots: [], // Return empty array of unavailable slots
      message: 'Error occurred - using mock data'
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

    // Send contact form emails
    try {
      await emailService.sendContactFormEmails({
        customerName: contactData.customerName,
        customerEmail: contactData.customerEmail,
        message: contactData.message
      });
      
      console.log('Contact form emails sent successfully');
      
      res.status(200).json({
        success: true,
        message: 'Contact form processed successfully'
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
    console.error('Error processing contact form submission:', error);

    // Return a general error response for unhandled errors
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred while processing the contact form'
    });
  }
});

// API Endpoint to handle booking data, sending emails, and adding to calendar
// Handle booking form submissions and send confirmation emails
app.post('/api/send-booking-emails', async (req, res) => {
  console.log('Received booking request:', JSON.stringify(req.body, null, 2));
  try {
    const bookingData = req.body;
    
    // Ensure consistent response structure
    const formatResponse = (success, data = {}, message = '') => ({
      success,
      data: {
        ...data,
        // Ensure contact info is always present
        contact: {
          name: data.contact?.name || data.name || '',
          email: data.contact?.email || data.email || '',
          phone: data.contact?.phone || data.phone || '',
          ...data.contact
        },
        // Add timestamp
        timestamp: new Date().toISOString(),
        // Generate a reference number if not provided
        referenceNumber: data.referenceNumber || `ZIMA-${Date.now()}`
      },
      message: message || (success ? 'Booking processed successfully' : 'Booking processing failed')
    });
    
    // Process the booking data
    let result;
    let savedToSheets = false;
    
    // Save to Google Sheets first for airport parking
    if (bookingData.service === 'airportParking') {
      try {
        const savedData = await saveAirportParking(bookingData);
        savedToSheets = true;
        console.log('Booking saved to Google Sheets successfully');
      } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        // Continue with calendar and email even if sheets fail
      }
    }
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

    // Send confirmation emails
    try {
      // Prepare email data
      const emailData = {
        ...bookingData,
        customerEmail: bookingData.customerEmail || (bookingData.contact && bookingData.contact.email) || bookingData.email,
        customerName: bookingData.customerName || bookingData.name || 'Customer',
        customerPhone: bookingData.customerPhone || (bookingData.contact && bookingData.contact.phone) || bookingData.phone || '',
        service: bookingData.service || 'airportParking',
        date: bookingData.date || new Date().toISOString(),
        time: bookingData.time || '',
        totalPrice: bookingData.totalPrice || 0,
        priceBreakdown: bookingData.priceBreakdown || {}
      };

      console.log('Attempting to send confirmation email to:', emailData.customerEmail);
      await emailService.sendBookingConfirmationEmails(emailData);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
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

        // Generate all potential slots for this service
        const allPotentialSlots = generateTimeSlots(bookingData.service);
        console.log('Generated time slots:', allPotentialSlots);
        
        // Check if the exact time slot is available for THIS service only
        try {
            const busySlots = await checkTimeSlotAvailability(calendar, bookingData.date, bookingData.service, allPotentialSlots);
            console.log('Busy slots:', busySlots);
            
            if (busySlots && busySlots.includes(bookingData.time)) {
                console.warn(`Selected time slot ${bookingData.time} for ${bookingData.service} is no longer available.`);
                return res.status(409).json({
                    success: false,
                    message: 'The selected time slot is no longer available. Please choose another time slot.'
                });
            }
        } catch (availabilityError) {
            console.error('Error checking time slot availability:', availabilityError);
            // Continue with booking even if availability check fails
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
      // Continue with the booking even if calendar fails - saving to Sheets is more critical
    }

    // Format the final response
    result = formatResponse(true, {
      ...bookingData,
      id: bookingData.eventId || `booking-${Date.now()}`,
      savedToSheets,
      calendarEvent: bookingData.eventId || null
    });

    // Respond to Frontend
    console.log('Booking processing completed successfully');
    res.status(200).json(result);
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

app.use((req, res, next) => {
  // Store the original send function
  const originalSend = res.send;
  
  // Override the send function
  res.send = function(body) {
    // If this is an HTML response, clean up the debug comment
    if (typeof body === 'string' && 
        (res.get('Content-Type') || '').includes('text/html')) {
      body = body.replace('// src/App.svelte', '');
      body = body.replace(/import App from ['"]\.\/App\.svelte['"];?/, '');
    }
    
    // Call the original send with the cleaned body
    return originalSend.call(this, body);
  };
  
  next();
});

// Detailed logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Serve static files from public directory
const publicPath = path.join(__dirname, 'public');
console.log('Public directory path:', publicPath);

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Check if public directory exists and log its contents
try {
  const publicFiles = fs.readdirSync(publicPath);
  console.log('Public directory exists. Files:', publicFiles);
} catch (err) {
  console.error('Public directory access error:', err);
}

// Serve static files with enhanced logging
app.use(express.static(publicPath, {
  setHeaders: (res, filePath) => {
    // Add caching for static assets
    if (path.extname(filePath).match(/\.(js|css|png|jpg|jpeg|gif|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
    }
  },
  // Log static file serving
  redirect: false,
  index: false
}));

// Enhanced catch-all route handler for SPA
app.get('*', (req, res, next) => {
  // Enhanced logging for route handling
  console.log(`[Route Handling] Requested path: ${req.path}`);

  // Explicitly handle /thankyou route
  if (req.path === '/thankyou') {
    console.log('[Special Route] Handling Thank You page route');
  }

  // Exclude routes that might be static files
  if (req.path.match(/\.(html|js|css|png|jpg|jpeg|gif|svg|ico|txt|xml)$/)) {
    console.log(`[Static File] Requested static file: ${req.path}`);
    return next(); // Let the static middleware handle it
  }

  // Check if the requested path starts with /api - don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    console.log(`[API Route] Skipping index.html for API path: ${req.path}`);
    return next();
  }

  const indexPath = path.join(publicPath, 'index.html');
  console.log('Serving index.html for path:', req.path);
  
  // Send the index.html for all routes
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(`File send error: ${err.message}`);
    } else {
      console.log(`Successfully served index.html for: ${req.path}`);
    }
  });
});

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
  console.log(`- Email Service: SMTP`);
  console.log(`- SMTP Configured: ${!!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)}`);
  console.log(`- Google Calendar API Configured: ${!!process.env.GOOGLE_CALENDAR_CREDENTIALS}`);
  console.log(`- Frontend Proxy URL: ${process.env.FRONTEND_URL || 'https://zima-auto-frontend.fly.dev'}`);
  console.log(`- Custom Domain: ${process.env.CUSTOM_DOMAIN || 'https://zima-auto.com'}`);
  console.log('Server is ready to handle requests.');
});

// Proxy endpoint for Google Apps Script to avoid CORS issues
app.post('/api/generate-order-form', async (req, res) => {
  try {
    console.log('Proxying Google Apps Script request:', req.body);
    
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzs6b-VCT2Zge6aVd2tc8aGvh2cqPRtl8GI4yXI-fhmHQgtxQs8IOVdEpLJ6hcvz2MnPg/exec';
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    console.log('Google Apps Script response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('Error proxying Google Apps Script request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});