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
const TEMP_PASS = "testtest";

const ALERT_GREEN = 0
const ALERT_AMBER = 1
const ALERT_RED = 2

const ALERT_LEVEL_CHANGED = 0
const RED_ALERT_REQUEST = 1
const UPDATE_HAZARD = 2
const ACTION_EXPIRED = 3
const PLAN_EXPIRED = 4
const PLAN_REJECTED = 5

const WAITING_RESPONSE = 0
const APPROVED = 1
const REJECTED = 2

const PLAN_IN_PROGRESS = 0
const PLAN_WAITINGAPPROVAL = 1
const PLAN_APPROVED = 2
const PLAN_NEEDREVIEWING = 3

const HAZARDS = {
  "0": "Cold Wave",
  "1": "Conflict",
  "2": "Cyclone",
  "3": "Drought",
  "4": "Earthquake",
  "5": "Epidemic",
  "6": "Fire",
  "7": "Flash Flood",
  "8": "Flood",
  "9": "Heat Wave",
  "10": "Heavy Rain",
  "11": "Humanitarian Access",
  "12": "Insect Infestation",
  "13": "Landslide",
  "14": "Locust Infestation",
  "15": "Mudslide",
  "16": "Population Displacement",
  "17": "Population Return",
  "18": "Snow Avalanche",
  "19": "Snowfall",
  "20": "Storm",
  "21": "Storm Surge",
  "22": "Technological Disaster",
  "23": "Tornado",
  "24": "Tsunami",
  "25": "Violent Wind",
  "26": "Volcano"
}

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {

  const user = event.data; // The Firebase user.
  const email = user.email; // The email of the user.

  const userPassword = generateRandomPassword();
  const userUid = user.uid;

  admin.auth().updateUser(userUid, {
    password: userPassword
  })
    .then(function (userRecord) {
      console.log("Successfully updated user password", userRecord.toJSON());
      return sendWelcomeEmail(email, userPassword);
    })
    .catch(function (error) {
      console.log("Error updating user password:", error);
    });
});

// Sends a welcome email to the given user.
function sendWelcomeEmail(email, userPassword) {
  const mailOptions = {
    from: '"ALERT" <noreply@firebase.com>',
    to: email
  };
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hello,
                      \nWelcome to ${APP_NAME}. I hope you will enjoy our platform.
                      \n Your temporary password is "` + userPassword + `", please login with your email address to update your credentials.
                      \n https://platform.alertpreparedness.org
                      \n Thanks
                      \n Your ALERT team `;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

//send general email
function sendEmail(email, title, content) {
  const mailOptions = {
    from: '"ALERT" <noreply@firebase.com>',
    to: email
  };
  mailOptions.subject = title
  mailOptions.text = content
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('normal email sent to:', email);
  });
}

function generateRandomPassword() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789";
  var string_length = getRandomInt(8, 10);
  var randomstring = '';
  var charCount = 0;
  var numCount = 0;

  for (var i = 0; i < string_length; i++) {
    if ((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
      var rnum = Math.floor(Math.random() * 10);
      randomstring += rnum;
      numCount += 1;
    } else {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
      charCount += 1;
    }
  }
  return randomstring;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Handling User Accounts
 * **/

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

exports.handleUserAccountUat2 = functions.database.ref('/uat-2/userPublic/{userId}')
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

exports.handleUserAccountD1s1 = functions.database.ref('/d1s1/userPublic/{userId}')
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

exports.handleUserAccountD1s2 = functions.database.ref('/d1s2/userPublic/{userId}')
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

exports.handleUserAccountD2s1 = functions.database.ref('/d2s1/userPublic/{userId}')
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

exports.handleUserAccountD2s2 = functions.database.ref('/d2s2/userPublic/{userId}')
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

exports.handleUserAccountD3s1 = functions.database.ref('/d3s1/userPublic/{userId}')
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

exports.handleUserAccountD3s2 = functions.database.ref('/d3s2/userPublic/{userId}')
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

//UNCOMMENT BELOW ONLY FOR LIVE AND COMMENT ALL ABOVE

// exports.handleUserAccountLive = functions.database.ref('/live/userPublic/{userId}')
//   .onWrite(event => {
//     console.log("agency node triggered");
//     const userId = event.params.userId;
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//     if (!preData && currData) {
//       //add user account
//       console.log("user added: " + userId);
//     } else if (preData && currData) {
//       //user account change
//       console.log("user data changed: " + userId);
//     } else if (preData && !currData) {
//       //delete user account
//       console.log("delete user: " + userId);
//       admin.auth().deleteUser(userId).then(() => {
//         console.log("successfully deleted user: " + userId);
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });

/**
 * Response plans partner Validation
 * **/

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

//for uat-2 response plans
exports.sendResponsePlanValidationEmailUat2 = functions.database.ref('/uat-2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('uat-2/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('uat-2/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('uat-2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://uat-2.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for d1s1 response plans
exports.sendResponsePlanValidationEmailD1s1 = functions.database.ref('/d1s1/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('d1s1/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('d1s1/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('d1s1/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://set-1.day-1.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for d1s2 response plans
exports.sendResponsePlanValidationEmailD1s2 = functions.database.ref('/d1s2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('d1s2/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('d1s2/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('d1s2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://set-2.day-1.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for d2s1 response plans
exports.sendResponsePlanValidationEmailD2s1 = functions.database.ref('/d2s1/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('d2s1/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('d2s1/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('d2s1/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://set-1.day-2.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for d2s2 response plans
exports.sendResponsePlanValidationEmailD2s2 = functions.database.ref('/d2s2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('d2s2/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('d2s2/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('d2s2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://set-2.day-2.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for d3s1 response plans
exports.sendResponsePlanValidationEmailD3s1 = functions.database.ref('/d3s1/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('d3s1/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('d3s1/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('d3s1/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://set-1.day-3.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for d3s2 response plans
exports.sendResponsePlanValidationEmailD3s2 = functions.database.ref('/d3s2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('d3s2/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('d3s2/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('d3s2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://set-2.day-3.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//UNCOMMENT BELOW ONLY FOR LIVE AND COMMENT ALL ABOVE

// //for live response plans
// exports.sendResponsePlanValidationEmailLive = functions.database.ref('/live/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     //check if newly created only
//     if (!preData && currData) {
//
//       let countryId = event.params['countryId'];
//       let partnerOrganisationId = event.params['partnerOrganisationId'];
//       let responsePlanId = event.params['responsePlanId'];
//       console.log('partnerOrganisationId: ' + partnerOrganisationId);
//
//       //check if partner user already
//       admin.database().ref('live/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('live/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('live/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
//                     console.log('send to email: ' + email);
//                     const mailOptions = {
//                       from: '"ALERT partner organisation" <noreply@firebase.com>',
//                       to: email
//                     };
//
//                     // \n https://uat.portal.alertpreparedness.org
//                     mailOptions.subject = `Please validate a response plan!`;
//                     mailOptions.text = `Hello,
//                               \n Please validate a response plan.
//                               \n To review the response plan, please visit the link below:
//                               \n http://platform.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
//                               \n Thanks
//                               \n Your ALERT team `;
//                     return mailTransport.sendMail(mailOptions).then(() => {
//                       console.log('Email sent to:', email);
//                     });
//                   });
//                 } else {
//                   console.log('Error occurred');
//                 }
//               });
//           }
//         });
//     }
//   });

/**
 * Partner Organisation Validation
 * **/

//ffor sand
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

//for test
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

//for uat
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

//for uat-2
exports.sendPartnerOrganisationValidationEmailUat2 = functions.database.ref('/uat-2/partnerOrganisation/{partnerId}')
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

      admin.database().ref('uat-2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://uat-2.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//for d1s1
exports.sendPartnerOrganisationValidationEmailD1s1 = functions.database.ref('/d1s1/partnerOrganisation/{partnerId}')
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

      admin.database().ref('d1s1/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://set-1.day-1.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//for d1s2
exports.sendPartnerOrganisationValidationEmailD1s2 = functions.database.ref('/d1s2/partnerOrganisation/{partnerId}')
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

      admin.database().ref('d1s2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://set-2.day-1.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//for d2s1
exports.sendPartnerOrganisationValidationEmailD2s1 = functions.database.ref('/d2s1/partnerOrganisation/{partnerId}')
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

      admin.database().ref('d2s1/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://set-1.day-2.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//for d2s2
exports.sendPartnerOrganisationValidationEmailD2s2 = functions.database.ref('/d2s2/partnerOrganisation/{partnerId}')
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

      admin.database().ref('d2s2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://set-2.day-2.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//for d3s1
exports.sendPartnerOrganisationValidationEmailD3s1 = functions.database.ref('/d3s1/partnerOrganisation/{partnerId}')
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

      admin.database().ref('d3s1/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://set-1.day-3.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//for d3s2
exports.sendPartnerOrganisationValidationEmailD3s2 = functions.database.ref('/d3s2/partnerOrganisation/{partnerId}')
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

      admin.database().ref('d3s2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://set-2.day-3.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

//UNCOMMENT BELOW ONLY FOR LIVE AND COMMENT ALL ABOVE

//for live
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
//                           \n http://platform.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

/**
 * Sending an email when a system admin notification sent
 *
 * */

//SAND, TEST, UAT, UAT-2

//UNCOMMENT BELOW 3 ONLY FOR SAND, TEST, UAT, UAT-2

//Only enable SAND for testing during development

// exports.sendSystemAdminNotificationsEmail_SAND = functions.database.ref('/sand/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('sand/userPublic/' + userId+ "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if(email){
//           admin.database().ref('sand/message/' + msgId).on('value', snapshot => {
//             let title = snapshot.val().title;
//             let content = snapshot.val().content;
//
//             const mailOptions = {
//               from: '"ALERT Preparedness" <noreply@firebase.com>',
//               to: email
//             };
//             mailOptions.subject = title;
//             mailOptions.text = content;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Notification email sent to :', email);
//             });
//           }, error => {
//             console.log(error.message);
//           });
//         }
//       }, error => {
//          console.log(error.message);
//       });
//     }
//   });

exports.sendSystemAdminNotificationsEmail_TEST = functions.database.ref('/test/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('test/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('test/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_UAT = functions.database.ref('/uat/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('uat/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('uat/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_UAT_2 = functions.database.ref('/uat-2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('uat-2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('uat-2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_D1S1 = functions.database.ref('/d1s1/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d1s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d1s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_D1S2 = functions.database.ref('/d1s2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d1s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d1s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_D2S1 = functions.database.ref('/d2s1/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d2s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d2s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_D2S2 = functions.database.ref('/d2s2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d2s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d2s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_D3S1 = functions.database.ref('/d3s1/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d3s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d3s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendSystemAdminNotificationsEmail_D3S2 = functions.database.ref('/d3s2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d3s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d3s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

//UNCOMMENT BELOW ONLY FOR LIVE AND COMMENT ALL ABOVE

// exports.sendSystemAdminNotificationsEmail_LIVE = functions.database.ref('/live/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('live/userPublic/' + userId+ "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if(email){
//           admin.database().ref('live/message/' + msgId).on('value', snapshot => {
//             let title = snapshot.val().title;
//             let content = snapshot.val().content;
//
//             const mailOptions = {
//               from: '"ALERT Preparedness" <noreply@firebase.com>',
//               to: email
//             };
//             mailOptions.subject = title;
//             mailOptions.text = content;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Notification email sent to :', email);
//             });
//           }, error => {
//             console.log(error.message);
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });

/**
 * Sending an email when a agency notification sent
 *
 * */

//SAND, TEST, UAT, UAT-2

//UNCOMMENT BELOW 3 ONLY FOR SAND, TEST, UAT, UAT-2

//Only enable SAND for testing during development

// exports.sendAgencyNotificationsEmail_SAND = functions.database.ref('/sand/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('sand/userPublic/' + userId+ "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if(email){
//           admin.database().ref('sand/message/' + msgId).on('value', snapshot => {
//             let title = snapshot.val().title;
//             let content = snapshot.val().content;
//
//             const mailOptions = {
//               from: '"ALERT Preparedness" <noreply@firebase.com>',
//               to: email
//             };
//             mailOptions.subject = title;
//             mailOptions.text = content;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Notification email sent to :', email);
//             });
//           }, error => {
//             console.log(error.message);
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });

exports.sendAgencyNotificationsEmail_TEST = functions.database.ref('/test/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('test/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('test/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_UAT = functions.database.ref('/uat/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('uat/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('uat/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_UAT_2 = functions.database.ref('/uat-2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('uat-2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('uat-2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_D1S1 = functions.database.ref('/d1s1/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d1s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d1s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_D1S2 = functions.database.ref('/d1s2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d1s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d1s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_D2S1 = functions.database.ref('/d2s1/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d2s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d2s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_D2S2 = functions.database.ref('/d2s2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d2s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d2s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_D3S1 = functions.database.ref('/d3s1/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d3s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d3s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendAgencyNotificationsEmail_D3S2 = functions.database.ref('/d3s2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d3s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d3s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

//UNCOMMENT BELOW ONLY FOR LIVE AND COMMENT ALL ABOVE

// exports.sendAgencyNotificationsEmail_LIVE = functions.database.ref('/live/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('live/userPublic/' + userId+ "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if(email){
//           admin.database().ref('live/message/' + msgId).on('value', snapshot => {
//             let title = snapshot.val().title;
//             let content = snapshot.val().content;
//
//             const mailOptions = {
//               from: '"ALERT Preparedness" <noreply@firebase.com>',
//               to: email
//             };
//             mailOptions.subject = title;
//             mailOptions.text = content;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Notification email sent to :', email);
//             });
//           }, error => {
//             console.log(error.message);
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });

/**
 * Sending an email when a country notification sent
 *
 * */

//SAND, TEST, UAT, UAT-2

//UNCOMMENT BELOW 3 ONLY FOR SAND, TEST, UAT, UAT-2

//Only enable SAND for testing during development

// exports.sendCountryNotificationsEmail_SAND = functions.database.ref('/sand/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('sand/userPublic/' + userId+ "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if(email){
//           admin.database().ref('sand/message/' + msgId).on('value', snapshot => {
//             let title = snapshot.val().title;
//             let content = snapshot.val().content;
//
//             const mailOptions = {
//               from: '"ALERT Preparedness" <noreply@firebase.com>',
//               to: email
//             };
//             mailOptions.subject = title;
//             mailOptions.text = content;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Notification email sent to :', email);
//             });
//           }, error => {
//             console.log(error.message);
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });

exports.sendCountryNotificationsEmail_TEST = functions.database.ref('/test/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('test/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('test/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_UAT = functions.database.ref('/uat/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('uat/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('uat/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_UAT_2 = functions.database.ref('/uat-2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('uat-2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('uat-2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_D1S1 = functions.database.ref('/d1s1/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d1s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d1s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_D1S2 = functions.database.ref('/d1s2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d1s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d1s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_D2S1 = functions.database.ref('/d2s1/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d2s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d2s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_D2S2 = functions.database.ref('/d2s2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d2s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d2s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_D3S1 = functions.database.ref('/d3s1/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d3s1/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d3s1/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

exports.sendCountryNotificationsEmail_D3S2 = functions.database.ref('/d3s2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('d3s2/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('d3s2/message/' + msgId).on('value', snapshot => {
            let title = snapshot.val().title;
            let content = snapshot.val().content;

            const mailOptions = {
              from: '"ALERT Preparedness" <noreply@firebase.com>',
              to: email
            };
            mailOptions.subject = title;
            mailOptions.text = content;
            return mailTransport.sendMail(mailOptions).then(() => {
              console.log('Notification email sent to :', email);
            });
          }, error => {
            console.log(error.message);
          });
        }
      }, error => {
        console.log(error.message);
      });
    }
  });

//UNCOMMENT BELOW ONLY FOR LIVE AND COMMENT ALL ABOVE

// exports.sendCountryNotificationsEmail_LIVE = functions.database.ref('/live/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('live/userPublic/' + userId+ "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if(email){
//           admin.database().ref('live/message/' + msgId).on('value', snapshot => {
//             let title = snapshot.val().title;
//             let content = snapshot.val().content;
//
//             const mailOptions = {
//               from: '"ALERT Preparedness" <noreply@firebase.com>',
//               to: email
//             };
//             mailOptions.subject = title;
//             mailOptions.text = content;
//             return mailTransport.sendMail(mailOptions).then(() => {
//               console.log('Notification email sent to :', email);
//             });
//           }, error => {
//             console.log(error.message);
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       });
//     }
//   });

/***********************************************************************************************************************/
//for sand
exports.sendNetworkAgencyValidationEmail_SAND = functions.database.ref('/sand/network/{networkId}/agencies/{agencyId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/sand/network/' + networkId).once("value", (data) => {

        // if (data.val().isGlobal) {
        console.log('isGlobal')
        admin.database().ref('/sand/agency/' + agencyId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/sand/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/sand/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('sand/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://localhost:4200/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
                          \n Thanks
                          \n Your ALERT team `;
                console.log('we are executing code here');
                return mailTransport.sendMail(mailOptions).then(() => {
                  console.log('New welcome email sent to:', email);
                });
              }, error => {
                console.log(error.message);
              });

            });

          });
        });
        // }else{
        //   console.log('isNotGlobal')
        //   admin.database().ref('/sand/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
        //     let countryOfficeCode = data.val().countryCode;
        //     admin.database().ref('/sand/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
        //       let adminId = data.val();
        //       console.log("admin id: " + adminId);
        //
        //       admin.database().ref('/sand/userPublic/' + adminId).once("value", (user) => {
        //         let email = user.val().email;
        //         console.log("admin email: " + email);
        //
        //         admin.database().ref('/sand/network/' + networkId).once("value", networkSnap => {
        //           let network = networkSnap.val();
        //
        //           let expiry = moment.utc().add(1, 'weeks').valueOf();
        //
        //           let validationToken = {'token': uuidv4(), 'expiry': expiry};
        //
        //           admin.database().ref('sand/networkCountryValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
        //             console.log('success validationToken');
        //             const mailOptions = {
        //               from: '"ALERT Network" <noreply@firebase.com>',
        //               to: email
        //             };
        //
        //             mailOptions.subject = `You have been invited to join a network`;
        //             mailOptions.text = `Hello,
        //                   \nYour Agency was added into ${network.name} network!.
        //                   \n To confirm, please click on the link below
        //                   \n http://localhost:4200/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
        //                   \n Thanks
        //                   \n Your ALERT team `;
        //             console.log('we are executing code here');
        //             return mailTransport.sendMail(mailOptions).then(() => {
        //               console.log('New welcome email sent to:', email);
        //             });
        //           }, error => {
        //             console.log(error.message);
        //           });
        //
        //         });
        //
        //       });
        //     });
        //
        //   })
        // }
      })
    }
  });


exports.sendNetworkAgencyValidationEmail_TEST = functions.database.ref('/test/network/{networkId}/agencies/{agencyId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log('test yeyegkbyjlvyjh')

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/test/network/' + networkId).once("value", (data) => {

        // if (data.val().isGlobal) {
        console.log('isGlobal')

        admin.database().ref('/test/agency/' + agencyId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/test/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/test/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('test/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                              \nYour Agency was added into ${network.name} network!.
                              \n To confirm, please click on the link below
                              \n https://test.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
                              \n Thanks
                              \n Your ALERT team `;
                return mailTransport.sendMail(mailOptions).then(() => {
                  console.log('New welcome email sent to:', email);
                });
              }, error => {
                console.log(error.message);
              });

            });

          });
        });
        // }else{
        //   console.log('isNotGlobal')
        //
        //   admin.database().ref('/test/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
        //     let countryOfficeCode = data.val().countryCode;
        //
        //     admin.database().ref('/test/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
        //       let adminId = data.val();
        //       console.log("admin id: " + adminId);
        //
        //       admin.database().ref('/test/userPublic/' + adminId).once("value", (user) => {
        //         let email = user.val().email;
        //         console.log("admin email: " + email);
        //
        //         admin.database().ref('/test/network/' + networkId).once("value", networkSnap => {
        //           let network = networkSnap.val();
        //
        //           let expiry = moment.utc().add(1, 'weeks').valueOf();
        //
        //           let validationToken = {'token': uuidv4(), 'expiry': expiry};
        //
        //           admin.database().ref('test/networkCountryValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
        //             console.log('success validationToken');
        //             const mailOptions = {
        //               from: '"ALERT Network" <noreply@firebase.com>',
        //               to: email
        //             };
        //
        //             mailOptions.subject = `You have been invited to join a network`;
        //             mailOptions.text = `Hello,
        //                       \nYour Agency was added into ${network.name} network!.
        //                       \n To confirm, please click on the link below
        //                       \n https://test.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
        //                       \n Thanks
        //                       \n Your ALERT team `;
        //             return mailTransport.sendMail(mailOptions).then(() => {
        //               console.log('New welcome email sent to:', email);
        //             });
        //           }, error => {
        //             console.log(error.message);
        //           });
        //
        //         });
        //
        //       });
        //     });
        //   })
        //
        // }
      })
    }
  });


exports.sendNetworkAgencyValidationEmail_UAT = functions.database.ref('/uat/network/{networkId}/agencies/{agencyId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/uat/network/' + networkId).once("value", (data) => {

        // if (data.val().isGlobal) {
        console.log('isGlobal')

        admin.database().ref('/uat/agency/' + agencyId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/uat/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/uat/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('uat/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                              \nYour Agency was added into ${network.name} network!.
                              \n To confirm, please click on the link below
                              \n https://uat.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
                              \n Thanks
                              \n Your ALERT team `;
                return mailTransport.sendMail(mailOptions).then(() => {
                  console.log('New welcome email sent to:', email);
                });
              }, error => {
                console.log(error.message);
              });

            });

          });
        });
        // } else {
        //   console.log('isNotGlobal')
        //
        //   admin.database().ref('/uat/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
        //     let countryOfficeCode = data.val().countryCode;
        //
        //     admin.database().ref('/uat/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
        //       let adminId = data.val();
        //       console.log("admin id: " + adminId);
        //
        //       admin.database().ref('/uat/userPublic/' + adminId).once("value", (user) => {
        //         let email = user.val().email;
        //         console.log("admin email: " + email);
        //
        //         admin.database().ref('/uat/network/' + networkId).once("value", networkSnap => {
        //           let network = networkSnap.val();
        //
        //           let expiry = moment.utc().add(1, 'weeks').valueOf();
        //
        //           let validationToken = {'token': uuidv4(), 'expiry': expiry};
        //
        //           admin.database().ref('uat/networkCountryValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
        //             console.log('success validationToken');
        //             const mailOptions = {
        //               from: '"ALERT Network" <noreply@firebase.com>',
        //               to: email
        //             };
        //
        //             mailOptions.subject = `You have been invited to join a network`;
        //             mailOptions.text = `Hello,
        //                         \nYour Agency was added into ${network.name} network!.
        //                         \n To confirm, please click on the link below
        //                         \n https://uat.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
        //                         \n Thanks
        //                         \n Your ALERT team `;
        //             return mailTransport.sendMail(mailOptions).then(() => {
        //               console.log('New welcome email sent to:', email);
        //             });
        //           }, error => {
        //             console.log(error.message);
        //           });
        //
        //         });
        //
        //       });
        //     });
        //   })
        // }
      })
    }
  });

exports.sendNetworkAgencyValidationEmail_UAT_2 = functions.database.ref('/uat-2/network/{networkId}/agencies/{agencyId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/uat-2/agency/' + agencyId + '/adminId').once("value", (data) => {
        let adminId = data.val();
        console.log("admin id: " + adminId);

        admin.database().ref('/uat-2/userPublic/' + adminId).once("value", (user) => {
          let email = user.val().email;
          console.log("admin email: " + email);

          admin.database().ref('/uat-2/network/' + networkId).once("value", networkSnap => {
            let network = networkSnap.val();

            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            admin.database().ref('uat-2/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT Network" <noreply@firebase.com>',
                to: email
              };

              mailOptions.subject = `You have been invited to join a network`;
              mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n https://uat-2.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
                          \n Thanks
                          \n Your ALERT team `;
              return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
              });
            }, error => {
              console.log(error.message);
            });

          });

        });
      });
    }
  });

/***********************************************************************************************************************/

/***********************************************************************************************************************/
//for sand
exports.createUserNetworkCountry_SAND = functions.database.ref('/sand/administratorNetworkCountry/{adminId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country admin added");
      let adminId = event.params['adminId'];
      console.log("admin id: " + adminId);
      admin.database().ref("/sand/userPublic/" + adminId)
        .once("value", data => {
          let userDb = data.val();
          console.log(userDb);

          admin.auth().createUser({
            uid: adminId,
            email: userDb.email,
            password: TEMP_PASS
          })
            .then(user => {
              console.log("Successfully created new user: " + user.uid)
            })
            .catch(error => {
              console.log("Error creating new user:", error)
            })

        });
    }
  });

exports.createUserNetworkCountry_TEST = functions.database.ref('/test/administratorNetworkCountry/{adminId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country admin added");
      let adminId = event.params['adminId'];
      console.log("admin id: " + adminId);
      admin.database().ref("/test/userPublic/" + adminId)
        .once("value", data => {
          let userDb = data.val();
          console.log(userDb);

          admin.auth().createUser({
            uid: adminId,
            email: userDb.email,
            password: TEMP_PASS
          })
            .then(user => {
              console.log("Successfully created new user: " + user.uid)
            })
            .catch(error => {
              console.log("Error creating new user:", error)
            })

        });
    }
  });

exports.createUserNetworkCountry_UAT = functions.database.ref('/uat/administratorNetworkCountry/{adminId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country admin added");
      let adminId = event.params['adminId'];
      console.log("admin id: " + adminId);
      admin.database().ref("/uat/userPublic/" + adminId)
        .once("value", data => {
          let userDb = data.val();
          console.log(userDb);

          admin.auth().createUser({
            uid: adminId,
            email: userDb.email,
            password: TEMP_PASS
          })
            .then(user => {
              console.log("Successfully created new user: " + user.uid)
            })
            .catch(error => {
              console.log("Error creating new user:", error)
            })

        });
    }
  });

exports.createUserNetworkCountry_UAT_2 = functions.database.ref('/uat-2/administratorNetworkCountry/{adminId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country admin added");
      let adminId = event.params['adminId'];
      console.log("admin id: " + adminId);
      admin.database().ref("/uat-2/userPublic/" + adminId)
        .once("value", data => {
          let userDb = data.val();
          console.log(userDb);

          admin.auth().createUser({
            uid: adminId,
            email: userDb.email,
            password: TEMP_PASS
          })
            .then(user => {
              console.log("Successfully created new user: " + user.uid)
            })
            .catch(error => {
              console.log("Error creating new user:", error)
            })

        });
    }
  });
/***********************************************************************************************************************/

/***********************************************************************************************************************/
//for sand
exports.updateUserEmail_SAND = functions.database.ref('/sand/userPublic/{uid}/email')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData && preData !== currData) {
      console.log("email updated");
      let uid = event.params['uid'];
      console.log("user id email updated: " + uid);
      admin.auth().updateUser(uid, {
        email: currData
      })
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user", userRecord.toJSON());
        })
        .catch(function (error) {
          console.log("Error updating user:", error);
        });
      // admin.database().ref("/uat-2/userPublic/" + adminId)
      //   .once("value", data => {
      //     let userDb = data.val();
      //     console.log(userDb);
      //
      //     admin.auth().createUser({
      //       uid: adminId,
      //       email: userDb.email,
      //       password: TEMP_PASS
      //     })
      //       .then(user => {
      //         console.log("Successfully created new user: " + user.uid)
      //       })
      //       .catch(error => {
      //         console.log("Error creating new user:", error)
      //       })
      //
      //   });
    }
  });

exports.updateUserEmail_TEST = functions.database.ref('/test/userPublic/{uid}/email')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData && preData !== currData) {
      console.log("email updated");
      let uid = event.params['uid'];
      console.log("user id email updated: " + uid);
      admin.auth().updateUser(uid, {
        email: currData
      })
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user", userRecord.toJSON());
        })
        .catch(function (error) {
          console.log("Error updating user:", error);
        });
    }
  });

exports.updateUserEmail_UAT = functions.database.ref('/uat/userPublic/{uid}/email')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData && preData !== currData) {
      console.log("email updated");
      let uid = event.params['uid'];
      console.log("user id email updated: " + uid);
      admin.auth().updateUser(uid, {
        email: currData
      })
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user", userRecord.toJSON());
        })
        .catch(function (error) {
          console.log("Error updating user:", error);
        });
    }
  });

exports.updateUserEmail_UAT_2 = functions.database.ref('/uat-2/userPublic/{uid}/email')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData && preData !== currData) {
      console.log("email updated");
      let uid = event.params['uid'];
      console.log("user id email updated: " + uid);
      admin.auth().updateUser(uid, {
        email: currData
      })
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user", userRecord.toJSON());
        })
        .catch(function (error) {
          console.log("Error updating user:", error);
        });
    }
  });
/***********************************************************************************************************************/

/***********************************************************************************************************************/
exports.sendNetworkCountryAgencyValidationEmail_SAND = functions.database.ref('/sand/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country office agency country added");

      let networkId = event.params['networkId'];
      let networkCountryId = event.params['networkCountryId'];
      let agencyId = event.params['agencyId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/sand/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
        let adminId = data.val();
        console.log("admin id: " + adminId);

        admin.database().ref('/sand/userPublic/' + adminId).once("value", (user) => {
          let email = user.val().email;
          console.log("admin email: " + email);

          admin.database().ref('/sand/network/' + networkId).once("value", networkSnap => {
            let network = networkSnap.val();


            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            admin.database().ref('sand/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT Network" <noreply@firebase.com>',
                to: email
              };

              mailOptions.subject = `You have been invited to join a network`;
              mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://localhost:4200/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
                          \n Thanks
                          \n Your ALERT team `;
              return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
              });
            }, error => {
              console.log(error.message);
            });

          });

        });
      });
    }
  });

exports.sendNetworkCountryAgencyValidationEmail_TEST = functions.database.ref('/test/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country office agency country added");

      let networkId = event.params['networkId'];
      let networkCountryId = event.params['networkCountryId'];
      let agencyId = event.params['agencyId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/test/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
        let adminId = data.val();
        console.log("admin id: " + adminId);

        admin.database().ref('/test/userPublic/' + adminId).once("value", (user) => {
          let email = user.val().email;
          console.log("admin email: " + email);

          admin.database().ref('/test/network/' + networkId).once("value", networkSnap => {
            let network = networkSnap.val();

            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            admin.database().ref('test/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT Network" <noreply@firebase.com>',
                to: email
              };

              mailOptions.subject = `You have been invited to join a network`;
              mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://test.portal.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
                          \n Thanks
                          \n Your ALERT team `;
              return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
              });
            }, error => {
              console.log(error.message);
            });

          });

        });
      });
    }
  });

exports.sendNetworkCountryAgencyValidationEmail_UAT_1 = functions.database.ref('/uat/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country office agency country added");

      let networkId = event.params['networkId'];
      let networkCountryId = event.params['networkCountryId'];
      let agencyId = event.params['agencyId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/uat/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
        let adminId = data.val();
        console.log("admin id: " + adminId);

        admin.database().ref('/uat/userPublic/' + adminId).once("value", (user) => {
          let email = user.val().email;
          console.log("admin email: " + email);

          admin.database().ref('/uat/network/' + networkId).once("value", networkSnap => {
            let network = networkSnap.val();

            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            admin.database().ref('uat/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT Network" <noreply@firebase.com>',
                to: email
              };

              mailOptions.subject = `You have been invited to join a network`;
              mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://uat.portal.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
                          \n Thanks
                          \n Your ALERT team `;
              return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
              });
            }, error => {
              console.log(error.message);
            });

          });

        });
      });
    }
  });

exports.sendNetworkCountryAgencyValidationEmail_UAT_2 = functions.database.ref('/uat-2/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country office agency country added");

      let networkId = event.params['networkId'];
      let networkCountryId = event.params['networkCountryId'];
      let agencyId = event.params['agencyId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/uat-2/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
        let adminId = data.val();
        console.log("admin id: " + adminId);

        admin.database().ref('/uat-2/userPublic/' + adminId).once("value", (user) => {
          let email = user.val().email;
          console.log("admin email: " + email);

          admin.database().ref('/uat-2/network/' + networkId).once("value", networkSnap => {
            let network = networkSnap.val();

            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            admin.database().ref('uat-2/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT Network" <noreply@firebase.com>',
                to: email
              };

              mailOptions.subject = `You have been invited to join a network`;
              mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://uat-2.portal.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
                          \n Thanks
                          \n Your ALERT team `;
              return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
              });
            }, error => {
              console.log(error.message);
            });

          });

        });
      });
    }
  });
/***********************************************************************************************************************/

/********************************************SEND EMAIL TO EXTERNAL RECIPIENTS*****************************************************************/
exports.sendEmailToExternalForAlertChange_SAND = functions.database.ref('/sand/alert/{countryId}/{alertId}/alertLevel')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData !== currData) {

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/sand/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
            console.log("external recipient: ")
            console.log(data.val())
            let exObj = data.val();
            if (exObj) {
              let recipients = Object.keys(exObj).map(key => {
                return exObj[key]
              })
              for (let i = 0, len = recipients.length; i < len; i++) {
                if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                  console.log("alert change!")
                  console.log("email need to send to: " + recipients[i].email)
                  let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
                  let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
                  sendEmail(recipients[i].email, title, content)
                } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                  console.log("red alert request")
                  console.log("email need to send to: " + recipients[i].email)
                  let title = `Red alert for ${HAZARDS[alert.hazardScenario]} has been requested`
                  let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has requested RED level update`
                  sendEmail(recipients[i].email, title, content)
                } else {
                  console.log("ERROR, please check!")
                }
              }
            }
          })
        } else {
          admin.database().ref('/sand/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
              let exObj = data.val();
              if (exObj) {
                let recipients = Object.keys(exObj).map(key => {
                  return exObj[key]
                })
                for (let i = 0, len = recipients.length; i < len; i++) {
                  if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                    console.log("alert change!")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `The alert level for ${otherHazardName} has been updated`
                    let content = `The following alert: ${otherHazardName} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
                    sendEmail(recipients[i].email, title, content)
                  } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                    console.log("red alert request")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `Red alert for ${otherHazardName} has been requested`
                    let content = `The following alert: ${otherHazardName} has requested RED level update`
                    sendEmail(recipients[i].email, title, content)
                  } else {
                    console.log("ERROR, please check!")
                  }
                }
              }
            })
          })
        }
      })
    } else {
      console.log("error!!")
    }
  })

exports.sendEmailToExternalForAlertChange_TEST = functions.database.ref('/test/alert/{countryId}/{alertId}/alertLevel')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData !== currData) {

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/test/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          admin.database().ref('/test/externalRecipient/' + countryId).once('value', (data) => {
            console.log("external recipient: ")
            console.log(data.val())
            let exObj = data.val();
            if (exObj) {
              let recipients = Object.keys(exObj).map(key => {
                return exObj[key]
              })
              for (let i = 0, len = recipients.length; i < len; i++) {
                if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                  console.log("alert change!")
                  console.log("email need to send to: " + recipients[i].email)
                  let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
                  let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
                  sendEmail(recipients[i].email, title, content)
                } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                  console.log("red alert request")
                  console.log("email need to send to: " + recipients[i].email)
                  let title = `Red alert for ${HAZARDS[alert.hazardScenario]} has been requested`
                  let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has requested RED level update`
                  sendEmail(recipients[i].email, title, content)
                } else {
                  console.log("ERROR, please check!")
                }
              }
            }
          })
        } else {
          admin.database().ref('/test/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/test/externalRecipient/' + countryId).once('value', (data) => {
              let exObj = data.val();
              if (exObj) {
                let recipients = Object.keys(exObj).map(key => {
                  return exObj[key]
                })
                for (let i = 0, len = recipients.length; i < len; i++) {
                  if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                    console.log("alert change!")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `The alert level for ${otherHazardName} has been updated`
                    let content = `The following alert: ${otherHazardName} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
                    sendEmail(recipients[i].email, title, content)
                  } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                    console.log("red alert request")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `Red alert for ${otherHazardName} has been requested`
                    let content = `The following alert: ${otherHazardName} has requested RED level update`
                    sendEmail(recipients[i].email, title, content)
                  } else {
                    console.log("ERROR, please check!")
                  }
                }
              }
            })
          })
        }
      })
    } else {
      console.log("error!!")
    }
  })

exports.sendEmailToExternalForAlertChange_UAT = functions.database.ref('/uat/alert/{countryId}/{alertId}/alertLevel')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData !== currData) {

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/uat/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          admin.database().ref('/uat/externalRecipient/' + countryId).once('value', (data) => {
            console.log("external recipient: ")
            console.log(data.val())
            let exObj = data.val();
            if (exObj) {
              let recipients = Object.keys(exObj).map(key => {
                return exObj[key]
              })
              for (let i = 0, len = recipients.length; i < len; i++) {
                if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                  console.log("alert change!")
                  console.log("email need to send to: " + recipients[i].email)
                  let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
                  let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
                  sendEmail(recipients[i].email, title, content)
                } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                  console.log("red alert request")
                  console.log("email need to send to: " + recipients[i].email)
                  let title = `Red alert for ${HAZARDS[alert.hazardScenario]} has been requested`
                  let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has requested RED level update`
                  sendEmail(recipients[i].email, title, content)
                } else {
                  console.log("ERROR, please check!")
                }
              }
            }
          })
        } else {
          admin.database().ref('/uat/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/uat/externalRecipient/' + countryId).once('value', (data) => {
              let exObj = data.val();
              if (exObj) {
                let recipients = Object.keys(exObj).map(key => {
                  return exObj[key]
                })
                for (let i = 0, len = recipients.length; i < len; i++) {
                  if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                    console.log("alert change!")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `The alert level for ${otherHazardName} has been updated`
                    let content = `The following alert: ${otherHazardName} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
                    sendEmail(recipients[i].email, title, content)
                  } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                    console.log("red alert request")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `Red alert for ${otherHazardName} has been requested`
                    let content = `The following alert: ${otherHazardName} has requested RED level update`
                    sendEmail(recipients[i].email, title, content)
                  } else {
                    console.log("ERROR, please check!")
                  }
                }
              }
            })
          })
        }
      })
    } else {
      console.log("error!!")
    }
  })

exports.sendEmailToExternalForAlertChangeRed_SAND = functions.database.ref('/sand/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
  .onWrite(event => {

    const currData = event.data.current.val();

    if (currData === APPROVED) {
      console.log("red alert approved");

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/sand/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
          let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
          admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
            console.log("external recipient: ")
            console.log(data.val())
            let exObj = data.val();
            if (exObj) {
              let recipients = Object.keys(exObj).map(key => {
                return exObj[key]
              })
              for (let i = 0, len = recipients.length; i < len; i++) {
                if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                  console.log("alert change!")
                  console.log("email need to send to: " + recipients[i].email)
                  sendEmail(recipients[i].email, title, content)
                } else {
                  console.log("ERROR, please check!")
                }
              }
            }
          })
        } else {
          admin.database().ref('/sand/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
              console.log("external recipient: ")
              console.log(data.val())
              let exObj = data.val();
              if (exObj) {
                let recipients = Object.keys(exObj).map(key => {
                  return exObj[key]
                })
                for (let i = 0, len = recipients.length; i < len; i++) {
                  if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                    console.log("alert change!")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `The alert level for ${otherHazardName} has been updated`
                    let content = `The following alert: ${otherHazardName} has had its level updated to RED ALERT`
                    sendEmail(recipients[i].email, title, content)
                  } else {
                    console.log("ERROR, please check!")
                  }
                }
              }
            })
          })
        }
      })
    } else {
      console.log("error!!")
    }
  })

exports.sendEmailToExternalForAlertChangeRed_TEST = functions.database.ref('/test/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
  .onWrite(event => {

    const currData = event.data.current.val();

    if (currData === APPROVED) {
      console.log("red alert approved");

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/test/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
          let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
          admin.database().ref('/test/externalRecipient/' + countryId).once('value', (data) => {
            console.log("external recipient: ")
            console.log(data.val())
            let exObj = data.val();
            if (exObj) {
              let recipients = Object.keys(exObj).map(key => {
                return exObj[key]
              })
              for (let i = 0, len = recipients.length; i < len; i++) {
                if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                  console.log("alert change!")
                  console.log("email need to send to: " + recipients[i].email)
                  sendEmail(recipients[i].email, title, content)
                } else {
                  console.log("ERROR, please check!")
                }
              }
            }
          })
        } else {
          admin.database().ref('/test/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/test/externalRecipient/' + countryId).once('value', (data) => {
              console.log("external recipient: ")
              console.log(data.val())
              let exObj = data.val();
              if (exObj) {
                let recipients = Object.keys(exObj).map(key => {
                  return exObj[key]
                })
                for (let i = 0, len = recipients.length; i < len; i++) {
                  if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                    console.log("alert change!")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `The alert level for ${otherHazardName} has been updated`
                    let content = `The following alert: ${otherHazardName} has had its level updated to RED ALERT`
                    sendEmail(recipients[i].email, title, content)
                  } else {
                    console.log("ERROR, please check!")
                  }
                }
              }
            })
          })
        }
      })
    } else {
      console.log("error!!")
    }
  })

exports.sendEmailToExternalForAlertChangeRed_UAT = functions.database.ref('/uat/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
  .onWrite(event => {

    const currData = event.data.current.val();

    if (currData === APPROVED) {
      console.log("red alert approved");

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/uat/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
          let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
          admin.database().ref('/uat/externalRecipient/' + countryId).once('value', (data) => {
            console.log("external recipient: ")
            console.log(data.val())
            let exObj = data.val();
            if (exObj) {
              let recipients = Object.keys(exObj).map(key => {
                return exObj[key]
              })
              for (let i = 0, len = recipients.length; i < len; i++) {
                if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                  console.log("alert change!")
                  console.log("email need to send to: " + recipients[i].email)
                  sendEmail(recipients[i].email, title, content)
                } else {
                  console.log("ERROR, please check!")
                }
              }
            }
          })
        } else {
          admin.database().ref('/uat/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/uat/externalRecipient/' + countryId).once('value', (data) => {
              console.log("external recipient: ")
              console.log(data.val())
              let exObj = data.val();
              if (exObj) {
                let recipients = Object.keys(exObj).map(key => {
                  return exObj[key]
                })
                for (let i = 0, len = recipients.length; i < len; i++) {
                  if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
                    console.log("alert change!")
                    console.log("email need to send to: " + recipients[i].email)
                    let title = `The alert level for ${otherHazardName} has been updated`
                    let content = `The following alert: ${otherHazardName} has had its level updated to RED ALERT`
                    sendEmail(recipients[i].email, title, content)
                  } else {
                    console.log("ERROR, please check!")
                  }
                }
              }
            })
          })
        }
      })
    } else {
      console.log("error!!")
    }
  })

exports.sendEmailToExternalForIndicatorUpdate_SAND = functions.database.ref('/sand/indicator/{hazardId}/{indicatorId}/triggerSelected')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData !== preData) {
      console.log("indicator updated");

      let hazardId = event.params['hazardId'];
      let indicatorId = event.params['indicatorId'];

      admin.database().ref('/sand/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
        let indicator = data.val();
        if (indicator.hazardScenario['key'] === 'countryContext') {
          console.log("send email to state indicator for country context was updated")
          let title = `The indicator ${indicator.name} for Country Context has been updated`
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`
          fetchUsersAndSendEmail('sand', hazardId, title, content, UPDATE_HAZARD)
        } else {
          console.log("fetch country id for hazard")
          admin.database().ref('/sand/hazard').once("value", (data) => {
            let filteredObjs = Object.keys(data.val()).map(key => {
              let obj = data.val()[key];
              obj['id'] = key
              return obj
            })
              .filter(item => {
                return item.hasOwnProperty(hazardId)
              })

            let countryId = filteredObjs[0]['id']
            console.log("fetched country id: " + countryId)
            if (indicator.hazardScenario.hazardScenario !== -1) {
              let title = `The indicator ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
              let content = `The following indicator: ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
              fetchUsersAndSendEmail('sand', countryId, title, content)
            } else {
              admin.database().ref('/sand/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('sand', countryId, title, content, UPDATE_HAZARD)
              })
            }
          })
        }
      })
    }
  })

exports.sendEmailToExternalForIndicatorUpdate_TEST = functions.database.ref('/test/indicator/{hazardId}/{indicatorId}/triggerSelected')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData !== preData) {
      console.log("indicator updated");

      let hazardId = event.params['hazardId'];
      let indicatorId = event.params['indicatorId'];

      admin.database().ref('/test/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
        let indicator = data.val();
        if (indicator.hazardScenario['key'] === 'countryContext') {
          console.log("send email to state indicator for country context was updated")
          let title = `The indicator ${indicator.name} for Country Context has been updated`
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`
          fetchUsersAndSendEmail('test', hazardId, title, content, UPDATE_HAZARD)
        } else {
          console.log("fetch country id for hazard")
          admin.database().ref('/test/hazard').once("value", (data) => {
            let filteredObjs = Object.keys(data.val()).map(key => {
              let obj = data.val()[key];
              obj['id'] = key
              return obj
            })
              .filter(item => {
                return item.hasOwnProperty(hazardId)
              })

            let countryId = filteredObjs[0]['id']
            console.log("fetched country id: " + countryId)
            if (indicator.hazardScenario.hazardScenario !== -1) {
              let title = `The indicator ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
              let content = `The following indicator: ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
              fetchUsersAndSendEmail('test', countryId, title, content)
            } else {
              admin.database().ref('/test/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('test', countryId, title, content, UPDATE_HAZARD)
              })
            }
          })
        }
      })
    }
  })

exports.sendEmailToExternalForIndicatorUpdate_UAT = functions.database.ref('/uat/indicator/{hazardId}/{indicatorId}/triggerSelected')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData !== preData) {
      console.log("indicator updated");

      let hazardId = event.params['hazardId'];
      let indicatorId = event.params['indicatorId'];

      admin.database().ref('/uat/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
        let indicator = data.val();
        if (indicator.hazardScenario['key'] === 'countryContext') {
          console.log("send email to state indicator for country context was updated")
          let title = `The indicator ${indicator.name} for Country Context has been updated`
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`
          fetchUsersAndSendEmail('uat', hazardId, title, content, UPDATE_HAZARD)
        } else {
          console.log("fetch country id for hazard")
          admin.database().ref('/uat/hazard').once("value", (data) => {
            let filteredObjs = Object.keys(data.val()).map(key => {
              let obj = data.val()[key];
              obj['id'] = key
              return obj
            })
              .filter(item => {
                return item.hasOwnProperty(hazardId)
              })

            let countryId = filteredObjs[0]['id']
            console.log("fetched country id: " + countryId)
            if (indicator.hazardScenario.hazardScenario !== -1) {
              let title = `The indicator ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
              let content = `The following indicator: ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
              fetchUsersAndSendEmail('uat', countryId, title, content)
            } else {
              admin.database().ref('/uat/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('uat', countryId, title, content, UPDATE_HAZARD)
              })
            }
          })
        }
      })
    }
  })

exports.sendEmailToExternalForPlanExpired_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/isActive')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && !currData) {

      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      console.log("response plan was expired")
      admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        console.log(plan)
        let title = `Plan ${plan.name} was expired`
        let content = `The following plan: ${plan.name} was expired.`
        fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_EXPIRED);
      })
    }
  })

exports.sendEmailToExternalForPlanExpired_TEST = functions.database.ref('/test/responsePlan/{countryId}/{planId}/isActive')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && !currData) {

      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      console.log("response plan was expired")
      admin.database().ref('/test/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        console.log(plan)
        let title = `Plan ${plan.name} was expired`
        let content = `The following plan: ${plan.name} was expired.`
        fetchUsersAndSendEmail('test', countryId, title, content, PLAN_EXPIRED);
      })
    }
  })

exports.sendEmailToExternalForPlanExpired_UAT = functions.database.ref('/uat/responsePlan/{countryId}/{planId}/isActive')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && !currData) {

      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      console.log("response plan was expired")
      admin.database().ref('/uat/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        console.log(plan)
        let title = `Plan ${plan.name} was expired`
        let content = `The following plan: ${plan.name} was expired.`
        fetchUsersAndSendEmail('uat', countryId, title, content, PLAN_EXPIRED);
      })
    }
  })

exports.sendEmailPlanRejectedByCountryDirector_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log(currData)

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by country director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by country director.`
        fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByCountryDirector_TEST = functions.database.ref('/test/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log(currData)

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by country director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/test/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by country director.`
        fetchUsersAndSendEmail('test', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByCountryDirector_UAT = functions.database.ref('/uat/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log(currData)

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by country director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/uat/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by country director.`
        fetchUsersAndSendEmail('uat', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByRegionDirector_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by region director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by region director.`
        fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByRegionDirector_TEST = functions.database.ref('/test/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by region director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/test/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by region director.`
        fetchUsersAndSendEmail('test', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByRegionDirector_UAT = functions.database.ref('/uat/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by region director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/uat/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by region director.`
        fetchUsersAndSendEmail('uat', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByGlobalDirector_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by global director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by global director.`
        fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByGlobalDirector_TEST = functions.database.ref('/test/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by global director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/test/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by global director.`
        fetchUsersAndSendEmail('test', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByGlobalDirector_UAT = functions.database.ref('/uat/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by global director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/uat/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by global director.`
        fetchUsersAndSendEmail('uat', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

////private functions
function fetchUsersAndSendEmail(node, countryId, title, content, setting) {
  admin.database().ref('/'+node+'/externalRecipient/' + countryId).once('value', (data) => {
    let exObj = data.val();
    if (exObj) {
      let recipients = Object.keys(exObj).map(key => {
        return exObj[key]
      })
      for (let i = 0, len = recipients.length; i < len; i++) {
        if (recipients[i].notificationsSettings[setting]) {
          sendEmail(recipients[i].email, title, content)
        }
      }
    }
  })
}

function getAlertName(level) {
  if (level === ALERT_GREEN) {
    return "GREEN ALERT"
  } else if (level === ALERT_AMBER) {
    return "AMBER ALERT"
  } else if (level === ALERT_RED) {
    return "RED ALERT"
  }
}

/*********************************************************************************************************************************************/
