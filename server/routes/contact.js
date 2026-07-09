const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');

// @route   POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@lumaris.com',
      subject: `Lumaris Contact: ${subject || 'New Message'} — from ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h2 style="color: #b8966a;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <hr />
          <p style="line-height: 1.8;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    });

    // Auto-reply to sender
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting Lumaris',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf9f7; padding: 40px;">
          <h1 style="color: #b8966a; font-size: 24px; letter-spacing: 4px; font-weight: 300;">LUMARIS</h1>
          <h2 style="color: #2c2c2c; font-weight: 400;">Thank you, ${name}</h2>
          <p style="color: #666; line-height: 1.8;">
            We have received your message and will respond within 24–48 hours.
          </p>
          <p style="color: #666; line-height: 1.8;">
            In the meantime, explore our collections and discover the energy of natural gemstones.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">© ${new Date().getFullYear()} Lumaris</p>
        </div>
      `
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/contact/newsletter
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    await sendEmail({
      to: email,
      subject: 'Welcome to the Lumaris Journal',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf9f7; padding: 40px; text-align: center;">
          <h1 style="color: #b8966a; font-size: 24px; letter-spacing: 4px; font-weight: 300;">LUMARIS</h1>
          <h2 style="color: #2c2c2c; font-weight: 400;">You're now part of our story</h2>
          <p style="color: #666; line-height: 1.8;">
            Thank you for subscribing. You'll receive gemstone wisdom, collection stories, and exclusive offers.
          </p>
        </div>
      `
    });

    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
