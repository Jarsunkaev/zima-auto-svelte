// test-domain-delegation.js
const { google } = require('googleapis');

async function testDomainDelegation() {
  const serviceAccount = require('./credentials/service-account.json');
  
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: 'ahmedhasimov@zima-auto.com' // Your admin email
  });
  
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    console.log('Testing domain-wide delegation...');
    
    // Try to access the calendar
    const calendarId = 'c_8431682552f67d9917a67afd7165d7b14c964a381ced3cd4aa8c84ea9ea1e713@group.calendar.google.com';
    
    const result = await calendar.calendars.get({ calendarId });
    console.log('✅ Access granted! Calendar:', result.data.summary);
    
    // Try to create an event
    const testEvent = {
      summary: 'Test Event - Domain Delegation',
      start: {
        dateTime: '2025-05-03T10:00:00',
        timeZone: 'Europe/Budapest',
      },
      end: {
        dateTime: '2025-05-03T10:30:00',
        timeZone: 'Europe/Budapest',
      },
    };
    
    const eventResult = await calendar.events.insert({
      calendarId,
      resource: testEvent,
    });
    
    console.log('✅ Event created successfully:', eventResult.data.id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('unauthorized_client')) {
      console.log('\nIf you see "unauthorized_client", wait a few minutes for the delegation to take effect');
    }
  }
}

testDomainDelegation();