/**
 * Vercel Serverless Function: /api/consultation
 * Processes form submissions, sends notification to the admin, and sends confirmation to the client.
 * Features CORS support, rich schema validations, and sandbox protection wrappers.
 */

export default async function handler(req, res) {
    // Set CORS headers to support local development testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { name, email, phone, company, stage, service, goals, date, time, notes } = req.body;

        // Notes is optional; all other fields are strictly mandatory
        if (!name || !email || !phone || !company || !stage || !service || !goals || !date || !time) {
            return res.status(400).json({ success: false, error: 'Missing required form fields.' });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const receiverEmail = process.env.ADMIN_RECEIVER_EMAIL || 'ca.kundhan@gmail.com';
        const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

        console.log(`Processing structured submission for: ${name} (${company}) - Service: ${service}`);

        // Service Key to Premium Label Dictionary
        const serviceLabels = {
            'gst-filings': 'GST Filings & Advisory',
            'ipo-services': 'IPO Readiness & Services',
            'company-compliances': 'Company MCA Compliances',
            'audit-assurance': 'Audit & Internal Controls',
            'mis-reporting': 'MIS Reporting & Analytics',
            'startup-msme': 'Startup & MSME Advisory',
            'virtual-cfo': 'Virtual CFO Services',
            'investment-advisory': 'Investment Advisory',
            'business-planning': 'Business Financial Planning',
            'itr-1': 'ITR-1 (Sahaj - Salaried)',
            'itr-2': 'ITR-2 (Capital Gains & Foreign Assets)',
            'itr-3': 'ITR-3 (Business & Professional)',
            'itr-4': 'ITR-4 (Sugam - Presumptive)',
            'itr-5': 'ITR-5 (Partnerships & LLPs)',
            'itr-6': 'ITR-6 (Corporate Businesses)',
            'itr-7': 'ITR-7 (Trusts & Institutions)'
        };
        const readableService = serviceLabels[service] || service.replace('-', ' ');

        // 1. Construct HTML for Admin Notification
        const adminHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111111; line-height: 1.6; background-color: #F8F9FA; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #EAEAEA; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden; }
                    .header { background: #0E1118; border-bottom: 3px solid #F5C542; padding: 32px 24px; text-align: center; }
                    .title { font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0; letter-spacing: 0.05em; text-transform: uppercase; }
                    .subtitle { font-size: 14px; color: #F5C542; margin-top: 6px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
                    .section { padding: 24px; border-bottom: 1px solid #EAEAEA; }
                    .section-title { font-size: 13px; font-weight: 700; color: #F5C542; background: #0E1118; display: inline-block; padding: 4px 12px; border-radius: 4px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                    .field-group { margin-bottom: 12px; }
                    .field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666666; margin-bottom: 2px; }
                    .field-value { font-size: 14px; color: #111111; font-weight: 500; }
                    .value-box { font-size: 14px; color: #111111; background-color: #F9F9F9; padding: 16px; border-radius: 6px; border-left: 4px solid #F5C542; white-space: pre-wrap; margin-top: 6px; }
                    .slot-highlight { background: #FFFDF5; border: 1px dashed #F5C542; border-radius: 6px; padding: 16px; display: flex; justify-content: space-around; text-align: center; }
                    .slot-item { flex: 1; }
                    .slot-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #888888; margin-bottom: 2px; }
                    .slot-value { font-size: 15px; font-weight: 700; color: #0E1118; }
                    .footer { font-size: 12px; color: #888888; text-align: center; padding: 20px; background: #F8F9FA; border-top: 1px solid #EAEAEA; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="title">New Advisory Booking</h1>
                        <p class="subtitle">Kundhan & Associates • Global Advisory</p>
                    </div>
                    
                    <!-- Section 1: Lead Details -->
                    <div class="section">
                        <div class="section-title">Client Profile</div>
                        <div class="grid">
                            <div class="field-group">
                                <div class="field-label">Full Name</div>
                                <div class="field-value"><strong>${name}</strong></div>
                            </div>
                            <div class="field-group">
                                <div class="field-label">Company Name</div>
                                <div class="field-value">${company}</div>
                            </div>
                            <div class="field-group">
                                <div class="field-label">Business Stage</div>
                                <div class="field-value" style="text-transform: capitalize;">${stage.replace('-', ' ')}</div>
                            </div>
                            <div class="field-group">
                                <div class="field-label">Phone Number</div>
                                <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
                            </div>
                        </div>
                        <div class="field-group" style="margin-top: 12px; margin-bottom: 0;">
                            <div class="field-label">Business Email</div>
                            <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                        </div>
                    </div>
                    
                    <!-- Section 2: Consultation Booking Details -->
                    <div class="section">
                        <div class="section-title">Requested Service & Slot</div>
                        <div class="field-group" style="margin-bottom: 16px;">
                            <div class="field-label">Advisory Service</div>
                            <div class="field-value" style="font-size: 16px; font-weight: 700; color: #0E1118;">${readableService}</div>
                        </div>
                        <div class="slot-highlight">
                            <div class="slot-item" style="border-right: 1px solid #EAEAEA;">
                                <div class="slot-label">Preferred Date</div>
                                <div class="slot-value">${date}</div>
                            </div>
                            <div class="slot-item">
                                <div class="slot-label">Preferred Time</div>
                                <div class="slot-value" style="text-transform: capitalize;">${time}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Section 3: Context Requirements -->
                    <div class="section">
                        <div class="section-title">Requirement Context</div>
                        <div class="field-label">Core Situation / Inquiry</div>
                        <div class="value-box">${goals}</div>
                        
                        ${notes ? `
                        <div class="field-label" style="margin-top: 16px;">Additional Context & Notes</div>
                        <div class="value-box" style="border-left-color: #888888; background-color: #FAFAFA;">${notes}</div>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        Sent from Kundhan & Associates Advisory Portal • Hyderabad, India
                    </div>
                </div>
            </body>
            </html>
        `;

        // 2. Construct HTML for Client Confirmation
        const clientHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; line-height: 1.6; padding: 20px; background-color: #F8F9FA; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #EAEAEA; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden; }
                    .header { background: #0E1118; border-bottom: 3px solid #F5C542; padding: 28px 20px; text-align: center; }
                    .title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0; letter-spacing: 0.05em; text-transform: uppercase; }
                    .subtitle { font-size: 13px; color: #F5C542; margin-top: 4px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
                    .body-section { padding: 32px 24px; }
                    .text { font-size: 15px; color: #333333; margin-bottom: 18px; }
                    .slot-card { background-color: #F9F9F9; border-left: 4px solid #F5C542; border-radius: 4px; padding: 16px; margin: 24px 0; }
                    .slot-row { margin-bottom: 8px; font-size: 14px; }
                    .slot-row strong { color: #0E1118; }
                    .footer { font-size: 12px; color: #888888; text-align: center; padding: 16px; background: #F8F9FA; border-top: 1px solid #EAEAEA; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="title">Request Received</h1>
                        <p class="subtitle">Kundhan & Associates • Global Advisory</p>
                    </div>
                    
                    <div class="body-section">
                        <p class="text">Dear ${name},</p>
                        <p class="text">Thank you for booking a consultation with Kundhan & Associates. We have successfully received your strategic advisory request.</p>
                        
                        <div class="slot-card">
                            <div class="slot-row"><strong>Service Field:</strong> ${readableService}</div>
                            <div class="slot-row"><strong>Requested Date:</strong> ${date}</div>
                            <div class="slot-row"><strong>Preferred Slot:</strong> <span style="text-transform: capitalize;">${time}</span></div>
                        </div>
                        
                        <p class="text">Our principal strategic advisor is reviewing your requirement and company profile. We will connect with you via email within 24 hours to schedule our 30-minute introductory call.</p>
                        
                        <p class="text" style="margin-top: 32px;">Best regards,<br><strong>Kundhan & Associates Team</strong></p>
                    </div>
                    
                    <div class="footer">
                        This is an automated confirmation of your strategic advisory request.
                    </div>
                </div>
            </body>
            </html>
        `;

        if (!resendApiKey) {
            console.warn('WARNING: RESEND_API_KEY environment variable is not defined.');
            console.log('SIMULATING DISPATCH IN DEV:');
            console.log(adminHtmlContent);
            return res.status(200).json({ success: true, message: 'Simulation successful.' });
        }

        // 3. Dispatch Email to Admin (Recipient: ca.kundhan@gmail.com)
        const adminResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `Advisory Portal <${senderEmail}>`,
                to: [receiverEmail],
                reply_to: email,
                subject: `New Structured Booking: ${name} (${company})`,
                html: adminHtmlContent
            })
        });

        const adminData = await adminResponse.json();

        if (!adminResponse.ok) {
            console.error('Resend Admin Send Error:', adminData);
            return res.status(adminResponse.status).json({ success: false, error: adminData.message || 'Resend failed to notify admin.' });
        }

        console.log(`Admin lead notification email sent. ID: ${adminData.id}`);

        // 4. Dispatch Email to Client (Gracefully wrapped to bypass sandbox rules)
        try {
            console.log(`Attempting to dispatch client confirmation to: ${email}`);
            const clientResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: `Kundhan & Associates <${senderEmail}>`,
                    to: [email],
                    subject: `Request Received: Kundhan & Associates`,
                    html: clientHtmlContent
                })
            });

            const clientData = await clientResponse.json();
            if (clientResponse.ok) {
                console.log(`Client confirmation email sent successfully. ID: ${clientData.id}`);
            } else {
                console.warn('Client confirmation rejected by Resend (This is normal in sandbox/free trial):', clientData.message);
            }
        } catch (clientErr) {
            console.warn('Failed to dispatch client confirmation (non-fatal):', clientErr);
        }

        return res.status(200).json({ success: true, message: 'Consultation request processed successfully.', id: adminData.id });

    } catch (error) {
        console.error('Serverless function exception caught:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error. Please contact administrator.' });
    }
}
