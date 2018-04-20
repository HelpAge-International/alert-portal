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

const COUNTRIES = [
  "Afghanistan",
  "Åland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, the Democratic Republic of the",
  "Cook Islands",
  "Costa Rica",
  "Ivory Coast",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Holy See (Vatican City State)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran, Islamic Republic of",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People's Republic of",
  "Korea, Republic of",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Macedonia, the former Yugoslav Republic of",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia, Federated States of",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestinian Territory, Occupied",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Réunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan, Province of China",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Virgin Islands, British",
  "Virgin Islands, U.S.",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
]
// exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
//
//   const user = event.data; // The Firebase user.
//   const email = user.email; // The email of the user.
//
//   const userPassword = generateRandomPassword();
//   const userUid = user.uid;
//
//   admin.auth().updateUser(userUid, {
//     password: userPassword
//   })
//     .then(function (userRecord) {
//       console.log("Successfully updated user password", userRecord.toJSON());
//       return sendWelcomeEmail(email, userPassword);
//     })
//     .catch(function (error) {
//       console.log("Error updating user password:", error);
//     });
// });

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
  console.log(mailOptions.title)
  console.log(mailOptions.text)
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
      admin.auth().createUser({
        uid: userId,
        email: currData.email,
        password: TEMP_PASS
      })
        .then(user => {
          console.log("(handleUserAccount)Successfully created new user: " + user.uid)
        })
        .catch(error => {
          console.log("(handleUserAccount)Error creating new user:", error)
        })
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
      admin.auth().createUser({
        uid: userId,
        email: currData.email,
        password: TEMP_PASS
      })
        .then(user => {
          console.log("(handleUserAccountTest)Successfully created new user: " + user.uid)
        })
        .catch(error => {
          console.log("(handleUserAccountTest)Error creating new user:", error)
        })
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
      admin.auth().createUser({
        uid: userId,
        email: currData.email,
        password: TEMP_PASS
      })
        .then(user => {
          console.log("(handleUserAccountUat)Successfully created new user: " + user.uid)
        })
        .catch(error => {
          console.log("(handleUserAccountUat)Error creating new user:", error)
        })
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
      admin.auth().createUser({
        uid: userId,
        email: currData.email,
        password: TEMP_PASS
      })
        .then(user => {
          console.log("(handleUserAccountUat)Successfully created new user: " + user.uid)
        })
        .catch(error => {
          console.log("(handleUserAccountUat)Error creating new user:", error)
        })
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

exports.handleUserAccountDemo = functions.database.ref('/demo/userPublic/{userId}')
  .onWrite(event => {
    const userId = event.params.userId;
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
      admin.auth().createUser({
        uid: userId,
        email: currData.email,
        password: TEMP_PASS
      })
        .then(user => {
          console.log("(handleUserAccountUat)Successfully created new user: " + user.uid)
        })
        .catch(error => {
          console.log("(handleUserAccountUat)Error creating new user:", error)
        })
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

exports.handleUserAccountTraining = functions.database.ref('/training/userPublic/{userId}')
  .onWrite(event => {
    const userId = event.params.userId;
    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    if (!preData && currData) {
      //add user account
      console.log("user added: " + userId);
      admin.auth().createUser({
        uid: userId,
        email: currData.email,
        password: TEMP_PASS
      })
        .then(user => {
          console.log("(handleUserAccountUat)Successfully created new user: " + user.uid)
        })
        .catch(error => {
          console.log("(handleUserAccountUat)Error creating new user:", error)
        })
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

// exports.handleUserAccountD1s1 = functions.database.ref('/d1s1/userPublic/{userId}')
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
//
// exports.handleUserAccountD1s2 = functions.database.ref('/d1s2/userPublic/{userId}')
//   .onWrite(event => {
//     console.log("agency node triggered");
//     const userId = event.params.userId;
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//     if (!preData && currData) {
//       //add user account
//       console.log("user added: " + userId);
//       admin.auth().createUser({
//         uid: userId,
//         email: currData.email,
//         password: TEMP_PASS
//       })
//         .then(user => {
//           console.log("(handleUserAccountUat)Successfully created new user: " + user.uid)
//         })
//         .catch(error => {
//           console.log("(handleUserAccountUat)Error creating new user:", error)
//         })
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

// exports.handleUserAccountD2s1 = functions.database.ref('/d2s1/userPublic/{userId}')
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
//
// exports.handleUserAccountD2s2 = functions.database.ref('/d2s2/userPublic/{userId}')
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
//
// exports.handleUserAccountD3s1 = functions.database.ref('/d3s1/userPublic/{userId}')
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
//
// exports.handleUserAccountD3s2 = functions.database.ref('/d3s2/userPublic/{userId}')
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

exports.sendResponsePlanValidationEmailDemo = functions.database.ref('/demo/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('demo/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('demo/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('demo/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://demo.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

exports.sendResponsePlanValidationEmailTraining = functions.database.ref('/training/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
      admin.database().ref('training/partnerUser/' + partnerOrganisationId)
        .on('value', snapshot => {
          console.log(snapshot.val());
          if (!snapshot.val()) {
            console.log("not partner user found");
            //if not a partner user, send email to organisation email
            admin.database().ref('training/partnerOrganisation/' + partnerOrganisationId + '/email')
              .on('value', snapshot => {
                if (snapshot.val()) {
                  let email = snapshot.val();

                  let expiry = moment.utc().add(1, 'weeks').valueOf();
                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  console.log("email: " + email);

                  admin.database().ref('training/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n http://training.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
// exports.sendResponsePlanValidationEmailUat2 = functions.database.ref('/uat-2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('uat-2/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('uat-2/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('uat-2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://uat-2.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
//
// //for d1s1 response plans
// exports.sendResponsePlanValidationEmailD1s1 = functions.database.ref('/d1s1/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('d1s1/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('d1s1/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('d1s1/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://set-1.day-1.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
//
// //for d1s2 response plans
// exports.sendResponsePlanValidationEmailD1s2 = functions.database.ref('/d1s2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('d1s2/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('d1s2/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('d1s2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://set-2.day-1.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
//
// //for d2s1 response plans
// exports.sendResponsePlanValidationEmailD2s1 = functions.database.ref('/d2s1/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('d2s1/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('d2s1/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('d2s1/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://set-1.day-2.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
//
// //for d2s2 response plans
// exports.sendResponsePlanValidationEmailD2s2 = functions.database.ref('/d2s2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('d2s2/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('d2s2/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('d2s2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://set-2.day-2.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
//
// //for d3s1 response plans
// exports.sendResponsePlanValidationEmailD3s1 = functions.database.ref('/d3s1/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('d3s1/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('d3s1/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('d3s1/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://set-1.day-3.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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
//
// //for d3s2 response plans
// exports.sendResponsePlanValidationEmailD3s2 = functions.database.ref('/d3s2/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
//       admin.database().ref('d3s2/partnerUser/' + partnerOrganisationId)
//         .on('value', snapshot => {
//           console.log(snapshot.val());
//           if (!snapshot.val()) {
//             console.log("not partner user found");
//             //if not a partner user, send email to organisation email
//             admin.database().ref('d3s2/partnerOrganisation/' + partnerOrganisationId + '/email')
//               .on('value', snapshot => {
//                 if (snapshot.val()) {
//                   let email = snapshot.val();
//
//                   let expiry = moment.utc().add(1, 'weeks').valueOf();
//                   let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//                   console.log("email: " + email);
//
//                   admin.database().ref('d3s2/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
//                               \n http://set-2.day-3.training.portal.alertpreparedness.org/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
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

    admin.database().ref('sand/userPublic/' + partnerOrganisation.userId).once("value", (data) => {
      let username = data.val().firstName + " " + data.val().lastName;
      let userEmail = data.val().email;

      admin.database().ref('sand/agency/' + partnerOrganisation.agencyId).once("value", (agency) => {
        let agencyName = agency.val().name;

        admin.database().ref('sand/countryOffice/' + partnerOrganisation.agencyId + '/' + partnerOrganisation.countryId).once("value", (country) => {
          var countryName = country.val().location;
          countryName = COUNTRIES[countryName];

          if (!preData && currData) {
            console.log("Partner Organisation created");

            let partnerId = event.params['partnerId'];
            let email = partnerOrganisation.email;
            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            // console.log("email: " + email);
            admin.database().ref('sand/partnerOrganisation/' + partnerId).once("value", (org) => {

            admin.database().ref('sand/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT partner organisation" <noreply@firebase.com>',
                to: email
              };

              // \n https://uat.portal.alertpreparedness.org
              mailOptions.subject = `Welcome to ${APP_NAME}!`;
              mailOptions.text = `Hello,
                          \nYour Organisation ${org.val().organisationName} was added by ${username}, ${countryName}, ${agencyName}, as a Partner Organisation on the ALERT Platform.
                          \n Contact information: ${userEmail}
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
          });
          }
        });
      });
    });
  });

//for test
exports.sendPartnerOrganisationValidationEmailTest = functions.database.ref('/test/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    admin.database().ref('test/userPublic/' + partnerOrganisation.userId).once("value", (data) => {
      let username = data.val().firstName + " " + data.val().lastName;
      let userEmail = data.val().email;

      admin.database().ref('test/agency/' + partnerOrganisation.agencyId).once("value", (agency) => {
        let agencyName = agency.val().name;

        admin.database().ref('test/countryOffice/' + partnerOrganisation.agencyId + '/' + partnerOrganisation.countryId).once("value", (country) => {
          var countryName = country.val().location;
          countryName = COUNTRIES[countryName];

          if (!preData && currData) {
            console.log("Partner Organisation created");

            let partnerId = event.params['partnerId'];
            let email = partnerOrganisation.email;
            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            console.log("email: " + email);

            admin.database().ref('test/partnerOrganisation/' + partnerId).once("value", (org) => {

            admin.database().ref('test/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
              console.log('success validationToken');
              const mailOptions = {
                from: '"ALERT partner organisation" <noreply@firebase.com>',
                to: email
              };

              // \n https://uat.portal.alertpreparedness.org
              mailOptions.subject = `Welcome to ${APP_NAME}!`;
              mailOptions.text = `Hello,
                          \n Your Organisation ${org.val().organisationName} was added by ${username}, ${countryName}, ${agencyName}, as a Partner Organisation on the ALERT Platform.
                          \n Contact information: ${userEmail}
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
            });
          }
        });
      });
    });


  });

//for uat
exports.sendPartnerOrganisationValidationEmailUat = functions.database.ref('/uat/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    admin.database().ref('uat/userPublic/' + partnerOrganisation.userId).once("value", (data) => {
      let username = data.val().firstName + " " + data.val().lastName;
      let userEmail = data.val().email;

      admin.database().ref('uat/agency/' + partnerOrganisation.agencyId).once("value", (agency) => {
        let agencyName = agency.val().name;

        admin.database().ref('uat/countryOffice/' + partnerOrganisation.agencyId + '/' + partnerOrganisation.countryId).once("value", (country) => {
          var countryName = country.val().location;
          countryName = COUNTRIES[countryName];

          if (!preData && currData) {
            console.log("Partner Organisation created");

            let partnerId = event.params['partnerId'];
            let email = partnerOrganisation.email;
            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            console.log("email: " + email);
            admin.database().ref('uat/partnerOrganisation/' + partnerId).once("value", (org) => {

              admin.database().ref('uat/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT partner organisation" <noreply@firebase.com>',
                  to: email
                };

                // \n https://uat.portal.alertpreparedness.org
                mailOptions.subject = `Welcome to ${APP_NAME}!`;
                mailOptions.text = `Hello,
                          \n Your Organisation ${org.val().organisationName} was added by ${username}, ${countryName}, ${agencyName}, as a Partner Organisation on the ALERT Platform.
                          \n Contact information: ${userEmail}
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
            });
          }
        });
      });
    });


  });

exports.sendPartnerOrganisationValidationEmailDemo = functions.database.ref('/demo/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    admin.database().ref('demo/userPublic/' + partnerOrganisation.userId).once("value", (data) => {
      let username = data.val().firstName + " " + data.val().lastName;
      let userEmail = data.val().email;

      admin.database().ref('demo/agency/' + partnerOrganisation.agencyId).once("value", (agency) => {
        let agencyName = agency.val().name;

        admin.database().ref('demo/countryOffice/' + partnerOrganisation.agencyId + '/' + partnerOrganisation.countryId).once("value", (country) => {
          var countryName = country.val().location;
          countryName = COUNTRIES[countryName];

          if (!preData && currData) {
            console.log("Partner Organisation created");

            let partnerId = event.params['partnerId'];
            let email = partnerOrganisation.email;
            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            console.log("email: " + email);
            admin.database().ref('demo/partnerOrganisation/' + partnerId).once("value", (org) => {

              admin.database().ref('demo/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT partner organisation" <noreply@firebase.com>',
                  to: email
                };

                // \n https://uat.portal.alertpreparedness.org
                mailOptions.subject = `Welcome to ${APP_NAME}!`;
                mailOptions.text = `Hello,
                          \n Your Organisation ${org.val().organisationName} was added by ${username}, ${countryName}, ${agencyName}, as a Partner Organisation on the ALERT Platform.
                          \n Contact information: ${userEmail}
                          \n To confirm, please click on the link below
                          \n http://demo.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                          \n Thanks
                          \n Your ALERT team `;
                return mailTransport.sendMail(mailOptions).then(() => {
                  console.log('New welcome email sent to:', email);
                });
              }, error => {
                console.log(error.message);
              });
            });
          }
        });
      });
    });
  });

exports.sendPartnerOrganisationValidationEmailTraining = functions.database.ref('/training/partnerOrganisation/{partnerId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let partnerOrganisation = event.data.val();
    let isApproved = partnerOrganisation.isApproved;

    admin.database().ref('training/userPublic/' + partnerOrganisation.userId).once("value", (data) => {
      let username = data.val().firstName + " " + data.val().lastName;
      let userEmail = data.val().email;

      admin.database().ref('training/agency/' + partnerOrganisation.agencyId).once("value", (agency) => {
        let agencyName = agency.val().name;

        admin.database().ref('training/countryOffice/' + partnerOrganisation.agencyId + '/' + partnerOrganisation.countryId).once("value", (country) => {
          var countryName = country.val().location;
          countryName = COUNTRIES[countryName];

          if (!preData && currData) {
            console.log("Partner Organisation created");

            let partnerId = event.params['partnerId'];
            let email = partnerOrganisation.email;
            let expiry = moment.utc().add(1, 'weeks').valueOf();

            let validationToken = {'token': uuidv4(), 'expiry': expiry};

            console.log("email: " + email);
            admin.database().ref('training/partnerOrganisation/' + partnerId).once("value", (org) => {

              admin.database().ref('training/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT partner organisation" <noreply@firebase.com>',
                  to: email
                };

                // \n https://uat.portal.alertpreparedness.org
                mailOptions.subject = `Welcome to ${APP_NAME}!`;
                mailOptions.text = `Hello,
                          \n Your Organisation ${org.val().organisationName} was added by ${username}, ${countryName}, ${agencyName}, as a Partner Organisation on the ALERT Platform.
                          \n Contact information: ${userEmail}
                          \n To confirm, please click on the link below
                          \n http://training.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                          \n Thanks
                          \n Your ALERT team `;
                return mailTransport.sendMail(mailOptions).then(() => {
                  console.log('New welcome email sent to:', email);
                });
              }, error => {
                console.log(error.message);
              });
            });
          }
        });
      });
    });
  });

//for uat-2
// exports.sendPartnerOrganisationValidationEmailUat2 = functions.database.ref('/uat-2/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('uat-2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://uat-2.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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
// //for d1s1
// exports.sendPartnerOrganisationValidationEmailD1s1 = functions.database.ref('/d1s1/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('d1s1/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://set-1.day-1.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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
// //for d1s2
// exports.sendPartnerOrganisationValidationEmailD1s2 = functions.database.ref('/d1s2/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('d1s2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://set-2.day-1.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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
// //for d2s1
// exports.sendPartnerOrganisationValidationEmailD2s1 = functions.database.ref('/d2s1/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('d2s1/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://set-1.day-2.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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
// //for d2s2
// exports.sendPartnerOrganisationValidationEmailD2s2 = functions.database.ref('/d2s2/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('d2s2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://set-2.day-2.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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
// //for d3s1
// exports.sendPartnerOrganisationValidationEmailD3s1 = functions.database.ref('/d3s1/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('d3s1/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://set-1.day-3.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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
// //for d3s2
// exports.sendPartnerOrganisationValidationEmailD3s2 = functions.database.ref('/d3s2/partnerOrganisation/{partnerId}')
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
//       admin.database().ref('d3s2/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
//                           \n http://set-2.day-3.training.portal.alertpreparedness.org/partner-validation;token=${validationToken.token};partnerId=${partnerId}
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

exports.sendSystemAdminNotificationsEmail_Demo = functions.database.ref('/demo/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('demo/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('demo/message/' + msgId).on('value', snapshot => {
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

exports.sendSystemAdminNotificationsEmail_Training = functions.database.ref('/training/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('training/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('training/message/' + msgId).on('value', snapshot => {
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

// exports.sendSystemAdminNotificationsEmail_UAT_2 = functions.database.ref('/uat-2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('uat-2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('uat-2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendSystemAdminNotificationsEmail_D1S1 = functions.database.ref('/d1s1/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d1s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d1s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendSystemAdminNotificationsEmail_D1S2 = functions.database.ref('/d1s2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d1s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d1s2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendSystemAdminNotificationsEmail_D2S1 = functions.database.ref('/d2s1/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d2s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d2s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendSystemAdminNotificationsEmail_D2S2 = functions.database.ref('/d2s2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d2s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d2s2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendSystemAdminNotificationsEmail_D3S1 = functions.database.ref('/d3s1/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d3s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d3s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendSystemAdminNotificationsEmail_D3S2 = functions.database.ref('/d3s2/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d3s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d3s2/message/' + msgId).on('value', snapshot => {
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

exports.sendAgencyNotificationsEmail_Demo = functions.database.ref('/demo/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('demo/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('demo/message/' + msgId).on('value', snapshot => {
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

exports.sendAgencyNotificationsEmail_Training = functions.database.ref('/training/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('training/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('training/message/' + msgId).on('value', snapshot => {
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

// exports.sendAgencyNotificationsEmail_UAT_2 = functions.database.ref('/uat-2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('uat-2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('uat-2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendAgencyNotificationsEmail_D1S1 = functions.database.ref('/d1s1/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d1s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d1s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendAgencyNotificationsEmail_D1S2 = functions.database.ref('/d1s2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d1s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d1s2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendAgencyNotificationsEmail_D2S1 = functions.database.ref('/d2s1/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d2s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d2s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendAgencyNotificationsEmail_D2S2 = functions.database.ref('/d2s2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d2s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d2s2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendAgencyNotificationsEmail_D3S1 = functions.database.ref('/d3s1/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d3s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d3s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendAgencyNotificationsEmail_D3S2 = functions.database.ref('/d3s2/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d3s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d3s2/message/' + msgId).on('value', snapshot => {
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

exports.sendCountryNotificationsEmail_SAND = functions.database.ref('/sand/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
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

exports.sendCountryNotificationsEmail_Demo = functions.database.ref('/demo/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('demo/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('demo/message/' + msgId).on('value', snapshot => {
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

exports.sendCountryNotificationsEmail_Training = functions.database.ref('/training/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    let userId = event.params['userId'];
    let msgId = event.params['messageId'];

    if (!preData && currData) {
      admin.database().ref('training/userPublic/' + userId + "/email").on('value', snapshot => {

        let email = snapshot.val();

        if (email) {
          admin.database().ref('training/message/' + msgId).on('value', snapshot => {
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

// exports.sendCountryNotificationsEmail_UAT_2 = functions.database.ref('/uat-2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('uat-2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('uat-2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendCountryNotificationsEmail_D1S1 = functions.database.ref('/d1s1/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d1s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d1s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendCountryNotificationsEmail_D1S2 = functions.database.ref('/d1s2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d1s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d1s2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendCountryNotificationsEmail_D2S1 = functions.database.ref('/d2s1/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d2s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d2s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendCountryNotificationsEmail_D2S2 = functions.database.ref('/d2s2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d2s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d2s2/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendCountryNotificationsEmail_D3S1 = functions.database.ref('/d3s1/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d3s1/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d3s1/message/' + msgId).on('value', snapshot => {
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
//
// exports.sendCountryNotificationsEmail_D3S2 = functions.database.ref('/d3s2/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     let userId = event.params['userId'];
//     let msgId = event.params['messageId'];
//
//     if (!preData && currData) {
//       admin.database().ref('d3s2/userPublic/' + userId + "/email").on('value', snapshot => {
//
//         let email = snapshot.val();
//
//         if (email) {
//           admin.database().ref('d3s2/message/' + msgId).on('value', snapshot => {
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

      console.log("network id: "+networkId)
      console.log("agency id: "+agencyId)

      admin.database().ref('/sand/network/' + networkId).once("value", (data) => {

        let network = data.val();

        // if (data.val().isGlobal) {
        //   console.log('isGlobal')
          admin.database().ref('/sand/agency/' + agencyId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/sand/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

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
        // } else {
        //   console.log('isNotGlobal')
        //   admin.database().ref('/sand/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
        //     let countryOfficeCode = data.val().countryCode;
        //     if(countryOfficeCode){
        //       admin.database().ref('/sand/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
        //         let adminId = data.val();
        //         console.log("admin id: " + adminId);
        //
        //         admin.database().ref('/sand/userPublic/' + adminId).once("value", (user) => {
        //           let email = user.val().email;
        //           console.log("admin email: " + email);
        //
        //           let expiry = moment.utc().add(1, 'weeks').valueOf();
        //
        //           let validationToken = {'token': uuidv4(), 'expiry': expiry};
        //
        //           admin.database().ref('sand/networkAgencyValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
        //             console.log('success validationToken');
        //             const mailOptions = {
        //               from: '"ALERT Network" <noreply@firebase.com>',
        //               to: email
        //             };
        //
        //             mailOptions.subject = `You have been invited to join a network`;
        //             mailOptions.text = `Hello,
        //                     \nYour Agency was added into ${network.name} network!.
        //                     \n To confirm, please click on the link below
        //                     \n http://localhost:4200/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
        //                     \n Thanks
        //                     \n Your ALERT team `;
        //             console.log('we are executing code here');
        //             return mailTransport.sendMail(mailOptions).then(() => {
        //               console.log('New welcome email sent to:', email);
        //             });
        //           }, error => {
        //             console.log(error.message);
        //           });
        //         });
        //       });
        //     }else{
        //       console.log('in eelssee')
        //       admin.database().ref('/sand/agency/' + agencyId + '/adminId').once("value", (data) => {
        //         let adminId = data.val();
        //         console.log("admin id: " + adminId);
        //
        //         admin.database().ref('/sand/userPublic/' + adminId).once("value", (user) => {
        //           let email = user.val().email;
        //           console.log("admin email: " + email);
        //
        //           let expiry = moment.utc().add(1, 'weeks').valueOf();
        //
        //           let validationToken = {'token': uuidv4(), 'expiry': expiry};
        //
        //           admin.database().ref('sand/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
        //             console.log('success validationToken');
        //             const mailOptions = {
        //               from: '"ALERT Network" <noreply@firebase.com>',
        //               to: email
        //             };
        //
        //             mailOptions.subject = `You have been invited to join a network`;
        //             mailOptions.text = `Hello,
        //                     \nYour Agency was added into ${network.name} network!.
        //                     \n To confirm, please click on the link below
        //                     \n http://localhost:4200/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
        //                     \n Thanks
        //                     \n Your ALERT team `;
        //             console.log('we are executing code here');
        //             return mailTransport.sendMail(mailOptions).then(() => {
        //               console.log('New welcome email sent to:', email);
        //             });
        //           }, error => {
        //             console.log(error.message);
        //           });
        //         });
        //       });
        //     }
        //
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

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/test/network/' + networkId).once("value", (data) => {

        let network = data.val();

        if (data.val().isGlobal) {
          console.log('isGlobal')
          admin.database().ref('/test/agency/' + agencyId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/test/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

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
                          \n http://test.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
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
        } else {
          console.log('isNotGlobal')
          admin.database().ref('/test/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
            let countryOfficeCode = data.val().countryCode;
            admin.database().ref('/test/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
              let adminId = data.val();
              console.log("admin id: " + adminId);

              admin.database().ref('/test/userPublic/' + adminId).once("value", (user) => {
                let email = user.val().email;
                console.log("admin email: " + email);

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref('test/networkAgencyValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://test.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
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

          })
        }
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

        let network = data.val();

        if (data.val().isGlobal) {
          console.log('isGlobal')
          admin.database().ref('/uat/agency/' + agencyId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/uat/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

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
                          \n http://uat.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
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
        } else {
          console.log('isNotGlobal')
          admin.database().ref('/uat/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
            let countryOfficeCode = data.val().countryCode;
            admin.database().ref('/uat/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
              let adminId = data.val();
              console.log("admin id: " + adminId);

              admin.database().ref('/uat/userPublic/' + adminId).once("value", (user) => {
                let email = user.val().email;
                console.log("admin email: " + email);

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref('uat/networkAgencyValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://uat.portal.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
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

          })
        }
      })
    }
  });

exports.sendNetworkAgencyValidationEmail_Demo = functions.database.ref('/demo/network/{networkId}/agencies/{agencyId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/demo/network/' + networkId).once("value", (data) => {

        let network = data.val();

        if (data.val().isGlobal) {
          console.log('isGlobal')
          admin.database().ref('/demo/agency/' + agencyId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/demo/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('demo/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://demo.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
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
        } else {
          console.log('isNotGlobal')
          admin.database().ref('/demo/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
            let countryOfficeCode = data.val().countryCode;
            admin.database().ref('/demo/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
              let adminId = data.val();
              console.log("admin id: " + adminId);

              admin.database().ref('/demo/userPublic/' + adminId).once("value", (user) => {
                let email = user.val().email;
                console.log("admin email: " + email);

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref('demo/networkAgencyValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://demo.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
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

          })
        }
      })
    }
  });

exports.sendNetworkAgencyValidationEmail_Training = functions.database.ref('/training/network/{networkId}/agencies/{agencyId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("Network agency added");

      let networkId = event.params['networkId'];
      let agencyId = event.params['agencyId'];

      admin.database().ref('/training/network/' + networkId).once("value", (data) => {

        let network = data.val();

        if (data.val().isGlobal) {
          console.log('isGlobal')
          admin.database().ref('/training/agency/' + agencyId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/training/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('training/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://training.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
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
        } else {
          console.log('isNotGlobal')
          admin.database().ref('/training/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
            let countryOfficeCode = data.val().countryCode;
            admin.database().ref('/training/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
              let adminId = data.val();
              console.log("admin id: " + adminId);

              admin.database().ref('/training/userPublic/' + adminId).once("value", (user) => {
                let email = user.val().email;
                console.log("admin email: " + email);

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref('training/networkAgencyValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://training.alertpreparedness.org/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
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

          })
        }
      })
    }
  });

/***********************************************************************************************************************/

/***********************************************************************************************************************/
//Bug Reporting
//for sand

exports.sendBugReportingEmailSand = functions.database.ref('/sand/bugReporting/{countryId}/{bugId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    console.log(currData)

    let eParams = event.params;
    // Set variables to parameters of the data returned, ready to construct for the email
    let countryId = eParams['countryId'];
    let bugId = eParams['bugId'];

    console.log("countyId: " + countryId);

    const mailOptions = {
      from: '"ALERT Network" <noreply@firebase.com>',
      to: 'ryan@rolleragency.co.uk'
    };
    mailOptions.subject = `ALERT Platform: A problem has been reported`;
    mailOptions.html = `Hello,
                          <br>
                          <br> A problem was reported at ${currData.date}
                          <br>  
                          <br> Description: <br>
                          ${currData.description}
                          <br> <br>        
                          <a href="${currData.downloadLink}"> Click for image </a>                                          
                          <br> <br>                         
                          User details: <br>
                          ${currData.firstName} ${currData.lastName}, ${currData.country}, ${currData.agencyName}, ${currData.email}
                          <br>
                          <br>
                          System Information: <br>
                          ${currData.systemInfo}
                          `;

    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New bug reporting email:');
    });

    // admin.database().ref("/sand/bugReporting/" + countryId + '/' + bugId)
    //   .once("value", data => {
    //     let userDb = data.val();
    //     console.log(userDb, ' : loggin userDb');
    //     const mailOptions = {
    //       from: '"ALERT Network" <noreply@firebase.com>',
    //       to: 'dan@rolleragency.co.uk'
    //     };
    //     mailOptions.subject = `ALERT Platform: A problem has been reported`;
    //     mailOptions.text = `Hello,
    //                       \n
    //                       \n A problem was reported at ${date}
    //                       \n
    //                       \n Description: \n
    //                       ${description}
    //                       \n
    //                       ${downloadURL}
    //                       \n
    //                       \n
    //                       User details: \n
    //                       ${firstName} ${lastName}, ${country}, ${agencyName} \n
    //                       ${email}
    //                       \n
    //                       \n
    //                       System Information: \n
    //                       ${systemInfo}
    //                       `;
    //     return mailTransport.sendMail(mailOptions).then(() => {
    //       console.log('New welcome email sent to:', email);
    //     });
    //   }, error => {
    //     console.log(error.message);
    //   });

  })

/***********************************************************************************************************************/

// For TEST
exports.sendBugReportingEmailTest = functions.database.ref('/test/bugReporting/{countryId}/{bugId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    console.log(currData)

    let eParams = event.params;
    // Set variables to parameters of the data returned, ready to construct for the email
    let countryId = eParams['countryId'];
    let bugId = eParams['bugId'];

    console.log("countyId: " + countryId);

    const mailOptions = {
      from: '"ALERT Network" <noreply@firebase.com>',
      to: 'ryan@rolleragency.co.uk'
    };
    mailOptions.subject = `ALERT Platform: A problem has been reported`;
    mailOptions.html = `Hello,
                        <br>
                        <br> A problem was reported at ${currData.date}
                        <br>  
                        <br> Description: <br>
                        ${currData.description}
                        <br> <br>        
                        <a href="${currData.downloadLink}"> Click for image </a>                                          
                        <br> <br>                         
                        User details: <br>
                        ${currData.firstName} ${currData.lastName}, ${currData.country}, ${currData.agencyName}, ${currData.email}
                        <br>
                        <br>
                        System Information: <br>
                        ${currData.systemInfo}
                        `;

    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New bug reporting email:');
    });

    // admin.database().ref("/sand/bugReporting/" + countryId + '/' + bugId)
    //   .once("value", data => {
    //     let userDb = data.val();
    //     console.log(userDb, ' : loggin userDb');
    //     const mailOptions = {
    //       from: '"ALERT Network" <noreply@firebase.com>',
    //       to: 'dan@rolleragency.co.uk'
    //     };
    //     mailOptions.subject = `ALERT Platform: A problem has been reported`;
    //     mailOptions.text = `Hello,
    //                       \n
    //                       \n A problem was reported at ${date}
    //                       \n
    //                       \n Description: \n
    //                       ${description}
    //                       \n
    //                       ${downloadURL}
    //                       \n
    //                       \n
    //                       User details: \n
    //                       ${firstName} ${lastName}, ${country}, ${agencyName} \n
    //                       ${email}
    //                       \n
    //                       \n
    //                       System Information: \n
    //                       ${systemInfo}
    //                       `;
    //     return mailTransport.sendMail(mailOptions).then(() => {
    //       console.log('New welcome email sent to:', email);
    //     });
    //   }, error => {
    //     console.log(error.message);
    //   });

  })

// For UAT
exports.sendBugReportingEmailUAT = functions.database.ref('/uat/bugReporting/{countryId}/{bugId}')
.onWrite(event => {

  const preData = event.data.previous.val();
  const currData = event.data.current.val();

  console.log(currData)

  let eParams = event.params;
  // Set variables to parameters of the data returned, ready to construct for the email
  let countryId = eParams['countryId'];
  let bugId = eParams['bugId'];

  console.log("countyId: " + countryId);

  const mailOptions = {
    from: '"ALERT Network" <noreply@firebase.com>',
    to: 'luis.vidal@helpage.org'
  };
  mailOptions.subject = `ALERT Platform: A problem has been reported`;
  mailOptions.html = `Hello,
                        <br>
                        <br> A problem was reported at ${currData.date}
                        <br>  
                        <br> Description: <br>
                        ${currData.description}
                        <br> <br>        
                        <a href="${currData.downloadLink}"> Click for image </a>                                          
                        <br> <br>                         
                        User details: <br>
                        ${currData.firstName} ${currData.lastName}, ${currData.country}, ${currData.agencyName}, ${currData.email}
                        <br>
                        <br>
                        System Information: <br>
                        ${currData.systemInfo}
                        `;

  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New bug reporting email:');
  });

  // admin.database().ref("/sand/bugReporting/" + countryId + '/' + bugId)
  //   .once("value", data => {
  //     let userDb = data.val();
  //     console.log(userDb, ' : loggin userDb');
  //     const mailOptions = {
  //       from: '"ALERT Network" <noreply@firebase.com>',
  //       to: 'dan@rolleragency.co.uk'
  //     };
  //     mailOptions.subject = `ALERT Platform: A problem has been reported`;
  //     mailOptions.text = `Hello,
  //                       \n
  //                       \n A problem was reported at ${date}
  //                       \n
  //                       \n Description: \n
  //                       ${description}
  //                       \n
  //                       ${downloadURL}
  //                       \n
  //                       \n
  //                       User details: \n
  //                       ${firstName} ${lastName}, ${country}, ${agencyName} \n
  //                       ${email}
  //                       \n
  //                       \n
  //                       System Information: \n
  //                       ${systemInfo}
  //                       `;
  //     return mailTransport.sendMail(mailOptions).then(() => {
  //       console.log('New welcome email sent to:', email);
  //     });
  //   }, error => {
  //     console.log(error.message);
  //   });

})

exports.sendBugReportingEmailDemo = functions.database.ref('/demo/bugReporting/{countryId}/{bugId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    console.log(currData)

    let eParams = event.params;
    // Set variables to parameters of the data returned, ready to construct for the email
    let countryId = eParams['countryId'];
    let bugId = eParams['bugId'];

    console.log("countyId: " + countryId);

    const mailOptions = {
      from: '"ALERT Network" <noreply@firebase.com>',
      to: 'luis.vidal@helpage.org'
    };
    mailOptions.subject = `ALERT Platform: A problem has been reported`;
    mailOptions.html = `Hello,
                        <br>
                        <br> A problem was reported at ${currData.date}
                        <br>  
                        <br> Description: <br>
                        ${currData.description}
                        <br> <br>        
                        <a href="${currData.downloadLink}"> Click for image </a>                                          
                        <br> <br>                         
                        User details: <br>
                        ${currData.firstName} ${currData.lastName}, ${currData.country}, ${currData.agencyName}, ${currData.email}
                        <br>
                        <br>
                        System Information: <br>
                        ${currData.systemInfo}
                        `;

    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New bug reporting email:');
    });

    // admin.database().ref("/sand/bugReporting/" + countryId + '/' + bugId)
    //   .once("value", data => {
    //     let userDb = data.val();
    //     console.log(userDb, ' : loggin userDb');
    //     const mailOptions = {
    //       from: '"ALERT Network" <noreply@firebase.com>',
    //       to: 'dan@rolleragency.co.uk'
    //     };
    //     mailOptions.subject = `ALERT Platform: A problem has been reported`;
    //     mailOptions.text = `Hello,
    //                       \n
    //                       \n A problem was reported at ${date}
    //                       \n
    //                       \n Description: \n
    //                       ${description}
    //                       \n
    //                       ${downloadURL}
    //                       \n
    //                       \n
    //                       User details: \n
    //                       ${firstName} ${lastName}, ${country}, ${agencyName} \n
    //                       ${email}
    //                       \n
    //                       \n
    //                       System Information: \n
    //                       ${systemInfo}
    //                       `;
    //     return mailTransport.sendMail(mailOptions).then(() => {
    //       console.log('New welcome email sent to:', email);
    //     });
    //   }, error => {
    //     console.log(error.message);
    //   });

  })

exports.sendBugReportingEmailTraining = functions.database.ref('/training/bugReporting/{countryId}/{bugId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    console.log(currData)

    let eParams = event.params;
    // Set variables to parameters of the data returned, ready to construct for the email
    let countryId = eParams['countryId'];
    let bugId = eParams['bugId'];

    console.log("countyId: " + countryId);

    const mailOptions = {
      from: '"ALERT Network" <noreply@firebase.com>',
      to: 'luis.vidal@helpage.org'
    };
    mailOptions.subject = `ALERT Platform: A problem has been reported`;
    mailOptions.html = `Hello,
                        <br>
                        <br> A problem was reported at ${currData.date}
                        <br>  
                        <br> Description: <br>
                        ${currData.description}
                        <br> <br>        
                        <a href="${currData.downloadLink}"> Click for image </a>                                          
                        <br> <br>                         
                        User details: <br>
                        ${currData.firstName} ${currData.lastName}, ${currData.country}, ${currData.agencyName}, ${currData.email}
                        <br>
                        <br>
                        System Information: <br>
                        ${currData.systemInfo}
                        `;

    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New bug reporting email:');
    });

    // admin.database().ref("/sand/bugReporting/" + countryId + '/' + bugId)
    //   .once("value", data => {
    //     let userDb = data.val();
    //     console.log(userDb, ' : loggin userDb');
    //     const mailOptions = {
    //       from: '"ALERT Network" <noreply@firebase.com>',
    //       to: 'dan@rolleragency.co.uk'
    //     };
    //     mailOptions.subject = `ALERT Platform: A problem has been reported`;
    //     mailOptions.text = `Hello,
    //                       \n
    //                       \n A problem was reported at ${date}
    //                       \n
    //                       \n Description: \n
    //                       ${description}
    //                       \n
    //                       ${downloadURL}
    //                       \n
    //                       \n
    //                       User details: \n
    //                       ${firstName} ${lastName}, ${country}, ${agencyName} \n
    //                       ${email}
    //                       \n
    //                       \n
    //                       System Information: \n
    //                       ${systemInfo}
    //                       `;
    //     return mailTransport.sendMail(mailOptions).then(() => {
    //       console.log('New welcome email sent to:', email);
    //     });
    //   }, error => {
    //     console.log(error.message);
    //   });

  })

/*

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

          if (!userDb) {
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
          }
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

// exports.createUserNetworkCountry_UAT_2 = functions.database.ref('/uat-2/administratorNetworkCountry/{adminId}')
//   .onWrite(event => {
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (!preData && currData) {
//       console.log("network country admin added");
//       let adminId = event.params['adminId'];
//       console.log("admin id: " + adminId);
//       admin.database().ref("/uat-2/userPublic/" + adminId)
//         .once("value", data => {
//           let userDb = data.val();
//           console.log(userDb);
//
//           admin.auth().createUser({
//             uid: adminId,
//             email: userDb.email,
//             password: TEMP_PASS
//           })
//             .then(user => {
//               console.log("Successfully created new user: " + user.uid)
//             })
//             .catch(error => {
//               console.log("Error creating new user:", error)
//             })
//
//         });
//     }
//   });
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

exports.updateUserEmail_Demo = functions.database.ref('/demo/userPublic/{uid}/email')
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

exports.updateUserEmail_Training = functions.database.ref('/training/userPublic/{uid}/email')
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

// exports.updateUserEmail_UAT_2 = functions.database.ref('/uat-2/userPublic/{uid}/email')
//   .onWrite(event => {
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (preData && currData && preData !== currData) {
//       console.log("email updated");
//       let uid = event.params['uid'];
//       console.log("user id email updated: " + uid);
//       admin.auth().updateUser(uid, {
//         email: currData
//       })
//         .then(function (userRecord) {
//           // See the UserRecord reference doc for the contents of userRecord.
//           console.log("Successfully updated user", userRecord.toJSON());
//         })
//         .catch(function (error) {
//           console.log("Error updating user:", error);
//         });
//     }
//   });
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

      if (agencyId !== countryId) {
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
      } else {
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

              admin.database().ref('sand/networkCountryValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://localhost:4200/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}
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

      if (agencyId !== countryId) {
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
      } else {
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

              admin.database().ref('test/networkCountryValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://test.portal.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}
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

      if (agencyId !== countryId) {
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
      } else {
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

              admin.database().ref('uat/networkCountryValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://uat.portal.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}
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
    }
  });

exports.sendNetworkCountryAgencyValidationEmail_Demo = functions.database.ref('/demo/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country office agency country added");

      let networkId = event.params['networkId'];
      let networkCountryId = event.params['networkCountryId'];
      let agencyId = event.params['agencyId'];
      let countryId = event.params['countryId'];

      if (agencyId !== countryId) {
        admin.database().ref('/demo/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/demo/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/demo/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('demo/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://demo.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
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
      } else {
        admin.database().ref('/demo/agency/' + agencyId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/demo/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/demo/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('demo/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://demo.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}
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
    }
  });

exports.sendNetworkCountryAgencyValidationEmail_Training = functions.database.ref('/training/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (!preData && currData) {
      console.log("network country office agency country added");

      let networkId = event.params['networkId'];
      let networkCountryId = event.params['networkCountryId'];
      let agencyId = event.params['agencyId'];
      let countryId = event.params['countryId'];

      if (agencyId !== countryId) {
        admin.database().ref('/training/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/training/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/training/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('training/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://training.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
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
      } else {
        admin.database().ref('/training/countryOffice/' + agencyId + '/adminId').once("value", (data) => {
          let adminId = data.val();
          console.log("admin id: " + adminId);

          admin.database().ref('/training/userPublic/' + adminId).once("value", (user) => {
            let email = user.val().email;
            console.log("admin email: " + email);

            admin.database().ref('/training/network/' + networkId).once("value", networkSnap => {
              let network = networkSnap.val();

              let expiry = moment.utc().add(1, 'weeks').valueOf();

              let validationToken = {'token': uuidv4(), 'expiry': expiry};

              admin.database().ref('training/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
                console.log('success validationToken');
                const mailOptions = {
                  from: '"ALERT Network" <noreply@firebase.com>',
                  to: email
                };

                mailOptions.subject = `You have been invited to join a network`;
                mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n http://training.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}
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
    }
  });

// exports.sendNetworkCountryAgencyValidationEmail_UAT_2 = functions.database.ref('/uat-2/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
//   .onWrite(event => {
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (!preData && currData) {
//       console.log("network country office agency country added");
//
//       let networkId = event.params['networkId'];
//       let networkCountryId = event.params['networkCountryId'];
//       let agencyId = event.params['agencyId'];
//       let countryId = event.params['countryId'];
//
//       admin.database().ref('/uat-2/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
//         let adminId = data.val();
//         console.log("admin id: " + adminId);
//
//         admin.database().ref('/uat-2/userPublic/' + adminId).once("value", (user) => {
//           let email = user.val().email;
//           console.log("admin email: " + email);
//
//           admin.database().ref('/uat-2/network/' + networkId).once("value", networkSnap => {
//             let network = networkSnap.val();
//
//             let expiry = moment.utc().add(1, 'weeks').valueOf();
//
//             let validationToken = {'token': uuidv4(), 'expiry': expiry};
//
//             admin.database().ref('uat-2/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
//               console.log('success validationToken');
//               const mailOptions = {
//                 from: '"ALERT Network" <noreply@firebase.com>',
//                 to: email
//               };
//
//               mailOptions.subject = `You have been invited to join a network`;
//               mailOptions.text = `Hello,
//                           \nYour Agency was added into ${network.name} network!.
//                           \n To confirm, please click on the link below
//                           \n http://uat-2.portal.alertpreparedness.org/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
//                           \n Thanks
//                           \n Your ALERT team `;
//               return mailTransport.sendMail(mailOptions).then(() => {
//                 console.log('New welcome email sent to:', email);
//               });
//             }, error => {
//               console.log(error.message);
//             });
//
//           });
//
//         });
//       });
//     }
//   });
/***********************************************************************************************************************/

/********************************************SEND EMAIL TO EXTERNAL RECIPIENTS*****************************************************************/
// exports.sendEmailToExternalForAlertChange_SAND = functions.database.ref('/sand/alert/{countryId}/{alertId}/alertLevel')
//   .onWrite(event => {
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (preData !== currData) {
//
//       let alertId = event.params['alertId'];
//       let countryId = event.params['countryId'];
//
//       admin.database().ref('/sand/alert/' + countryId + '/' + alertId).once("value", (data) => {
//         let alert = data.val();
//         console.log(alert);
//         if (alert.hazardScenario !== -1) {
//           admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
//             console.log("external recipient: ")
//             console.log(data.val())
//             let exObj = data.val();
//             if (exObj) {
//               let recipients = Object.keys(exObj).map(key => {
//                 return exObj[key]
//               })
//               for (let i = 0, len = recipients.length; i < len; i++) {
//                 if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
//                   console.log("alert change!")
//                   console.log("email need to send to: " + recipients[i].email)
//                   let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
//                   let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
//                   sendEmail(recipients[i].email, title, content)
//                 } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
//                   console.log("red alert request")
//                   console.log("email need to send to: " + recipients[i].email)
//                   let title = `Red alert for ${HAZARDS[alert.hazardScenario]} has been requested`
//                   let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has requested RED level update`
//                   sendEmail(recipients[i].email, title, content)
//                 } else {
//                   console.log("ERROR, please check!")
//                 }
//               }
//             }
//           })
//         } else {
//           admin.database().ref('/sand/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
//             let otherHazardName = data.val()
//             admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
//               let exObj = data.val();
//               if (exObj) {
//                 let recipients = Object.keys(exObj).map(key => {
//                   return exObj[key]
//                 })
//                 for (let i = 0, len = recipients.length; i < len; i++) {
//                   if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
//                     console.log("alert change!")
//                     console.log("email need to send to: " + recipients[i].email)
//                     let title = `The alert level for ${otherHazardName} has been updated`
//                     let content = `The following alert: ${otherHazardName} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`
//                     sendEmail(recipients[i].email, title, content)
//                   } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
//                     console.log("red alert request")
//                     console.log("email need to send to: " + recipients[i].email)
//                     let title = `Red alert for ${otherHazardName} has been requested`
//                     let content = `The following alert: ${otherHazardName} has requested RED level update`
//                     sendEmail(recipients[i].email, title, content)
//                   } else {
//                     console.log("ERROR, please check!")
//                   }
//                 }
//               }
//             })
//           })
//         }
//       })
//     } else {
//       console.log("error!!")
//     }
//   })
//
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

exports.sendEmailToExternalForAlertChange_Demo = functions.database.ref('/demo/alert/{countryId}/{alertId}/alertLevel')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData !== currData) {

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/demo/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          admin.database().ref('/demo/externalRecipient/' + countryId).once('value', (data) => {
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
          admin.database().ref('/demo/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/demo/externalRecipient/' + countryId).once('value', (data) => {
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

exports.sendEmailToExternalForAlertChange_Training = functions.database.ref('/training/alert/{countryId}/{alertId}/alertLevel')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData !== currData) {

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/training/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          admin.database().ref('/training/externalRecipient/' + countryId).once('value', (data) => {
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
          admin.database().ref('/training/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/training/externalRecipient/' + countryId).once('value', (data) => {
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

// exports.sendEmailToExternalForAlertChangeRed_SAND = functions.database.ref('/sand/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
//   .onWrite(event => {
//
//     const currData = event.data.current.val();
//
//     if (currData === APPROVED) {
//       console.log("red alert approved");
//
//       let alertId = event.params['alertId'];
//       let countryId = event.params['countryId'];
//
//       admin.database().ref('/sand/alert/' + countryId + '/' + alertId).once("value", (data) => {
//         let alert = data.val();
//         console.log(alert);
//         if (alert.hazardScenario !== -1) {
//           let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
//           let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
//           admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
//             console.log("external recipient: ")
//             console.log(data.val())
//             let exObj = data.val();
//             if (exObj) {
//               let recipients = Object.keys(exObj).map(key => {
//                 return exObj[key]
//               })
//               for (let i = 0, len = recipients.length; i < len; i++) {
//                 if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
//                   console.log("alert change!")
//                   console.log("email need to send to: " + recipients[i].email)
//                   sendEmail(recipients[i].email, title, content)
//                 } else {
//                   console.log("ERROR, please check!")
//                 }
//               }
//             }
//           })
//         } else {
//           admin.database().ref('/sand/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
//             let otherHazardName = data.val()
//             admin.database().ref('/sand/externalRecipient/' + countryId).once('value', (data) => {
//               console.log("external recipient: ")
//               console.log(data.val())
//               let exObj = data.val();
//               if (exObj) {
//                 let recipients = Object.keys(exObj).map(key => {
//                   return exObj[key]
//                 })
//                 for (let i = 0, len = recipients.length; i < len; i++) {
//                   if (recipients[i].notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === APPROVED))) {
//                     console.log("alert change!")
//                     console.log("email need to send to: " + recipients[i].email)
//                     let title = `The alert level for ${otherHazardName} has been updated`
//                     let content = `The following alert: ${otherHazardName} has had its level updated to RED ALERT`
//                     sendEmail(recipients[i].email, title, content)
//                   } else {
//                     console.log("ERROR, please check!")
//                   }
//                 }
//               }
//             })
//           })
//         }
//       })
//     } else {
//       console.log("error!!")
//     }
//   })
//
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
  });

exports.sendEmailToExternalForAlertChangeRed_Demo = functions.database.ref('/demo/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
  .onWrite(event => {

    const currData = event.data.current.val();

    if (currData === APPROVED) {
      console.log("red alert approved");

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/demo/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
          let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
          admin.database().ref('/demo/externalRecipient/' + countryId).once('value', (data) => {
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
          admin.database().ref('/demo/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/demo/externalRecipient/' + countryId).once('value', (data) => {
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
  });

exports.sendEmailToExternalForAlertChangeRed_Training = functions.database.ref('/training/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
  .onWrite(event => {

    const currData = event.data.current.val();

    if (currData === APPROVED) {
      console.log("red alert approved");

      let alertId = event.params['alertId'];
      let countryId = event.params['countryId'];

      admin.database().ref('/training/alert/' + countryId + '/' + alertId).once("value", (data) => {
        let alert = data.val();
        console.log(alert);
        if (alert.hazardScenario !== -1) {
          let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
          let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
          admin.database().ref('/training/externalRecipient/' + countryId).once('value', (data) => {
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
          admin.database().ref('/training/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
            let otherHazardName = data.val()
            admin.database().ref('/training/externalRecipient/' + countryId).once('value', (data) => {
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
  });

exports.sendEmailToExternalForIndicatorUpdate_SAND = functions.database.ref('/sand/indicator/{hazardId}/{indicatorId}/triggerSelected')
  .onWrite(event => {
    console.log("indicator update notification gets called!!!");

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData !== preData) {
      console.log("indicator updated");

      let hazardId = event.params['hazardId'];
      let indicatorId = event.params['indicatorId'];

      admin.database().ref('/sand/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
        let indicator = data.val();
        console.log(indicator)
        if (indicator.hazardScenario['key'] === 'countryContext') {
          console.log("send email to state indicator for country context was updated")
          let title = `The indicator ${indicator.name} for Country Context has been updated`
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`
          fetchUsersAndSendEmail('sand', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
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
              fetchUsersAndSendEmail('sand', countryId, title, content, 0, indicator.assignee)
            } else {
              admin.database().ref('/sand/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('sand', countryId, title, content, UPDATE_HAZARD, indicator.assignee)
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
          fetchUsersAndSendEmail('test', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
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
              fetchUsersAndSendEmail('test', countryId, title, content, 0, indicator.assignee)
            } else {
              admin.database().ref('/test/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('test', countryId, title, content, UPDATE_HAZARD, indicator.assignee)
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
          fetchUsersAndSendEmail('uat', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
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
              fetchUsersAndSendEmail('uat', countryId, title, content, 0, indicator.assignee)
            } else {
              admin.database().ref('/uat/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('uat', countryId, title, content, UPDATE_HAZARD, indicator.assignee)
              })
            }
          })
        }
      })
    }
  })

exports.sendEmailToExternalForIndicatorUpdate_Demo = functions.database.ref('/demo/indicator/{hazardId}/{indicatorId}/triggerSelected')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData !== preData) {
      console.log("indicator updated");

      let hazardId = event.params['hazardId'];
      let indicatorId = event.params['indicatorId'];

      admin.database().ref('/demo/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
        let indicator = data.val();
        if (indicator.hazardScenario['key'] === 'countryContext') {
          console.log("send email to state indicator for country context was updated")
          let title = `The indicator ${indicator.name} for Country Context has been updated`
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`
          fetchUsersAndSendEmail('demo', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
        } else {
          console.log("fetch country id for hazard")
          admin.database().ref('/demo/hazard').once("value", (data) => {
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
              fetchUsersAndSendEmail('demo', countryId, title, content, 0, indicator.assignee)
            } else {
              admin.database().ref('/demo/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('demo', countryId, title, content, UPDATE_HAZARD, indicator.assignee)
              })
            }
          })
        }
      })
    }
  })

exports.sendEmailToExternalForIndicatorUpdate_Training = functions.database.ref('/training/indicator/{hazardId}/{indicatorId}/triggerSelected')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && currData !== preData) {
      console.log("indicator updated");

      let hazardId = event.params['hazardId'];
      let indicatorId = event.params['indicatorId'];

      admin.database().ref('/training/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
        let indicator = data.val();
        if (indicator.hazardScenario['key'] === 'countryContext') {
          console.log("send email to state indicator for country context was updated")
          let title = `The indicator ${indicator.name} for Country Context has been updated`
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`
          fetchUsersAndSendEmail('training', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
        } else {
          console.log("fetch country id for hazard")
          admin.database().ref('/training/hazard').once("value", (data) => {
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
              fetchUsersAndSendEmail('training', countryId, title, content, 0, indicator.assignee)
            } else {
              admin.database().ref('/training/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
                let otherHazardName = data.val()
                let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`
                let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`
                fetchUsersAndSendEmail('training', countryId, title, content, UPDATE_HAZARD, indicator.assignee)
              })
            }
          })
        }
      })
    }
  })

// exports.sendEmailToExternalForPlanExpired_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/isActive')
//   .onWrite(event => {
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (preData && !currData) {
//
//       let countryId = event.params['countryId'];
//       let planId = event.params['planId'];
//
//       console.log("response plan was expired")
//       admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
//         let plan = data.val()
//         console.log(plan)
//         let title = `Plan ${plan.name} was expired`
//         let content = `The following plan: ${plan.name} was expired.`
//         fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_EXPIRED);
//       })
//     }
//   })
//
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

exports.sendEmailToExternalForPlanExpired_Demo = functions.database.ref('/demo/responsePlan/{countryId}/{planId}/isActive')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && !currData) {

      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      console.log("response plan was expired")
      admin.database().ref('/demo/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        console.log(plan)
        let title = `Plan ${plan.name} was expired`
        let content = `The following plan: ${plan.name} was expired.`
        fetchUsersAndSendEmail('demo', countryId, title, content, PLAN_EXPIRED);
      })
    }
  })

exports.sendEmailToExternalForPlanExpired_Training = functions.database.ref('/training/responsePlan/{countryId}/{planId}/isActive')
  .onWrite(event => {
    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (preData && !currData) {

      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      console.log("response plan was expired")
      admin.database().ref('/training/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        console.log(plan)
        let title = `Plan ${plan.name} was expired`
        let content = `The following plan: ${plan.name} was expired.`
        fetchUsersAndSendEmail('training', countryId, title, content, PLAN_EXPIRED);
      })
    }
  })

// exports.sendEmailPlanRejectedByCountryDirector_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//     console.log(currData)
//
//     if (currData === PLAN_NEEDREVIEWING) {
//       console.log("plan rejected by country director")
//       let countryId = event.params['countryId'];
//       let planId = event.params['planId'];
//
//       admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
//         let plan = data.val()
//         let title = `Response plan was rejected`
//         let content = `The following response plan:${plan.name}, was rejected by country director.`
//         fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_REJECTED)
//       })
//     }
//   })
//
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

exports.sendEmailPlanRejectedByCountryDirector_Demo = functions.database.ref('/demo/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log(currData)

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by country director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/demo/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by country director.`
        fetchUsersAndSendEmail('demo', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByCountryDirector_Training = functions.database.ref('/training/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();
    console.log(currData)

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by country director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/training/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by country director.`
        fetchUsersAndSendEmail('training', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

// exports.sendEmailPlanRejectedByRegionDirector_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (currData === PLAN_NEEDREVIEWING) {
//       console.log("plan rejected by region director")
//       let countryId = event.params['countryId'];
//       let planId = event.params['planId'];
//
//       admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
//         let plan = data.val()
//         let title = `Response plan was rejected`
//         let content = `The following response plan:${plan.name}, was rejected by region director.`
//         fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_REJECTED)
//       })
//     }
//   })
//
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

exports.sendEmailPlanRejectedByRegionDirector_Demo = functions.database.ref('/demo/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by region director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/demo/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by region director.`
        fetchUsersAndSendEmail('demo', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

exports.sendEmailPlanRejectedByRegionDirector_Training = functions.database.ref('/training/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by region director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/training/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by region director.`
        fetchUsersAndSendEmail('training', countryId, title, content, PLAN_REJECTED)
      })
    }
  })

// exports.sendEmailPlanRejectedByGlobalDirector_SAND = functions.database.ref('/sand/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
//   .onWrite(event => {
//
//     const preData = event.data.previous.val();
//     const currData = event.data.current.val();
//
//     if (currData === PLAN_NEEDREVIEWING) {
//       console.log("plan rejected by global director")
//       let countryId = event.params['countryId'];
//       let planId = event.params['planId'];
//
//       admin.database().ref('/sand/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
//         let plan = data.val()
//         let title = `Response plan was rejected`
//         let content = `The following response plan:${plan.name}, was rejected by global director.`
//         fetchUsersAndSendEmail('sand', countryId, title, content, PLAN_REJECTED)
//       })
//     }
//   })
//
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
  });

exports.sendEmailPlanRejectedByGlobalDirector_Demo = functions.database.ref('/demo/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by global director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/demo/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by global director.`
        fetchUsersAndSendEmail('demo', countryId, title, content, PLAN_REJECTED)
      })
    }
  });

exports.sendEmailPlanRejectedByGlobalDirector_Training = functions.database.ref('/training/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
  .onWrite(event => {

    const preData = event.data.previous.val();
    const currData = event.data.current.val();

    if (currData === PLAN_NEEDREVIEWING) {
      console.log("plan rejected by global director")
      let countryId = event.params['countryId'];
      let planId = event.params['planId'];

      admin.database().ref('/training/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
        let plan = data.val()
        let title = `Response plan was rejected`
        let content = `The following response plan:${plan.name}, was rejected by global director.`
        fetchUsersAndSendEmail('training', countryId, title, content, PLAN_REJECTED)
      })
    }
  });

exports.updateLatestCoCAllUsers_SAND = functions.database.ref('/sand/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('sand/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('sand/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_SAND = functions.database.ref('/sand/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('sand/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('sand/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_TEST = functions.database.ref('/test/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('test/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('test/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_TEST = functions.database.ref('/test/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('test/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('test/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_UAT = functions.database.ref('/uat/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('uat/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('uat/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_UAT = functions.database.ref('/uat/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('uat/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('uat/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_Demo = functions.database.ref('/demo/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('demo/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('demo/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_Demo = functions.database.ref('/demo/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('demo/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('demo/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_Training = functions.database.ref('/training/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('training/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('training/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_Training = functions.database.ref('/training/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('training/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('training/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_UAT_2 = functions.database.ref('/uat-2/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('uat-2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('uat-2/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_UAT_2 = functions.database.ref('/uat-2/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('uat-2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('uat-2/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_D1S1 = functions.database.ref('/d1s1/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d1s1/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d1s1/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_D1S1 = functions.database.ref('/d1s1/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d1s1/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d1s1/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_D1S2 = functions.database.ref('/d1s2/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d1s2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d1s2/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_D1S2 = functions.database.ref('/d1s2/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d1s2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d1s2/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_D2S1 = functions.database.ref('/d2s1/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d2s1/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d2s1/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_D2S1 = functions.database.ref('/d2s1/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d2s1/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d2s1/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_D2S2 = functions.database.ref('/d2s2/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d2s2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d2s2/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_D2S2 = functions.database.ref('/d2s2/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d2s2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d2s2/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_D3S1 = functions.database.ref('/d3s1/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d3s1/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d3s1/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_D3S1 = functions.database.ref('/d3s1/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d3s1/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d3s1/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestCoCAllUsers_D3S2 = functions.database.ref('/d3s2/system/{systemId}/coc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d3s2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d3s2/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
              //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

exports.updateLatestToCAllUsers_D3S2 = functions.database.ref('/d3s2/system/{systemId}/toc')
  .onWrite(event => {
    const currData = event.data.current.val();
    if (currData) {
      admin.database().ref('d3s2/userPublic/').once('value', (data) => {
        let usersJson = data.val();
        if(usersJson) {
          let userIds = Object.keys(usersJson);
          //console.log(userIds);
          userIds.forEach(userId => {
            admin.database().ref('d3s2/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
              //console.log("latestToCAgreed is set to false for user with id: "+ userId);
            });
          });
        }
      }, error => {
        console.log(error.message);
      })
    }
    return true;
  });

// exports.updateLatestCoCAllUsers_LIVE = functions.database.ref('/live/system/{systemId}/coc')
//   .onWrite(event => {
//     const currData = event.data.current.val();
//     if (currData) {
//       admin.database().ref('live/userPublic/').once('value', (data) => {
//         let usersJson = data.val();
//         if(usersJson) {
//           let userIds = Object.keys(usersJson);
//           //console.log(userIds);
//           userIds.forEach(userId => {
//             admin.database().ref('live/userPublic/'+userId+'/latestCoCAgreed').set(false).then(() =>{
//               //console.log("latestCoCAgreed is set to false for user with id: "+ userId);
//             });
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       })
//     }
//     return true;
//   });

// exports.updateLatestToCAllUsers_LIVE = functions.database.ref('/live/system/{systemId}/toc')
//   .onWrite(event => {
//     const currData = event.data.current.val();
//     if (currData) {
//       admin.database().ref('live/userPublic/').once('value', (data) => {
//         let usersJson = data.val();
//         if(usersJson) {
//           let userIds = Object.keys(usersJson);
//           //console.log(userIds);
//           userIds.forEach(userId => {
//             admin.database().ref('live/userPublic/'+userId+'/latestToCAgreed').set(false).then(() =>{
//               //console.log("latestToCAgreed is set to false for user with id: "+ userId);
//             });
//           });
//         }
//       }, error => {
//         console.log(error.message);
//       })
//     }
//     return true;
//   });

/**
 * Private functions
*/

function fetchUsersAndSendEmail(node, countryId, title, content, setting, assignee) {
  console.log("fetchUsersAndSendEmail - gets called!!! "+node)
  admin.database().ref('/' + node + '/externalRecipient/' + countryId).once('value', (data) => {
    let exObj = data.val();
    console.log(exObj)
    if (exObj) {
      let recipients = Object.keys(exObj).map(key => {
        return exObj[key]
      })
      for (let i = 0, len = recipients.length; i < len; i++) {
        console.log(recipients[i].email)
        if (recipients[i].notificationsSettings[setting]) {
          sendEmail(recipients[i].email, title, content)
        }
      }
    }
  });

  admin.database().ref('/' + node + '/userPublic/' + assignee).once('value', (data) => {
    let exObj = data.val();
    console.log(exObj.email)
    if (exObj) {
      sendEmail(exObj.email, title, content)
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
