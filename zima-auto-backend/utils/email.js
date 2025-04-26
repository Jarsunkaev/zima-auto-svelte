// zima-auto-backend/utils/email.js
const nodemailer = require('nodemailer');

// Set up transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT), 
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Optional TLS options if needed
    tls: {
        rejectUnauthorized: false
    }
});

// Format service name for display based on language
function formatServiceName(serviceId, language = 'en') {
    // Default language fallback is English
    if (language === 'hu') {
        switch (serviceId) {
            case 'airportParking': return 'Reptéri Parkolás';
            case 'carWash': return 'Autómosó';
            case 'autoService': return 'Autószerviz';
            case 'tireService': return 'Gumiszerviz';
            default: return serviceId;
        }
    } else {
        switch (serviceId) {
            case 'airportParking': return 'Airport Parking';
            case 'carWash': return 'Car Wash';
            case 'autoService': return 'Auto Service';
            case 'tireService': return 'Tire Service';
            default: return serviceId;
        }
    }
}

// Format car wash package name with discounted price only
function formatCarWashPackage(packageId, language) {
    if (language === 'hu') {
        switch (packageId) {
            case 'smartInteriorExterior': return 'SMART - Belső és Külső (7120 Ft - kedvezményes ár)';
            case 'premiumInteriorExterior': return 'PRÉMIUM - Belső és Külső (9520 Ft - kedvezményes ár)';
            default: return packageId;
        }
    } else {
        switch (packageId) {
            case 'smartInteriorExterior': return 'SMART - Interior and Exterior (7120 HUF - discounted price)';
            case 'premiumInteriorExterior': return 'PREMIUM - Interior and Exterior (9520 HUF - discounted price)';
            default: return packageId;
        }
    }
}

// Format auto service type
function formatAutoServiceType(typeId, language) {
    if (language === 'hu') {
        switch (typeId) {
            case 'maintenance': return 'Általános karbantartás';
            case 'repair': return 'Javítás';
            case 'diagnostic': return 'Diagnosztika';
            case 'other': return 'Egyéb';
            default: return typeId;
        }
    } else {
        switch (typeId) {
            case 'maintenance': return 'General maintenance';
            case 'repair': return 'Repair';
            case 'diagnostic': return 'Diagnostics';
            case 'other': return 'Other';
            default: return typeId;
        }
    }
}

// Format tire service type
function formatTireServiceType(typeId, language) {
    if (language === 'hu') {
        switch (typeId) {
            case 'change': return 'Gumiabroncs csere';
            case 'repair': return 'Javítás';
            case 'balancing': return 'Kerékkiegyensúlyozás';
            case 'storage': return 'Gumitárolás';
            default: return typeId;
        }
    } else {
        switch (typeId) {
            case 'change': return 'Tire replacement';
            case 'repair': return 'Repair';
            case 'balancing': return 'Wheel balancing';
            case 'storage': return 'Tire storage';
            default: return typeId;
        }
    }
}

// Format price in Hungarian or English format
function formatPrice(amount, language) {
    if (language === 'hu') {
        return `${amount.toLocaleString('hu-HU')} Ft`;
    } else {
        return `${amount.toLocaleString('en-US')} HUF`;
    }
}

// Get formatted service details in both languages
function getFormattedBilingualServiceDetails(bookingData) {
    // Hungarian details
    let huDetails = '';
    // Basic info for all services
    huDetails += `<p><strong>Szolgáltatás:</strong> ${formatServiceName(bookingData.service, 'hu')}</p>`;
    huDetails += `<p><strong>Dátum:</strong> ${bookingData.date}</p>`;
    
    if (bookingData.time) {
        huDetails += `<p><strong>Időpont:</strong> ${bookingData.time}</p>`;
    }
    
    // Service-specific details
    switch (bookingData.service) {
        case 'airportParking':
            if (bookingData.days) {
                huDetails += `<p><strong>Időtartam:</strong> ${bookingData.days} nap</p>`;
            }
            if (bookingData.licensePlate) {
                huDetails += `<p><strong>Rendszám:</strong> ${bookingData.licensePlate}</p>`;
            }
            
            // Add parking price if provided
            if (bookingData.priceBreakdown && bookingData.priceBreakdown.parkingTotal) {
                huDetails += `<p><strong>Parkolási díj:</strong> ${formatPrice(bookingData.priceBreakdown.parkingTotal, 'hu')}</p>`;
            }
            
            if (bookingData.carWashPackage && bookingData.carWashPackage !== 'none') {
                huDetails += `<p><strong>Autómosó csomag:</strong> ${formatCarWashPackage(bookingData.carWashPackage, 'hu')}</p>`;
                
                // Add car wash discounted price if provided
                if (bookingData.priceBreakdown && bookingData.priceBreakdown.carWashDiscounted) {
                    huDetails += `<p><strong>Autómosó kedvezményes díj:</strong> ${formatPrice(bookingData.priceBreakdown.carWashDiscounted, 'hu')}</p>`;
                }
            }
            
            // Add total price if provided
            if (bookingData.totalPrice) {
                huDetails += `<div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                              <p style="font-weight: bold; color: #00bae5; font-size: 1.1em;"><strong>Végösszeg:</strong> ${formatPrice(bookingData.totalPrice, 'hu')}</p>
                              </div>`;
            }
            break;
            
        case 'carWash':
            // Any car wash specific details would go here
            break;
            
        case 'autoService':
            if (bookingData.serviceType) {
                huDetails += `<p><strong>Szerviz típusa:</strong> ${formatAutoServiceType(bookingData.serviceType, 'hu')}</p>`;
            }
            if (bookingData.carModel) {
                huDetails += `<p><strong>Autó típusa:</strong> ${bookingData.carModel}</p>`;
            }
            if (bookingData.licensePlate) {
                huDetails += `<p><strong>Rendszám:</strong> ${bookingData.licensePlate}</p>`;
            }
            if (bookingData.notes) {
                huDetails += `<p><strong>Megjegyzések:</strong> ${bookingData.notes}</p>`;
            }
            break;
            
        case 'tireService':
            if (bookingData.serviceType) {
                huDetails += `<p><strong>Szolgáltatás típusa:</strong> ${formatTireServiceType(bookingData.serviceType, 'hu')}</p>`;
            }
            if (bookingData.carModel) {
                huDetails += `<p><strong>Autó típusa:</strong> ${bookingData.carModel}</p>`;
            }
            if (bookingData.licensePlate) {
                huDetails += `<p><strong>Rendszám:</strong> ${bookingData.licensePlate}</p>`;
            }
            if (bookingData.tireCount) {
                huDetails += `<p><strong>Gumiabroncsok száma:</strong> ${bookingData.tireCount}</p>`;
            }
            if (bookingData.notes) {
                huDetails += `<p><strong>Megjegyzések:</strong> ${bookingData.notes}</p>`;
            }
            break;
    }
    
    // English details
    let enDetails = '';
    // Basic info for all services
    enDetails += `<p><strong>Service:</strong> ${formatServiceName(bookingData.service, 'en')}</p>`;
    enDetails += `<p><strong>Date:</strong> ${bookingData.date}</p>`;
    
    if (bookingData.time) {
        enDetails += `<p><strong>Time:</strong> ${bookingData.time}</p>`;
    }
    
    // Service-specific details
    switch (bookingData.service) {
        case 'airportParking':
            if (bookingData.days) {
                enDetails += `<p><strong>Duration:</strong> ${bookingData.days} days</p>`;
            }
            if (bookingData.licensePlate) {
                enDetails += `<p><strong>License Plate:</strong> ${bookingData.licensePlate}</p>`;
            }
            
            // Add parking price if provided
            if (bookingData.priceBreakdown && bookingData.priceBreakdown.parkingTotal) {
                enDetails += `<p><strong>Parking fee:</strong> ${formatPrice(bookingData.priceBreakdown.parkingTotal, 'en')}</p>`;
            }
            
            if (bookingData.carWashPackage && bookingData.carWashPackage !== 'none') {
                enDetails += `<p><strong>Car Wash Package:</strong> ${formatCarWashPackage(bookingData.carWashPackage, 'en')}</p>`;
                
                // Add car wash discounted price if provided
                if (bookingData.priceBreakdown && bookingData.priceBreakdown.carWashDiscounted) {
                    enDetails += `<p><strong>Car wash discounted fee:</strong> ${formatPrice(bookingData.priceBreakdown.carWashDiscounted, 'en')}</p>`;
                }
            }
            
            // Add total price if provided
            if (bookingData.totalPrice) {
                enDetails += `<div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                             <p style="font-weight: bold; color: #00bae5; font-size: 1.1em;"><strong>Total price:</strong> ${formatPrice(bookingData.totalPrice, 'en')}</p>
                             </div>`;
            }
            break;
            
        case 'carWash':
            // Any car wash specific details would go here
            break;
            
        case 'autoService':
            if (bookingData.serviceType) {
                enDetails += `<p><strong>Service Type:</strong> ${formatAutoServiceType(bookingData.serviceType, 'en')}</p>`;
            }
            if (bookingData.carModel) {
                enDetails += `<p><strong>Car Model:</strong> ${bookingData.carModel}</p>`;
            }
            if (bookingData.licensePlate) {
                enDetails += `<p><strong>License Plate:</strong> ${bookingData.licensePlate}</p>`;
            }
            if (bookingData.notes) {
                enDetails += `<p><strong>Notes:</strong> ${bookingData.notes}</p>`;
            }
            break;
            
        case 'tireService':
            if (bookingData.serviceType) {
                enDetails += `<p><strong>Service Type:</strong> ${formatTireServiceType(bookingData.serviceType, 'en')}</p>`;
            }
            if (bookingData.carModel) {
                enDetails += `<p><strong>Car Model:</strong> ${bookingData.carModel}</p>`;
            }
            if (bookingData.licensePlate) {
                enDetails += `<p><strong>License Plate:</strong> ${bookingData.licensePlate}</p>`;
            }
            if (bookingData.tireCount) {
                enDetails += `<p><strong>Number of Tires:</strong> ${bookingData.tireCount}</p>`;
            }
            if (bookingData.notes) {
                enDetails += `<p><strong>Notes:</strong> ${bookingData.notes}</p>`;
            }
            break;
    }
    
    return {
        hu: huDetails,
        en: enDetails
    };
}

// Send emails to both customer and admin
async function sendBookingConfirmationEmails(bookingData) {
    // Make sure SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("Email service not configured: Missing SMTP credentials");
        throw new Error("Email service not properly configured");
    }
    
    const adminEmail = bookingData.adminEmail || process.env.ADMIN_EMAIL || 'jarsunkaev@gmail.com';
    
    // Get bilingual service details
    const serviceDetails = getFormattedBilingualServiceDetails(bookingData);
    
    // 1. Send bilingual confirmation to customer
    try {
        await transporter.sendMail({
            from: `"Zima Auto" <${process.env.SMTP_USER}>`,
            to: bookingData.customerEmail,
            subject: `Zima Auto - Foglalás Visszaigazolása / Booking Confirmation`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Hungarian Section -->
                    <div style="margin-bottom: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Foglalás Visszaigazolása</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;">Tisztelt ${bookingData.customerName},</p>
                        
                        <p style="margin-bottom: 15px;">Köszönjük a foglalását a Zima Auto-nál. A foglalás a következő adatokkal lett visszaigazolva:</p>
                        
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            ${serviceDetails.hu}
                        </div>
                        
                        <p>Ha változtatásra van szüksége a foglalásában, vagy bármilyen kérdése van, kérjük, hívjon minket a +36 70 555 0588 telefonszámon, vagy válaszoljon erre az e-mailre.</p>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">Üdvözlettel,<br>Zima Auto Csapat</p>
                    </div>
                    
                    <!-- Divider -->
                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>
                    
                    <!-- English Section -->
                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Booking Confirmation</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;">Dear ${bookingData.customerName},</p>
                        
                        <p style="margin-bottom: 15px;">Thank you for booking with Zima Auto. Your reservation has been confirmed with the following details:</p>
                        
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            ${serviceDetails.en}
                        </div>
                        
                        <p>If you need to make any changes to your booking or have any questions, please contact us at +36 70 555 0588 or reply to this email.</p>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">Best regards,<br>Zima Auto Team</p>
                    </div>
                </div>
            `
        });
        
        console.log(`Bilingual confirmation email sent to customer: ${bookingData.customerEmail}`);
    } catch (error) {
        console.error("Error sending customer confirmation email:", error);
        throw error;
    }
    
    // 2. Send bilingual notification to admin
    try {
        await transporter.sendMail({
            from: `"Zima Auto Booking System" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `Új Foglalás / New Booking: ${formatServiceName(bookingData.service, 'hu')} / ${formatServiceName(bookingData.service, 'en')}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Hungarian Section -->
                    <div style="margin-bottom: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Új Foglalás Érkezett</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;"><strong>Ügyfél adatai:</strong></p>
                        <ul style="margin-bottom: 20px;">
                            <li><strong>Név:</strong> ${bookingData.customerName}</li>
                            <li><strong>Email:</strong> ${bookingData.customerEmail}</li>
                            <li><strong>Telefon:</strong> ${bookingData.customerPhone || 'Nincs megadva'}</li>
                        </ul>
                        
                        <p style="margin-bottom: 15px;"><strong>Foglalás részletei:</strong></p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            ${serviceDetails.hu}
                        </div>
                    </div>
                    
                    <!-- Divider -->
                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>
                    
                    <!-- English Section -->
                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">New Booking Received</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;"><strong>Customer Details:</strong></p>
                        <ul style="margin-bottom: 20px;">
                            <li><strong>Name:</strong> ${bookingData.customerName}</li>
                            <li><strong>Email:</strong> ${bookingData.customerEmail}</li>
                            <li><strong>Phone:</strong> ${bookingData.customerPhone || 'Not provided'}</li>
                        </ul>
                        
                        <p style="margin-bottom: 15px;"><strong>Booking Details:</strong></p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            ${serviceDetails.en}
                        </div>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">This is an automated notification from the Zima Auto Booking System.</p>
                    </div>
                </div>
            `
        });
        
        console.log(`Bilingual notification email sent to admin: ${adminEmail}`);
    } catch (error) {
        console.error("Error sending admin notification email:", error);
        // Continue even if admin email fails, as customer already got confirmation
    }
}

// Add this function to your utils/email.js file
// Place it right before the module.exports line
// Make the following changes to your email.js file:

// 1. First, ensure the sendContactEmails function is defined BEFORE it's used
// Add this function to your utils/email.js file after the existing functions
// but BEFORE the module.exports line:

// Send emails for contact form submissions
async function sendContactEmails(contactData) {
    // Make sure SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("Email service not configured: Missing SMTP credentials");
        throw new Error("Email service not properly configured");
    }
    
    const adminEmail = contactData.adminEmail || process.env.ADMIN_EMAIL || 'jarsunkaev@gmail.com';
    
    // 1. Send confirmation to the customer
    try {
        await transporter.sendMail({
            from: `"Zima Auto" <${process.env.SMTP_USER}>`,
            to: contactData.customerEmail,
            subject: `Zima Auto - Üzenet Visszaigazolása / Message Confirmation`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Hungarian Section -->
                    <div style="margin-bottom: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Üzenet Visszaigazolása</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;">Tisztelt ${contactData.customerName},</p>
                        
                        <p style="margin-bottom: 15px;">Köszönjük, hogy kapcsolatba lépett velünk. Üzenetét megkaptuk és hamarosan válaszolunk Önnek.</p>
                        
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            <p><strong>Tárgy:</strong> ${contactData.subject}</p>
                            <p><strong>Üzenet:</strong> ${contactData.message}</p>
                        </div>
                        
                        <p>Ha további kérdése van, kérjük, hívjon minket a +36 70 555 0588 telefonszámon, vagy válaszoljon erre az e-mailre.</p>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">Üdvözlettel,<br>Zima Auto Csapat</p>
                    </div>
                    
                    <!-- Divider -->
                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>
                    
                    <!-- English Section -->
                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Message Confirmation</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;">Dear ${contactData.customerName},</p>
                        
                        <p style="margin-bottom: 15px;">Thank you for contacting us. We have received your message and will respond to you shortly.</p>
                        
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            <p><strong>Subject:</strong> ${contactData.subject}</p>
                            <p><strong>Message:</strong> ${contactData.message}</p>
                        </div>
                        
                        <p>If you have any further questions, please contact us at +36 70 555 0588 or reply to this email.</p>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">Best regards,<br>Zima Auto Team</p>
                    </div>
                </div>
            `
        });
        
        console.log(`Confirmation email sent to customer: ${contactData.customerEmail}`);
    } catch (error) {
        console.error("Error sending customer confirmation email:", error);
        throw error;
    }
    
    // 2. Send notification to admin
    try {
        await transporter.sendMail({
            from: `"Zima Auto Contact Form" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `Új Kapcsolati Üzenet / New Contact Message: ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                    <!-- Hungarian Section -->
                    <div style="margin-bottom: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Új Kapcsolati Űrlap Üzenet</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;"><strong>Ügyfél adatai:</strong></p>
                        <ul style="margin-bottom: 20px;">
                            <li><strong>Név:</strong> ${contactData.customerName}</li>
                            <li><strong>Email:</strong> ${contactData.customerEmail}</li>
                            <li><strong>Telefon:</strong> ${contactData.customerPhone || 'Nincs megadva'}</li>
                        </ul>
                        
                        <p style="margin-bottom: 15px;"><strong>Üzenet részletei:</strong></p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            <p><strong>Tárgy:</strong> ${contactData.subject}</p>
                            <p><strong>Üzenet:</strong> ${contactData.message}</p>
                        </div>
                        
                        <p style="margin-top: 10px;"><strong>Küldés ideje:</strong> ${new Date().toLocaleString('hu-HU')}</p>
                    </div>
                    
                    <!-- Divider -->
                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>
                    
                    <!-- English Section -->
                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">New Contact Form Message</h2>
                        </div>
                        
                        <p style="margin-bottom: 15px;"><strong>Customer Details:</strong></p>
                        <ul style="margin-bottom: 20px;">
                            <li><strong>Name:</strong> ${contactData.customerName}</li>
                            <li><strong>Email:</strong> ${contactData.customerEmail}</li>
                            <li><strong>Phone:</strong> ${contactData.customerPhone || 'Not provided'}</li>
                        </ul>
                        
                        <p style="margin-bottom: 15px;"><strong>Message Details:</strong></p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            <p><strong>Subject:</strong> ${contactData.subject}</p>
                            <p><strong>Message:</strong> ${contactData.message}</p>
                        </div>
                        
                        <p style="margin-top: 10px;"><strong>Submission Time:</strong> ${new Date().toLocaleString('en-US')}</p>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">This is an automated notification from the Zima Auto Contact Form.</p>
                    </div>
                </div>
            `
        });
        
        console.log(`Notification email sent to admin: ${adminEmail}`);
    } catch (error) {
        console.error("Error sending admin notification email:", error);
        throw error; // Throw error for contact form as it's critical both emails are delivered
    }
}

// 2. Then, make sure the export is done correctly:
module.exports = {
    sendBookingConfirmationEmails,
    sendContactEmails
};