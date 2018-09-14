const ENVIRONMENT = {
  SAND: {
    label: "SAND",
    env: "sand",
    url: "http://localhost:4200"
  },
  TEST: {
    label: "TEST",
    env: "test",
    url: "http://test.portal.alertpreparedness.org"
  },
  UAT: {
    label: "UAT",
    env: "uat",
    url: "http://uat.portal.alertpreparedness.org"
  },
  TRAINING: {
    label: "TRAINING",
    env: "training",
    url: "http://training.portal.alertpreparedness.org"
  },
  DEMO: {
    label: "DEMO",
    env: "demo",
    url: "http://demo.portal.alertpreparedness.org"
  },
  UAT_1: {
    label: "UAT_1",
    env: "uat-1",
    url: "http://uat-1.portal.alertpreparedness.org"
  },
  UAT_2: {
    label: "UAT_2",
    env: "uat-2",
    url: "http://uat-2.portal.alertpreparedness.org"
  },
  D1S1: {
    labe: "D1S1",
    env: "d1s1",
    url: "http://set-1.day-1.training.portal.alertpreparedness.org"
  },
  D1S2: {
    labe: "D1S2",
    env: "d1s2",
    url: "http://set-2.day-1.training.portal.alertpreparedness.org"
  },
  D2S1: {
    labe: "D2S1",
    env: "d2s1",
    url: "http://set-1.day-2.training.portal.alertpreparedness.org"
  },
  D2S2: {
    labe: "D2S2",
    env: "d2s2",
    url: "http://set-2.day-2.training.portal.alertpreparedness.org"
  },
  D3S1: {
    labe: "D3S1",
    env: "d3s1",
    url: "http://set-1.day-3.training.portal.alertpreparedness.org"
  },
  D3S2: {
    labe: "D3S2",
    env: "d3s2",
    url: "http://set-2.day-3.training.portal.alertpreparedness.org"
  },
  LIVE: {
    label: "LIVE",
    env: "live",
    url: "http://platform.alertpreparedness.org"
  }
};

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const moment = require('moment');
const cors = require('cors')({origin: true});
const uuidv4 = require('uuid/v4');
admin.initializeApp(functions.config().firebase);


/**
 * THESE ARE STORED IN FIREBASE CONFIGURATION!
 * run `firebase functions:config:get` to pull these configuration details
 */
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


const APP_NAME = 'ALERT';
const TEMP_PASS = "testtest";

const ALERT_GREEN = 0;
const ALERT_AMBER = 1;
const ALERT_RED = 2;

const ALERT_LEVEL_CHANGED = 0;
const RED_ALERT_REQUEST = 1;
const UPDATE_HAZARD = 2;
const ACTION_EXPIRED = 3;
const PLAN_EXPIRED = 4;
const PLAN_REJECTED = 5;

const WAITING_RESPONSE = 0;
const APPROVED = 1;
const REJECTED = 2;

const PLAN_IN_PROGRESS = 0;
const PLAN_WAITINGAPPROVAL = 1;
const PLAN_APPROVED = 2;
const PLAN_NEEDREVIEWING = 3;

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
};

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
];


/**
 * EXPORT DECLARATIONS
 * - Does not work through for-loop, so the declarations are duplicated for SAND, TEST, UAT and LIVE
 * Also you can't use array declarations for some reason, not sure why, so they're standard exports
 */

exports.sendWelcomeEmail = sendWelcomeEmail();

// region Delcarations :- SAND

exports.handleUserAccounts_SAND = handleUserAccounts(ENVIRONMENT.SAND);
exports.sendResponsePlanValidationEmail_SAND = sendResponsePlanValidationEmail(ENVIRONMENT.SAND);
exports.sendPartnerOrganisationValidationEmail_SAND = sendPartnerOrganisationValidationEmail(ENVIRONMENT.SAND);
exports.sendSystemAdminNotificationsEmail_SAND = sendSystemAdminNotificationsEmail(ENVIRONMENT.SAND);
exports.sendAgencyNotificationsEmail_SAND = sendAgencyNotificationsEmail(ENVIRONMENT.SAND);
exports.sendCountryNotificationsEmail_SAND = sendCountryNotificationsEmail(ENVIRONMENT.SAND);
exports.sendNetworkAgencyValidationEmail_SAND = sendNetworkAgencyValidationEmail(ENVIRONMENT.SAND);
exports.sendNetworkCountryAgencyValidationEmail_SAND = sendNetworkCountryAgencyValidationEmail(ENVIRONMENT.SAND);
exports.sendBugReportingEmail_SAND = sendBugReportingEmail(ENVIRONMENT.SAND);
exports.createUserNetworkCountry_SAND = createUserNetworkCountry(ENVIRONMENT.SAND);
exports.updateUserEmail_SAND = updateUserEmail(ENVIRONMENT.SAND);
exports.sendEmailToExternalForAlertChange_SAND = sendEmailToExternalForAlertChange(ENVIRONMENT.SAND);
exports.sendEmailToExternalForAlertChangeRed_SAND = sendEmailToExternalForAlertChangeRed(ENVIRONMENT.SAND);
exports.sendEmailToExternalForIndicatorUpdate_SAND = sendEmailToExternalForIndicatorUpdate(ENVIRONMENT.SAND);
exports.sendEmailToExternalForPlanExpired_SAND = sendEmailToExternalForPlanExpired(ENVIRONMENT.SAND);
exports.sendEmailPlanRejectedByCountryDirector_SAND = sendEmailPlanRejectedByCountryDirector(ENVIRONMENT.SAND);
exports.sendEmailPlanRejectedByRegionDirector_SAND = sendEmailPlanRejectedByRegionDirector(ENVIRONMENT.SAND);
exports.sendEmailPlanRejectedByGlobalDirector_SAND = sendEmailPlanRejectedByGlobalDirector(ENVIRONMENT.SAND);
exports.updateLatestToCAllUsers_SAND = updateLatestToCAllUsers(ENVIRONMENT.SAND);
exports.updateLatestCoCAllUsers_SAND = updateLatestCoCAllUsers(ENVIRONMENT.SAND);
exports.sendIndicatorAssignedMobileNotification_SAND = sendIndicatorAssignedMobileNotification(ENVIRONMENT.SAND);
exports.sendResponsePlanApprovalNotification_SAND = sendResponsePlanApprovalNotification(ENVIRONMENT.SAND);
exports.sendAlertMobileNotification_SAND = sendAlertMobileNotification(ENVIRONMENT.SAND);
exports.sendActionMobileNotification_SAND = sendActionMobileNotification(ENVIRONMENT.SAND);
exports.countryOfficeClockSettingsChange_SAND = countryOfficeClockSettingsChange(ENVIRONMENT.SAND);
exports.networkClockSettingsChange_SAND = networkClockSettingsChange(ENVIRONMENT.SAND);
exports.networkCountryClockSettingsChange_SAND = networkCountryClockSettingsChange(ENVIRONMENT.SAND);
exports.sendResponsePlanMobileNotification_SAND = sendResponsePlanMobileNotification(ENVIRONMENT.SAND);

// endregion

// region Delcarations :- TEST

exports.handleUserAccounts_TEST = handleUserAccounts(ENVIRONMENT.TEST);
exports.sendResponsePlanValidationEmail_TEST = sendResponsePlanValidationEmail(ENVIRONMENT.TEST);
exports.sendPartnerOrganisationValidationEmail_TEST = sendPartnerOrganisationValidationEmail(ENVIRONMENT.TEST);
exports.sendSystemAdminNotificationsEmail_TEST = sendSystemAdminNotificationsEmail(ENVIRONMENT.TEST);
exports.sendAgencyNotificationsEmail_TEST = sendAgencyNotificationsEmail(ENVIRONMENT.TEST);
exports.sendCountryNotificationsEmail_TEST = sendCountryNotificationsEmail(ENVIRONMENT.TEST);
exports.sendNetworkAgencyValidationEmail_TEST = sendNetworkAgencyValidationEmail(ENVIRONMENT.TEST);
exports.sendNetworkCountryAgencyValidationEmail_TEST = sendNetworkCountryAgencyValidationEmail(ENVIRONMENT.TEST);
exports.sendBugReportingEmail_TEST = sendBugReportingEmail(ENVIRONMENT.TEST);
exports.createUserNetworkCountry_TEST = createUserNetworkCountry(ENVIRONMENT.TEST);
exports.updateUserEmail_TEST = updateUserEmail(ENVIRONMENT.TEST);
exports.sendEmailToExternalForAlertChange_TEST = sendEmailToExternalForAlertChange(ENVIRONMENT.TEST);
exports.sendEmailToExternalForAlertChangeRed_TEST = sendEmailToExternalForAlertChangeRed(ENVIRONMENT.TEST);
exports.sendEmailToExternalForIndicatorUpdate_TEST = sendEmailToExternalForIndicatorUpdate(ENVIRONMENT.TEST);
exports.sendEmailToExternalForPlanExpired_TEST = sendEmailToExternalForPlanExpired(ENVIRONMENT.TEST);
exports.sendEmailPlanRejectedByCountryDirector_TEST = sendEmailPlanRejectedByCountryDirector(ENVIRONMENT.TEST);
exports.sendEmailPlanRejectedByRegionDirector_TEST = sendEmailPlanRejectedByRegionDirector(ENVIRONMENT.TEST);
exports.sendEmailPlanRejectedByGlobalDirector_TEST = sendEmailPlanRejectedByGlobalDirector(ENVIRONMENT.TEST);
exports.updateLatestToCAllUsers_TEST = updateLatestToCAllUsers(ENVIRONMENT.TEST);
exports.updateLatestCoCAllUsers_TEST = updateLatestCoCAllUsers(ENVIRONMENT.TEST);
exports.sendIndicatorAssignedMobileNotification_TEST = sendIndicatorAssignedMobileNotification(ENVIRONMENT.TEST);
exports.sendResponsePlanApprovalNotification_TEST = sendResponsePlanApprovalNotification(ENVIRONMENT.TEST);
exports.sendAlertMobileNotification_TEST = sendAlertMobileNotification(ENVIRONMENT.TEST);
exports.sendActionMobileNotification_TEST = sendActionMobileNotification(ENVIRONMENT.TEST);
exports.countryOfficeClockSettingsChange_TEST = countryOfficeClockSettingsChange(ENVIRONMENT.TEST);
exports.networkClockSettingsChange_TEST = networkClockSettingsChange(ENVIRONMENT.TEST);
exports.networkCountryClockSettingsChange_TEST = networkCountryClockSettingsChange(ENVIRONMENT.TEST);
exports.sendResponsePlanMobileNotification_TEST = sendResponsePlanMobileNotification(ENVIRONMENT.TEST);

// endregion

// region Delcarations :- UAT

exports.handleUserAccounts_UAT = handleUserAccounts(ENVIRONMENT.UAT);
exports.sendResponsePlanValidationEmail_UAT = sendResponsePlanValidationEmail(ENVIRONMENT.UAT);
exports.sendPartnerOrganisationValidationEmail_UAT = sendPartnerOrganisationValidationEmail(ENVIRONMENT.UAT);
exports.sendSystemAdminNotificationsEmail_UAT = sendSystemAdminNotificationsEmail(ENVIRONMENT.UAT);
exports.sendAgencyNotificationsEmail_UAT = sendAgencyNotificationsEmail(ENVIRONMENT.UAT);
exports.sendCountryNotificationsEmail_UAT = sendCountryNotificationsEmail(ENVIRONMENT.UAT);
exports.sendNetworkAgencyValidationEmail_UAT = sendNetworkAgencyValidationEmail(ENVIRONMENT.UAT);
exports.sendNetworkCountryAgencyValidationEmail_UAT = sendNetworkCountryAgencyValidationEmail(ENVIRONMENT.UAT);
exports.sendBugReportingEmail_UAT = sendBugReportingEmail(ENVIRONMENT.UAT);
exports.createUserNetworkCountry_UAT = createUserNetworkCountry(ENVIRONMENT.UAT);
exports.updateUserEmail_UAT = updateUserEmail(ENVIRONMENT.UAT);
exports.sendEmailToExternalForAlertChange_UAT = sendEmailToExternalForAlertChange(ENVIRONMENT.UAT);
exports.sendEmailToExternalForAlertChangeRed_UAT = sendEmailToExternalForAlertChangeRed(ENVIRONMENT.UAT);
exports.sendEmailToExternalForIndicatorUpdate_UAT = sendEmailToExternalForIndicatorUpdate(ENVIRONMENT.UAT);
exports.sendEmailToExternalForPlanExpired_UAT = sendEmailToExternalForPlanExpired(ENVIRONMENT.UAT);
exports.sendEmailPlanRejectedByCountryDirector_UAT = sendEmailPlanRejectedByCountryDirector(ENVIRONMENT.UAT);
exports.sendEmailPlanRejectedByRegionDirector_UAT = sendEmailPlanRejectedByRegionDirector(ENVIRONMENT.UAT);
exports.sendEmailPlanRejectedByGlobalDirector_UAT = sendEmailPlanRejectedByGlobalDirector(ENVIRONMENT.UAT);
exports.updateLatestToCAllUsers_UAT = updateLatestToCAllUsers(ENVIRONMENT.UAT);
exports.updateLatestCoCAllUsers_UAT = updateLatestCoCAllUsers(ENVIRONMENT.UAT);
exports.sendIndicatorAssignedMobileNotification_UAT = sendIndicatorAssignedMobileNotification(ENVIRONMENT.UAT);
exports.sendResponsePlanApprovalNotification_UAT = sendResponsePlanApprovalNotification(ENVIRONMENT.UAT);
exports.sendAlertMobileNotification_UAT = sendAlertMobileNotification(ENVIRONMENT.UAT);
exports.sendActionMobileNotification_UAT = sendActionMobileNotification(ENVIRONMENT.UAT);
exports.countryOfficeClockSettingsChange_UAT = countryOfficeClockSettingsChange(ENVIRONMENT.UAT);
exports.networkClockSettingsChange_UAT = networkClockSettingsChange(ENVIRONMENT.UAT);
exports.networkCountryClockSettingsChange_UAT = networkCountryClockSettingsChange(ENVIRONMENT.UAT);
exports.sendResponsePlanMobileNotification_UAT = sendResponsePlanMobileNotification(ENVIRONMENT.UAT);

// endregion

// region Delcarations :- LIVE

// exports.handleUserAccounts_LIVE = handleUserAccounts(ENVIRONMENT.LIVE);
// exports.sendResponsePlanValidationEmail_LIVE = sendResponsePlanValidationEmail(ENVIRONMENT.LIVE);
// exports.sendPartnerOrganisationValidationEmail_LIVE = sendPartnerOrganisationValidationEmail(ENVIRONMENT.LIVE);
// exports.sendSystemAdminNotificationsEmail_LIVE = sendSystemAdminNotificationsEmail(ENVIRONMENT.LIVE);
// exports.sendAgencyNotificationsEmail_LIVE = sendAgencyNotificationsEmail(ENVIRONMENT.LIVE);
// exports.sendCountryNotificationsEmail_LIVE = sendCountryNotificationsEmail(ENVIRONMENT.LIVE);
// exports.sendNetworkAgencyValidationEmail_LIVE = sendNetworkAgencyValidationEmail(ENVIRONMENT.LIVE);
// exports.sendNetworkCountryAgencyValidationEmail_LIVE = sendNetworkCountryAgencyValidationEmail(ENVIRONMENT.LIVE);
// exports.sendBugReportingEmail_LIVE = sendBugReportingEmail(ENVIRONMENT.LIVE);
// exports.createUserNetworkCountry_LIVE = createUserNetworkCountry(ENVIRONMENT.LIVE);
// exports.updateUserEmail_LIVE = updateUserEmail(ENVIRONMENT.LIVE);
// exports.sendEmailToExternalForAlertChange_LIVE = sendEmailToExternalForAlertChange(ENVIRONMENT.LIVE);
// exports.sendEmailToExternalForAlertChangeRed_LIVE = sendEmailToExternalForAlertChangeRed(ENVIRONMENT.LIVE);
// exports.sendEmailToExternalForIndicatorUpdate_LIVE = sendEmailToExternalForIndicatorUpdate(ENVIRONMENT.LIVE);
// exports.sendEmailToExternalForPlanExpired_LIVE = sendEmailToExternalForPlanExpired(ENVIRONMENT.LIVE);
// exports.sendEmailPlanRejectedByCountryDirector_LIVE = sendEmailPlanRejectedByCountryDirector(ENVIRONMENT.LIVE);
// exports.sendEmailPlanRejectedByRegionDirector_LIVE = sendEmailPlanRejectedByRegionDirector(ENVIRONMENT.LIVE);
// exports.sendEmailPlanRejectedByGlobalDirector_LIVE = sendEmailPlanRejectedByGlobalDirector(ENVIRONMENT.LIVE);
// exports.updateLatestToCAllUsers_LIVE = updateLatestToCAllUsers(ENVIRONMENT.LIVE);
// exports.updateLatestCoCAllUsers_LIVE = updateLatestCoCAllUsers(ENVIRONMENT.LIVE);
// exports.sendIndicatorAssignedMobileNotification_LIVE = sendIndicatorAssignedMobileNotification(ENVIRONMENT.LIVE);
// exports.sendResponsePlanApprovalNotification_LIVE = sendResponsePlanApprovalNotification(ENVIRONMENT.LIVE);
// exports.sendAlertMobileNotification_LIVE = sendAlertMobileNotification(ENVIRONMENT.LIVE);
// exports.sendActionMobileNotification_LIVE = sendActionMobileNotification(ENVIRONMENT.LIVE);
// exports.countryOfficeClockSettingsChange_LIVE = countryOfficeClockSettingsChange(ENVIRONMENT.LIVE);
// exports.networkClockSettingsChange_LIVE = networkClockSettingsChange(ENVIRONMENT.LIVE);
// exports.networkCountryClockSettingsChange_LIVE = networkCountryClockSettingsChange(ENVIRONMENT.LIVE);
// exports.sendResponsePlanMobileNotification_LIVE = sendResponsePlanMobileNotification(ENVIRONMENT.LIVE);

// endregion


/**
 * Send a welcome email
 */
function sendWelcomeEmail() {
  return functions.auth.user().onCreate(event => {

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
}


/**
 * Handle creating or removing user accounts
 */
function handleUserAccounts(ENV) {
  return functions.database.ref('/' + ENV.env + '/userPublic/{userId}')
    .onWrite(event => {
      console.log("agency node triggered");
      const userId = event.params.userId;
      const preData = event.data.previous.val();
      const currData = event.data.current.val();
      if (!preData && currData) {
        //add user account
        console.log("user added: " + userId);
        const pass = ENV.label == 'LIVE' ? generateRandomPassword() : TEMP_PASS;
        admin.auth().createUser({
          uid: userId,
          email: currData.email,
          password: pass
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
}

/**
 * Send response plan validation email
 */
function sendResponsePlanValidationEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
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
        admin.database().ref(ENV.env + '/partnerUser/' + partnerOrganisationId)
          .on('value', snapshot => {
            console.log(snapshot.val());
            if (!snapshot.val()) {
              console.log("not partner user found");
              //if not a partner user, send email to organisation email
              admin.database().ref(ENV.env + '/partnerOrganisation/' + partnerOrganisationId + '/email')
                .on('value', snapshot => {
                  if (snapshot.val()) {
                    let email = snapshot.val();

                    let expiry = moment.utc().add(1, 'weeks').valueOf();
                    let validationToken = {'token': uuidv4(), 'expiry': expiry};

                    console.log("email: " + email);

                    admin.database().ref(ENV.env + '/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken).then(() => {
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
                              \n ${ENV.url}/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
                              \n Thanks,
                              \n ALERT Team`;
                      return mailTransport.sendMail(mailOptions).then(() => {
                        console.log('Email sent to:', email);
                      });
                    });
                  } else {
                    console.log('Error occurred - Snapshot is null');
                  }
                });
            }
          });
      }
    });
}

/**
 * Send partner organisatino validation email
 */
function sendPartnerOrganisationValidationEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/partnerOrganisation/{partnerId}')
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

        admin.database().ref(ENV.env + '/partnerOrganisationValidation/' + partnerId + '/validationToken').set(validationToken).then(() => {
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
                          \n ${ENV.url}/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                          \n Thanks,
                          \n ALERT Team `;
          return mailTransport.sendMail(mailOptions).then(() => {
            console.log('New welcome email sent to:', email);
          });
        }, error => {
          console.log(error.message);
        });
      }
    });
}

/**
 * Sending email when system admin notification is sent
 */
function sendSystemAdminNotificationsEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      let userId = event.params['userId'];
      let msgId = event.params['messageId'];

      if (!preData && currData) {
        admin.database().ref(ENV.env + '/userPublic/' + userId + "/email").on('value', snapshot => {

          let email = snapshot.val();

          if (email) {
            admin.database().ref(ENV.env + '/message/' + msgId).on('value', snapshot => {
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
}

/**
 * Sending an agency notification email
 */
function sendAgencyNotificationsEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      let userId = event.params['userId'];
      let msgId = event.params['messageId'];

      if (!preData && currData) {
        admin.database().ref(ENV.env + '/userPublic/' + userId + "/email").on('value', snapshot => {

          let email = snapshot.val();

          if (email) {
            admin.database().ref(ENV.env + '/message/' + msgId).on('value', snapshot => {
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
}

/**
 * Sending an email when a country notification is sent
 */
function sendCountryNotificationsEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      let userId = event.params['userId'];
      let msgId = event.params['messageId'];

      if (!preData && currData) {
        admin.database().ref(ENV.env + '/userPublic/' + userId + "/email").on('value', snapshot => {

          let email = snapshot.val();

          if (email) {
            admin.database().ref(ENV.env + '/message/' + msgId).on('value', snapshot => {
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
}

/**
 * Send a network agency validation email
 */
function sendNetworkAgencyValidationEmail(ENV) {
  return functions.database.ref('/training/network/{networkId}/agencies/{agencyId}')
    .onWrite(event => {
      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (!preData && currData) {
        console.log("Network agency added");

        let networkId = event.params['networkId'];
        let agencyId = event.params['agencyId'];

        admin.database().ref('/' + ENV.env + '/network/' + networkId).once("value", (data) => {

          let network = data.val();

          if (data.val().isGlobal) {
            console.log('isGlobal');
            admin.database().ref('/' + ENV.env + '/agency/' + agencyId + '/adminId').once("value", (data) => {
              let adminId = data.val();
              console.log("admin id: " + adminId);

              admin.database().ref('/' + ENV.env + '/userPublic/' + adminId).once("value", (user) => {
                let email = user.val().email;
                console.log("admin email: " + email);

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref(ENV.env + '/networkAgencyValidation/' + agencyId + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was invited to join the network: ${network.name}
                          \n To confirm, please click on the link below
                          \n ${ENV.url}/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}
                          \n Thanks,
                          \n ALERT Team `;
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
            admin.database().ref('/' + ENV.env + '/network/' + networkId + '/agencies/' + agencyId).once("value", (data) => {
              let countryOfficeCode = data.val().countryCode;
              admin.database().ref('/' + ENV.env + '/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId').once("value", (data) => {
                let adminId = data.val();
                console.log("admin id: " + adminId);

                admin.database().ref('/' + ENV.env + '/userPublic/' + adminId).once("value", (user) => {
                  let email = user.val().email;
                  console.log("admin email: " + email);

                  let expiry = moment.utc().add(1, 'weeks').valueOf();

                  let validationToken = {'token': uuidv4(), 'expiry': expiry};

                  admin.database().ref(ENV.env + '/networkAgencyValidation/' + countryOfficeCode + '/validationToken').set(validationToken).then(() => {
                    console.log('success validationToken');
                    const mailOptions = {
                      from: '"ALERT Network" <noreply@firebase.com>',
                      to: email
                    };

                    mailOptions.subject = `You have been invited to join a network`;
                    mailOptions.text = `Hello,
                          \nYour Agency was invited to join the network: ${network.name}
                          \n To confirm, please click on the link below
                          \n ${ENV.url}/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId};countryId=${countryOfficeCode}
                          \n Thanks,
                          \n ALERT Team `;
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
}

/**
 * Send an email when a bug is reported
 */
function sendBugReportingEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/bugReporting/{countryId}/{bugId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      console.log(currData);

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
    });
}

/**
 * Create a network country user
 */
function createUserNetworkCountry(ENV) {
  return functions.database.ref('/' + ENV.env + '/administratorNetworkCountry/{adminId}')
    .onWrite(event => {
      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (!preData && currData) {
        console.log("network country admin added");
        let adminId = event.params['adminId'];
        console.log("admin id: " + adminId);
        admin.database().ref("/" + ENV.env + "/userPublic/" + adminId)
          .once("value", data => {
            let userDb = data.val();
            console.log(userDb);

            const pass = ENV.label === 'LIVE' ? generateRandomPassword() : TEMP_PASS;
            admin.auth().createUser({
              uid: adminId,
              email: userDb.email,
              password: pass
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
}

/**
 * Update user email
 */
function updateUserEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/userPublic/{uid}/email')
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
}

/**
 * Send network country agency validation email
 */
function sendNetworkCountryAgencyValidationEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
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
          admin.database().ref('/' + ENV.env + '/countryOffice/' + agencyId + '/' + countryId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/' + ENV.env + '/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

              admin.database().ref('/' + ENV.env + '/network/' + networkId).once("value", networkSnap => {
                let network = networkSnap.val();

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref(ENV.env + '/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was invited to join the network: ${network.name}
                          \n To confirm, please click on the link below
                          \n ${ENV.url}/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId};countryId=${countryId}
                          \n Thanks,
                          \n ALERT Team `;
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
          admin.database().ref('/' + ENV.env + '/countryOffice/' + agencyId + '/adminId').once("value", (data) => {
            let adminId = data.val();
            console.log("admin id: " + adminId);

            admin.database().ref('/' + ENV.env + '/userPublic/' + adminId).once("value", (user) => {
              let email = user.val().email;
              console.log("admin email: " + email);

              admin.database().ref('/' + ENV.env + '/network/' + networkId).once("value", networkSnap => {
                let network = networkSnap.val();

                let expiry = moment.utc().add(1, 'weeks').valueOf();

                let validationToken = {'token': uuidv4(), 'expiry': expiry};

                admin.database().ref('' + ENV.env + '/networkCountryValidation/' + countryId + '/validationToken').set(validationToken).then(() => {
                  console.log('success validationToken');
                  const mailOptions = {
                    from: '"ALERT Network" <noreply@firebase.com>',
                    to: email
                  };

                  mailOptions.subject = `You have been invited to join a network`;
                  mailOptions.text = `Hello,
                          \nYour Agency was added into ${network.name} network!.
                          \n To confirm, please click on the link below
                          \n ${ENV.url}/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}
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
}

/**
 * Send email to external for alert changes
 */
function sendEmailToExternalForAlertChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/alert/{countryId}/{alertId}/alertLevel')
    .onWrite(event => {
      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (preData !== currData) {

        let alertId = event.params['alertId'];
        let countryId = event.params['countryId'];

        admin.database().ref('/' + ENV.env + '/alert/' + countryId + '/' + alertId).once("value", (data) => {
          let alert = data.val();
          console.log(alert);
          if (alert.hazardScenario !== -1) {
            admin.database().ref('/' + ENV.env + '/externalRecipient/' + countryId).once('value', (data) => {
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
            admin.database().ref('/' + ENV.env + '/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
              let otherHazardName = data.val()
              admin.database().ref('/' + ENV.env + '/externalRecipient/' + countryId).once('value', (data) => {
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
}

/**
 * Send email to external (what?) for alert change red - Ask Fei
 */
function sendEmailToExternalForAlertChangeRed(ENV) {
  return functions.database.ref('/' + ENV.env + '/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
    .onWrite(event => {

      const currData = event.data.current.val();

      if (currData === APPROVED) {
        console.log("red alert approved");

        let alertId = event.params['alertId'];
        let countryId = event.params['countryId'];

        admin.database().ref('/' + ENV.env + '/alert/' + countryId + '/' + alertId).once("value", (data) => {
          let alert = data.val();
          console.log(alert);
          if (alert.hazardScenario !== -1) {
            let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`
            let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`
            admin.database().ref('/' + ENV.env + '/externalRecipient/' + countryId).once('value', (data) => {
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
            admin.database().ref('/' + ENV.env + '/hazardOther/' + alert.otherName + "/name").once("value", (data) => {
              let otherHazardName = data.val()
              admin.database().ref('/' + ENV.env + '/externalRecipient/' + countryId).once('value', (data) => {
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
}

/**
 * Send email to external (what?) for indicator update
 */
function sendEmailToExternalForIndicatorUpdate(ENV) {
  return functions.database.ref('/' + ENV.env + '/indicator/{hazardId}/{indicatorId}/triggerSelected')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (preData && currData !== preData) {
        console.log("indicator updated");

        let hazardId = event.params['hazardId'];
        let indicatorId = event.params['indicatorId'];

        admin.database().ref('/' + ENV.env + '/indicator/' + hazardId + '/' + indicatorId).once("value", (data) => {
          let indicator = data.val();
          if (indicator.hazardScenario['key'] === 'countryContext') {
            console.log("send email to state indicator for country context was updated")
            let title = `The indicator ${indicator.name} for Country Context has been updated`
            let content = `The following indicator: ${indicator.name} for Country Context has been updated`
            fetchUsersAndSendEmail('' + ENV.env + '', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
          } else {
            console.log("fetch country id for hazard")
            admin.database().ref('/' + ENV.env + '/hazard').once("value", (data) => {
              let filteredObjs = Object.keys(data.val()).map(key => {
                let obj = data.val()[key];
                obj['id'] = key;
                return obj
              })
                .filter(item => {
                  return item.hasOwnProperty(hazardId)
                });

              let countryId = filteredObjs[0]['id'];
              console.log("fetched country id: " + countryId);
              if (indicator.hazardScenario.hazardScenario !== -1) {
                let title = `The indicator ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
                let content = `The following indicator: ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`
                fetchUsersAndSendEmail('' + ENV.env + '', countryId, title, content, 0, indicator.assignee)
              } else {
                admin.database().ref('/' + ENV.env + '/hazardOther/' + indicator.hazardScenario.otherName + "/name").once("value", (data) => {
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
    });
}

/**
 * Send email to external (what?) for plan expired
 */
function sendEmailToExternalForPlanExpired(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/isActive')
    .onWrite(event => {
      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (preData && !currData) {

        let countryId = event.params['countryId'];
        let planId = event.params['planId'];

        console.log("response plan was expired")
        admin.database().ref('/' + ENV.env + '/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
          let plan = data.val()
          console.log(plan)
          let title = `Plan ${plan.name} was expired`;
          let content = `The following plan: ${plan.name} was expired.`;
          fetchUsersAndSendEmail(ENV.env, countryId, title, content, PLAN_EXPIRED);
        })
      }
    });
}

/**
 * Send email plan rejected by country director
 */
function sendEmailPlanRejectedByCountryDirector(ENV) {
  functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();
      console.log(currData)

      if (currData === PLAN_NEEDREVIEWING) {
        console.log("plan rejected by country director")
        let countryId = event.params['countryId'];
        let planId = event.params['planId'];

        admin.database().ref('/' + ENV.env + '/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
          let plan = data.val()
          let title = `Response plan was rejected`;
          let content = `The following response plan:${plan.name}, was rejected by country director.`
          fetchUsersAndSendEmail(ENV.env, countryId, title, content, PLAN_REJECTED)
        })
      }
    })
}

/**
 * Send email plan rejected by regional director
 */
function sendEmailPlanRejectedByRegionDirector(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (currData === PLAN_NEEDREVIEWING) {
        console.log("plan rejected by region director")
        let countryId = event.params['countryId'];
        let planId = event.params['planId'];

        admin.database().ref('/' + ENV.env + '/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
          let plan = data.val()
          let title = `Response plan was rejected`
          let content = `The following response plan:${plan.name}, was rejected by region director.`
          fetchUsersAndSendEmail(ENV.env, countryId, title, content, PLAN_REJECTED)
        })
      }
    });
}

/**
 * Send email plan rejected by global director
 */
function sendEmailPlanRejectedByGlobalDirector(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
    .onWrite(event => {

      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if (currData === PLAN_NEEDREVIEWING) {
        console.log("plan rejected by global director")
        let countryId = event.params['countryId'];
        let planId = event.params['planId'];

        admin.database().ref('/' + ENV.env + '/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
          let plan = data.val()
          let title = `Response plan was rejected`
          let content = `The following response plan:${plan.name}, was rejected by global director.`
          fetchUsersAndSendEmail('' + ENV.env + '', countryId, title, content, PLAN_REJECTED)
        })
      }
    });
}

/**
 * Change to the Code of Conduct for all users
 */
function updateLatestCoCAllUsers(ENV) {
  return functions.database.ref('/' + ENV.env + '/system/{systemId}/coc')
    .onWrite(event => {
      const currData = event.data.current.val();
      if (currData) {
        let promise = admin.database().ref(ENV.env + '/userPublic/').once('value', (data) => {
          console.log("Fetched data for userPublic");
          let usersJson = data.val();
          if (usersJson) {
            let userIds = Object.keys(usersJson);
            let promiseList = [];
            userIds.forEach(userId => {
              let x = admin.database().ref(ENV.env + '/userPublic/' + userId + '/latestCoCAgreed').set(false);
              promiseList.push(x);
            });
            console.log("Resolving all UserPublic promise updates");
            return Promise.all(promiseList).then(() => {
              console.log("User Public promises resolved");
              return true;
            });
          }
          else {
            console.err("Cannot process user JSON");
            console.err(data.val());
          }
        }, error => {
          console.err(error);
        });
        console.log("Resolving all");
        return Promise.resolve(promise).then(_ => true);
      }
      else {
        return true;
      }
    });
}

/**
 * Change to the Terms and Conditions of all users
 */
function updateLatestToCAllUsers(ENV) {
  return functions.database.ref('/' + ENV.env + '/system/{systemId}/toc')
    .onWrite(event => {
      const currData = event.data.current.val();
      if (currData) {
        let promise = admin.database().ref(ENV.env + '/userPublic/').once('value', (data) => {
          console.log("Fetched data for userPublic");
          let usersJson = data.val();
          if (usersJson) {
            let userIds = Object.keys(usersJson);
            let promiseList = [];
            userIds.forEach(userId => {
              let x = admin.database().ref(ENV.env + '/userPublic/' + userId + '/latestToCAgreed').set(false);
              promiseList.push(x);
            });
            console.log("Resolving all userPublic promise updates");
            return Promise.all(promiseList).then(() => {
              console.log("userPublic Promises resolved");
              return true;
            });
          }
          else {
            console.err("Cannot process user JSON");
            console.err(data.val());
          }
        }, error => {
          console.err(error);
        });
        return Promise.resolve(promise).then(_ => true);
      }
      else {
        return true;
      }
    });
}

/**
 * Send indicator assigned mobile notification event
 */
function sendIndicatorAssignedMobileNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/indicator/{hazardId}/{indicatorId}/')
    .onWrite(event => {
      const preIndicatorData = event.data.previous.val();
      const currIndicatorData = event.data.current.val();

      var preIndicatorAssignee = null;
      var currIndicatorAssignee = null;

      var preIndicatorDueDate = null;
      var currIndicatorDueDate = null;

      if(preIndicatorData){
        preIndicatorAssignee = preIndicatorData.assignee;
        preIndicatorDueDate = preIndicatorData.dueDate;
      }

      if(currIndicatorData){
        currIndicatorAssignee = currIndicatorData.assignee;
        currIndicatorDueDate = currIndicatorData.dueDate;
      }

      const hazardId = event.params.hazardId
      const indicatorId = event.params.indicatorId

      var rescheduleNotification = createIndicatorRescheduleNotification(currIndicatorData, hazardId, indicatorId)
      var assignedNotification = createIndicatorAssignedNotification(currIndicatorData, hazardId, indicatorId)

      var promises = [];
      console.log("SENDING: " + currIndicatorAssignee);

      if(currIndicatorAssignee != preIndicatorAssignee){
        console.log("SENDING: " + currIndicatorAssignee)
        if(currIndicatorAssignee != null){
          promises.push(sendNotification(ENV.env, rescheduleNotification, currIndicatorAssignee))
          promises.push(sendNotification(ENV.env, assignedNotification, currIndicatorAssignee))
        }
        if(preIndicatorAssignee != null){
          promises.push(sendNotification(ENV.env, rescheduleNotification, preIndicatorAssignee))
        }
      }
      else if(currIndicatorDueDate != preIndicatorDueDate){
        promises.push(sendNotification(ENV.env, rescheduleNotification, currIndicatorAssignee))
      }

      return Promise.all(promises)
    });
}

/**
 * Send response plan approval notification
 */
function sendResponsePlanApprovalNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{groupId}/{responsePlanId}/approval/{groupName}/{approverId}')
    .onWrite(event => {
      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      const approverId = event.params.approverId
      const groupId = event.params.groupId
      const responsePlanId = event.params.responsePlanId

      const groupName = event.params.groupName

      console.log("Response Plan Updated: " + currData)

      if(preData != currData && (currData == PLAN_WAITINGAPPROVAL || currData == PLAN_REJECTED)){
        return admin.database().ref(`/${ENV.env}/responsePlan/${groupId}/${responsePlanId}`).once('value').then(responsePlanSnap => {
          const responsePlan = responsePlanSnap.val()

          if(currData == PLAN_WAITINGAPPROVAL) {
            const notification = createResponsePlanApprovalSubmittedNotification(responsePlan);
            if(groupName == "countryDirector"){
              return admin.database().ref(`/${ENV.env}/directorCountry/${approverId}`).once('value').then(directorCountrySnap => {
                return sendNotification(env, notification, directorCountrySnap.val())
              })
            }
            else if(groupName == "globalDirector"){
              return admin.database().ref(`/${ENV.env}/globalDirector`).orderByChild(`agencyAdmin/${approverId}`).equalTo(true).once('value').then(globalDirectorSnap => {

                return globalDirectorSnap.forEach(function(childSnapshot) {
                  var key = childSnapshot.key;
                  return sendNotification(env, notification, key)
                });
              })
            }
            else if(groupName == "regionDirector"){
              return admin.database().ref(`/${ENV.env}/directorRegion/${approverId}`).once('value').then(directorRegionSnap => {
                return sendNotification(env, notification, directorRegionSnap.val())
              })
            }
            else if(groupName == "partner"){
              return sendNotification(env, notification, approverId)
            }
          }
          else if(currData == PLAN_REJECTED){
            console.log("Plan rejected. " + groupId)
            const notification = createResponsePlanApprovalRejectedNotification(responsePlan)
            return sendCountryNetworkNetworkCountryNotification(env, notification, groupId, NOTIFICATION_SETTING_RESPONSE_PLAN_REJECTED)
          }
        });
      }

    });
}

/**
 * Change the clock settings in country office
 */
function countryOfficeClockSettingsChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/countryOffice/{agencyId}/{countryId}/clockSettings')
    .onWrite(event => {
      const preClockSettingsData = event.data.previous.val()
      const currClockSettingsData = event.data.current.val()

      const agencyId = event.params.agencyId
      const countryId = event.params.countryId

      const prePreparednessClockSettings = preClockSettingsData.preparedness
      const currPreparednessClockSettings = currClockSettingsData.preparedness

      const preResponsePlanClockSettings = preClockSettingsData.responsePlans
      const currResponsePlanClockSettings = currClockSettingsData.responsePlans

      if(prePreparednessClockSettings != currPreparednessClockSettings){
        var notification = createActionCountryRescheduleNotification(agencyId, countryId)
        return sendNotificationToCountryUsers(ENV.env, notification, countryId)
      }
      if(preResponsePlanClockSettings != currResponsePlanClockSettings){
        var notification = createResponsePlanCountryRescheduleNotification(agencyId, countryId)
        return sendNotificationToCountryUsers(ENV.env, notification, countryId)
      }
    });
}

/**
 * Change network clock settings
 */
function networkClockSettingsChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/network/{networkId}/clockSettings')
    .onWrite(event => {
      const preClockSettingsData = event.data.previous.val()
      const currClockSettingsData = event.data.current.val()

      const networkId = event.params.networkId;

      const prePreparednessClockSettings = preClockSettingsData.preparedness
      const currPreparednessClockSettings = currClockSettingsData.preparedness

      if(prePreparednessClockSettings != currPreparednessClockSettings){
        var notification = createActionNetworkRescheduleNotification(networkId)
        return sendNotificationToNetworkUsers(ENV.env, notification, networkId)
      }
    });
}

/**
 * Send an action mobile notification
 */
function sendActionMobileNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/action/{groupId}/{actionId}/')
    .onWrite(event => {
      const preActionData = event.data.previous.val();
      const currActionData = event.data.current.val();

      var preActionAssignee = null
      var currActionAssignee = null
      var preActionDueDate = null
      var currActionDueDate = null
      var preActionCompletedAt = null
      var currActionCompletedAt = null
      var preActionUpdatedAt = null
      var currActionUpdatedAt = null
      var preActionCreatedAt = null
      var currActionCreatedAt = null
      var preActionFrequencyBase = null
      var currActionFrequencyBase = null
      var preActionFrequencyValue = null
      var currActionFrequencyValue = null

      if(preActionData != null){
        preActionAssignee = preActionData.asignee
        preActionDueDate = preActionData.dueDate
        preActionCompletedAt = preActionData.isCompleteAt
        preActionUpdatedAt = preActionData.updatedAt
        preActionCreatedAt = preActionData.createdAt
        preActionFrequencyBase = preActionData.frequencyBase
        preActionFrequencyValue = preActionData.frequencyValue
      }

      if(currActionData != null){
        currActionAssignee = currActionData.asignee
        currActionDueDate = currActionData.dueDate
        currActionCompletedAt = currActionData.isCompleteAt
        currActionUpdatedAt = currActionData.updatedAt
        currActionCreatedAt = currActionData.createdAt
        currActionFrequencyBase = currActionData.frequencyBase
        currActionFrequencyValue = currActionData.frequencyValue
      }

      const groupId = event.params.groupId
      const actionId = event.params.actionId

      if(currActionData.type == 1 || currActionData.type == 2){
        var rescheduleNotification = createActionRescheduleNotification(currActionData, groupId, actionId)
        var assignedNotification = createActionAssignedNotification(currActionData, groupId, actionId)

        var promises = []

        if(currActionAssignee != preActionAssignee){
          if(currActionAssignee != null){
            promises.push(sendNotification(ENV.env, rescheduleNotification, currActionAssignee))
            promises.push(sendNotification(ENV.env, assignedNotification, currActionAssignee))
          }
          if(preActionAssignee != null){
            promises.push(sendNotification(ENV.env, rescheduleNotification, preActionAssignee))
          }
        }
        else if(currActionDueDate != preActionDueDate ||
          currActionCompletedAt != preActionCompletedAt ||
          currActionUpdatedAt != preActionUpdatedAt ||
          currActionCreatedAt != preActionCreatedAt ||
          currActionFrequencyBase != preActionFrequencyBase ||
          currActionFrequencyValue != preActionFrequencyValue
        ){
          promises.push(sendNotification(ENV.env, rescheduleNotification, currActionAssignee))
        }

        return Promise.all(promises)
      }
    });
}

/**
 * Send response plan mobile notification
 */
function sendResponsePlanMobileNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/action/{groupId}/{responsePlanId}/')
    .onWrite(event => {
      const preResponsePlanData = event.data.previous.val();
      const currResponsePlanData = event.data.current.val();

      var preResponsePlanTimeCreated = null;
      var currResponsePlanTimeCreated = null;
      var preResponsePlanTimeUpdated = null;
      var currResponsePlanTimeUpdated = null;

      if(preResponsePlanData != null){
        preResponsePlanTimeCreated = preResponsePlanData.timeCreated
        preResponsePlanTimeUpdated = preResponsePlanData.timeUpdated
      }
      if(currResponsePlanData != null){
        currResponsePlanTimeCreated = currResponsePlanData.timeCreated
        currResponsePlanTimeUpdated = currResponsePlanData.timeUpdated
      }
      //For Expiration

      const groupId = event.params.groupId
      const responsePlanId = event.params.responsePlanId

      var rescheduleNotification = createResponsePlanRescheduleNotification(groupId, responsePlanId)

      if(
        (currResponsePlanTimeCreated != preResponsePlanTimeCreated ||
          currResponsePlanTimeUpdated != preResponsePlanTimeUpdated) &&
        currResponsePlanAssignee != null){
        return sendNotification(ENV.env, rescheduleNotification, currResponsePlanAssignee)
      }
    });
}

/**
 * Send alert mobile notification
 */
function sendAlertMobileNotification(ENV) {
  return functions.database.ref('/live/alert/{id}/{alertId}')
    .onWrite(event => {
      const preData = event.data.previous.val();
      const currData = event.data.current.val();

      if(preData != null){
        const preAlertLevel = preData.alertLevel
        const currAlertLevel = currData.alertLevel

        var preApprovalLevel
        if(preData.approval != null && preData.approval.countryDirector != null && Object.keys(preData.approval.countryDirector).length > 0){
          preApprovalKey = Object.keys(preData.approval.countryDirector)[0]
          preApprovalLevel = preData.approval.countryDirector[preApprovalKey]
        }

        var currApprovalLevel
        if(currData.approval != null && currData.approval.countryDirector != null && Object.keys(currData.approval.countryDirector).length > 0){
          currApprovalKey = Object.keys(currData.approval.countryDirector)[0]
          currApprovalLevel = currData.approval.countryDirector[currApprovalKey]
        }

        console.log(`${preAlertLevel} => ${currAlertLevel} - ${preApprovalLevel} => ${currApprovalLevel}`)

        let toGreenAmber = preAlertLevel != currAlertLevel && (currAlertLevel == ALERT_AMBER || currAlertLevel == ALERT_GREEN)
        let toApprovedRed  = preApprovalLevel != currApprovalLevel && currAlertLevel == ALERT_RED && currApprovalLevel == APPROVED
        let redAlertRequested = currAlertLevel == ALERT_RED && currApprovalLevel == WAITING_RESPONSE && (currAlertLevel != preAlertLevel || preApprovalLevel != currApprovalLevel)

        console.log(`To Green/Amber: ${toGreenAmber} - To Approved Red: ${toApprovedRed} - Red Alert Requested: ${redAlertRequested}`)
        if(toGreenAmber || toApprovedRed || redAlertRequested){
          let id = event.params['id'];
          let alertId = event.params['alertId'];
          return admin.database().ref(`/${ENV.env}/alert/${id}/${alertId}`).once('value')
            .then(alertSnap => {
              alert = alertSnap.val()
              if(toGreenAmber){
                let notification = createAlertLevelChangedNotification(alert, alertId, preAlertLevel, currAlertLevel)
                return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, id, NOTIFICATION_SETTING_ALERT_LEVEL_CHANGED)
              }
              else if(toApprovedRed){
                let notification = createRedAlertApprovedNotification(alert, alertId)
                return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, id, NOTIFICATION_SETTING_ALERT_LEVEL_CHANGED)
              }
              else if(redAlertRequested){
                let notification = createRedAlertRequestedNotification(alert, alertId, preAlertLevel, currAlertLevel)
                return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, id, NOTIFICATION_SETTING_RED_ALERT_REQUEST)
              }
            })
        }
      }
    });
}

/**
 * Network Country Clock Settings
 */
function networkCountryClockSettingsChange(ENV) {
  return functions.database.ref('/live/networkCountry/{networkId}/{countryId}/clockSettings')
    .onWrite(event => {
      const preClockSettingsData = event.data.previous.val()
      const currClockSettingsData = event.data.current.val()

      const networkId = event.params.networkId
      const countryId = event.params.countryId

      const prePreparednessClockSettings = preClockSettingsData.preparedness
      const currPreparednessClockSettings = currClockSettingsData.preparedness

      if(prePreparednessClockSettings != currPreparednessClockSettings){
        var notification = createActionNetworkCountryRescheduleNotification(networkId, countryId)
        return sendNotificationToCountryUsers(ENV.env, notification, countryId)
      }
    })
}

/**
 * Functions for Mobile
 */
function sendNotificaitonToLocalNetworkUsers(env, notification, id, notificationSetting){
  let networkPromise = admin.database().ref(`/${env}/network/${id}`).once('value');

  return networkPromise.then(networkSnap => {
    let network = networkSnap.val()

    if(network){
      let agencyPromises = []
      for (var agencyName in network.agencies) {
        if (network.agencies.hasOwnProperty(agencyName) && network.agencies[agencyName].hasOwnProperty('countryCode') && network.agencies[agencyName].isApproved) {
          let countryId = network.agencies[agencyName].countryCode
          agencyPromises.push(sendNotificationToCountryUsers(env, notification, countryId, notificationSetting))
        }
      }
      return Promise.all(agencyPromises)
    }
    else{
      return Promise.reject(new Error('Network doesnt exist'))
    }
  })
}

function sendNotificationToNetworkCountry(env, notification, id, notificationSetting){
  //Sorry for the climb
  return admin.database().ref(`/${env}/networkCountry/`).once('value').then(networkCountrySnap => {
    let networkCountryBase = networkCountryBaseSnap.val()
    for (var networkId in networkCountryBase) {
      //networkCountry/{networkId}
      if (networkCountryBase.hasOwnProperty(networkId)) {
        for(var networkCountryId in networkCountryBase[networkId]){
          //networkCountry/{networkId}/{networkCountryId}
          if(networkCountryBase[networkId].hasOwnProperty(networkCountryId)){
            if(networkCountryId == id){
              let networkCountry = networkCountryBase[networkId][networkCountryId]
              let networkCountryPromises = []
              if(networkCountry.agencyCountries){
                for(var agencyId in networkCountry.agencyCountries){
                  //networkCountry/{networkId}/{networkCountryId}/{agencyId*ignored*}
                  if(networkCountry.agencyCountries.hasOwnProperty(agencyId)){
                    for(var countryId in networkCountry.agencyCountries[agencyId]){
                      //networkCountry/{networkId}/{networkCountryId}/{countryId*ignored*}/{countryId}/
                      if(networkCountry.agencyCountries[agencyId].hasOwnProperty(countryId)){
                        var country = networkCountry.agencyCountries[agencyId][countryId]
                        if(country.isApproved){
                          networkCountryPromises.push(sendNotificationToCountryUsers(env, notification, countryId, notificationSetting))
                        }
                      }
                    }
                  }
                }
              }
              return Promise.all(networkCountryPromises)
            }
          }
        }
      }
    }
    return Promise.reject(new Error('Network Country doesnt exist'))
  })
}

//I know.. Country, Network, or NetworkCountry
function sendCountryNetworkNetworkCountryNotification(env, notification, id, notificationSetting){
  return sendNotificationToCountryUsers(env, notification, id, notificationSetting)
    .then(
      //Success
      function(){
        return Promise.resolve()
      },
      //Fail
      function(error){
        return sendNotificationToLocalNetworkUsers(env, notification, id, notificationSetting);
      }
    )
    .then(
      function(){
        return Promise.resolve()
      },
      function(error){
        return sendNotificationToNetworkCountry(env, notification, id, notificationSetting)
      }
    )
}

function sendNotificationToCountryUsers(env, notification, countryId){
  return sendNotificationToCountryUsers(env, notification, countryId, null)
}

function sendNotificationToCountryUsers(env, notification, countryId, notificationSetting){

  console.log("Sending notification to country: " + countryId)
  return admin.database().ref(`/${env}/group/country/${countryId}/`).once('value').then(countryGroupSnap => {
    let countryGroup = countryGroupSnap.val()
    console.log("Got country group : " + countryGroup)

    if(countryGroup){
      var sendAlertPromises = []
      for (var userId in countryGroup.countryallusersgroup) {
        if (countryGroup.countryallusersgroup.hasOwnProperty(userId)) {
          console.log("Sending notificaiton to: " + userId)
          if(notificationSetting == null){
            console.log("Notification Setting Null")
            sendAlertPromises.push(sendNotification(env, notification, userId))
          }
          else{
            console.log("Notification Setting Not Null")
            sendAlertPromises.push(sendNotificationWithSetting(env, notification, userId, countryId, notificationSetting))
          }
        }
      }
      return Promise.all(sendAlertPromises)
    }
    else{
      return Promise.reject(new Error(`Country doesnt exist: ${countryId}`))
    }

  })
}

function createAlertLevelChangedNotification(alert, alertId, preAlertLevel, currAlertLevel){
  return {
    'notification': {
      'title': `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`,
      'body': `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${LEVELS[preAlertLevel]} to ${LEVELS[currAlertLevel]}`
    },
    'data': {
      'alertId': alertId,
      'type': NOTIFICATION_ALERT.toString()
    }
  }
}
function createRedAlertApprovedNotification(alert, alertId){
  return {
    'notification': {
      'title': `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`,
      'body': `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${alert.previousIsAmber ? "Amber" : "Green"} to ${LEVELS[alert.alertLevel]}`
    },
    'data': {
      'alertId': alertId,
      'type': NOTIFICATION_ALERT.toString()
    }
  }
}

function createRedAlertRequestedNotification(alert, alertId){
  return {
    'notification': {
      'title': `A red alert level has been requested for ${HAZARDS[alert.hazardScenario]}`,
      'body': `A red alert has been requested for the following alert: ${HAZARDS[alert.hazardScenario]}`
    },
    'data': {
      'alertId': alertId,
      'type': NOTIFICATION_ALERT.toString()
    }
  }
}

function createIndicatorAssignedNotification(indicator, hazardId, indicatorId){
  return {
    'notification': {
      'title': "An indicator has been assigned to you",
      'body': `The following indicator: ${indicator.name} has been assigned to you`
    },
    'data': {
      'indicatorId': indicatorId,
      'hazardId': hazardId,
      'type': NOTIFICATION_INDICATOR_ASSIGNED.toString()
    }
  }
}

function createIndicatorRescheduleNotification(indicator, hazardId, indicatorId){
  return {
    'data': {
      'indicatorId': indicatorId,
      'hazardId': hazardId,
      'type': NOTIFICATION_INDICATOR_RESCHEDULE.toString()
    }
  }
}

//LEVEL is apa/mpa
function createActionAssignedNotification(action, groupId, actionId){
  return {
    'notification': {
      'title': `An ${action.level == 1 ? "minimum" : "advanced"} has been assigned to you`,
      'body': `The following ${action.level == 1 ? "minimum" : "advanced"} preparedness action: ${action.task} has been assigned to you`
    },
    'data': {
      'actionId': actionId,
      'groupId': groupId,
      'actionType': action.level.toString(),//TODO: DELETE THIS LINE if you're reading this in April+, just here for backwards compatibility
      'actionLevel': action.level.toString(),
      'type': NOTIFICATION_ACTION_ASSIGNED.toString()
    }
  }
}

function createActionRescheduleNotification(action, groupId, actionId){
  return {
    'data': {
      'actionId': actionId,
      'groupId': groupId,
      'actionType': action.level.toString(),//TODO: DELETE THIS LINE if you're reading this in April+, just here for backwards compatibility
      'actionLevel': action.level.toString(),
      'type': NOTIFICATION_ACTION_RESCHEDULE.toString()
    }
  }
}
function createResponsePlanRescheduleNotification(groupId, responsePlanId){
  return {
    'data': {
      'responsePlanId': responsePlanId,
      'groupId': groupId,
      'type': NOTIFICATION_RESPONSE_PLAN_RESCHEDULE.toString()
    }
  }
}

function createActionCountryRescheduleNotification(agencyId, countryId){
  return {
    'data': {
      'agencyId': agencyId,
      'countryId': countryId,
      'type': NOTIFICATION_ACTION_COUNTRY_RESCHEDULE.toString()
    }
  }
}

function createResponsePlanCountryRescheduleNotification(agencyId, countryId){
  return {
    'data': {
      'agencyId': agencyId,
      'countryId': countryId,
      'type': NOTIFICATION_RESPONSE_PLAN_COUNTRY_RESCHEDULE.toString()
    }
  }
}

function createActionLocalNetworkRescheduleNotification(networkId){
  return {
    'data': {
      'networkId': networkId,
      'type': NOTIFICATION_ACTION_LOCAL_NETWORK_RESCHEDULE.toString()
    }
  }
}
function createActionNetworkCountryRescheduleNotification(networkId, countryId){
  return {
    'data': {
      'networkId': networkId,
      'countryId': countryId,
      'type': NOTIFICATION_ACTION_NETWORK_COUNTRY_RESCHEDULE.toString()
    }
  }
}
function createResponsePlanApprovalSubmittedNotification(responsePlan){
  return {
    'notification': {
      'title': "A response plan has been submitted for approval",
      'body': `The following response plan: ${responsePlan.name} has been submitted for approval`
    }
  }
}
function createResponsePlanApprovalRejectedNotification(responsePlan){
  return {
    'notification': {
      'title': "A response plan has been rejected",
      'body': `The following response plan: ${responsePlan.name} has been rejected`
    }
  }
}

function sendNotification(env, payload, userId){
  console.log("Sending Notification")
  return admin.database().ref(`/${env}/userPublic/${userId}/deviceNotificationIds`).once('value')
    .then(deviceNotificationIdsSnap => {
      let deviceNotificationIds = deviceNotificationIdsSnap.val()
      if(deviceNotificationIds){
        let promises = []
        for (var i = deviceNotificationIds.length - 1; i >= 0; i--) {
          let deviceNotificationId = deviceNotificationIds[i].val()
          console.log(`Sending notification to ${userId} (${deviceNotificationId}): ${JSON.stringify(payload)}`)
          promises.push(admin.messaging().sendToDevice(deviceNotificationId, payload))
        }
        return Promise.all(promises)
      }
      else{
        return Promise.resolve()
      }
    })
}
function sendNotificationWithSetting(env, payload, userId, countryId, notificationGroup){
  console.log("Send Notification With Setting " + userId + " - " + notificationGroup)
  return admin.database().ref(`/${env}/staff/${countryId}/${userId}/notification/`).once('value')
    .then(notificationSnap => {
      if(notificationSnap.val() != null){
        for (var i = notificationSnap.val().length - 1; i >= 0; i--) {
          if(notificationSnap.val()[i] == notificationGroup){
            return Promise.resolve()
          }
        }
        return Promise.reject(new Error('fail'))
      }
      else{
        console.log(`Notification Setting Error: user (${userId}) setting (${notificationGroup})`)
        return Promise.reject(new Error('fail'))
      }
    })
    .then(function(){
        return sendNotification(env, payload, userId)

      },
      function(error){
        return Promise.resolve()
      })

}

/**
 * Private functions
 */

// Fetching users and send an email
function fetchUsersAndSendEmail(node, countryId, title, content, setting, assignee) {
  console.log("fetchUsersAndSendEmail - gets called!!! " + node)
  admin.database().ref('/' + node + '/externalRecipient/' + countryId).once('value', (data) => {
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

// Get alert names
function getAlertName(level) {
  if (level === ALERT_GREEN) {
    return "GREEN ALERT"
  } else if (level === ALERT_AMBER) {
    return "AMBER ALERT"
  } else if (level === ALERT_RED) {
    return "RED ALERT"
  }
}

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
                      \n Thanks,
                      \n ALERT Team `;
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

// Generate random password between 8-10 characters long
function generateRandomPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789";
  const string_length = getRandomInt(8, 10);
  let randomstring = '';
  let charCount = 0;
  let numCount = 0;

  for (let i = 0; i < string_length; i++) {
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

// Get random int
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
