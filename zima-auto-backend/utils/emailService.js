const nodemailer = require('nodemailer');
const { Resend } = require('resend');

class EmailService {
    constructor() {
        // Initialize Resend client
        this.resend = new Resend(process.env.RESEND_API_KEY);

        // Initialize Nodemailer SMTP transport
        this.smtpTransport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // Use TLS (true for 465, false for other ports)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
             tls: {
                // do not fail on invalid certs - use only in development
                rejectUnauthorized: process.env.NODE_ENV !== 'development'
            }
        });

         // Verify SMTP connection on startup (optional but recommended)
        this.smtpTransport.verify(function(error, success) {
            if (error) {
                console.error("SMTP connection verification failed:", error);
            } else {
                console.log("SMTP server is ready to take our messages");
            }
        });
    }

    // Validate email format
    static isValidEmail(email) {
        // Simple regex for basic email format validation
        return typeof email === 'string' &&
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Extract email from booking data
    static extractEmail(bookingData) {
        // Check common fields where email might be stored
        const possibleEmailSources = [
            bookingData.customerEmail,
            bookingData.contact?.email, // Using optional chaining
            bookingData.email,
            // Add other potential fields if necessary
            bookingData.contact && bookingData.contact.email // Backward compatibility without optional chaining
        ];

        for (const emailSource of possibleEmailSources) {
            // Check if it's a non-empty string and matches basic email format
            if (typeof emailSource === 'string' &&
                emailSource.trim() !== '' && // Ensure it's not just whitespace
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSource.trim())) {
                return emailSource.trim().toLowerCase(); // Return trimmed and lowercased email
            }
        }

        // Fallback email address if none found
        console.warn("No valid customer email found in booking data. Using fallback email.");
        return 'ahmedhasimov@zima-auto.com'; // Fallback email - consider if this is desired behavior
    }

    // Format service names for display in emails
    static formatServiceName(serviceId, language = 'en') {
        const services = {
            hu: {
                'airportParking': 'Reptéri Parkolás',
                'carWash': 'Autómosó',
                'autoService': 'Autószerviz',
                'tireService': 'Gumiszerviz'
            },
            en: {
                'airportParking': 'Airport Parking',
                'carWash': 'Car Wash',
                'autoService': 'Auto Service',
                'tireService': 'Tire Service'
            }
        };
        // Return translated name or original ID if translation not found
        return services[language] && services[language][serviceId] ? services[language][serviceId] : serviceId;
    }

    // Send email with multiple providers as fallback
    async sendEmail(options) {
        // Define providers in order of preference
        const providers = [
            { name: 'Resend', method: this._sendViaResend },
            { name: 'SMTP', method: this._sendViaSMTP }
        ];

        // Default sender address
        const fullOptions = {
            from: 'Zima Auto <info@zima-auto.com>', // Use a generic info address
            ...options
        };

        // Basic validation before attempting to send
        if (!fullOptions.to) {
            console.error('Email sending failed: Recipient email is required.');
            throw new Error('Recipient email is required');
        }
         if (!EmailService.isValidEmail(fullOptions.to)) {
             console.error(`Email sending failed: Invalid recipient email format for ${fullOptions.to}.`);
             throw new Error(`Invalid recipient email format: ${fullOptions.to}`);
         }
        if (!fullOptions.subject) {
             console.error('Email sending failed: Email subject is required.');
            throw new Error('Email subject is required');
        }
        if (!fullOptions.html && !fullOptions.text) {
             console.error('Email sending failed: Email content (html or text) is required.');
            throw new Error('Email content (html or text) is required');
        }


        for (const provider of providers) {
            try {
                console.log(`Attempting to send email to ${fullOptions.to} via ${provider.name}`);

                const result = await provider.method.call(this, fullOptions);
                console.log(`✅ Email sent successfully via ${provider.name} to ${fullOptions.to}`);
                return result; // Return on first successful send
            } catch (error) {
                console.error(`❌ Email sending failed with ${provider.name} to ${fullOptions.to}:`, {
                    errorMessage: error.message,
                    // Avoid logging the whole stack in production unless necessary
                    errorStack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
                    emailOptions: {
                        to: fullOptions.to,
                        subject: fullOptions.subject,
                        hasHtml: !!fullOptions.html,
                        hasText: !!fullOptions.text,
                        // Do not log sensitive content like `html` or `text` body
                    },
                    originalError: error // Log the original error object
                });
                // Continue to the next provider if the current one fails
            }
        }

        // If all providers fail
        const finalErrorMessage = `All email providers failed to send email to ${fullOptions.to}. Check server logs for details.`;
        console.error(`🔥🔥 ${finalErrorMessage}`);
        throw new Error(finalErrorMessage);
    }

    // Send via Resend API
    async _sendViaResend(options) {
        // Resend API call structure
        const result = await this.resend.emails.send({
            from: options.from,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc, // Include BCC if available in options
            subject: options.subject,
            html: options.html,
            text: options.text, // Include text alternative for better deliverability
            reply_to: options.replyTo, // Include replyTo if available
        });

        // Resend indicates errors via result.error
        if (result.error) {
            // Log Resend specific error details if available
            console.error("Resend API returned an error:", result.error);
            throw new Error(result.error.message || 'Resend email sending failed');
        }

        // Resend returns data like id, from, to, etc. on success
        console.log('Resend API successful response:', result);
        return result;
    }

    // Send via SMTP
    async _sendViaSMTP(options) {
        // Nodemailer mail options structure
        const mailOptions = {
            from: options.from,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc, // Include BCC
            subject: options.subject,
            html: options.html,
            text: options.text, // Include text alternative
            replyTo: options.replyTo, // Include replyTo
            // attachments: options.attachments // Include attachments if needed
        };

        // Nodemailer sendMail call
        const result = await this.smtpTransport.sendMail(mailOptions);

        // Nodemailer throws an error on failure, so if we reach here, it was successful
        console.log('SMTP successful response:', result);
        return result; // Result contains info about the sent message (e.g., messageId)
    }

    // Orchestrates sending booking confirmation emails (customer + admin)
    async sendBookingConfirmationEmails(bookingData) {
        const customerEmail = EmailService.extractEmail(bookingData);

        // Validate customer email before proceeding
        if (!EmailService.isValidEmail(customerEmail)) {
             const validationError = `Invalid or missing customer email address found in booking data: "${customerEmail}"`;
             console.error(validationError, bookingData);
            throw new Error(validationError);
        }

        // --- Send email to customer ---
        try {
            console.log(`Generating customer confirmation email for ${customerEmail}`);
            const customerEmailHtml = this.generateServiceSpecificTemplate(bookingData);

            await this.sendEmail({
                to: customerEmail,
                cc: 'ahmedhasimov@zima-auto.com', // CC to admin for monitoring
                subject: 'Zima Auto - Foglalás Visszaigazolása / Booking Confirmation',
                html: customerEmailHtml
            });
            console.log(`Customer confirmation email sent to ${customerEmail}`);
        } catch (error) {
            console.error(`Failed to send customer confirmation email to ${customerEmail}:`, error);
            // Decide if you want to throw here or try sending the admin email first
            // Throwing here means the admin won't get notified about a failed customer email send
            // Not throwing means the admin gets notified, but the customer didn't.
            // Let's log and proceed to admin email, as admin notification is crucial.
        }


        // --- Send notification email to Zima Auto admin ---
         try {
            console.log(`Generating admin notification email for booking ID: ${bookingData.id || 'N/A'}`);
            const adminEmailHtml = this.generateAdminNotificationTemplate(bookingData, customerEmail);

            // Send to primary info address, CC to ahmedhasimov
            await this.sendEmail({
                to: 'info@zima-auto.com', // Primary admin email
                cc: 'ahmedhasimov@zima-auto.com', // Secondary admin email
                subject: `New Booking Confirmation - ${EmailService.formatServiceName(bookingData.service, 'en')}`, // More descriptive subject
                html: adminEmailHtml
            });
             console.log(`Admin notification email sent for booking ID: ${bookingData.id || 'N/A'}`);
         } catch (error) {
              console.error(`Failed to send admin notification email for booking ID: ${bookingData.id || 'N/A'}:`, error);
              // It's critical for the admin to know about new bookings, so re-throw this error
              // if the admin email is essential for workflow. Or log and handle appropriately.
              // For now, let's just log as the customer email might have succeeded.
              // Depending on requirements, you might want to alert differently if admin email fails.
         }

        return true; // Indicate that the process attempted to send both emails
    }

    // Generate the email template specific to the service type for the CUSTOMER
    generateServiceSpecificTemplate(bookingData) {
        // Pass bookingData to specific template generators
        switch(bookingData.service) {
            case 'airportParking':
                return this.generateAirportParkingTemplate(bookingData);
            case 'carWash':
                return this.generateCarWashTemplate(bookingData);
            case 'autoService':
                return this.generateAutoServiceTemplate(bookingData);
            case 'tireService':
                return this.generateTireServiceTemplate(bookingData);
            default:
                 console.warn(`Unknown service type '${bookingData.service}'. Generating default template.`);
                return this.generateDefaultTemplate(bookingData);
        }
    }

    // Generate notification email template for the ADMIN
    generateAdminNotificationTemplate(bookingData, customerEmail) {
        // Basic service info
        const serviceName = EmailService.formatServiceName(bookingData.service, 'hu');
        const serviceNameEn = EmailService.formatServiceName(bookingData.service, 'en');
        const customerName = bookingData.customerName || bookingData.name || '';
        const phone = bookingData.customerPhone || bookingData.contact?.phone || 'N/A';

        // Common details HTML structure
        let adminEmailContent = `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Új Foglalás / New Booking
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                        <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei / Booking Details</h3>
                        ${bookingData.id ? `<p style="margin: 5px 0;"><strong>Foglalás ID / Booking ID:</strong> ${bookingData.id}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>Ügyfél neve / Customer Name:</strong> ${customerName || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
                        <p style="margin: 5px 0;"><strong>Telefon / Phone:</strong> ${phone}</p>
                        <p style="margin: 5px 0;"><strong>Szolgáltatás / Service:</strong> ${serviceName} / ${serviceNameEn}</p>
        `;

        // Add service-specific details based on bookingData.service
        switch(bookingData.service) {
            case 'airportParking':
                const dateRange = bookingData.date || 'N/A';
                const licensePlate = bookingData.licensePlate || 'N/A';
                const passengers = bookingData.passengers || 'N/A';
                const days = bookingData.days || 'N/A';
                const totalPrice = bookingData.totalPrice || 'N/A';
                const hasCarWash = bookingData.carWashPackage && bookingData.carWashPackage !== 'none';

                adminEmailContent += `
                        <p style="margin: 5px 0;"><strong>Parkolási időszak / Parking Period:</strong> ${dateRange}</p>
                        <p style="margin: 5px 0;"><strong>Napok száma / Days:</strong> ${days}</p>
                        <p style="margin: 5px 0;"><strong>Rendszám / License Plate:</strong> ${licensePlate}</p>
                        <p style="margin: 5px 0;"><strong>Utasok száma / Passengers:</strong> ${passengers}</p>
                        ${hasCarWash ? `<p style="margin: 5px 0;"><strong>Autómosó csomag / Car Wash Package:</strong> ${bookingData.carWashPackageName || bookingData.carWashPackage || 'N/A'}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>Végösszeg / Total Price:</strong> ${totalPrice} Ft</p>
                `;
                break;

            case 'carWash':
                const carWashDate = bookingData.date || 'N/A';
                const carWashTime = bookingData.time || 'N/A';

                adminEmailContent += `
                        <p style="margin: 5px 0;"><strong>Dátum / Date:</strong> ${carWashDate}</p>
                        <p style="margin: 5px 0;"><strong>Időpont / Time:</strong> ${carWashTime}</p>
                `;
                break;

            case 'autoService':
                const autoServiceDate = bookingData.date || 'N/A';
                const autoServiceTime = bookingData.time || 'N/A';
                const autoServiceType = bookingData.serviceType || 'N/A';
                const carModel = bookingData.carModel || 'N/A';
                const autoLicensePlate = bookingData.licensePlate || 'N/A';

                // Map service type to Hungarian and English descriptions
                const autoServiceTypeMap = {
                    maintenance: { hu: 'Általános karbantartás', en: 'General maintenance' },
                    repair: { hu: 'Javítás', en: 'Repair' },
                    diagnostic: { hu: 'Diagnosztika', en: 'Diagnostics' },
                    other: { hu: 'Egyéb', en: 'Other' }
                };
                const autoServiceTypeHu = autoServiceTypeMap[autoServiceType]?.hu || autoServiceType;
                const autoServiceTypeEn = autoServiceTypeMap[autoServiceType]?.en || autoServiceType;

                adminEmailContent += `
                        <p style="margin: 5px 0;"><strong>Szolgáltatás típusa / Service Type:</strong> ${autoServiceTypeHu} / ${autoServiceTypeEn}</p>
                        <p style="margin: 5px 0;"><strong>Dátum / Date:</strong> ${autoServiceDate}</p>
                        <p style="margin: 5px 0;"><strong>Időpont / Time:</strong> ${autoServiceTime}</p>
                        <p style="margin: 5px 0;"><strong>Autó típusa / Car Model:</strong> ${carModel}</p>
                        <p style="margin: 5px 0;"><strong>Rendszám / License Plate:</strong> ${autoLicensePlate}</p>
                `;
                break;

            case 'tireService':
                const tireServiceDate = bookingData.date || 'N/A';
                const tireServiceTime = bookingData.time || 'N/A';
                const tireServiceType = bookingData.serviceType || 'N/A';
                const tireCarModel = bookingData.carModel || 'N/A';
                const tireLicensePlate = bookingData.licensePlate || 'N/A';
                const tireCount = bookingData.tireCount || 'N/A';

                // Map service type to Hungarian and English descriptions
                 const tireServiceTypeMap = {
                    change: { hu: 'Gumiabroncs csere', en: 'Tire replacement' },
                    repair: { hu: 'Javítás', en: 'Repair' },
                    balancing: { hu: 'Kerékkiegyensúlyozás', en: 'Wheel balancing' },
                    storage: { hu: 'Gumitárolás', en: 'Tire storage' }
                };
                const tireServiceTypeHu = tireServiceTypeMap[tireServiceType]?.hu || tireServiceType;
                const tireServiceTypeEn = tireServiceTypeMap[tireServiceType]?.en || tireServiceType;

                adminEmailContent += `
                        <p style="margin: 5px 0;"><strong>Szolgáltatás típusa / Service Type:</strong> ${tireServiceTypeHu} / ${tireServiceTypeEn}</p>
                        <p style="margin: 5px 0;"><strong>Dátum / Date:</strong> ${tireServiceDate}</p>
                        <p style="margin: 5px 0;"><strong>Időpont / Time:</strong> ${tireServiceTime}</p>
                        <p style="margin: 5px 0;"><strong>Autó típusa / Car Model:</strong> ${tireCarModel}</p>
                        <p style="margin: 5px 0;"><strong>Rendszám / License Plate:</strong> ${tireLicensePlate}</p>
                        <p style="margin: 5px 0;"><strong>Gumiabroncsok száma / Number of Tires:</strong> ${tireCount}</p>
                `;
                break;

            default:
                // Default case - just add date and time if available
                const defaultDate = bookingData.date || 'N/A';
                const defaultTime = bookingData.time || ''; // Time might not be applicable

                adminEmailContent += `
                        <p style="margin: 5px 0;"><strong>Dátum / Date:</strong> ${defaultDate}</p>
                        ${defaultTime ? `<p style="margin: 5px 0;"><strong>Időpont / Time:</strong> ${defaultTime}</p>` : ''}
                `;
        }

        // Add notes/additional details if available
        const notes = bookingData.notes || bookingData.additionalDetails || null;
        if (notes) {
            adminEmailContent += `
                        <p style="margin: 5px 0;"><strong>Megjegyzések / Additional Details:</strong> ${notes}</p>
            `;
        }

        // Close the details section and main content div
        adminEmailContent += `
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.<br>
                        Generated by Zima Auto Booking System
                    </p>
                </footer>
            </div>
        `;

        return adminEmailContent;
    }

    // Generate template for Airport Parking service (Customer Email)
    generateAirportParkingTemplate(bookingData) {
        // Extract specific fields for airport parking
        const customerName = bookingData.customerName || bookingData.name || '';
        const email = EmailService.extractEmail(bookingData); // Ensure this gets the customer's email
        const phone = bookingData.customerPhone || bookingData.contact?.phone || 'N/A';
        const dateRange = bookingData.date || 'N/A'; // Format "YYYY-MM-DD HH:MM - YYYY-MM-DD HH:MM"
        const licensePlate = bookingData.licensePlate || 'N/A';
        const passengers = bookingData.passengers || 'N/A';
        const days = bookingData.days || 'N/A';

        // Price breakdown info
        const hasPriceBreakdown = bookingData.priceBreakdown && typeof bookingData.priceBreakdown === 'object';
        const parkingTotal = hasPriceBreakdown ? bookingData.priceBreakdown.parkingTotal : 'N/A';
        const totalPrice = bookingData.totalPrice || 'N/A'; // Final calculated total

        // Car wash add-on info
        const hasCarWash = bookingData.carWashPackage && bookingData.carWashPackage !== 'none';
        const carWashPackageName = bookingData.carWashPackageName || (hasCarWash ? bookingData.carWashPackage : '');
        const carWashStandard = hasPriceBreakdown && hasCarWash ? bookingData.priceBreakdown.carWashStandard : 0;
        const carWashDiscount = hasPriceBreakdown && hasCarWash ? bookingData.priceBreakdown.carWashDiscount : 0;
        const carWashDiscounted = hasPriceBreakdown && hasCarWash ? bookingData.priceBreakdown.carWashDiscounted : 0;
        const notes = bookingData.notes || 'N/A';


        return `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Reptéri Parkolás Foglalás / Airport Parking Booking
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Tisztelt ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Köszönjük a foglalását a Zima Auto reptéri parkolónkban. A foglalás a következő adatokkal lett visszaigazolva:
                        </p>

                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei</h3>
                            <p style="margin: 5px 0;"><strong>Ügyfél neve:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>E-mail cím:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Telefonszám:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Parkolási időszak:</strong> ${dateRange}</p>
                            <p style="margin: 5px 0;"><strong>Napok száma:</strong> ${days}</p>
                            <p style="margin: 5px 0;"><strong>Rendszám:</strong> ${licensePlate}</p>
                            <p style="margin: 5px 0;"><strong>Utasok száma:</strong> ${passengers}</p>

                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Megjegyzések:</strong> ${notes}</p>` : ''}

                            <div style="margin-top: 15px; border-top: 1px dashed #ddd; padding-top: 15px;">
                                <h4 style="margin-top: 0; color: #00bae5;">Árak részletezése</h4>
                                <p style="margin: 5px 0;"><strong>Parkolás díj:</strong> ${parkingTotal} Ft</p>
                                ${hasCarWash ? `
                                <p style="margin: 5px 0;"><strong>Autómosó csomag:</strong> ${carWashPackageName}</p>
                                <p style="margin: 5px 0;"><strong>Autómosó díj (alap):</strong> ${carWashStandard} Ft</p>
                                <p style="margin: 5px 0;"><strong>Autómosó kedvezmény (20%):</strong> - ${carWashDiscount} Ft</p>
                                <p style="margin: 5px 0;"><strong>Autómosó díj (kedvezményes):</strong> ${carWashDiscounted} Ft</p>
                                ` : ''}
                                <p style="margin: 10px 0; font-weight: bold; color: #00bae5; font-size: 16px;">
                                    <strong>Végösszeg:</strong> ${totalPrice} Ft
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr style="border: 0; height: 1px; background-color: #ddd; margin: 30px 0;">

                    <div>
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Dear ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Thank you for booking with Zima Auto airport parking. Your reservation has been confirmed with the following details:
                        </p>

                        <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; border-left: 5px solid #2196f3;">
                            <h3 style="margin-top: 0; color: #2196f3;">Booking Details</h3>
                            <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Parking Period:</strong> ${dateRange}</p>
                            <p style="margin: 5px 0;"><strong>Number of Days:</strong> ${days}</p>
                            <p style="margin: 5px 0;"><strong>License Plate:</strong> ${licensePlate}</p>
                            <p style="margin: 5px 0;"><strong>Number of Passengers:</strong> ${passengers}</p>

                             ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Additional Notes:</strong> ${notes}</p>` : ''}

                            <div style="margin-top: 15px; border-top: 1px dashed #ddd; padding-top: 15px;">
                                <h4 style="margin-top: 0; color: #2196f3;">Price Breakdown</h4>
                                <p style="margin: 5px 0;"><strong>Parking Fee:</strong> ${parkingTotal} HUF</p>
                                ${hasCarWash ? `
                                <p style="margin: 5px 0;"><strong>Car Wash Package:</strong> ${carWashPackageName}</p>
                                <p style="margin: 5px 0;"><strong>Car Wash Fee (Standard):</strong> ${carWashStandard} HUF</p>
                                <p style="margin: 5px 0;"><strong>Car Wash Discount (20%):</strong> - ${carWashDiscount} HUF</p>
                                <p style="margin: 5px 0;"><strong>Car Wash Fee (Discounted):</strong> ${carWashDiscounted} HUF</p>
                                ` : ''}
                                <p style="margin: 10px 0; font-weight: bold; color: #2196f3; font-size: 16px;">
                                    <strong>Total Price:</strong> ${totalPrice} HUF
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 25px; background-color: #e6f2ff; border-radius: 8px; padding: 15px; color: #0056b3;">
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Cím / Address:</strong> Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220
                        </p>
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Kapcsolat / Contact:</strong><br>
                            📞 +36 70 555 0588<br>
                            ✉️ info@zima-auto.com
                        </p>
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.<br>
                        Üdvözlettel / Best regards, Zima Auto Csapat / Zima Auto Team
                    </p>
                </footer>
            </div>
        `;
    }

    // Generate template for Tire Service (Customer Email)
    generateTireServiceTemplate(bookingData) {
        // Extract specific fields for tire service
        const customerName = bookingData.customerName || bookingData.name || '';
        const email = EmailService.extractEmail(bookingData); // Ensure this gets the customer's email
        const phone = bookingData.customerPhone || bookingData.contact?.phone || 'N/A';
        const date = bookingData.date || 'N/A';
        const time = bookingData.time || 'N/A';
        const serviceType = bookingData.serviceType || 'N/A';

        // Map service type to Hungarian and English descriptions
        const serviceTypeMap = {
            change: { hu: 'Gumiabroncs csere', en: 'Tire replacement' },
            repair: { hu: 'Javítás', en: 'Repair' },
            balancing: { hu: 'Kerékkiegyensúlyozás', en: 'Wheel balancing' },
            storage: { hu: 'Gumitárolás', en: 'Tire storage' }
        };

        const serviceTypeHu = serviceTypeMap[serviceType]?.hu || serviceType;
        const serviceTypeEn = serviceTypeMap[serviceType]?.en || serviceType;

        const carModel = bookingData.carModel || 'N/A';
        const licensePlate = bookingData.licensePlate || 'N/A';
        const tireCount = bookingData.tireCount || 'N/A';
        const notes = bookingData.notes || 'N/A';

        return `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Gumiszerviz Időpontfoglalás / Tire Service Appointment
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Tisztelt ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Köszönjük a foglalását a Zima Auto gumiszervizünkben. A foglalás a következő adatokkal lett visszaigazolva:
                        </p>

                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei</h3>
                            <p style="margin: 5px 0;"><strong>Ügyfél neve:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>E-mail cím:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Telefonszám:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Szolgáltatás:</strong> Gumiszerviz</p>
                            <p style="margin: 5px 0;"><strong>Szolgáltatás típusa:</strong> ${serviceTypeHu}</p>
                            <p style="margin: 5px 0;"><strong>Dátum:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Időpont:</strong> ${time}</p>
                            <p style="margin: 5px 0;"><strong>Autó típusa:</strong> ${carModel}</p>
                            <p style="margin: 5px 0;"><strong>Rendszám:</strong> ${licensePlate}</p>
                            <p style="margin: 5px 0;"><strong>Gumiabroncsok száma:</strong> ${tireCount}</p>
                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Megjegyzések:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <hr style="border: 0; height: 1px; background-color: #ddd; margin: 30px 0;">

                    <div>
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Dear ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Thank you for booking with Zima Auto tire service. Your appointment has been confirmed with the following details:
                        </p>

                        <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; border-left: 5px solid #2196f3;">
                            <h3 style="margin-top: 0; color: #2196f3;">Booking Details</h3>
                            <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Service:</strong> Tire Service</p>
                            <p style="margin: 5px 0;"><strong>Service Type:</strong> ${serviceTypeEn}</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                            <p style="margin: 5px 0;"><strong>Car Model:</strong> ${carModel}</p>
                            <p style="margin: 5px 0;"><strong>License Plate:</strong> ${licensePlate}</p>
                            <p style="margin: 5px 0;"><strong>Number of Tires:</strong> ${tireCount}</p>
                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Additional Notes:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <div style="margin-top: 25px; background-color: #e6f2ff; border-radius: 8px; padding: 15px; color: #0056b3;">
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Cím / Address:</strong> Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220
                        </p>
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Kapcsolat / Contact:</strong><br>
                            📞 +36 70 555 0588<br>
                            ✉️ info@zima-auto.com
                        </p>
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.<br>
                        Üdvözlettel / Best regards, Zima Auto Csapat / Zima Auto Team
                    </p>
                </footer>
            </div>
        `;
    }

    // Generate template for Car Wash service (Customer Email)
    generateCarWashTemplate(bookingData) {
        // Extract specific fields for car wash
        const customerName = bookingData.customerName || bookingData.name || '';
        const email = EmailService.extractEmail(bookingData); // Ensure this gets the customer's email
        const phone = bookingData.customerPhone || bookingData.contact?.phone || 'N/A';
        const date = bookingData.date || 'N/A';
        const time = bookingData.time || 'N/A';
        const notes = bookingData.notes || 'N/A';


        return `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Autómosó Időpontfoglalás / Car Wash Appointment
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Tisztelt ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Köszönjük a foglalását a Zima Auto autómosónkban. Az időpont a következő adatokkal lett visszaigazolva:
                        </p>

                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei</h3>
                            <p style="margin: 5px 0;"><strong>Ügyfél neve:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>E-mail cím:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Telefonszám:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Szolgáltatás:</strong> Autómosó</p>
                            <p style="margin: 5px 0;"><strong>Dátum:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Időpont:</strong> ${time}</p>
                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Megjegyzések:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <hr style="border: 0; height: 1px; background-color: #ddd; margin: 30px 0;">

                    <div>
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Dear ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Thank you for booking with Zima Auto car wash. Your appointment has been confirmed with the following details:
                        </p>

                        <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; border-left: 5px solid #2196f3;">
                            <h3 style="margin-top: 0; color: #2196f3;">Booking Details</h3>
                            <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Service:</strong> Car Wash</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Additional Notes:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <div style="margin-top: 25px; background-color: #e6f2ff; border-radius: 8px; padding: 15px; color: #0056b3;">
                         <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Cím / Address:</strong> Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220
                        </p>
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Kapcsolat / Contact:</strong><br>
                            📞 +36 70 555 0588<br>
                            ✉️ info@zima-auto.com
                        </p>
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.<br>
                        Üdvözlettel / Best regards, Zima Auto Csapat / Zima Auto Team
                    </p>
                </footer>
            </div>
        `;
    }

     // Generate template for Auto Service (Customer Email)
    generateAutoServiceTemplate(bookingData) {
        // Extract specific fields for auto service
        const customerName = bookingData.customerName || bookingData.name || '';
        const email = EmailService.extractEmail(bookingData); // Ensure this gets the customer's email
        const phone = bookingData.customerPhone || bookingData.contact?.phone || 'N/A';
        const date = bookingData.date || 'N/A';
        const time = bookingData.time || 'N/A';
        const serviceType = bookingData.serviceType || 'N/A';

        // Map service type to Hungarian and English descriptions
        const serviceTypeMap = {
            maintenance: { hu: 'Általános karbantartás', en: 'General maintenance' },
            repair: { hu: 'Javítás', en: 'Repair' },
            diagnostic: { hu: 'Diagnosztika', en: 'Diagnostics' },
            other: { hu: 'Egyéb', en: 'Other' }
        };

        const serviceTypeHu = serviceTypeMap[serviceType]?.hu || serviceType;
        const serviceTypeEn = serviceTypeMap[serviceType]?.en || serviceType;

        const carModel = bookingData.carModel || 'N/A';
        const licensePlate = bookingData.licensePlate || 'N/A';
        const notes = bookingData.notes || 'N/A';


        return `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Autószerviz Időpontfoglalás / Auto Service Appointment
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Tisztelt ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Köszönjük a foglalását a Zima Auto autószervizünkben. Az időpont a következő adatokkal lett visszaigazolva:
                        </p>

                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei</h3>
                            <p style="margin: 5px 0;"><strong>Ügyfél neve:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>E-mail cím:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Telefonszám:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Szolgáltatás:</strong> Autószerviz</p>
                             <p style="margin: 5px 0;"><strong>Szolgáltatás típusa:</strong> ${serviceTypeHu}</p>
                            <p style="margin: 5px 0;"><strong>Dátum:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Időpont:</strong> ${time}</p>
                            <p style="margin: 5px 0;"><strong>Autó típusa:</strong> ${carModel}</p>
                            <p style="margin: 5px 0;"><strong>Rendszám:</strong> ${licensePlate}</p>
                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Megjegyzések:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <hr style="border: 0; height: 1px; background-color: #ddd; margin: 30px 0;">

                    <div>
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Dear ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Thank you for booking with Zima Auto auto service. Your appointment has been confirmed with the following details:
                        </p>

                        <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; border-left: 5px solid #2196f3;">
                            <h3 style="margin-top: 0; color: #2196f3;">Booking Details</h3>
                            <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Service:</strong> Auto Service</p>
                            <p style="margin: 5px 0;"><strong>Service Type:</strong> ${serviceTypeEn}</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                            <p style="margin: 5px 0;"><strong>Car Model:</strong> ${carModel}</p>
                            <p style="margin: 5px 0;"><strong>License Plate:</strong> ${licensePlate}</p>
                             ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Additional Notes:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <div style="margin-top: 25px; background-color: #e6f2ff; border-radius: 8px; padding: 15px; color: #0056b3;">
                         <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Cím / Address:</strong> Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220
                        </p>
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Kapcsolat / Contact:</strong><br>
                            📞 +36 70 555 0588<br>
                            ✉️ info@zima-auto.com
                        </p>
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.<br>
                        Üdvözlettel / Best regards, Zima Auto Csapat / Zima Auto Team
                    </p>
                </footer>
            </div>
        `;
    }


    // Generate a default email template if service type is unknown (Customer Email)
    generateDefaultTemplate(bookingData) {
         // Extract common fields
        const customerName = bookingData.customerName || bookingData.name || '';
        const email = EmailService.extractEmail(bookingData); // Ensure this gets the customer's email
        const phone = bookingData.customerPhone || bookingData.contact?.phone || 'N/A';
        const date = bookingData.date || 'N/A';
        const time = bookingData.time || 'N/A';
        const serviceName = EmailService.formatServiceName(bookingData.service, 'hu');
        const serviceNameEn = EmailService.formatServiceName(bookingData.service, 'en');
        const notes = bookingData.notes || 'N/A';


        return `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Foglalás Visszaigazolása / Booking Confirmation
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Tisztelt ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Köszönjük a foglalását a Zima Auto-nál. A foglalás a következő adatokkal lett visszaigazolva:
                        </p>

                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei</h3>
                            <p style="margin: 5px 0;"><strong>Ügyfél neve:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>E-mail cím:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Telefonszám:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Szolgáltatás:</strong> ${serviceName}</p>
                            ${date ? `<p style="margin: 5px 0;"><strong>Dátum:</strong> ${date}</p>` : ''}
                            ${time ? `<p style="margin: 5px 0;"><strong>Időpont:</strong> ${time}</p>` : ''}
                             ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Megjegyzések:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <hr style="border: 0; height: 1px; background-color: #ddd; margin: 30px 0;">

                    <div>
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Dear ${customerName},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Thank you for booking with Zima Auto. Your booking has been confirmed with the following details:
                        </p>

                        <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; border-left: 5px solid #2196f3;">
                            <h3 style="margin-top: 0; color: #2196f3;">Booking Details</h3>
                            <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                            <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceNameEn}</p>
                            ${date ? `<p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>` : ''}
                            ${time ? `<p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>` : ''}
                            ${notes !== 'N/A' ? `<p style="margin: 5px 0;"><strong>Additional Notes:</strong> ${notes}</p>` : ''}
                        </div>
                    </div>

                    <div style="margin-top: 25px; background-color: #e6f2ff; border-radius: 8px; padding: 15px; color: #0056b3;">
                         <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Cím / Address:</strong> Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220
                        </p>
                        <p style="margin: 5px 0; font-weight: 600;">
                            <strong>Kapcsolat / Contact:</strong><br>
                            📞 +36 70 555 0588<br>
                            ✉️ info@zima-auto.com
                        </p>
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.<br>
                        Üdvözlettel / Best regards, Zima Auto Csapat / Zima Auto Team
                    </p>
                </footer>
            </div>
        `;
    }
}

module.exports = EmailService;