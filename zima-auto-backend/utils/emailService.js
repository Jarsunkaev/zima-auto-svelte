const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

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
        
        // Load email templates
        this.loadTemplates();
        
        // Register Handlebars helpers
        this.registerHandlebarsHelpers();
    }

    // Static method to create a singleton instance
    static getInstance() {
        if (!this.instance) {
            this.instance = new EmailService();
        }
        return this.instance;
    }

    // Load email templates from files
    loadTemplates() {
        try {
            // Potential template directory paths
            const potentialTemplatePaths = [
                path.join(__dirname, '..', 'templates'),           // Relative to utils
                path.join(process.cwd(), 'templates'),             // Relative to current working directory
                path.join(process.cwd(), 'zima-auto-backend', 'templates'), // Potential deployment path
                path.resolve(__dirname, '..', 'templates'),        // Absolute path resolution
                path.resolve(process.cwd(), 'templates')           // Absolute current working directory
            ];

            console.log('🔍 Attempting to find templates in:', potentialTemplatePaths);

            let templatesDir = null;
            for (const templatePath of potentialTemplatePaths) {
                console.log(`Checking path: ${templatePath}`);
                if (fs.existsSync(templatePath)) {
                    const files = fs.readdirSync(templatePath);
                    console.log(`Files in ${templatePath}:`, files);
                    
                    if (files.includes('airportParking.html')) {
                        templatesDir = templatePath;
                        break;
                    }
                }
            }

            if (!templatesDir) {
                console.error('🔥 Could not find templates directory');
                throw new Error('No templates directory found');
            }

            console.log('📂 Loading templates from:', templatesDir);

            const availableTemplates = fs.readdirSync(templatesDir);
            console.log('📄 Available templates:', availableTemplates);

            // Verify specific template exists
            const airportParkingTemplatePath = path.join(templatesDir, 'airportParking.html');
            if (!fs.existsSync(airportParkingTemplatePath)) {
                console.error('🔥 Airport Parking template not found:', airportParkingTemplatePath);
                console.error('Full path contents:', availableTemplates);
            }
            
            this.templates = {
                airportParking: fs.readFileSync(path.join(templatesDir, 'airportParking.html'), 'utf8'),
                carWash: fs.readFileSync(path.join(templatesDir, 'carWash.html'), 'utf8'),
                autoService: fs.readFileSync(path.join(templatesDir, 'autoService.html'), 'utf8'),
                tireService: fs.readFileSync(path.join(templatesDir, 'tireService.html'), 'utf8'),
                contactForm: fs.readFileSync(path.join(templatesDir, 'contactForm.html'), 'utf8'),
                // Default template as fallback
                default: fs.readFileSync(path.join(templatesDir, 'default.html'), 'utf8')
            };
            
            // Compile templates with Handlebars
            this.compiledTemplates = {};
            for (const [key, template] of Object.entries(this.templates)) {
                this.compiledTemplates[key] = Handlebars.compile(template);
            }
            
            console.log('✅ Email templates loaded successfully');
        } catch (error) {
            console.error('❌ Error loading email templates:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                __dirname: __dirname,
                cwd: process.cwd()
            });
            // Initialize with empty templates as fallback
            this.templates = {};
            this.compiledTemplates = {};
            
            // Attempt to list all files in potential template directories
            try {
                console.log('Attempting to list files in potential template directories:');
                console.log('1. __dirname:', fs.readdirSync(__dirname));
                console.log('2. __dirname/../templates:', fs.readdirSync(path.join(__dirname, '..', 'templates')));
                console.log('3. process.cwd():', fs.readdirSync(process.cwd()));
                console.log('4. process.cwd()/templates:', fs.readdirSync(path.join(process.cwd(), 'templates')));
            } catch (listError) {
                console.error('Error listing potential template directories:', listError);
            }
        }
    }
    
    // Register Handlebars helpers for conditional sections
    registerHandlebarsHelpers() {
        Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        });
        
        Handlebars.registerHelper('ifNotEquals', function (arg1, arg2, options) {
            return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
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
    
    // Format service type for display
    static formatServiceType(serviceType, service, language = 'en') {
        // Map of service type labels
        const serviceTypes = {
            autoService: {
                hu: {
                    'maintenance': 'Általános karbantartás',
                    'repair': 'Javítás',
                    'diagnostic': 'Diagnosztika',
                    'other': 'Egyéb'
                },
                en: {
                    'maintenance': 'General Maintenance',
                    'repair': 'Repair',
                    'diagnostic': 'Diagnostics',
                    'other': 'Other'
                }
            },
            tireService: {
                hu: {
                    'change': 'Gumiabroncs csere',
                    'repair': 'Javítás',
                    'balancing': 'Kerékkiegyensúlyozás',
                    'storage': 'Gumitárolás'
                },
                en: {
                    'change': 'Tire Replacement',
                    'repair': 'Repair',
                    'balancing': 'Wheel Balancing',
                    'storage': 'Tire Storage'
                }
            }
        };
        
        // If service type mapping exists for this service
        if (serviceTypes[service] && serviceTypes[service][language] && serviceTypes[service][language][serviceType]) {
            return serviceTypes[service][language][serviceType];
        }
        
        // Fallback to the raw service type
        return serviceType;
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

    // Send booking confirmation emails with service-specific templates
    async sendBookingConfirmationEmails(bookingData) {
        const customerEmail = EmailService.extractEmail(bookingData);

        if (!EmailService.isValidEmail(customerEmail)) {
            throw new Error(`Invalid email address: ${customerEmail}`);
        }

        try {
            // Prepare template data with all possible booking fields
            const templateData = {
                // Common fields for all services
                customerName: bookingData.customerName || bookingData.name || '',
                email: customerEmail,
                
                // Car Wash Package Details
                carWashPackage: bookingData.carWashPackage || false,
                carWashPackageName: bookingData.carWashPackageName || '',
                priceBreakdown: {
                    parkingTotal: bookingData.priceBreakdown?.parkingTotal || 0,
                    carWashStandard: bookingData.priceBreakdown?.carWashStandard || 0,
                    carWashDiscount: bookingData.priceBreakdown?.carWashDiscount || 0,
                    carWashDiscounted: bookingData.priceBreakdown?.carWashDiscounted || 0
                },
                phone: bookingData.customerPhone || bookingData.phone || 'N/A',
                date: bookingData.date || '',
                time: bookingData.time || 'N/A',
                notes: bookingData.notes || bookingData.additionalDetails || '',
                
                // Service-specific fields
                service: bookingData.service,
                serviceType: EmailService.formatServiceType(bookingData.serviceType, bookingData.service, 'en'),
                serviceTypeHu: EmailService.formatServiceType(bookingData.serviceType, bookingData.service, 'hu'),
                
                // Airport Parking specific fields
                days: bookingData.days || '0',
                licensePlate: bookingData.licensePlate || 'N/A',
                passengers: bookingData.passengers || '0',
                carWashPackage: bookingData.carWashPackage || '',
                carWashPackageName: bookingData.carWashPackageName || '',
                totalPrice: bookingData.totalPrice || '0',
                priceBreakdown: bookingData.priceBreakdown || {
                    parkingTotal: '0',
                    carWashStandard: '0',
                    carWashDiscount: '0',
                    carWashDiscounted: '0'
                },
                
                // Auto/Tire Service specific fields
                carModel: bookingData.carModel || 'N/A',
                tireCount: bookingData.tireCount || '4'
            };
            
            // Select appropriate template based on service type
            const templateKey = bookingData.service || 'default';
            const compiledTemplate = this.compiledTemplates[templateKey] || this.compiledTemplates.default;
            
            if (!compiledTemplate) {
                throw new Error(`Template not found for service: ${templateKey}`);
            }
            
            // Render the HTML template with data
            const emailHtml = compiledTemplate(templateData);
            
            // Format a suitable subject line based on service
            const serviceNameEn = EmailService.formatServiceName(bookingData.service, 'en');
            const serviceNameHu = EmailService.formatServiceName(bookingData.service, 'hu');
            const subject = `Zima Auto - ${serviceNameHu} / ${serviceNameEn} - Confirmation`;

            // Send email to customer with CC to admin
            await this.sendEmail({
                to: customerEmail,
                cc: 'ahmedhasimov@zima-auto.com',
                subject,
                html: emailHtml
            });

            // Create admin notification email
            const adminHtml = this.createAdminNotificationHtml(bookingData, customerEmail);

            // Send email to Zima Auto admin
            await this.sendEmail({
                to: 'info@zima-auto.com',
                cc: 'ahmedhasimov@zima-auto.com',
                subject: `New Booking - ${serviceNameEn}`,
                html: adminHtml
            });

            return true;
        } catch (error) {
            console.error('Error sending booking confirmation emails:', error);
            throw error;
        }
    }
    
    // Create HTML for admin notification
    // Send contact form confirmation emails
    async sendContactFormEmails(contactData) {
        const { name, email, message } = contactData;

        // Validate email
        if (!EmailService.isValidEmail(email)) {
            throw new Error(`Invalid email address: ${email}`);
        }

        try {
            // Prepare template data
            const templateData = {
                customerName: name || 'Kedves Ügyfelünk / Dear Customer',
                email,
                message
            };

            // Compile contact form template
            const compiledTemplate = this.compiledTemplates.contactForm || this.compiledTemplates.default;
            const emailHtml = compiledTemplate(templateData);

            // Subject line
            const subject = 'Zima Auto - Kapcsolatfelvétel / Contact Form Confirmation';

            // Send confirmation to customer
            await this.sendEmail({
                to: email,
                subject,
                html: emailHtml
            });

            // Send admin notification
            const adminHtml = `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `;

            // Send email to Zima Auto admin
            await this.sendEmail({
                to: 'info@zima-auto.com',
                cc: 'ahmedhasimov@zima-auto.com',
                subject: 'New Contact Form Submission',
                html: adminHtml
            });

            return true;
        } catch (error) {
            console.error('Error sending contact form emails:', error);
            throw error;
        }
    }

    createAdminNotificationHtml(bookingData, customerEmail) {
        // Service name in English
        const serviceNameEn = EmailService.formatServiceName(bookingData.service, 'en');
        // Service name in Hungarian
        const serviceNameHu = EmailService.formatServiceName(bookingData.service, 'hu');
        
        // Format service type if available
        let serviceType = '';
        let serviceTypeHu = '';
        if (bookingData.serviceType) {
            serviceType = EmailService.formatServiceType(bookingData.serviceType, bookingData.service, 'en');
            serviceTypeHu = EmailService.formatServiceType(bookingData.serviceType, bookingData.service, 'hu');
        }
        
        // Basic admin notification HTML
        let adminHtml = `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #f4f7f9; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <header style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00bae5; margin: 0; font-size: 24px; font-weight: 700;">
                        Új Foglalás / New Booking
                    </h1>
                    <p style="font-size: 18px; color: #333;">${serviceNameHu} / ${serviceNameEn}</p>
                </header>

                <div style="background-color: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 5px solid #00bae5;">
                        <h3 style="margin-top: 0; color: #00bae5;">Foglalás részletei / Booking Details</h3>
                        <p style="margin: 5px 0;">
                            <strong>Ügyfél neve / Customer Name:</strong> 
                            ${bookingData.customerName || bookingData.name || 'N/A'}
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
                            ${serviceNameHu} / ${serviceNameEn}
                        </p>`;
                            
        // Add service-specific details based on service type
        if (serviceType) {
            adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Szolgáltatás típusa / Service Type:</strong> 
                            ${serviceTypeHu} / ${serviceType}
                        </p>`;
        }
                            
        adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Dátum / Date:</strong> 
                            ${bookingData.date}
                        </p>`;
                        
        if (bookingData.time) {
            adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Időpont / Time:</strong> 
                            ${bookingData.time}
                        </p>`;
        }
        
        // Add Airport Parking specific fields
        if (bookingData.service === 'airportParking') {
            adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Időtartam / Duration:</strong> 
                            ${bookingData.days} nap / days
                        </p>
                        <p style="margin: 5px 0;">
                            <strong>Rendszám / License Plate:</strong> 
                            ${bookingData.licensePlate || 'N/A'}
                        </p>
                        <p style="margin: 5px 0;">
                            <strong>Utasok száma / Passengers:</strong> 
                            ${bookingData.passengers || '0'}
                        </p>`;
            
            // Add car wash package if selected
            if (bookingData.carWashPackage && bookingData.carWashPackage !== 'none') {
                adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Autómosó csomag / Car Wash Package:</strong> 
                            ${bookingData.carWashPackageName || bookingData.carWashPackage}
                        </p>`;
            }
            
            // Add price breakdown if available
            if (bookingData.totalPrice) {
                adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Végösszeg / Total Price:</strong> 
                            ${bookingData.totalPrice} HUF
                        </p>`;
            }
        }
        
        // Add Auto/Tire Service specific fields
        if (bookingData.service === 'autoService' || bookingData.service === 'tireService') {
            if (bookingData.carModel) {
                adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Autó típusa / Car Model:</strong> 
                            ${bookingData.carModel}
                        </p>`;
            }
            
            if (bookingData.licensePlate) {
                adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Rendszám / License Plate:</strong> 
                            ${bookingData.licensePlate}
                        </p>`;
            }
            
            // Add tire count for Tire Service
            if (bookingData.service === 'tireService' && bookingData.tireCount) {
                adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Gumiabroncsok száma / Number of Tires:</strong> 
                            ${bookingData.tireCount}
                        </p>`;
            }
        }
        
        // Add notes if available
        if (bookingData.notes || bookingData.additionalDetails) {
            adminHtml += `
                        <p style="margin: 5px 0;">
                            <strong>Megjegyzések / Additional Notes:</strong> 
                            ${bookingData.notes || bookingData.additionalDetails}
                        </p>`;
        }
        
        // Close the HTML
        adminHtml += `
                    </div>
                </div>

                <footer style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                    <p>
                        © 2025 Zima Auto. Minden jog fenntartva. / All rights reserved.
                    </p>
                </footer>
            </div>
        `;
        
        return adminHtml;
    }
}

// Export the EmailService class
module.exports = EmailService;

