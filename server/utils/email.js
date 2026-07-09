const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Lumaris <noreply@lumaris.com>',
    to,
    subject,
    html
  });
};

const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf9f7; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #b8966a; font-size: 28px; letter-spacing: 4px; font-weight: 300;">LUMARIS</h1>
      </div>
      <h2 style="color: #2c2c2c; font-weight: 400;">Welcome, ${name}</h2>
      <p style="color: #666; line-height: 1.8;">
        Thank you for joining Lumaris — a world where gemstone energy, history, and artistry converge into timeless jewelry.
      </p>
      <p style="color: #666; line-height: 1.8;">
        Explore our curated collections, discover the energy of natural gemstones, and find the piece that speaks to your story.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/shop" style="background: #b8966a; color: white; padding: 14px 32px; text-decoration: none; font-size: 14px; letter-spacing: 2px;">EXPLORE COLLECTIONS</a>
      </div>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
        © ${new Date().getFullYear()} Lumaris — Natural Gemstone Jewelry
      </p>
    </div>
  `,

  orderConfirmation: (order, name) => `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf9f7; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #b8966a; font-size: 28px; letter-spacing: 4px; font-weight: 300;">LUMARIS</h1>
      </div>
      <h2 style="color: #2c2c2c; font-weight: 400;">Order Confirmed</h2>
      <p style="color: #666;">Dear ${name}, your order <strong>#${order.orderNumber}</strong> has been confirmed.</p>
      <div style="background: white; padding: 24px; border: 1px solid #e8e4df; margin: 24px 0;">
        ${order.items.map(item => `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0ede9;">
            <span style="color: #2c2c2c;">${item.name} × ${item.quantity}</span>
            <span style="color: #b8966a;">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        <div style="text-align: right; margin-top: 16px;">
          <strong style="color: #2c2c2c;">Total: $${order.totalAmount.toFixed(2)}</strong>
        </div>
      </div>
      <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
        © ${new Date().getFullYear()} Lumaris — Natural Gemstone Jewelry
      </p>
    </div>
  `
};

module.exports = { sendEmail, emailTemplates };
