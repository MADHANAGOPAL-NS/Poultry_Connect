import nodemailer from 'nodemailer';

const sendVerificationEmail = async (email, token) => {
  try {
    // You should replace these auth details with your actual SMTP credentials (e.g. Gmail, SendGrid, etc.)
    // For testing, you can use ethereal.email or a real gmail app password.
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use host/port for custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Poultry Connect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirm your signup - Poultry Connect',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Confirm your signup</h2>
          <p>Hello,</p>
          <p>Thank you for registering with Poultry Connect! Run by and for the poultry community.</p>
          <p>Please click the button below to confirm your email address and activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirm your mail</a>
          </div>
          <p>If you did not sign up for this account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px; text-align: center;">
            You're receiving this email because you signed up for Poultry Connect.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendVerificationEmail;
