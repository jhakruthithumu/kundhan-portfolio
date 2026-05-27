/**
 * Vercel Serverless Function: /api/consultation
 * Handles consultation form submissions and sends high-fidelity email notifications to the admin.
 * Zero-dependency (uses native fetch) for maximum speed and zero build-time failures.
 */

export default async function handler(req, res) {
    // 1. Enforce POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { name, email, company, stage, service, goals } = req.body;

        // 2. Validate input parameters
        if (!name || !email || !company || !stage || !service || !goals) {
            return res.status(400).json({ success: false, error: 'Missing required form fields.' });
        }

        // 3. Retrieve environment variables (with fallback options)
        const resendApiKey = process.env.RESEND_API_KEY;
        const receiverEmail = process.env.ADMIN_RECEIVER_EMAIL || 'ca.kundhan@gmail.com';
        const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

        console.log(`Processing submission for: ${name} (${company})`);

        // 4. Construct high-fidelity HTML email body
        const htmlContent = `
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
                    
                    <div class="footer">
                        Sent securely from Kundhan & Associates Serverless Pipeline.
                    </div>
                </div>
            </body>
            </html>
        `;

        // 5. If Resend API Key is missing, log & simulate success in dev
        if (!resendApiKey) {
            console.warn('WARNING: RESEND_API_KEY environment variable is not defined.');
            console.log('SIMULATING SUCCESSFUL EMAIL DISPATCH IN DEVELOPMENT MODE:');
            console.log(htmlContent);
            return res.status(200).json({ 
                success: true, 
                message: 'Simulation successful. Please add RESEND_API_KEY environment variable in Vercel to send real emails.' 
            });
        }

        // 6. Make request to Resend API
        const response = await fetch('https://api.resend.com/emails', {
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
                html: htmlContent
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API returned error:', data);
            return res.status(response.status).json({ success: false, error: data.message || 'Resend failed to send email.' });
        }

        console.log(`Email successfully dispatched via Resend. ID: ${data.id}`);
        return res.status(200).json({ success: true, message: 'Consultation request sent successfully.', id: data.id });

    } catch (error) {
        console.error('Serverless function exception caught:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error. Please contact administrator.' });
    }
}
