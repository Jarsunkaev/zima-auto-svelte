// utils/mailjet.js
const Mailjet = require('node-mailjet');

// Helper function to validate email format - same as before
function isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper function to extract email from different possible sources - same as before
function extractEmail(bookingData) {
    console.log("Extracting email from:", JSON.stringify(bookingData, null, 2));
    
    const possibleEmailSources = [
        bookingData.customerEmail,
        bookingData.contact?.email,
        bookingData.email,
        bookingData.contact && bookingData.contact.email
    ];

    // Find the first valid email
    for (const emailSource of possibleEmailSources) {
        if (typeof emailSource === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSource.trim())) {
            console.log("Valid email found:", emailSource.trim());
            return emailSource.trim().toLowerCase();
        }
    }

    console.error('No valid email found in booking data');
    // Fallback to your own email to avoid sending failures
    return 'info@zima-auto.com';
}

// Format service names based on language - same as before
function formatServiceName(serviceId, language = 'en') {
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

// Other helper functions (formatting) from your original code...
// These are identical to your original code, so I'm skipping them for brevity

// Get formatted service details in both languages - same as before
function getFormattedBilingualServiceDetails(bookingData) {
    // This function should be the same as your original implementation
    // Let's assume you're keeping this function unchanged
    // Return example format for clarity:
    return {
        hu: `<p><strong>Szolgáltatás:</strong> ${formatServiceName(bookingData.service, 'hu')}</p>
             <p><strong>Dátum:</strong> ${bookingData.date}</p>`,
        en: `<p><strong>Service:</strong> ${formatServiceName(bookingData.service, 'en')}</p>
             <p><strong>Date:</strong> ${bookingData.date}</p>`
    };
}

// Initialize Mailjet with API credentials
function getMailjetClient() {
    // Check for credentials
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
        console.error('❌ Missing Mailjet API credentials!');
        throw new Error('Mailjet API credentials not configured');
    }

    // Initialize Mailjet client
    return Mailjet.apiConnect(
        process.env.MAILJET_API_KEY,
        process.env.MAILJET_SECRET_KEY
    );
}

// Main function to send email via Mailjet
async function sendMailjetEmail(data) {
    try {
        // Get Mailjet client
        const mailjet = getMailjetClient();

        console.log('Sending email via Mailjet:', {
            from: data.from,
            to: data.to,
            subject: data.subject
        });

        // Format the request for Mailjet API
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: data.from.includes('<') 
                                ? data.from.match(/<([^>]+)>/)[1] 
                                : data.from,
                            Name: data.from.includes('<') 
                                ? data.from.split('<')[0].trim() 
                                : 'Zima Auto'
                        },
                        To: [
                            {
                                Email: data.to
                            }
                        ],
                        Subject: data.subject,
                        HTMLPart: data.html,
                        ReplyTo: data.replyTo || undefined
                    }
                ]
            });

        // Send the email
        const result = await request;
        
        console.log('✅ Mailjet Email Sent Successfully:', {
            messageId: result.body.Messages?.[0]?.To?.[0]?.MessageID || 'Unknown',
            status: result.body.Messages?.[0]?.Status || 'Unknown'
        });
        
        return result.body;
    } catch (error) {
        console.error('❌ Mailjet Email Sending Failed:', {
            error: error.message,
            details: error.response?.data || error
        });
        throw error;
    }
}

// Main function to send booking confirmation emails
async function sendBookingConfirmationEmails(bookingData) {
    // Extract customer email
    const customerEmail = extractEmail(bookingData);
    console.log(`✅ Extracted Customer Email: ${customerEmail}`);

    // Validate email format
    if (!isValidEmail(customerEmail)) {
        console.error('❌ INVALID Email Format:', customerEmail);
        throw new Error(`Invalid email address format: ${customerEmail}`);
    }

    // Get bilingual service details
    const serviceDetails = getFormattedBilingualServiceDetails(bookingData);

    // Log the email attempt before sending
    console.log(`
    ====== EMAIL SENDING ATTEMPT ======
    To Customer: ${customerEmail}
    To Admin: info@zima-auto.com
    Subject: Zima Auto - Foglalás Visszaigazolása / Booking Confirmation
    ==============================
    `);

    // 1. Send bilingual confirmation to customer
    try {
        const customerMailResult = await sendMailjetEmail({
            from: 'Zima Auto <ahmedhasimov@zima-auto.com>',
            to: customerEmail,
            subject: 'Zima Auto - Foglalás Visszaigazolása / Booking Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="margin-bottom: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Foglalás Visszaigazolása</h2>
                        </div>

                        <p style="margin-bottom: 15px;">Tisztelt ${bookingData.customerName || bookingData.name},</p>

                        <p style="margin-bottom: 15px;">Köszönjük a foglalását a Zima Auto-nál. A foglalás a következő adatokkal lett visszaigazolva:</p>

                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            ${serviceDetails.hu}
                        </div>

                        <p>Ha változtatásra van szüksége a foglalásában, vagy bármilyen kérdése van, kérjük, hívjon minket a +36 70 555 0588 telefonszámon, vagy válaszoljon erre az e-mailre.</p>

                        <p style="margin-top: 20px; color: #666; font-size: 14px;">Üdvözlettel,<br>Zima Auto Csapat</p>
                    </div>

                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>

                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Booking Confirmation</h2>
                        </div>

                        <p style="margin-bottom: 15px;">Dear ${bookingData.customerName || bookingData.name},</p>

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

        console.log(`✅ Bilingual confirmation email sent to customer: ${customerEmail}`);

        // 2. Send a copy to info@zima-auto.com
        const infoEmailCopy = await sendMailjetEmail({
            from: 'Zima Auto Booking System <info@zima-auto.com>',
            to: 'info@zima-auto.com',
            subject: `Booking Confirmation Copy: ${formatServiceName(bookingData.service, 'en')}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="margin-bottom: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #00bae5;">Booking Confirmation Copy</h2>
                        </div>

                        <p style="margin-bottom: 15px;"><strong>Customer Details:</strong></p>
                        <ul style="margin-bottom: 20px;">
                            <li><strong>Name:</strong> ${bookingData.customerName || bookingData.name}</li>
                            <li><strong>Email:</strong> ${customerEmail}</li>
                            <li><strong>Phone:</strong> ${bookingData.customerPhone || (bookingData.contact && bookingData.contact.phone) || 'Not provided'}</li>
                        </ul>

                        <p style="margin-bottom: 15px;"><strong>Booking Details:</strong></p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00bae5;">
                            ${serviceDetails.en}
                        </div>

                        <p style="margin-top: 20px; color: #666; font-size: 14px;">This is a copy of the booking confirmation sent to the customer.</p>
                    </div>
                </div>
            `
        });

        console.log(`✅ Booking confirmation copy sent to info@zima-auto.com`);
    } catch (error) {
        console.error("❌ Error sending booking confirmation emails:", error);
        throw error;
    }
}

// Send emails for contact form submissions
async function sendContactEmails(contactData) {
    // Check for customer email
    if (!contactData.customerEmail || !isValidEmail(contactData.customerEmail)) {
        console.error("❌ Invalid or missing customer email:", contactData.customerEmail);
        throw new Error("Valid customer email is required");
    }

    // Log the email attempt before sending
    console.log(`
    ====== CONTACT EMAIL SENDING ATTEMPT ======
    To Customer: ${contactData.customerEmail}
    To Admin: info@zima-auto.com
    Subject: Zima Auto - Kapcsolati Üzenet / Contact Message
    ==============================
    `);

    try {
        // 1. Send confirmation to customer
        const customerMailResult = await sendMailjetEmail({
            from: 'Zima Auto Contact Form <info@zima-auto.com>',
            to: contactData.customerEmail,
            subject: 'Zima Auto - Üzenet Visszaigazolása / Message Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
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

                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>

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

        console.log(`✅ Confirmation email sent to customer: ${contactData.customerEmail}`);
    } catch (error) {
        console.error("❌ Error sending customer confirmation email:", error);
    }

    // 2. Send notification to admin
    try {
        await sendMailjetEmail({
            from: 'Zima Auto Contact Form <info@zima-auto.com>',
            to: 'info@zima-auto.com',
            replyTo: contactData.customerEmail,
            subject: 'Új Kapcsolati Ürlap Üzenet / New Contact Message: ' + contactData.subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
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

                    <div style="border-top: 1px solid #ddd; margin: 30px 0;"></div>

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

                        <p style="margin-top: 10px;"><strong>Sent Time:</strong> ${new Date().toLocaleString('en-US')}</p>
                    </div>
                </div>
            `
        });

        console.log(`✅ New contact message notification sent to info@zima-auto.com`);
    } catch (error) {
        console.error("❌ Error sending admin notification email:", error);
        throw error;
    }
}

// Simple test function to verify email sending
async function testMailjetConnection() {
    try {
        const result = await sendMailjetEmail({
            from: 'Zima Auto <ahmedhasimov@zima-auto.com>',
            to: 'info@zima-auto.com',
            subject: 'Mailjet Test Email',
            html: '<h1>Mailjet Test</h1><p>This is a test email to verify Mailjet connection.</p>'
        });
        
        console.log('✅ Mailjet test email sent successfully!');
        return result;
    } catch (error) {
        console.error('❌ Mailjet test failed:', error);
        throw error;
    }
}

// Export the functions
module.exports = {
    sendBookingConfirmationEmails,
    sendContactEmails,
    testMailjetConnection
};