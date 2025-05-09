const nodemailer = require('nodemailer');
const { Resend } = require('resend');

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.smtpTransport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false, // Use TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    // Validate email format
    static isValidEmail(email) {
        return typeof email === 'string' && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Extract email from booking data
    static extractEmail(bookingData) {
        const possibleEmailSources = [
            bookingData.customerEmail,
            bookingData.contact?.email,
            bookingData.email,
            bookingData.contact && bookingData.contact.email
        ];

        for (const emailSource of possibleEmailSources) {
            if (typeof emailSource === 'string' && 
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSource.trim())) {
                return emailSource.trim().toLowerCase();
            }
        }

        return 'ahmedhasimov@zima-auto.com';
    }

    // Format service names
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
        return services[language][serviceId] || serviceId;
    }

    // Send email with multiple providers
    async sendEmail(options) {
        const providers = [
            { name: 'Resend', method: this._sendViaResend },
            { name: 'SMTP', method: this._sendViaSMTP }
        ];

        const fullOptions = {
            from: 'Zima Auto <ahmedhasimov@zima-auto.com>',
            ...options
        };

        for (const provider of providers) {
            try {
                console.log(`Attempting to send email via ${provider.name}`);
                
                // Validate email options
                if (!fullOptions.to) {
                    throw new Error('Recipient email is required');
                }
                if (!fullOptions.subject) {
                    throw new Error('Email subject is required');
                }
                if (!fullOptions.html) {
                    throw new Error('Email HTML content is required');
                }

                const result = await provider.method.call(this, fullOptions);
                console.log(`✅ Email sent successfully via ${provider.name}`);
                return result;
            } catch (error) {
                console.error(`❌ Email sending failed with ${provider.name}:`, {
                    errorMessage: error.message,
                    errorStack: error.stack,
                    emailOptions: {
                        to: fullOptions.to,
                        subject: fullOptions.subject,
                        hasHtml: !!fullOptions.html
                    }
                });
                // Continue to next provider
            }
        }

        throw new Error('All email providers failed. Check server logs for details.');
    }

    // Send via Resend API
    async _sendViaResend(options) {
        const result = await this.resend.emails.send({
            from: options.from,
            to: options.to,
            cc: options.cc,
            subject: options.subject,
            html: options.html
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        console.log('✅ Email sent via Resend:', result);
        return result;
    }

    // Send via SMTP
    async _sendViaSMTP(options) {
        const mailOptions = {
            from: options.from,
            to: options.to,
            cc: options.cc,
            subject: options.subject,
            html: options.html
        };

        const result = await this.smtpTransport.sendMail(mailOptions);
        console.log('✅ Email sent via SMTP:', result);
        return result;
    }

    // Send booking confirmation emails
    async sendBookingConfirmationEmails(bookingData) {
        const customerEmail = EmailService.extractEmail(bookingData);

        if (!EmailService.isValidEmail(customerEmail)) {
            throw new Error(`Invalid email address: ${customerEmail}`);
        }

        // Comprehensive service details formatting
        const formatServiceDetails = (language) => {
            const serviceNameMap = {
                hu: {
                    'airportParking': 'Reptéri Parkolás',
                    'carWash': 'Autómosás',
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

            const detailsMap = {
                hu: {
                    'customerName': 'Ügyfél neve',
                    'email': 'E-mail cím',
                    'phone': 'Telefonszám',
                    'service': 'Szolgáltatás',
                    'date': 'Dátum',
                    'time': 'Időpont',
                    'carModel': 'Autó típusa',
                    'licensePlate': 'Rendszám',
                    'additionalDetails': 'További megjegyzések'
                },
                en: {
                    'customerName': 'Customer Name',
                    'email': 'Email Address',
                    'phone': 'Phone Number',
                    'service': 'Service',
                    'date': 'Date',
                    'time': 'Time',
                    'carModel': 'Car Model',
                    'licensePlate': 'License Plate',
                    'additionalDetails': 'Additional Notes'
                }
            };

            const details = [
                { key: 'customerName', value: bookingData.customerName || bookingData.name },
                { key: 'email', value: customerEmail },
                { key: 'phone', value: bookingData.customerPhone || bookingData.phone || 'N/A' },
                { key: 'service', value: serviceNameMap[language][bookingData.service] },
                { key: 'date', value: bookingData.date },
                { key: 'time', value: bookingData.time || 'N/A' },
                { key: 'carModel', value: bookingData.carModel || 'N/A' },
                { key: 'licensePlate', value: bookingData.licensePlate || 'N/A' },
                { key: 'additionalDetails', value: bookingData.notes || bookingData.additionalDetails || 'Nincs' }
            ];

            return details.map(detail => 
                `<p style="margin: 5px 0;">
                    <strong>${detailsMap[language][detail.key]}:</strong> 
                    ${detail.value}
                </p>`
            ).join('');
        };

        const emailHtml = `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Foglalás Visszaigazolása / Booking Confirmation
                    </h1>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <!-- Hungarian Section -->
                    <div style="margin-bottom: 30px;">
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Tisztelt ${bookingData.customerName || bookingData.name},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Köszönjük a foglalását a Zima Auto-nál. A foglalás a következő adatokkal lett visszaigazolva:
                        </p>

                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei</h3>
                            ${formatServiceDetails('hu')}
                        </div>
                    </div>

                    <!-- Divider -->
                    <hr style="border: 0; height: 1px; background-color: #ddd; margin: 30px 0;">

                    <!-- English Section -->
                    <div>
                        <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
                            Dear ${bookingData.customerName || bookingData.name},
                        </p>

                        <p style="margin-bottom: 20px; color: #666;">
                            Thank you for booking with Zima Auto. Your reservation has been confirmed with the following details:
                        </p>

                        <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; border-left: 5px solid #2196f3;">
                            <h3 style="margin-top: 0; color: #2196f3;">Booking Details</h3>
                            ${formatServiceDetails('en')}
                        </div>
                    </div>

                    <div style="margin-top: 25px; background-color: #e6f2ff; border-radius: 8px; padding: 15px; color: #0056b3;">
                        <p style="margin: 0; font-weight: 600;">
                            Kapcsolat / Contact:<br>
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

        // Send email to customer with CC to admin
        await this.sendEmail({
            to: customerEmail,
            cc: 'ahmedhasimov@zima-auto.com',
            subject: 'Zima Auto - Foglalás Visszaigazolása / Booking Confirmation',
            html: emailHtml
        });

        // Send email to Zima Auto admin
        await this.sendEmail({
            to: 'info@zima-auto.com',
            cc: 'ahmedhasimov@zima-auto.com',
            subject: 'New Booking Confirmation',
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                    <header style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                            Új Foglalás / New Booking
                        </h1>
                    </header>

                    <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                            <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei / Booking Details</h3>
                            <p style="margin: 5px 0;">
                                <strong>Ügyfél neve / Customer Name:</strong> 
                                ${bookingData.customerName || bookingData.name}
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>Email:</strong> 
                                ${customerEmail}
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>Telefon / Phone:</strong> 
                                ${bookingData.customerPhone || bookingData.phone || 'N/A'}
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>Szolgáltatás / Service:</strong> 
                                ${EmailService.formatServiceName(bookingData.service, 'hu')} / ${EmailService.formatServiceName(bookingData.service, 'en')}
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>Dátum / Date:</strong> 
                                ${bookingData.date}
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>Időpont / Time:</strong> 
                                ${bookingData.time || 'N/A'}
                            </p>
                            ${bookingData.licensePlate ? `
                            <p style="margin: 5px 0;">
                                <strong>Rendszám / License Plate:</strong> 
                                ${bookingData.licensePlate}
                            </p>` : ''}
                            ${bookingData.carModel ? `
                            <p style="margin: 5px 0;">
                                <strong>Autó típusa / Car Model:</strong> 
                                ${bookingData.carModel}
                            </p>` : ''}
                            ${(bookingData.notes || bookingData.additionalDetails) ? `
                            <p style="margin: 5px 0;">
                                <strong>Megjegyzések / Additional Details:</strong> 
                                ${bookingData.notes || bookingData.additionalDetails}
                            </p>` : ''}
                        </div>
                    </div>

                    <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                        <p>
                            © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.
                        </p>
                    </footer>
                </div>
            `
        });

        return true;
    }
}

module.exports = new EmailService();