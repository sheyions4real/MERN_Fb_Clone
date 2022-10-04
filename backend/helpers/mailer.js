const nodemailer = require("nodemailer");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env; // destructure the process.env

const auth = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  MAILING_REFRESH,
  oauth_link
);

exports.sendResetCode = (email, name, url) => {
  try {
    auth.setCredentials({
      refresh_token: MAILING_REFRESH,
    });

    const accessToken = auth.getAccessToken();
    const smtp = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken,
      },
    });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 25,
      secure: false,
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    });

    // FUNCTIONAL TO BYPASS  CERTIFICATE ISSUE FROM THE SENDING SERVER
    const transporter2 = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: accessToken,
        expires: 1484314697598,
      },
      tls: {
        rejectUnauthorized: false, // to bypass  self signed certificate  issue
      },
    });

    console.log(`${EMAIL}\n${MAILING_ID}\n${MAILING_SECRET}\n${MAILING_REFRESH}\n${email}\n${name}\n${url}\n
    `);
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Linkupcloud email verification",
      html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#e346e7"><img src="https://res.cloudinary.com/sheyions4real/image/upload/v1662047336/LinkupCloud/logo3_c2kf7g.png" alt="" style="width:52px" srcset=""><span>Action required: Activation of your linkupcloud account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:roboto;padding-bottom:2rem"><span>Hello <strong>${name}</strong></span><div style="padding:20px 0;margin-bottom:5px"><span style="padding:1.5rem 0">You recently created an account on linkupcloud. To complete your registration, please confirm your account</span></div><a style="width:200px;padding:10px 15px;background:#95a718;color:#fff;text-decoration:none;font-weight:500" href="${url}">Confirm your account</a><br><div style="padding-top:1.5rem;color:#898f9c"><span>Linkupcloud gives you the platform to showcase your skills and talents to the world to attract potential sponsors and managers whild building your brand</span></div></div>`,
      auth: {
        user: EMAIL,
        refreshToken: MAILING_REFRESH,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    };

    //Step 3: Sending email
    transporter2
      .sendMail(mailOptions)
      .then((res) => {
        console.log("Email Sent" + res);
      })
      .catch((error) => {
        console.log("Email not Sent" + error.message);
      });

    // transporter
    //   .sendMail(mailOptions)
    //   .then((res) => {
    //     console.log("Email Sent" + res);
    //   })
    //   .catch((error) => {
    //     console.log("Email not Sent" + error.message);
    //   });
  } catch (error) {
    console.log("Email global not Sent" + error.message);
  }
};

exports.sendVerificationEmail = (email, name, code) => {
  try {
    auth.setCredentials({
      refresh_token: MAILING_REFRESH,
    });

    const accessToken = auth.getAccessToken();
    const smtp = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken,
      },
    });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 25,
      secure: false,
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    });

    // FUNCTIONAL TO BYPASS  CERTIFICATE ISSUE FROM THE SENDING SERVER
    const transporter2 = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: accessToken,
        expires: 1484314697598,
      },
      tls: {
        rejectUnauthorized: false, // to bypass  self signed certificate  issue
      },
    });

    console.log(`${EMAIL}\n${MAILING_ID}\n${MAILING_SECRET}\n${MAILING_REFRESH}\n${email}\n${name}\n${url}\n
    `);
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Reset LinkupCloud Verification",
      html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#e346e7"><img src="https://res.cloudinary.com/sheyions4real/image/upload/v1662047336/LinkupCloud/logo3_c2kf7g.png" alt="" style="width:52px" srcset=""><span>Action required: Activation of your linkupcloud account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:roboto;padding-bottom:2rem"><span>Hello <strong>${name}</strong></span><div style="padding:20px 0;margin-bottom:5px"><span style="padding:1.5rem 0">You recently created an account on linkupcloud. To complete your registration, please confirm your account</span></div><a style="width:200px;padding:10px 15px;background:#95a718;color:#fff;text-decoration:none;font-weight:500" >${code}</a><br><div style="padding-top:1.5rem;color:#898f9c"><span>Linkupcloud gives you the platform to showcase your skills and talents to the world to attract potential sponsors and managers whild building your brand</span></div></div>`,
      auth: {
        user: EMAIL,
        refreshToken: MAILING_REFRESH,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    };
    // disable sending email due to change in gmail credentials for the momemt
    // //Step 3: Sending email
    // transporter2
    //   .sendMail(mailOptions)
    //   .then((res) => {
    //     console.log("Email Sent" + res);
    //   })
    //   .catch((error) => {
    //     console.log("Email not Sent" + error.message);
    //   });

    // transporter
    //   .sendMail(mailOptions)
    //   .then((res) => {
    //     console.log("Email Sent" + res);
    //   })
    //   .catch((error) => {
    //     console.log("Email not Sent" + error.message);
    //   });
  } catch (error) {
    console.log("Email global not Sent" + error.message);
  }
};
