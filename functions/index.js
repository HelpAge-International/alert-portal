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

  const userPassword = generateRandomPassword();
  const userUid = user.uid;

  admin.auth().updateUser(userUid, {
    password: userPassword
  })
    .then(function(userRecord){
      console.log("Successfully updated user password", userRecord.toJSON());
      return sendWelcomeEmail(email, userPassword);
  })
    .catch(function(error){
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
                      \n Your temporary password is "`+userPassword+`", please login with your email address to update your credentials.
                      \n https://platform.alertpreparedness.org
                      \n Thanks
                      \n Your ALERT team `;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

function generateRandomPassword(){
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789";
  var string_length = getRandomInt(8,10);
  var randomstring = '';
  var charCount = 0;
  var numCount = 0;

  for (var i=0; i<string_length; i++) {
    if((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
      var rnum = Math.floor(Math.random() * 10);
      randomstring += rnum;
      numCount += 1;
    } else {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
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

//for live response plans
exports.sendResponsePlanValidationEmailLive = functions.database.ref('/live/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('live/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('live/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('live/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://platform.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

//for live
exports.sendPartnerOrganisationValidationEmailLive = functions.database.ref('/live/partnerOrganisation/{partnerId}')
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

      admin.database().ref('live/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n http://platform.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

/**
 * Sending an email when a system admin notification sent
 *
 * */

//SAND, TEST, UAT, UAT-2

//UNCOMMENT BELOW 3 ONLY FOR SAND, TEST, UAT, UAT-2

//Only enable SAND for testing during development

exports.sendSystemAdminNotificationsEmail_SAND = functions.database.ref('/sand/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('sand/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
          admin.database().ref('sand/message/' + msgId).on('value', snapshot => {
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

exports.sendSystemAdminNotificationsEmail_TEST = functions.database.ref('/test/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('test/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('uat/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('uat-2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d1s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d1s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d2s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d2s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d3s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d3s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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

exports.sendAgencyNotificationsEmail_SAND = functions.database.ref('/sand/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('sand/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
          admin.database().ref('sand/message/' + msgId).on('value', snapshot => {
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

exports.sendAgencyNotificationsEmail_TEST = functions.database.ref('/test/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('test/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('uat/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('uat-2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d1s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d1s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d2s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d2s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d3s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d3s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('test/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('uat/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('uat-2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d1s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d1s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d2s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d2s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d3s1/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
      admin.database().ref('d3s2/userPublic/' + userId+ "/email").on('value', snapshot => {

        let email = snapshot.val();

        if(email){
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
