// WhatsApp Notification API using Twilio
// Sends low-stock alerts via WhatsApp

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phoneNumber, productName, remainingStock, alertType } = req.body;

        // Format phone number for WhatsApp (must include whatsapp: prefix)
        const whatsappTo = phoneNumber.startsWith('whatsapp:')
            ? phoneNumber
            : `whatsapp:${phoneNumber}`;

        // Prepare message based on alert type
        let message = '';

        if (alertType === 'low_stock') {
            message = `⚠️ *Low Stock Alert*\n\nProduct: ${productName}\nRemaining: ${remainingStock} units\n\nPlease restock soon to avoid running out.\n\n- Micro-POS`;
        } else if (alertType === 'out_of_stock') {
            message = `🚨 *Out of Stock Alert*\n\nProduct: ${productName}\nStatus: OUT OF STOCK\n\nPlease restock immediately.\n\n- Micro-POS`;
        } else if (alertType === 'daily_summary') {
            message = `📊 *Daily Sales Summary*\n\n${productName}\n\nHave a great day!\n\n- Micro-POS`;
        }

        // Send WhatsApp message via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

        const formData = new URLSearchParams();
        formData.append('From', TWILIO_WHATSAPP_NUMBER);
        formData.append('To', whatsappTo);
        formData.append('Body', message);

        const response = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({
                success: true,
                messageSid: data.sid
            });
        } else {
            throw new Error(data.message || 'Failed to send WhatsApp message');
        }

    } catch (error) {
        console.error('WhatsApp notification error:', error);
        return res.status(500).json({
            error: 'Failed to send notification',
            details: error.message
        });
    }
}
