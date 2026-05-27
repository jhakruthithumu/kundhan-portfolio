/**
 * Vercel Serverless Function: /api/consultation
 * Processes form submissions, sends notification to the admin, and sends confirmation to the client.
 * Features graceful try-catch wraps for client emails to prevent sandbox restrictions from blocking submissions.
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { name, email, company, stage, service, goals } = req.body;

        if (!name || !email || !company || !stage || !service || !goals) {
            return res.status(400).json({ success: false, error: 'Missing required form fields.' });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const receiverEmail = process.env.ADMIN_RECEIVER_EMAIL || 'ca.kundhan@gmail.com';
        const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

        console.log(`Processing submission for: ${name} (${company})`);

        // 1. Construct HTML for Admin Notification
        const adminHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #EAEAEA; border-radius: 8px; }
                    .header { border-bottom: 2px solid #F5C542; padding-bottom: 16px; margin-bottom: 24px; }
                    .title { font-size: 20px; font-weight: 700; color: #0A0A0A; margin: 0; }
                    .subtitle { font-size: 14px; color: #666666; margin-top: 4px; }
                    .field-group { margin-bottom: 20px; }
                    .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #F5C542; margin-bottom: 4px; }
                    .field-value { font-size: 15px; color: #111111; background-color: #F9F9F9; padding: 12px; border-radius: 4px; border-left: 3px solid #E0E0E0; }
                    .footer { font-size: 12px; color: #888888; text-align: center; border-top: 1px solid #EAEAEA; padding-top: 16px; margin-top: 32px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="title">New Advisory Consultation Request</h1>
                        <p class="subtitle">Kundhan and Associates - Global Accounting & Advisory</p>
                    </div>
                    
                    <div class="field-group">
                        <div class="field-label">Client Name</div>
                        <div class="field-value"><strong>${name}</strong></div>
                    </div>
                    
                    <div class="field-group">
                        <div class="field-label">Business Email</div>
                        <div class="field-value"><a href="mailto:${email}">${email}</a></div>
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
                        <div class="field-label">Primary Advisory Need</div>
                        <div class="field-value" style="text-transform: capitalize;">${service.replace('-', ' ')}</div>
                    </div>
                    
                    <div class="field-group">
                        <div class="field-label">Business & Goals Description</div>
                        <div class="field-value" style="white-space: pre-wrap;">${goals}</div>
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
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1A1A1A; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #EAEAEA; border-radius: 8px; }
                    .header { border-bottom: 2px solid #F5C542; padding-bottom: 16px; margin-bottom: 24px; }
                    .title { font-size: 20px; font-weight: 700; color: #0A0A0A; margin: 0; }
                    .subtitle { font-size: 14px; color: #666666; margin-top: 4px; }
                    .text { font-size: 15px; color: #333333; margin-bottom: 16px; }
                    .footer { font-size: 12px; color: #888888; text-align: center; border-top: 1px solid #EAEAEA; padding-top: 16px; margin-top: 32px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="title">Consultation Request Received</h1>
                        <p class="subtitle">Kundhan and Associates - Global Accounting & Advisory</p>
                    </div>
                    
                    <p class="text">Dear ${name},</p>
                    <p class="text">Thank you for reaching out to Kundhan & Associates. We have successfully received your request for <strong>${service.replace('-', ' ')}</strong>.</p>
                    <p class="text">Our principal strategic advisor is reviewing your company stage and business goals. We will connect with you via email within 24 hours to schedule our 30-minute introductory call.</p>
                    
                    <p class="text">Best regards,<br><strong>Kundhan & Associates Team</strong></p>
                    
                    <div class="footer">
                        This is an automated confirmation of your request.
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
                subject: `New Consultation Request: ${name} (${company})`,
                html: adminHtmlContent
            })
        });

        const adminData = await adminResponse.json();

        if (!adminResponse.ok) {
            console.error('Resend Admin Send Error:', adminData);
            return res.status(adminResponse.status).json({ success: false, error: adminData.message || 'Resend failed to notify admin.' });
        }

        console.log(`Admin email sent. ID: ${adminData.id}`);

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
