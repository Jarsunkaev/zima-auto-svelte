const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const EmailService = require('../utils/emailService');
const emailService = EmailService.getInstance();

// Load environment variables
require('dotenv').config();

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials/service-account.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.SHEET_ID || '1WfGOZdb2mSo9AZYIKjdpkQcESzGHk2zzeSuKkv3XadU';

// Save airport parking to Google Sheets
async function saveAirportParking(bookingData) {
  try {
    console.log('Saving airport parking data:', JSON.stringify(bookingData, null, 2));
    
    // Get the last row to determine the next ID
    const sheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A2:A',
    });
    
    const rows = sheetResponse.data.values || [];
    let nextId = 1;
    if (rows.length > 0) {
      const ids = rows.map(row => {
        const id = parseInt(row[0]);
        return !isNaN(id) ? id : 0;
      });
      nextId = Math.max(...ids, 0) + 1;
    }
    
    // Prepare data for the sheet
    const rowData = [
      nextId, // ID
      bookingData.name || 'Névtelen Ügyfél',
      bookingData.licensePlate || '',
      bookingData.arrivalDate || '',
      bookingData.arrivalTime || '',
      bookingData.departureDate || '',
      bookingData.departureTime || '',
      bookingData.days || 1,
      bookingData.passengers || 1,
      bookingData.totalPrice || 0,
      bookingData.email || '',
      bookingData.phone || '',
      new Date().toISOString(),
      'FELDOLGOZÁS ALATT',
      bookingData.carWashPackage || 'none'
    ];
    
    // Append the new row to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A2:O2',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData]
      }
    });
    
    return {
      success: true,
      id: nextId,
      message: 'Booking saved successfully'
    };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw new Error('Failed to save booking');
  }
}

// Handle booking submission
router.post('/', async (req, res) => {
  console.log('Received booking submission:', JSON.stringify(req.body, null, 2));
  
  try {
    const bookingData = req.body;
    
    // Basic validation
    if (!bookingData.service) {
      return res.status(400).json({
        success: false,
        message: 'Service type is required'
      });
    }
    
    // Normalize contact information
    const normalizedData = {
      ...bookingData,
      // Ensure contact info is available at both root and nested levels
      email: bookingData.email || (bookingData.contact && bookingData.contact.email),
      phone: bookingData.phone || (bookingData.contact && bookingData.contact.phone),
      contact: {
        email: (bookingData.contact && bookingData.contact.email) || bookingData.email,
        phone: (bookingData.contact && bookingData.contact.phone) || bookingData.phone,
        name: (bookingData.contact && bookingData.contact.name) || bookingData.name
      },
      // Ensure we have a name field
      name: bookingData.name || (bookingData.firstName && bookingData.lastName 
        ? `${bookingData.firstName} ${bookingData.lastName}` 
        : 'Névtelen Ügyfél')
    };
    
    // Parse date range if it's a single date string
    if (normalizedData.date && !normalizedData.startDate) {
      const [startDate, endDate] = normalizedData.date.split(' - ');
      if (startDate) {
        const [datePart, timePart] = startDate.split(' ');
        normalizedData.startDate = datePart;
        normalizedData.startTime = timePart || '12:00';
      }
      if (endDate) {
        const [datePart, timePart] = endDate.split(' ');
        normalizedData.endDate = datePart;
        normalizedData.endTime = timePart || '12:00';
      } else if (normalizedData.startDate) {
        normalizedData.endDate = normalizedData.startDate;
        normalizedData.endTime = normalizedData.startTime || '12:00';
      }
    }
    
    // Log normalized data for debugging
    console.log('Normalized booking data:', JSON.stringify(normalizedData, null, 2));
    
    // Handle different service types
    let result;
    if (normalizedData.service === 'airportParking') {
      // Save to Google Sheets
      const sheetResult = await saveAirportParking(normalizedData);
      
      // Format response to match frontend expectations
      result = {
        success: true,
        message: 'Parkolási foglalás sikeresen rögzítve',
        data: {
          id: sheetResult.id || 'temp_' + Date.now(),
          referenceNumber: sheetResult.id || 'temp_' + Date.now(),
          ...normalizedData,
          bookingDate: new Date().toISOString(),
          status: 'FELDOLGOZÁS ALATT'
        }
      };
    } else {
      // Handle other service types here
      result = {
        success: true,
        message: 'Sikeres foglalás',
        data: {
          id: 'temp_' + Date.now(),
          referenceNumber: 'temp_' + Date.now(),
          ...normalizedData,
          bookingDate: new Date().toISOString(),
          status: 'FELDOLGOZÁS ALATT'
        }
      };
    }
    
    // Send confirmation email if booking was successful
    if (result.success && result.data) {
      try {
        await emailService.sendBookingConfirmationEmails({
          ...result.data,
          customerEmail: result.data.email,
          customerName: result.data.name,
          customerPhone: result.data.phone,
          serviceType: result.data.service,
          date: result.data.startDate,
          time: result.data.startTime,
          totalPrice: result.data.totalPrice || 0
        });
        console.log('Confirmation email sent for booking:', result.data.id);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    // Log successful response
    console.log('Sending booking response:', JSON.stringify({
      success: result.success,
      message: result.message,
      data: { id: result.data?.id }
    }, null, 2));
    
    // Send the response
    return res.json({
      success: result.success,
      message: result.message,
      data: result.data
    });
    
  } catch (error) {
    console.error('Error processing booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Hiba történt a feldolgozás során',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
