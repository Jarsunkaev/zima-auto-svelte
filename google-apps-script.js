/**
 * Google Apps Script for Zima Auto Order Form Generation
 * 
 * Setup Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Deploy as a web app
 * 5. Set access to "Anyone, even anonymous"
 * 6. Copy the web app URL and add it to your environment variables as VITE_GOOGLE_APPS_SCRIPT_URL
 */

// Configuration - Update these with your actual IDs
const TEMPLATE_DOC_ID = '1LbBcibpTR1OY_HZpK5yISg1MOTpAKhqXCi1k2RlUsZc';

// Define allowed origins
const ALLOWED_ORIGINS = [
  'https://www.zima-auto.com',
  'https://zima-auto.com',
  'http://localhost:5000',
  'http://localhost:3000',
  'https://zima-auto-frontend.fly.dev'
];

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Zima Auto Order Form Generator is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    console.log('doPost called with:', e);
    console.log('postData:', e?.postData);
    
    if (!e || !e.postData) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No post data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    if (data.action === 'createOrderForm') {
      return createOrderForm(data.booking);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid action'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function createOrderForm(booking) {
  try {
    console.log('createOrderForm called with booking:', booking);
    console.log('Booking type:', typeof booking);
    console.log('Booking keys:', Object.keys(booking || {}));
    
    if (!booking) {
      console.error('No booking data provided');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No booking data provided'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate required fields
    const requiredFields = ['name', 'licensePlate', 'arrival', 'departure', 'days', 'total', 'email', 'phone', 'currentDate'];
    const missingFields = requiredFields.filter(field => !booking[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Missing required fields: ' + missingFields.join(', ')
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    console.log('All required fields present, proceeding with document creation...');
    
    // Create a copy of the template document
    let templateFile;
    try {
      templateFile = DriveApp.getFileById(TEMPLATE_DOC_ID);
      console.log('Template file accessed successfully:', templateFile.getName());
    } catch (templateError) {
      console.error('Failed to access template file:', templateError.message);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Template document not found or not accessible. Please check the TEMPLATE_DOC_ID configuration.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the target folder
    let targetFolder;
    try {
      targetFolder = DriveApp.getFolderById('1IH5hrnZHeu8c3jzZyy3ORlm-WQ7ztOor');
      console.log('Target folder accessed successfully:', targetFolder.getName());
    } catch (folderError) {
      console.error('Failed to access target folder:', folderError.message);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Target folder not found or not accessible. Please check the folder ID.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    console.log('Creating copy of template...');
    const newDoc = templateFile.makeCopy();
    const newDocId = newDoc.getId();
    console.log('Template copy created with ID:', newDocId);
    
    // Rename the copied document with a descriptive name
    console.log('Renaming document...');
    newDoc.setName(`Megrendelőlap Airport Parking - ${booking.name} - ${booking.currentDate}`);
    console.log('Document renamed successfully');
    
    // Move the document to the target folder
    console.log('Moving document to target folder...');
    targetFolder.addFile(newDoc);
    DriveApp.getRootFolder().removeFile(newDoc);
    console.log('Document moved to target folder successfully');
    
    // Open the new document for editing
    console.log('Opening document for editing...');
    const newDocFile = DocumentApp.openById(newDocId);
    console.log('Document opened successfully');
    const body = newDocFile.getBody();
    console.log('Document body accessed');
    
    console.log('Template opened, creating replacements...');
    
    const replacements = {
      '{{NÉV}}': booking.name || '',
      '{{RENDSZÁM}}': booking.licensePlate || '',
      '{{ÁTADÁS_IDŐPONTJA}}': booking.arrival || '',
      '{{FELVÉTEL_IDŐPONTJA}}': booking.departure || '',
      '{{PARKOLÁS_IDŐTARTAMA}}': `${booking.days || ''} nap`,
      '{{TOTAL_PRICE}}': `${booking.total || ''} Ft`,
      '{{ELÉRHETŐSÉG}}': `${booking.email || ''} / ${booking.phone || ''}`,
      '{{EMAIL}}': booking.email || '',
      '{{PHONE}}': booking.phone || '',
      '{{CURRENT_DATE}}': booking.currentDate || '',
      // Also support English placeholders for backward compatibility
      '{{CUSTOMER_NAME}}': booking.name || '',
      '{{LICENSE_PLATE}}': booking.licensePlate || '',
      '{{ARRIVAL_DATE}}': booking.arrival || '',
      '{{DEPARTURE_DATE}}': booking.departure || '',
      '{{DAYS}}': `${booking.days || ''} nap`,
      '{{TOTAL_AMOUNT}}': `${booking.total || ''} Ft`,
      '{{CUSTOMER_EMAIL}}': booking.email || '',
      '{{CUSTOMER_PHONE}}': booking.phone || ''
    };
    
    console.log('Replacements object:', replacements);
    
    // Perform replacements
    console.log('Starting text replacements...');
    for (const [placeholder, value] of Object.entries(replacements)) {
      console.log(`Replacing ${placeholder} with ${value}`);
      body.replaceText(placeholder, value);
    }
    console.log('All text replacements completed');
    
    // Save the document
    console.log('Saving and closing document...');
    newDocFile.saveAndClose();
    console.log('Document saved and closed successfully');
    
    console.log('Document saved successfully');
    
    // Document saved in target folder
    console.log('Document saved in target folder');
    
    // Create PDF version
    let pdfFile;
    try {
      console.log('Creating PDF from document...');
      const pdfBlob = newDoc.getAs('application/pdf');
      console.log('PDF blob created, size:', pdfBlob.getBytes().length);
      
      pdfFile = DriveApp.createFile(pdfBlob);
      pdfFile.setName(`Megrendelőlap Airport Parking - ${booking.name} - ${booking.currentDate}.pdf`);
      
      // Make the PDF publicly accessible
      pdfFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
      
      // Move the PDF to the target folder
      console.log('Moving PDF to target folder...');
      targetFolder.addFile(pdfFile);
      DriveApp.getRootFolder().removeFile(pdfFile);
      console.log('PDF moved to target folder successfully');
      
      console.log('PDF created successfully:', pdfFile.getName(), 'ID:', pdfFile.getId());
    } catch (pdfError) {
      console.error('Failed to create PDF:', pdfError.message);
      console.error('PDF creation error details:', pdfError);
      
      // Return success with just the document URL if PDF creation fails
      const docUrl = newDoc.getUrl();
      console.log('Document URL:', docUrl);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        documentUrl: docUrl,
        pdfUrl: null,
        documentId: newDocId,
        pdfId: null,
        warning: 'PDF creation failed, but document was created successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // PDF saved in target folder
    console.log('PDF saved in target folder');
    
    // Get the URLs
    const docUrl = newDoc.getUrl();
    const pdfUrl = pdfFile ? pdfFile.getDownloadUrl() : null;
    
    console.log('Document URL:', docUrl);
    console.log('PDF URL:', pdfUrl);
    
    // Documents created successfully in target folder
    console.log('Documents created successfully in target folder');
    
    // Always return success
    console.log('Document creation completed successfully in target folder');
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      documentUrl: docUrl,
      pdfUrl: pdfUrl,
      documentId: newDocId,
      pdfId: pdfFile ? pdfFile.getId() : null
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error creating order form:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - you can run this to test the script
function testCreateOrderForm() {
  const testBooking = {
    name: 'John Doe',
    licensePlate: 'ABC-123',
    arrival: '2024.01.15 10:00',
    departure: '2024.01.20 18:00',
    days: '5',
    total: '25000 Ft',
    email: 'john@example.com',
    phone: '+36 70 123 4567',
    currentDate: '2024.01.15'
  };
  
  const result = createOrderForm(testBooking);
  console.log(result.getContent());
}


