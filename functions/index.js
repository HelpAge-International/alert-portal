const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = 'Alert';

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {

  const user = event.data; // The Firebase user.
  const email = user.email; // The email of the user.

  return sendWelcomeEmail(email);
});

// Sends a welcome email to the given user.
function sendWelcomeEmail(email) {
  const mailOptions = {
    from: '"Alert" <noreply@firebase.com>',
    to: email
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hello, 
                      \nWelcome to ${APP_NAME}. I hope you will enjoy our platform.
                      \n You temporary password is "testtest", please login with your email address to update you credentials.
                      \n https://alert-190fa.firebaseapp.com
                      \n Thanks 
                      \n Your Alert team `;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

exports.handleUserAccount = functions.database.ref('/sand/userPublic/{userId}')
  .onWrite(event => {
    console.log("agency node triggered");
    const userId = event.params.userId;
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log(preData);
    console.log(currData);
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
    } else if (preData && currData) {
      //user account change
      console.log("user data changed: " + userId);
    } else if (preData && !currData) {
      //delete user account
      admin.auth().deleteUser(userId).then(() => {
        console.log("successfully deleted user: " + userId);
      }, error => {
        console.log(error.message);
      });
    }
  });
