const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');

// Read the service account key
async function getServiceAccountCredentials() {
  try {
    let credentials;

    // Try loading from environment variable first
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        console.log('Loaded Google Calendar credentials from environment variable.');
      } catch (parseError) {
        console.error('Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON:', parseError);
        throw new Error('Failed to parse Google Calendar credentials JSON from environment variable');
      }
    } else {
      // Fallback to loading from file
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
          list: async (params) => {
            console.log('MOCK CALENDAR: events.list called with params:', params);
            return { data: { items: [] } };
          },
          insert: async (params) => {
            console.log('MOCK CALENDAR: events.insert called with params:', params);
            return { data: { id: 'mock-event-id-' + Date.now() } };
          }
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
    console.error('GOOGLE_CALENDAR_ID environment variable is not set!');
    return 'jarsunkaev@gmail.com';
  }
  console.log(`Using Calendar ID: ${calendarId}`);
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
    console.log('Booking Data:', bookingData);

    let event;
    if (service === 'airportParking') {
      const { startDate, startTime, endDate, endTime, customerEmail, customerPhone, days, licensePlate, passengers, carWashPackage, priceBreakdown, totalPrice, notes } = bookingData;
      if (!startDate || !startTime || !endDate || !endTime) throw new Error('Missing airport parking start/end');

      event = {
        summary: `${formatServiceName(service)} - ${customerName}`,
        description:
          `Service: ${formatServiceName(service)}/${formatServiceName(service,'hu')}\n` +
          `Customer: ${customerName}\nEmail: ${customerEmail || 'N/A'}\nPhone: ${customerPhone || 'N/A'}\n` +
          `Duration: ${days} days\n` +
          (licensePlate ? `License Plate: ${licensePlate}\n` : '') +
          (passengers   ? `Passengers: ${passengers}\n` : '') +
          (carWashPackage && carWashPackage!=='none' ? `Car Wash Package: ${carWashPackage}\n` : '') +
          (priceBreakdown ? Object.entries(priceBreakdown).map(([k,v])=>`${k}: ${v} HUF`).join('\n') + '\n' : '') +
          (totalPrice ? `Total Price: ${totalPrice} HUF\n` : '') +
          (notes ? `Notes: ${notes}\n` : ''),
        start: { dateTime: `${startDate}T${startTime}:00`, timeZone: 'Europe/Budapest' },
        end:   { dateTime: `${endDate}T${endTime}:00`,     timeZone: 'Europe/Budapest' },
        colorId: getServiceColorId(service),
        extendedProperties: { private: { service, customerEmail, customerPhone, bookingReference: `ZIMA-${Date.now().toString(36).toUpperCase()}` } }
      };
    } else {
      const duration = service==='carWash'?30:60;
      const pad=v=>v.toString().padStart(2,'0');
      const startStr=`${date}T${pad(time.split(':')[0])}:${pad(time.split(':')[1])}:00`;
      const dtStart=new Date(startStr);
      const dtEnd=new Date(dtStart.getTime()+duration*60000);
      const endStr=`${dtEnd.getFullYear()}-${pad(dtEnd.getMonth()+1)}-${pad(dtEnd.getDate())}T${pad(dtEnd.getHours())}:${pad(dtEnd.getMinutes())}:00`;

      let description=
        `Service: ${formatServiceName(service)}/${formatServiceName(service,'hu')}\n`+
        `Customer: ${customerName}\nEmail: ${bookingData.customerEmail||'N/A'}\nPhone: ${bookingData.customerPhone||'N/A'}\n`;
      ['serviceType','carModel','licensePlate','tireCount','notes','totalPrice'].forEach(f=>{if(bookingData[f]!=null)description+=`${f.charAt(0).toUpperCase()+f.slice(1)}: ${bookingData[f]}\n`;});

      event={summary:`${formatServiceName(service)} - ${customerName}`,description,
        start:{dateTime:startStr,timeZone:'Europe/Budapest'},
        end:{dateTime:endStr,timeZone:'Europe/Budapest'},
        colorId:getServiceColorId(service),
        extendedProperties:{private:{service,bookingReference:`ZIMA-${Date.now().toString(36).toUpperCase()}`}}};
    }

    const response=await calendar.events.insert({calendarId,resource:event});
    console.log('Event created:',response.data.id);
    return response.data.id;
  } catch(error) {
    console.error('Error adding event to Google Calendar:',error);
    throw error;
  }
}

/**
 * Check time slot availability
 */
async function checkTimeSlotAvailability(calendar,date,service){
  try{
    const calendarId=getCalendarId(service);
    console.log(`Checking availability for ${service} on ${date}`);
    const [y,mo,d]=date.split('-').map(Number);
    const startOfDay=new Date(Date.UTC(y,mo-1,d,0,0,0));
    const endOfDay=new Date(Date.UTC(y,mo-1,d,23,59,59,999));
    const resp=await calendar.events.list({calendarId,timeMin:startOfDay.toISOString(),timeMax:endOfDay.toISOString(),singleEvents:true,orderBy:'startTime'});
    const events=resp.data.items||[];
    const relevant=events.filter(e=>e.extendedProperties?.private?.service===service);
    const slots=generateTimeSlots(service);
    const busy=[];
    relevant.forEach(ev=>{
      const es=new Date(ev.start.dateTime||ev.start.date);
      const ee=new Date(ev.end.dateTime||ev.end.date);
      slots.forEach(slot=>{
        const [hh,mm]=slot.split(':').map(Number);
        const st=new Date(y,mo-1,d,hh,mm);
        const et=new Date(st.getTime()+30*60000);
        if(es<et&&ee>st&&!busy.includes(slot))busy.push(slot);
      });
    });
    console.log('Busy slots:',busy);
    return busy;
  }catch(err){console.error('Error checking time slot availability:',err);return [];}
}

// Generate 30-min slots within business hours
function generateTimeSlots(service){
  const hours={carWash:[8,18],autoService:[8,17],tireService:[8,17],airportParking:[0,24]};
  const [open,close]=hours[service]||[8,17];
  const slots=[];
  for(let t=open;t<close;t+=0.5){const hh=Math.floor(t).toString().padStart(2,'0');const mm=((t%1)*60).toString().padStart(2,'0');slots.push(`${hh}:${mm}`);} 
  return slots.sort();
}

module.exports={getGoogleCalendarClient,addEventToCalendar,checkTimeSlotAvailability,generateTimeSlots,getServiceColorId};
