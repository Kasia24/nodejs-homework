const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: "your_email@example.com", // Ustaw nadawcę w SendGrid
    subject: "Verify your email",
    text: `Click the link below to verify your email: ${process.env.BASE_URL}/users/verify/${verificationToken}`,
    html: `<strong>Click the link to verify your email:</strong> <a href="${process.env.BASE_URL}/users/verify/${verificationToken}">Verify Email</a>`,
  };

  await sgMail.send(msg);
};

module.exports = { sendVerificationEmail };
