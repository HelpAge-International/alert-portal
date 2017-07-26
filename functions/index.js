const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const moment = require('moment');
const cors = require('cors')({origin: true});
const uuidv4 = require('uuid/v4');
admin.initializeApp(functions.config().firebase);

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = 'ALERT';
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
    from: '"ALERT" <noreply@firebase.com>',
    to: email
  };

  // \n https://uat.portal.alertpreparedness.org
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hello,
                      \nWelcome to ${APP_NAME}. I hope you will enjoy our platform.
                      \n Your temporary password is "BXQQLBJK", please login with your email address to update your credentials.
                      \n https://uat.portal.alertpreparedness.org
                      \n Thanks
                      \n Your ALERT team `;
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
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
    } else if (preData && currData) {
      //user account change
      console.log("user data changed: " + userId);
    } else if (preData && !currData) {
      //delete user account
      console.log("delete user: " + userId);
      admin.auth().deleteUser(userId).then(() => {
        console.log("successfully deleted user: " + userId);
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.handleUserAccountTest = functions.database.ref('/test/userPublic/{userId}')
  .onWrite(event => {
    console.log("agency node triggered");
    const userId = event.params.userId;
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
    } else if (preData && currData) {
      //user account change
      console.log("user data changed: " + userId);
    } else if (preData && !currData) {
      //delete user account
      console.log("delete user: " + userId);
      admin.auth().deleteUser(userId).then(() => {
        console.log("successfully deleted user: " + userId);
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.handleUserAccountUat = functions.database.ref('/uat/userPublic/{userId}')
  .onWrite(event => {
    console.log("agency node triggered");
    const userId = event.params.userId;
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
    } else if (preData && currData) {
      //user account change
      console.log("user data changed: " + userId);
    } else if (preData && !currData) {
      //delete user account
      console.log("delete user: " + userId);
      admin.auth().deleteUser(userId).then(() => {
        console.log("successfully deleted user: " + userId);
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.handleUserAccountLive = functions.database.ref('/live/userPublic/{userId}')
  .onWrite(event => {
    console.log("agency node triggered");
    const userId = event.params.userId;
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
    } else if (preData && currData) {
      //user account change
      console.log("user data changed: " + userId);
    } else if (preData && !currData) {
      //delete user account
      console.log("delete user: " + userId);
      admin.auth().deleteUser(userId).then(() => {
        console.log("successfully deleted user: " + userId);
      }, error => {
        console.log(error.message);
      });
    }
  });

// exports.handleResponsePlans = functions.database.ref('/sand/responsePlan/{countryId}/{responsePlan}/isArchived')
//   .onWrite(event => {
//     // if (event.data.current.val()['isArchived'] && event.data.changed()) {
//     let isActive = event.data.val();
//     if (isActive && event.data.changed()) {
//       console.log("response plan node triggered");
//       // console.log(event.data.val());
//       // console.log(event.data.key);
//       // console.log(event.data.previous.val());
//       // console.log(event.data.current.val());
//       // console.log(event.data.changed());
//       // console.log(event.data.val().startDate);
//       // console.log(event.params["countryId"]);
//
//       let countryId = event.params["countryId"];
//       // let responsePlanId = event.data.key;
//       let responsePlanId = event.params['responsePlan'];
//
//       admin.database().ref('/sand/administratorCountry').orderByChild("countryId").equalTo(countryId)
//         .on("value", snapshot => {
//           console.log("********");
//           console.log(snapshot.val());
//           let administratorCountry = snapshot.val()[countryId];
//           let agencyId = Object.keys(administratorCountry['agencyAdmin'])[0];
//           console.log("agency id: " + agencyId);
//
//           admin.database().ref('/sand/countryOffice/' + agencyId + '/' + countryId + '/clockSettings/responsePlans')
//             .on('value', snapshot => {
//               console.log(snapshot.val());
//               let durationType = Number(snapshot.val()['durationType']);
//               let value = Number(snapshot.val()['value']);
//               let timeDifference = calculateTime(durationType, value);
//               console.log(timeDifference);
//
//               setTimeout(() => {
//                 admin.database().ref('/sand/responsePlan/' + countryId + '/' + responsePlanId)
//                   .on('value', snapshot => {
//                     if (snapshot.val() && snapshot.val()['isActive']) {
//                       // admin.database().ref('/sand/responsePlan/' + countryId + '/' + responsePlanId + '/isArchived').set(false).then(() => {
//                       //   console.log("expire success");
//                       // }, error => {
//                       //   console.log(error.message);
//                       // });
//                     }
//                   });
//               }, timeDifference); //TODO this needs to be checked!!!
//
//             })
//         });
//     }
//   });
//
// exports.handleClockSettins = functions.database.ref('/sand/countryOffice/{agencyId}/{countryId}/clockSettings/responsePlans')
//   .onWrite(event => {
//     // console.log(event.data.val());
//     let serverTime = moment.utc().valueOf();
//     let countryId = event.params['countryId'];
//     let responsePlanSetting = event.data.val();
//     let durationType = Number(responsePlanSetting.durationType);
//     let value = Number(responsePlanSetting.value);
//     let timeDifference = calculateTime(durationType, value);
//     // console.log("duration type: " + durationType);
//     // console.log("value: " + value);
//     // console.log("time difference: " + timeDifference);
//     // console.log("country id: " + countryId);
//     // console.log("server time: " + serverTime);
//     updateResponsePlans(serverTime, timeDifference, countryId);
//   });

// function updateResponsePlans(serverTimeNow, timeDifference, countryId) {
//   admin.database().ref('sand/responsePlan/' + countryId)
//     .once('value', snapshot => {
//       console.log(snapshot.val());
//       let plansNeedToInactive = Object.keys(snapshot.val())
//         .map(key => {
//           let responsePlan = snapshot.val()[key];
//           responsePlan['id'] = key;
//           return responsePlan;
//         })
//         .filter(plan => (serverTimeNow - plan.startDate) > timeDifference && plan.isActive);
//       console.log(plansNeedToInactive);
//       plansNeedToInactive.forEach(plan => {
//         console.log(plan);
//         admin.database().ref('sand/responsePlan/' + countryId + '/' + plan['id'] + '/isArchived').set(false).then(() => {
//           console.log('success de-active');
//         }, error => {
//           console.log(error.message);
//         });
//       });
//     });
// }

// function calculateTime(durationType, value) {
//   let timeDifference = 0;
//   let oneDayTime = 24 * 60 * 60 * 1000;
//   switch (durationType) {
//     case WEEK:
//       timeDifference = value * 7 * oneDayTime;
//       break;
//     case MONTH:
//       timeDifference = value * 30 * oneDayTime; // one month has 30 days
//       break;
//     case YEAR:
//       timeDifference = value * 365 * oneDayTime; // one year has 365 days
//       break;
//   }
//   return timeDifference;
// }

//firebase deploy --only functions:sendResponsePlanValidationEmail
// exports.sendResponsePlanValidationEmail = functions.database.ref('/sand/responsePlan/{countryId}/{responsePlanId}/approval/partnerOrganisation/{partnerOrganisationId}')
//   .onWrite(event => {
//
//     let countryId = event.params['countryId'];
//     let partnerOrganisationId = event.params['partnerOrganisationId'];
//     let responsePlanId = event.params['responsePlanId'];
//     console.log('partnerOrganisationId: ' + partnerOrganisationId);
//
//       admin.database().ref('sand/partnerOrganisation/' + partnerOrganisationId + '/email')
//       .on('value', snapshot => {
//         if (snapshot.val()) {
//           let email = snapshot.val();
//
//           let expiry = moment.utc().add(1, 'weeks').valueOf();
//           let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//           console.log("email: " + email);
//
//           admin.database().ref('sand/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
//             console.log('send to email: ' + email);
//             const mailOptions = {
//               from: '"ALERT partner organisation" <noreply@firebase.com>',
//               to: email
//             };
//
//             // \n https://uat.portal.alertpreparedness.org
//             mailOptions.subject = `Please validate a response plan!`;
//             mailOptions.text = `Hello,
//                               \n Please validate a response plan.
//                               \n To review the response plan, please visit the link below:
//                               \n http://localhost:4200/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
//                               \n Thanks
//                               \n Your ALERT team `;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Email sent to:', email);
//             });
//           });
//         } else {
//           console.log('Error occurred');
//         }
//       });
//
//   });

//for sand response plan
exports.sendResponsePlanValidationEmail = functions.database.ref('/sand/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    //check if newly created only
    if (!preData && currData) {

      let countryId = event.params['countryId'];
      let partnerOrganisationId = event.params['partnerOrganisationId'];
      let responsePlanId = event.params['responsePlanId'];
      console.log('partnerOrganisationId: ' + partnerOrganisationId);

      //check if partner user already
      admin.database().ref('sand/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('sand/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('sand/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
                    console.log('send to email: ' + email);
                    const mailOptions = {
                      from: '"ALERT partner organisation" <noreply@firebase.com>',
                      to: email
                    };

                    // \n https://uat.portal.alertpreparedness.org
                    mailOptions.subject = `Please validate a response plan!`;
                    mailOptions.text = `Hello,
                              \n Please validate a response plan.
                              \n To review the response plan, please visit the link below:
                              \n http://localhost:4200/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
                              \n Thanks
                              \n Your ALERT team `;
                    return mailTransport.sendMail(mailOptions).then(() => {
                      console.log('Email sent to:', email);
                    });
                  });
                } else {
                  console.log('Error occurred');
                }
              });
          }
        });
    }
  });

//for test response plan
exports.sendResponsePlanValidationEmailTest = functions.database.ref('/test/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    //check if newly created only
    if (!preData && currData) {

      let countryId = event.params['countryId'];
      let partnerOrganisationId = event.params['partnerOrganisationId'];
      let responsePlanId = event.params['responsePlanId'];
      console.log('partnerOrganisationId: ' + partnerOrganisationId);

      //check if partner user already
      admin.database().ref('test/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('test/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('test/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
                    console.log('send to email: ' + email);
                    const mailOptions = {
                      from: '"ALERT partner organisation" <noreply@firebase.com>',
                      to: email
                    };

                    // \n https://uat.portal.alertpreparedness.org
                    mailOptions.subject = `Please validate a response plan!`;
                    mailOptions.text = `Hello,
                              \n Please validate a response plan.
                              \n To review the response plan, please visit the link below:
                              \n http://test.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
                              \n Thanks
                              \n Your ALERT team `;
                    return mailTransport.sendMail(mailOptions).then(() => {
                      console.log('Email sent to:', email);
                    });
                  });
                } else {
                  console.log('Error occurred');
                }
              });
          }
        });
    }
  });

//for uat response plan
exports.sendResponsePlanValidationEmailUat = functions.database.ref('/uat/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    //check if newly created only
    if (!preData && currData) {

      let countryId = event.params['countryId'];
      let partnerOrganisationId = event.params['partnerOrganisationId'];
      let responsePlanId = event.params['responsePlanId'];
      console.log('partnerOrganisationId: ' + partnerOrganisationId);

      //check if partner user already
      admin.database().ref('uat/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('uat/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('uat/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
                    console.log('send to email: ' + email);
                    const mailOptions = {
                      from: '"ALERT partner organisation" <noreply@firebase.com>',
                      to: email
                    };

                    // \n https://uat.portal.alertpreparedness.org
                    mailOptions.subject = `Please validate a response plan!`;
                    mailOptions.text = `Hello,
                              \n Please validate a response plan.
                              \n To review the response plan, please visit the link below:
                              \n http://uat.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
                              \n Thanks
                              \n Your ALERT team `;
                    return mailTransport.sendMail(mailOptions).then(() => {
                      console.log('Email sent to:', email);
                    });
                  });
                } else {
                  console.log('Error occurred');
                }
              });
          }
        });
    }
  });

//for sand partner org validation
//firebase deploy --only functions:sendPartnerOrganisationValidationEmail
exports.sendPartnerOrganisationValidationEmail = functions.database.ref('/sand/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    if (!preData && currData) {
      console.log("Partner Organisation created");

      let partnerId = event.params['partnerId'];
      let email = partnerOrganisation.email;
      let expiry = moment.utc().add(1, 'weeks').valueOf();

      let validationToken = {'token': uuidv4(), 'expiry': expiry};

      console.log("email: " + email);

      admin.database().ref('sand/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
        console.log('success validationToken');
        const mailOptions = {
          from: '"ALERT partner organisation" <noreply@firebase.com>',
          to: email
        };

        // \n https://uat.portal.alertpreparedness.org
        mailOptions.subject = `Welcome to ${APP_NAME}!`;
        // https://us-central1-alert-190fa.cloudfunctions.net/validatePartnerOrganisationRequest?token=${validationToken.token}&partnerId=${partnerId}
        mailOptions.text = `Hello,
                          \nYour Organisation was added as a Partner Organisation on the ${APP_NAME}!.
                          \n To confirm, please click on the link below
                          \n http://localhost:4200/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                          \n Thanks
                          \n Your ALERT team `;
        return mailTransport.sendMail(mailOptions).then(() => {
          console.log('New welcome email sent to:', email);
        });
      }, error => {
        console.log(error.message);
      });
    }
  });

//firebase deploy --only functions:validatePartnerOrganisationRequest
// exports.validatePartnerOrganisationRequest = functions.https.onRequest((req, res) => {
//   // Forbidding anything except GET requests.
//   if (req.method !== 'GET') {
//     res.status(403).send('Forbidden!');
//   }
//
//   // Enable CORS using the `cors` express middleware.
//   cors(req, res, () => {
//     // Reading date format from URL query parameter.
//     let token = req.query.token;
//     let partnerId = req.query.partnerId;
//     let invalid = true;
//
//     admin.database().ref('sand/partnerOrganisationValidation/' + partnerId + '/validationToken')
//       .on('value', snapshot => {
//         if (snapshot.val()) {
//           let validationToken = snapshot.val();
//
//           if (token === validationToken.token) {
//             let expiry = validationToken.expiry;
//             let serverTime = moment.utc();
//             let tokenExpiryTime = moment.utc(expiry)
//
//             if (serverTime.isBefore(tokenExpiryTime))
//               invalid = false;
//           }
//
//           if (invalid)
//             res.status(200).send('Invalid request');
//           else {
//             admin.database().ref('sand/partnerOrganisation/' + partnerId + '/isApproved').set(true).then(() => {
//               console.log('partner organisaition validated');
//               res.status(200).send('Thank you for your confirmation. Detailed instructions will be sent to your email soon!');
//             }, error => {
//               console.log(error.message);
//               end();
//             });
//           }
//         } else {
//           res.status(200).send('Invalid request');
//         }
//       });
//   });
// });

//for test partner org validation
//firebase deploy --only functions:sendPartnerOrganisationValidationEmail
exports.sendPartnerOrganisationValidationEmailTest = functions.database.ref('/test/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    if (!preData && currData) {
      console.log("Partner Organisation created");

      let partnerId = event.params['partnerId'];
      let email = partnerOrganisation.email;
      let expiry = moment.utc().add(1, 'weeks').valueOf();

      let validationToken = {'token': uuidv4(), 'expiry': expiry};

      console.log("email: " + email);

      admin.database().ref('test/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
        console.log('success validationToken');
        const mailOptions = {
          from: '"ALERT partner organisation" <noreply@firebase.com>',
          to: email
        };

        // \n https://uat.portal.alertpreparedness.org
        mailOptions.subject = `Welcome to ${APP_NAME}!`;
        mailOptions.text = `Hello,
                          \nYour Organisation was added as a Partner Organisation on the ${APP_NAME}!.
                          \n To confirm, please click on the link below
                          \n http://test.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                          \n Thanks
                          \n Your ALERT team `;
        return mailTransport.sendMail(mailOptions).then(() => {
          console.log('New welcome email sent to:', email);
        });
      }, error => {
        console.log(error.message);
      });
    }
  });

//firebase deploy --only functions:validatePartnerOrganisationRequest
// exports.validatePartnerOrganisationRequestTest = functions.https.onRequest((req, res) => {
//   // Forbidding anything except GET requests.
//   if (req.method !== 'GET') {
//     res.status(403).send('Forbidden!');
//   }
//
//   // Enable CORS using the `cors` express middleware.
//   cors(req, res, () => {
//     // Reading date format from URL query parameter.
//     let token = req.query.token;
//     let partnerId = req.query.partnerId;
//     let invalid = true;
//
//     admin.database().ref('test/partnerOrganisationValidation/' + partnerId + '/validationToken')
//       .on('value', snapshot => {
//         if (snapshot.val()) {
//           let validationToken = snapshot.val();
//
//           if (token === validationToken.token) {
//             let expiry = validationToken.expiry;
//             let serverTime = moment.utc();
//             let tokenExpiryTime = moment.utc(expiry)
//
//             if (serverTime.isBefore(tokenExpiryTime))
//               invalid = false;
//           }
//
//           if (invalid)
//             res.status(200).send('Invalid request');
//           else {
//             admin.database().ref('test/partnerOrganisation/' + partnerId + '/isApproved').set(true).then(() => {
//               console.log('partner organisaition validated');
//               res.status(200).send('Thank you for your confirmation. Detailed instructions will be sent to your email soon!');
//             }, error => {
//               console.log(error.message);
//               end();
//             });
//           }
//         } else {
//           res.status(200).send('Invalid request');
//         }
//       });
//   });
// });

//for uat partner org validation
//firebase deploy --only functions:sendPartnerOrganisationValidationEmail
exports.sendPartnerOrganisationValidationEmailUat = functions.database.ref('/uat/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    if (!preData && currData) {
      console.log("Partner Organisation created");

      let partnerId = event.params['partnerId'];
      let email = partnerOrganisation.email;
      let expiry = moment.utc().add(1, 'weeks').valueOf();

      let validationToken = {'token': uuidv4(), 'expiry': expiry};

      console.log("email: " + email);

      admin.database().ref('uat/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
        console.log('success validationToken');
        const mailOptions = {
          from: '"ALERT partner organisation" <noreply@firebase.com>',
          to: email
        };

        // \n https://uat.portal.alertpreparedness.org
        mailOptions.subject = `Welcome to ${APP_NAME}!`;
        mailOptions.text = `Hello,
                          \nYour Organisation was added as a Partner Organisation on the ${APP_NAME}!.
                          \n To confirm, please click on the link below
                          \n http://uat.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                          \n Thanks
                          \n Your ALERT team `;
        return mailTransport.sendMail(mailOptions).then(() => {
          console.log('New welcome email sent to:', email);
        });
      }, error => {
        console.log(error.message);
      });
    }
  });

//firebase deploy --only functions:validatePartnerOrganisationRequest
// exports.validatePartnerOrganisationRequestUat = functions.https.onRequest((req, res) => {
//   // Forbidding anything except GET requests.
//   if (req.method !== 'GET') {
//     res.status(403).send('Forbidden!');
//   }
//
//   // Enable CORS using the `cors` express middleware.
//   cors(req, res, () => {
//     // Reading date format from URL query parameter.
//     let token = req.query.token;
//     let partnerId = req.query.partnerId;
//     let invalid = true;
//
//     admin.database().ref('uat/partnerOrganisationValidation/' + partnerId + '/validationToken')
//       .on('value', snapshot => {
//         if (snapshot.val()) {
//           let validationToken = snapshot.val();
//
//           if (token === validationToken.token) {
//             let expiry = validationToken.expiry;
//             let serverTime = moment.utc();
//             let tokenExpiryTime = moment.utc(expiry)
//
//             if (serverTime.isBefore(tokenExpiryTime))
//               invalid = false;
//           }
//
//           if (invalid)
//             res.status(200).send('Invalid request');
//           else {
//             admin.database().ref('uat/partnerOrganisation/' + partnerId + '/isApproved').set(true).then(() => {
//               console.log('partner organisaition validated');
//               res.status(200).send('Thank you for your confirmation. Detailed instructions will be sent to your email soon!');
//             }, error => {
//               console.log(error.message);
//               end();
//             });
//           }
//         } else {
//           res.status(200).send('Invalid request');
//         }
//       });
//   });
// });

//for live
//firebase deploy --only functions:sendPartnerOrganisationValidationEmail
// exports.sendPartnerOrganisationValidationEmailLive = functions.database.ref('/live/partnerOrganisation/{partnerId}')
//   .onWrite(event => {
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let partnerOrganisation = event.data.val();
//     let isApproved = partnerOrganisation.isApproved;
//
//     if (!preData && currData) {
//       console.log("Partner Organisation created");
//
//       let partnerId = event.params['partnerId'];
//       let email = partnerOrganisation.email;
//       let expiry = moment.utc().add(1, 'weeks').valueOf();
//
//       let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//       console.log("email: " + email);
//
//       admin.database().ref('live/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
//         console.log('success validationToken');
//         const mailOptions = {
//           from: '"ALERT partner organisation" <noreply@firebase.com>',
//           to: email
//         };
//
//         // \n https://uat.portal.alertpreparedness.org
//         mailOptions.subject = `Welcome to ${APP_NAME}!`;
//         mailOptions.text = `Hello,
//                           \nYour Organisation was added as a Partner Organisation on the ${APP_NAME}!.
//                           \n To confirm, please click on the link below
//                           \n https://us-central1-alert-190fa.cloudfunctions.net/validatePartnerOrganisationRequest?token=${validationToken.token}&partnerId=${partnerId}
//                           \n Thanks
//                           \n Your ALERT team `;
//         return mailTransport.sendMail(mailOptions).then(() => {
//           console.log('New welcome email sent to:', email);
//         });
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });
//
// //firebase deploy --only functions:validatePartnerOrganisationRequest
// exports.validatePartnerOrganisationRequestLive = functions.https.onRequest((req, res) => {
//   // Forbidding anything except GET requests.
//   if (req.method !== 'GET') {
//     res.status(403).send('Forbidden!');
//   }
//
//   // Enable CORS using the `cors` express middleware.
//   cors(req, res, () => {
//     // Reading date format from URL query parameter.
//     let token = req.query.token;
//     let partnerId = req.query.partnerId;
//     let invalid = true;
//
//     admin.database().ref('live/partnerOrganisationValidation/' + partnerId + '/validationToken')
//       .on('value', snapshot => {
//         if (snapshot.val()) {
//           let validationToken = snapshot.val();
//
//           if (token === validationToken.token) {
//             let expiry = validationToken.expiry;
//             let serverTime = moment.utc();
//             let tokenExpiryTime = moment.utc(expiry)
//
//             if (serverTime.isBefore(tokenExpiryTime))
//               invalid = false;
//           }
//
//           if (invalid)
//             res.status(200).send('Invalid request');
//           else {
//             admin.database().ref('live/partnerOrganisation/' + partnerId + '/isApproved').set(true).then(() => {
//               console.log('partner organisaition validated');
//               res.status(200).send('Thank you for your confirmation. Detailed instructions will be sent to your email soon!');
//             }, error => {
//               console.log(error.message);
//               end();
//             });
//           }
//         } else {
//           res.status(200).send('Invalid request');
//         }
//       });
//   });
// });
