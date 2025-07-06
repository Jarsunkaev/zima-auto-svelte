// Google Apps Script for Zima Auto Airport Parking
// This script should be deployed as a web app

// Replace with your actual Google Sheet ID
const SPREADSHEET_ID = '1WfGOZdb2mSo9AZYIKjdpkQcESzGHk2zzeSuKkv3XadU';
const SHEET_NAME = 'Sheet1'; // Change if you used a different sheet name

// Define allowed origins
const ALLOWED_ORIGINS = [
  'https://www.zima-auto.com',
  'https://zima-auto.com',
  'http://localhost:5000',
  'http://localhost:3000',
  'https://zima-auto-frontend.fly.dev'
];

// Main entry points
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

// Handle all incoming requests
function handleRequest(e = {}) {
  try {
    // Ensure e is an object
    if (!e || typeof e !== 'object') {
      e = {};
    }
    
    // Handle CORS preflight request
    if (e && e.parameter && e.parameter.requestMethod === 'OPTIONS') {
      // For preflight requests, just return an empty response with 204 status
      // CORS headers will be set by the Google Apps Script web app configuration
      return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setContent('');
    }

    // Get the request origin
    const requestOrigin = getRequestOrigin(e);
    
    // Parse the request data
    let requestData = {};
    let action = '';
    
    // Check for POST data
    if (e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
        action = requestData.action || '';
      } catch (error) {
        console.error('Error parsing POST data:', error);
        return createErrorResponse('Invalid request data', 400);
      }
    } 
    // Check for GET parameters
    else if (e.parameter) {
      requestData = { ...e.parameter };
      action = e.parameter.action || '';
    }
    
    // If no action is specified, return a simple success response for the root URL
    if (!action) {
      return createCorsResponse({
        status: 'success',
        message: 'Zima Auto API is running',
        timestamp: new Date().toISOString()
      });
    }
    
    // Log the action and request data for debugging
    console.log('Action:', action);
    console.log('Request data:', JSON.stringify(requestData, null, 2));
    
    // Process the request based on the action
    let result;
    
    switch (action) {
      case 'createBooking':
        const bookingData = requestData.booking || {};
        result = createBooking({ ...bookingData, _request: e });
        break;
      case 'getBookings':
        result = getBookings(e);
        break;
      case 'updateStatus':
        const postData = e.postData ? requestData : e.parameter;
        result = updateStatus(postData.id, postData.status, e);
        break;
      default:
        return createErrorResponse('Invalid action specified', 400);
    }

    // Return the response with CORS headers
    return createCorsResponse(result);
    
  } catch (error) {
    console.error('Error handling request:', error);
    return createErrorResponse(error.message || 'An error occurred while processing your request');
  }
}

// Get the request origin from various possible locations
function getRequestOrigin(e) {
  if (!e) return '';
  
  // Try to get from __req parameter
  if (e.parameter && e.parameter.__req) {
    try {
      const reqData = JSON.parse(e.parameter.__req);
      if (reqData.headers && reqData.headers.origin) {
        return reqData.headers.origin;
      }
    } catch (error) {
      console.error('Error parsing __req parameter:', error);
    }
  }
  
  // Try to get from referer header
  if (e.parameter && e.parameter.referer) {
    try {
      const refererUrl = new URL(e.parameter.referer);
      return refererUrl.origin;
    } catch (error) {
      console.error('Error parsing referer:', error);
    }
  }
  
  // Try to get from postData
  if (e.postData && e.postData.contents) {
    try {
      const postData = JSON.parse(e.postData.contents);
      if (postData.origin) return postData.origin;
      if (postData.headers && postData.headers.origin) return postData.headers.origin;
    } catch (error) {
      console.error('Error parsing postData contents:', error);
    }
  }
  
  return '';
}

// Create a CORS-enabled response
function createCorsResponse(data) {
  const response = ContentService.createTextOutput(JSON.stringify(data));
  
  // In Google Apps Script, we set the MIME type directly
  response.setMimeType(ContentService.MimeType.JSON);
  
  // For Google Apps Script web apps, CORS headers are set in the deployment configuration
  // No need to set them here as they're handled at the deployment level
  
  return response;
}

// Create an error response
function createErrorResponse(message, statusCode = 500) {
  console.error('Error:', message);
  return createCorsResponse({
    status: 'error',
    message: message,
    code: statusCode
  });
}

// Get all bookings from the Google Sheet
function getBookings(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet || sheet.getLastRow() < 2) {
      return { status: 'success', data: [], _request: e };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = [
      'id', 'name', 'licensePlate', 'arrival', 'departure', 'days', 
      'passengers', 'amount', 'email', 'phone', 'createdAt', 'status'
    ];
    
    const bookings = [];
    
    // Start from index 1 to skip headers
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const booking = {};
      
      // Map each cell to its corresponding header
      for (let j = 0; j < headers.length; j++) {
        if (j < row.length) {
          booking[headers[j]] = row[j];
        } else {
          booking[headers[j]] = ''; // Default empty string for missing columns
        }
      }
      
      // Add the row number as an ID if ID column is empty
      if (!booking.id) {
        booking.id = `row-${i + 1}`;
      }
      
      // Ensure all required fields are present
      if (booking.name || booking.email) { // Only include rows with at least a name or email
        bookings.push(booking);
      }
    }
    
    console.log('Retrieved bookings:', JSON.stringify(bookings, null, 2));
    
    return { 
      status: 'success',
      data: bookings,
      _request: e // Include the original request for CORS handling
    };
    
  } catch (error) {
    console.error('Error in getBookings:', error);
    throw new Error('Failed to retrieve bookings: ' + error.message);
  }
}

// Create a new booking in the Google Sheet
function createBooking(bookingData) {
  try {
    const e = bookingData._request || {};
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        'ID', 'NÉV', 'RENDSZÁM', 'ÉRKEZÉS', 'TÁVOZÁS', 'HÁNY NAP', 'HÁNY FŐ',
        'ÖSSZEG', 'EMAIL', 'TELEFON', 'CREATED_AT', 'ÁLLAPOT'
      ];
      sheet.appendRow(headers);
    }
    
    // Generate a unique ID for the booking
    const id = Utilities.getUuid();
    const now = new Date();
    
    // Calculate days between arrival and departure
    const arrival = new Date(bookingData.arrival);
    const departure = new Date(bookingData.departure);
    const daysDifference = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
    
    // Prepare the row data according to the sheet's column structure
    const rowData = [
      id,                                    // ID
      bookingData.name || '',                // NÉV
      bookingData.licensePlate || '',        // RENDSZÁM
      bookingData.arrival || '',             // ÉRKEZÉS
      bookingData.departure || '',           // TÁVOZÁS
      daysDifference || 1,                   // HÁNY NAP
      bookingData.passengers || 1,           // HÁNY FŐ
      bookingData.amount || 0,               // ÖSSZEG
      bookingData.email || '',               // EMAIL
      bookingData.phone || '',               // TELEFON
      now.toISOString(),                     // CREATED_AT
      'Függőben'                            // ÁLLAPOT
    ];
    
    // Add the new row to the sheet
    sheet.appendRow(rowData);
    
    // Prepare the response
    const response = {
      status: 'success',
      message: 'Booking created successfully',
      data: {
        id,
        ...bookingData,
        status: 'Függőben',
        createdAt: now.toISOString()
      },
      _request: e
    };
    
    // Remove the _request property from the response data
    delete response.data._request;
    
    return response;
    
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw new Error('Failed to create booking: ' + error.message);
  }
}

// Update the status of a booking
function updateStatus(id, status, e = {}) {
  try {
    // Input validation
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid or missing booking ID');
    }
    
    if (!status || typeof status !== 'string') {
      throw new Error('Invalid or missing status');
    }
    
    // Ensure e is an object
    if (!e || typeof e !== 'object') {
      e = {};
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet not found');
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (!data || data.length === 0) {
      throw new Error('No data found in sheet');
    }
    
    const headers = data[0];
    
    // Find the status and ID column indices
    const statusCol = headers.indexOf('ÁLLAPOT') + 1; // +1 because getRange is 1-indexed
    const idCol = headers.indexOf('ID') + 1;
    
    if (statusCol === 0 || idCol === 0) {
      throw new Error('Required columns not found');
    }
    
    // Find the row with the matching ID
    let rowFound = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i] && data[i][idCol - 1] === id) {
        // Update the status in the sheet
        sheet.getRange(i + 1, statusCol).setValue(status);
        rowFound = true;
        
        return {
          status: 'success',
          message: 'Booking status updated successfully',
          data: { id, status },
          _request: e
        };
      }
    }
    
    throw new Error('Booking not found');
    
  } catch (error) {
    console.error('Error in updateStatus:', error);
    throw new Error('Failed to update booking status');
  }
}
