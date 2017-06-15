const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = 'Alert';
const WEEK = 0;
const MONTH = 1;
const YEAR = 2;

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

  // \n https://uat.portal.alertpreparedness.org
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hello,
                      \nWelcome to ${APP_NAME}. I hope you will enjoy our platform.
                      \n You temporary password is "testtest", please login with your email address to update you credentials.
                      \n https://uat.portal.alertpreparedness.org
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
      console.log("delete user: " + userId);
      // admin.auth().deleteUser(userId).then(() => {
      //   console.log("successfully deleted user: " + userId);
      // }, error => {
      //   console.log(error.message);
      // });
    }
  });

exports.handleUserAccountTest = functions.database.ref('/test/userPublic/{userId}')
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
      console.log("delete user: " + userId);
      // admin.auth().deleteUser(userId).then(() => {
      //   console.log("successfully deleted user: " + userId);
      // }, error => {
      //   console.log(error.message);
      // });
    }
  });

exports.handleUserAccountUat = functions.database.ref('/uat/userPublic/{userId}')
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
      console.log("delete user: " + userId);
      // admin.auth().deleteUser(userId).then(() => {
      //   console.log("successfully deleted user: " + userId);
      // }, error => {
      //   console.log(error.message);
      // });
    }
  });

exports.handleResponsePlans = functions.database.ref('/sand/responsePlan/{countryId}/{responsePlan}')
  .onWrite(event => {
    if (event.data.current.val()['isActive'] && event.data.changed()) {
      console.log("response plan node triggered");
      console.log(event.data.val());
      console.log(event.data.key);
      // console.log(event.data.previous.val());
      // console.log(event.data.current.val());
      // console.log(event.data.changed());
      console.log(event.data.val().startDate);
      console.log(event.params["countryId"]);

      let countryId = event.params["countryId"];
      let responsePlanId = event.data.key;

      admin.database().ref('/sand/administratorCountry').orderByChild("countryId").equalTo(countryId)
        .on("value", snapshot => {
          console.log("********");
          console.log(snapshot.val());
          let administratorCountry = snapshot.val()[countryId];
          let agencyId = Object.keys(administratorCountry['agencyAdmin'])[0];
          console.log("agency id: " + agencyId);

          admin.database().ref('/sand/countryOffice/' + agencyId + '/' + countryId + '/clockSettings/responsePlans')
            .on('value', snapshot => {
              console.log(snapshot.val());
              let durationType = Number(snapshot.val()['durationType']);
              let value = Number(snapshot.val()['value']);
              let oneDayTime = 24 * 60 * 60 * 1000;
              let timeDifference = 0;
              switch (durationType) {
                case WEEK:
                  timeDifference = value * 7 * oneDayTime;
                  break;
                case MONTH:
                  timeDifference = value * 30 * oneDayTime; // one month has 30 days
                  break;
                case YEAR:
                  timeDifference = value * 365 * oneDayTime; // one year has 365 days
                  break;
              }
              console.log(timeDifference);

              setTimeout(() => {
                admin.database().ref('/sand/responsePlan/' + countryId + '/' + responsePlanId)
                  .on('value', snapshot => {
                    if (snapshot.val() && snapshot.val()['isActive']) {
                      admin.database().ref('/sand/responsePlan/' + countryId + '/' + responsePlanId + '/isActive').set(false).then(() => {
                        console.log("expire success");
                      }, error => {
                        console.log(error.message);
                      });
                    }
                  });
              }, 5000);

            })
        });
    }
  });

