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
    label: "D1S1",
    env: "d1s1",
    url: "http://set-1.day-1.training.portal.alertpreparedness.org"
  },
  D1S2: {
    label: "D1S2",
    env: "d1s2",
    url: "http://set-2.day-1.training.portal.alertpreparedness.org"
  },
  D2S1: {
    label: "D2S1",
    env: "d2s1",
    url: "http://set-1.day-2.training.portal.alertpreparedness.org"
  },
  D2S2: {
    label: "D2S2",
    env: "d2s2",
    url: "http://set-2.day-2.training.portal.alertpreparedness.org"
  },
  D3S1: {
    label: "D3S1",
    env: "d3s1",
    url: "http://set-1.day-3.training.portal.alertpreparedness.org"
  },
  D3S2: {
    label: "D3S2",
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

const PLAN_IN_PROGRESS = 0;
const PLAN_WAITINGAPPROVAL = 1;
const PLAN_APPROVED = 2;
const PLAN_NEEDREVIEWING = 3;

const NOTIFICATION_ALERT = 0;
const NOTIFICATION_INDICATOR_ASSIGNED = 1;
const NOTIFICATION_INDICATOR_RESCHEDULE = 2;
const NOTIFICATION_ACTION_ASSIGNED = 3;
const NOTIFICATION_ACTION_RESCHEDULE = 4;
const NOTIFICATION_ACTION_COUNTRY_RESCHEDULE = 5;
const NOTIFICATION_ACTION_LOCAL_NETWORK_RESCHEDULE = 6;
const NOTIFICATION_ACTION_NETWORK_COUNTRY_RESCHEDULE = 7;
const NOTIFICATION_RESPONSE_PLAN_RESCHEDULE = 8;
const NOTIFICATION_RESPONSE_PLAN_COUNTRY_RESCHEDULE = 9;

const NOTIFICATION_SETTING_ALERT_LEVEL_CHANGED = 0;
const NOTIFICATION_SETTING_RED_ALERT_REQUEST = 1;
const NOTIFICATION_SETTING_UPDATE_HAZARD_INDICATOR = 2;
const NOTIFICATION_SETTING_MPA_APA_EXPIRED = 3;
const NOTIFICATION_SETTING_RESPONSE_PLAN_EXPIRED = 4;
const NOTIFICATION_SETTING_RESPONSE_PLAN_REJECTED = 5;

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

const LEVELS = {
  "0": "Green",
  "1": "Amber",
  "2": "Red"
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
  return functions.auth.user().onCreate(async (user) => {
    const email = user.email;
    const userPassword = generateRandomPassword();
    const userUid = user.uid;
    return admin.auth()
      .updateUser(userUid, {password: userPassword})
      .then(function (userRecord) {
        console.log("Successfully updated user password", userRecord.toJSON());
        return sendWelcomeEmailWith(email, userPassword);
      })
      .catch(function (error) {
        console.log("Error updating user password:");
        console.error(error);
      });
  });
}


/**
 * Handle creating or removing user accounts
 */
function handleUserAccounts(ENV) {
  return functions.database.ref('/' + ENV.env + '/userPublic/{userId}')
    .onWrite((snap, context) => {
      const userId = context.params.userId;
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (!preData && currData) {
        const pass = ENV.label === 'LIVE' ? generateRandomPassword() : TEMP_PASS;
        return admin.auth().createUser({
          uid: userId,
          email: currData.email,
          password: pass
        })
          .then(user => {
            console.log("Successfully created new user: " + user.uid);
            return true;
          })
          .catch(error => {
            console.log("Error creating user");
            console.error(error);
          });
      }

      if (preData && currData) {
        console.log("Update");
        return Promise.resolve(true);
      }

      if (preData && !currData) {
        return admin.auth()
          .deleteUser(userId)
          .then(() => {
            console.log("Successfully deleted user " + userId);
            return true;
          }, error => {
            console.log("Error deleting user");
            console.error(error);
          });
      }
      return Promise.resolve(true);
    });
}


/**
 * Send response plan validation email
 *
 * - Look for new data for partner organisation / country id fixes
 * - Make sure a partner user doesn't already exists.
 * - If it doesn't, we'll send an email to partner organisation
 */
function sendResponsePlanValidationEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{responsePlanId}/approval/partner/{partnerOrganisationId}')
    .onWrite(async (snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (!preData && currData) {
        // New data
        let countryId = context.params.countryId;
        let partnerOrganisationId = context.params.partnerOrganisationId;
        let responsePlanId = context.params.responsePlanId;

        // Check that partner user doesn't already exist. If it doesn't we'll send an email to partnerOrganisation
        let partnerUser = await refOnce(ENV.env + '/partnerUser/' + partnerOrganisationId);
        if (partnerUser != null) {
          return resolveLog("Partner user found")
        }

        // Partner organisation email exists check
        let partnerOrganisationEmail = await refOnce(ENV.env + '/partnerOrganisation/' + partnerOrganisationId + '/email');
        if (partnerOrganisationEmail == null) {
          return resolveLog("Partner organisation not found");
        }

        let expiry = moment.utc().add(1, 'weeks').valueOf();
        let validationToken = {'token': uuidv4(), 'expiry': expiry};

        // Save validation token
        await admin.database().ref(ENV.env + '/responsePlanValidation/' + responsePlanId + '/validationToken').set(validationToken);

        // Send an email
        const mailOptions = {
          from: '"ALERT partner organisation" <noreply@firebase.com>',
          to: partnerOrganisationEmail
        };
        mailOptions.subject = `Please validate a response plan!`;
        mailOptions.text = `Hello,
                \n Please validate a response plan.
                \n To review the response plan, please visit the link below:
                \n ${ENV.url}/dashboard/review-response-plan;id=${responsePlanId};token=${validationToken.token};countryId=${countryId};partnerOrganisationId=${partnerOrganisationId}
                \n Thanks,
                \n ALERT Team`;
        return mailTransport.sendMail(mailOptions, null)
          .then(() => {
            console.log('Email sent too: ', partnerOrganisationEmail);
            return true;
          })
          .catch((err) => {
            console.log("Sending email to " + partnerOrganisationEmail + " error");
            console.error(err);
          });
      }
      return Promise.resolve(true);
    });
}

/**
 * Send partner organisatino validation email
 */
function sendPartnerOrganisationValidationEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/partnerOrganisation/{partnerId}')
    .onWrite((snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      // New data
      if (!preData && currData) {
        let partnerId = context.params.partnerId;
        let email = currData.email;
        let expiry = moment.utc().add(1, 'weeks').valueOf();
        let validationToken = {'token': uuidv4(), 'expiry': expiry};

        return admin.database()
          .ref(ENV.env + '/partnerOrganisationValidation/' + partnerId + '/validationToken')
          .set(validationToken)
          .then(() => {
            const mailOptions = {
              from: '"ALERT partner organisation" <noreply@firebase.com>',
              to: email
            };

            mailOptions.subject = `Welcome to ${APP_NAME}!`;
            mailOptions.text = `Hello,
                            \nYour Organisation was added as a Partner Organisation on the ${APP_NAME}!.
                            \n To confirm, please click on the link below
                            \n ${ENV.url}/partner-validation;token=${validationToken.token};partnerId=${partnerId}
                            \n Thanks,
                            \n ALERT Team `;
            return mailTransport.sendMail(mailOptions, null);
          })
          .then(() => {
            console.log("Successfully saved and sent email");
            return true;
          })
          .catch((err) => {
            console.log("Error occured in saving / sending validation token");
            console.error(err);
          })
      }
      return Promise.resolve(true);
    });
}


/**
 * Sending email when system admin notification is sent
 */
function sendSystemAdminNotificationsEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/messageRef/systemadmin/{groupId}/{userId}/{messageId}')
    .onWrite((snap, context) => {
      return sendNotificationEmailForUserIdAndMsgId(ENV, snap, context)
        .then(() => {
          console.log("Successfully send email");
          return true;
        })
        .catch((err) => {
          console.log("Error sending notification email");
          console.error(err);
        });
    });
}

/**
 * Sending an agency notification email
 */
function sendAgencyNotificationsEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/messageRef/agency/{agencyId}/{groupId}/{userId}/{messageId}')
    .onWrite((snap, context) => {
      return sendNotificationEmailForUserIdAndMsgId(ENV, snap, context)
        .then(() => {
          console.log("Successfully send email");
          return true;
        })
        .catch((err) => {
          console.log("Error sending notification email");
          console.error(err);
        });
    });
}

/**
 * Sending an email when a country notification is sent
 */
function sendCountryNotificationsEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/messageRef/country/{countryId}/{groupId}/{userId}/{messageId}')
    .onWrite((snap, context) => {
      return sendNotificationEmailForUserIdAndMsgId(ENV, snap, context)
        .then(() => {
          console.log("Successfully send email");
          return true;
        })
        .catch((err) => {
          console.log("Error sending notification email");
          console.error(err);
        });
    });
}

/**
 * Method to send notifications
 *
 * @param {*} ENV The environment for the deployment
 * @param {Change<DataSnapshot>} snap The change snapshot
 * @param {EventContext} context The context of the function
 */
async function sendNotificationEmailForUserIdAndMsgId(ENV, snap, context) {
  const preData = snap.before.val();
  const currData = snap.after.val();
  let userId = context.params.userId;
  let msgId = context.params.messageId;

  // Send an email
  if (!preData && currData) {

    let email = await refOnce(ENV.env + '/userPublic/' + userId + "/email");
    if (email == null) {
      return resolveLog("Email doesn't exist under " + ENV.env + '/userPublic/' + userId);
    }

    let messageObj = await refOnce(ENV.env + '/message/' + msgId);
    if (messageObj == null) {
      return resolveLog("Message doesn't exist to send to user " + userId);
    }

    let title = messageObj.title;
    let content = messageObj.content;

    const mailOptions = {
      from: '"ALERT Preparedness" <noreply@firebase.com>',
      to: email
    };
    mailOptions.subject = title;
    mailOptions.text = content;
    return mailTransport.sendMail(mailOptions, null);
  } else {
    return Promise.resolve(true);
  }
}


/**
 * Send a network agency validation email
 * @param {*} ENV The environment the function is deployed too
 */
function sendNetworkAgencyValidationEmail(ENV) {
  return functions.database.ref('/training/network/{networkId}/agencies/{agencyId}')
    .onWrite(async (snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (!preData && currData) {
        let networkId = context.params.networkId;
        let agencyId = context.params.agencyId;

        let network = await refOnce('/' + ENV.env + '/network/' + networkId);
        if (network == null) {
          return resolveLog("Network doesn't exist");
        }

        // GLOBAL NETWORK
        let adminId;
        let countryOfficeCode = null;
        if (network.isGlobal) {
          adminId = await refOnce('/' + ENV.env + '/agency/' + agencyId + '/adminId');
          if (adminId == null) {
            return resolveLog("Global Agency admin id under agency " + agencyId + " doesn't exist");
          }
        }
        // NON GLOBAL NETWORK
        else {
          countryOfficeCode = await refOnce('/' + ENV.env + '/network/' + networkId + '/agencies/' + agencyId + '/countryCode');
          if (countryOfficeCode == null) {
            return resolveLog("Non Global Country office code for Network / " + networkId + " / agencies / " + agencyId + " doesn't exist");
          }

          adminId = await refOnce('/' + ENV.env + '/countryOffice/' + agencyId + '/' + countryOfficeCode + '/adminId');
          if (adminId == null) {
            return resolveLog("Non Global AdminId is null for network / " + networkId + " / agencies / " + agencyId + " doesn't exist");
          }
        }

        // Get user admin
        let userPublic = await refOnce('/' + ENV.env + '/userPublic/' + adminId);
        if (userPublic == null) {
          return resolveLog("Global AgencyId " + agencyId + " AdminId " + adminId + " doesn't exist");
        }

        let email = userPublic.email;
        let expiry = moment.utc().add(1, 'weeks').valueOf();
        let validationToken = {'token': uuidv4(), 'expiry': expiry};

        return admin.database()
          .ref(ENV.env + '/networkAgencyValidation/' + (countryOfficeCode == null ? adminId : countryOfficeCode) + '/validationToken')
          .set(validationToken)
          .then(() => {
            const mailOptions = {
              from: '"ALERT Network" <noreply@firebase.com>',
              to: email
            };

            mailOptions.subject = `You have been invited to join a network`;
            mailOptions.text = `Hello,
                  \nYour Agency was invited to join the network: ${network.name}
                  \n To confirm, please click on the link below
                  \n ${ENV.url}/network-agency-validation;token=${validationToken.token};networkId=${networkId};agencyId=${agencyId}${countryOfficeCode == null ? '' : (';countryId=' + countryOfficeCode)}
                  \n Thanks,
                  \n ALERT Team `;

            return mailTransport.sendMail(mailOptions, null);
          })
          .then(() => {
            console.log("Email " + email + " adminId + " + adminId + " Successfully saved and sent email");
            return true;
          })
          .catch((err) => {
            console.log("Email " + email + " adminId + " + adminId + " Error occured in saving / sending validation token");
            console.error(err);
          })
      }
      return Promise.resolve(true);

    });
}

/**
 * Send an email when a bug is reported
 */
function sendBugReportingEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/bugReporting/{countryId}/{bugId}')
    .onWrite((snap) => {
      const currData = snap.after.val();
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

      return mailTransport.sendMail(mailOptions, null)
        .then(() => {
          console.log('New bug reporting email');
          return true;
        });
    });
}


/**
 * Create a network country user
 */
function createUserNetworkCountry(ENV) {
  return functions.database.ref('/' + ENV.env + '/administratorNetworkCountry/{adminId}')
    .onWrite(async (snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (!preData && currData) {
        let adminId = context.params.adminId;

        let userPublic = await refOnce("/" + ENV.env + "/userPublic/" + adminId);
        if (userPublic == null) {
          return resolveLog("User public profile under " + adminId + " is empty!");
        }

        const pass = ENV.label === 'LIVE' ? generateRandomPassword() : TEMP_PASS;

        return admin.auth().createUser({
          uid: adminId,
          email: userPublic.email,
          password: pass
        })
          .then(user => {
            console.log("Successfully created new user: " + user.uid);
            return true;
          })
          .catch(error => {
            console.log("Error creating new user");
            console.error(error);
          });
      }
      return Promise.resolve(true);
    });
}

/**
 * Update user email
 */
function updateUserEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/userPublic/{uid}/email')
    .onWrite((snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (preData && currData && preData !== currData) {
        let uid = context.params.uid;
        return admin.auth()
          .updateUser(uid, {email: currData})
          .then((userRecord) => {
            console.log("Successfully updated user", userRecord.toJSON());
            return true;
          })
          .catch((error) => {
            console.log("Error updating user:", error);
            console.error(error);
          });
      }
      return Promise.resolve(true);
    });
}

/**
 * Send network country agency validation email
 */
function sendNetworkCountryAgencyValidationEmail(ENV) {
  return functions.database.ref('/' + ENV.env + '/networkCountry/{networkId}/{networkCountryId}/agencyCountries/{agencyId}/{countryId}')
    .onWrite(async (snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (!preData && currData) {
        let networkId = context.params.networkId;
        let networkCountryId = context.params.networkCountryId;
        let agencyId = context.params.agencyId;
        let countryId = context.params.countryId;

        let adminId = "";
        if (agencyId !== countryId) {
          let adminId = await refOnce('/' + ENV.env + '/countryOffice/' + agencyId + '/' + countryId + '/adminId');
          if (adminId == null) {
            return resolveLog("Admin Id inside " + agencyId + " /  " + countryId + " is null");
          }
        } else {
          let adminId = await refOnce('/' + ENV.env + '/countryOffice/' + agencyId + '/adminId');
          if (adminId == null) {
            return resolveLog("Admin Id " + agencyId + " is null");
          }
        }

        let userPublic = await refOnce('/' + ENV.env + '/userPublic/' + adminId);
        if (userPublic == null) {
          return resolveLog("Admin email is null");
        }

        let network = await refOnce('/' + ENV.env + '/network/' + networkId);
        if (network == null) {
          return resolveLog("Network under " + networkId + " is null");
        }

        let email = userPublic.email;
        let expiry = moment.utc().add(1, 'weeks').valueOf();
        let validationToken = {'token': uuidv4(), 'expiry': expiry};

        return admin.database()
          .ref(ENV.env + '/networkCountryValidation/' + countryId + '/validationToken')
          .set(validationToken)
          .then(() => {
            console.log('success validationToken');
            const mailOptions = {
              from: '"ALERT Network" <noreply@firebase.com>',
              to: email
            };

            mailOptions.subject = `You have been invited to join a network`;
            mailOptions.text = `Hello,
                    \nYour Agency was invited to join the network: ${network.name}
                    \n To confirm, please click on the link below
                    \n ${ENV.url}/network-country-validation;token=${validationToken.token};networkId=${networkId};networkCountryId=${networkCountryId};agencyId=${agencyId}${countryId !== agencyId ? (';countryId=' + countryId) : ''}
                    \n Thanks,
                    \n ALERT Team `;
            return mailTransport.sendMail(mailOptions, null);
          })
          .then(() => {
            console.log("Successfully sent validation email");
            return true;
          })
          .catch((error) => {
            console.log("Error occured sending validation token to user");
            console.error(error);
          });
      }
      return Promise.resolve(true);
    });
}


/**
 * Send email to external for alert changes
 */
function sendEmailToExternalForAlertChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/alert/{countryId}/{alertId}/alertLevel')
    .onWrite(async (snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (preData !== currData) {
        let alertId = context.params.alertId;
        let countryId = context.params.countryId;

        let alert = await refOnce('/' + ENV.env + '/alert/' + countryId + '/' + alertId);
        if (alert == null) {
          return resolveLog("Alert is null");
        }

        // Standard Hazard Scenario
        if (alert.hazardScenario !== -1) {
          let exObj = await refOnce('/' + ENV.env + '/externalRecipient/' + countryId);
          if (exObj == null) {
            return resolveLog("External recipient is null - " + alert.hazardScenario);
          }

          let recipients = Object.keys(exObj).map(key => exObj[key]);

          return Promise.all(
            recipients.map(recipient => {
              if (recipient.notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === PLAN_APPROVED))) {
                let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`;
                let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`;
                sendEmail(recipient.email, title, content);
              } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                let title = `Red alert for ${HAZARDS[alert.hazardScenario]} has been requested`;
                let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has requested RED level update`;
                sendEmail(recipient.email, title, content);
              } else {
                return Promise.resolve(true);
              }
            })
          )
            .then(() => {
              console.log("Successfully sent recipient emails");
              return true;
            })
            .catch((error) => {
              console.log("Error sending email promises");
              console.error(error);
            });
        }
        // Other hazard scenario
        else {
          let otherHazardName = await refOnce('/' + ENV.env + '/hazardOther/' + alert.otherName + "/name");
          if (otherHazardName == null) {
            return resolveLog("Other Hazard Name doesn't exist " + alert.otherName);
          }

          let exObj = await refOnce('/' + ENV.env + '/externalRecipient/' + countryId);
          if (exObj == null) {
            return resolveLog("External recipient is null " + alert.hazardScenario)
          }

          let recipients = Object.keys(exObj).map(key => exObj[key]);

          return Promise.all(
            recipients.map((recipient) => {
              if (recipient.notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === PLAN_APPROVED))) {
                let title = `The alert level for ${otherHazardName} has been updated`;
                let content = `The following alert: ${otherHazardName} has had its level updated from ${getAlertName(preData)} to ${getAlertName(currData)}`;
                return sendEmail(recipient.email, title, content);
              } else if (recipients[i].notificationsSettings[RED_ALERT_REQUEST]) {
                let title = `Red alert for ${otherHazardName} has been requested`;
                let content = `The following alert: ${otherHazardName} has requested RED level update`;
                return sendEmail(recipient.email, title, content);
              } else {
                return Promise.resolve(true);
              }
            })
          )
            .then(() => {
              console.log("Successfully sent recipient emails (OTHER)");
              return true;
            })
            .catch((error) => {
              console.log("Error sending email promises (OTHER)");
              console.error(error);
            });
        }
      }
    });
}

/**
 * Send email to external (what?) for alert change red - Ask Fei
 */
function sendEmailToExternalForAlertChangeRed(ENV) {
  return functions.database.ref('/' + ENV.env + '/alert/{countryId}/{alertId}/approval/countryDirector/{directorId}')
    .onWrite(async (snap, context) => {
      const currData = snap.after.val();

      if (currData === PLAN_APPROVED) {
        let alertId = context.params.alertId;
        let countryId = context.params.countryId;

        let alert = await refOnce('/' + ENV.env + '/alert/' + countryId + '/' + alertId);
        if (alert == null) {
          return resolveLog("Alert is null");
        }

        // Standard Alert Hazard Scenario
        if (alert.hazardScenario !== -1) {

          let exObj = await refOnce('/' + ENV.env + '/externalRecipient/' + countryId);
          if (exObj == null) {
            return resolveLog("External recipients is null");
          }

          let recipients = Object.keys(exObj).map(key => exObj[key]);
          let title = `The alert level for ${HAZARDS[alert.hazardScenario]} has been updated`;
          let content = `The following alert: ${HAZARDS[alert.hazardScenario]} has had its level updated to RED ALERT`;

          return Promise.all(
            recipients.map((recipient) => {
              if (recipient.notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === PLAN_APPROVED))) {
                return sendEmail(recipient.email, title, content);
              }
              return Promise.resolve(true);
            })
          )
            .then(() => {
              console.log("Successfully sent recipient emails (OTHER)");
              return true;
            })
            .catch((error) => {
              console.log("Error sending email promises (OTHER)");
              console.error(error);
            });
        }
        // Custom Alert Hazard Scenario
        else {
          let otherHazardName = await refOnce('/' + ENV.env + '/hazardOther/' + alert.otherName + "/name");
          if (otherHazardName == null) {
            return resolveLog("Other hazard doesn't exist");
          }

          let exObj = await refOnce('/' + ENV.env + '/externalRecipient/' + countryId);
          if (exObj == null) {
            return resolveLog("External recipients is null");
          }

          let recipients = Object.keys(exObj).map(key => exObj[key]);
          let title = `The alert level for ${otherHazardName} has been updated`;
          let content = `The following alert: ${otherHazardName} has had its level updated to RED ALERT`;

          return Promise.all(
            recipients.map((recipient) => {
              if (recipient.notificationsSettings[ALERT_LEVEL_CHANGED] && (!alert.hasOwnProperty('approval') || (alert.hasOwnProperty('approval') && alert['approval']['countryDirector'][Object.keys(alert['approval']['countryDirector'])[0]] === PLAN_APPROVED))) {
                return sendEmail(recipient.email, title, content);
              }
              return Promise.resolve(true);
            })
          )
            .then(() => {
              console.log("Successfully sent recipient emails (OTHER)");
              return true;
            })
            .catch((error) => {
              console.log("Error sending email promises (OTHER)");
              console.error(error);
            });
        }
      }

      return Promise.resolve(true);
    });
}


/**
 * Send email to external (what?) for indicator update
 */
function sendEmailToExternalForIndicatorUpdate(ENV) {
  return functions.database.ref('/' + ENV.env + '/indicator/{hazardId}/{indicatorId}/triggerSelected')
    .onWrite(async (snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (preData && currData !== preData) {
        let hazardId = context.params.hazardId;
        let indicatorId = context.params.indicatorId;

        let indicator = await refOnce('/' + ENV.env + '/indicator/' + hazardId + '/' + indicatorId);
        if (indicator == null) {
          return resolveLog("Indicator for " + hazardId + "/" + indicatorId + " is null");
        }

        if (indicator.hazardScenario['key'] === 'countryContext') {
          let title = `The indicator ${indicator.name} for Country Context has been updated`;
          let content = `The following indicator: ${indicator.name} for Country Context has been updated`;
          return fetchUsersAndSendEmail('' + ENV.env + '', hazardId, title, content, UPDATE_HAZARD, indicator.assignee)
            .then(() => {
              console.log("Successful country context update");
              return true;
            })
            .catch((error) => {
              console.log("Error occured for indicator update");
              console.error(error);
            });
        } else {
          let hazard = await refOnce('/' + ENV.env + '/hazard');
          if (hazard == null) {
            return resolveLog("Hazard list is empty");
          }

          let countriesWithHazardId = Object.keys(data.val()).map(key => {
            let obj = data.val()[key];
            obj['id'] = key;
            return obj
          })
            .filter(item => {
              return item.hasOwnProperty(hazardId)
            });
          let countryId = countriesWithHazardId[0]['id'];

          if (indicator.hazardScenario.hazardScenario !== -1) {
            let title = `The indicator ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`;
            let content = `The following indicator: ${indicator.name} for ${HAZARDS[indicator.hazardScenario.hazardScenario]} has been updated`;
            return fetchUsersAndSendEmail('' + ENV.env + '', countryId, title, content, 0, indicator.assignee)
              .then(() => {
                console.log("Successful hazard scenario ");
                return true;
              })
              .catch((error) => {
                console.log("Error occurred for indicator update");
                console.error(error);
              });
          } else {
            let otherHazardName = await refOnce('/' + ENV.env + '/hazardOther/' + indicator.hazardScenario.otherName + "/name");
            if (otherHazardName == null) {
              return resolveLog("Other hazard name is null");
            }

            let title = `The indicator ${indicator.name} for ${otherHazardName} has been updated`;
            let content = `The following indicator: ${indicator.name} for ${otherHazardName} has been updated`;
            return fetchUsersAndSendEmail('test', countryId, title, content, UPDATE_HAZARD, indicator.assignee);
          }
        }
      }

      return Promise.resolve(true);
    });
}


/**
 * Send email to external (what?) for plan expired
 */
function sendEmailToExternalForPlanExpired(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/isActive')
    .onWrite((snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (preData && !currData) {
        let countryId = context.params.countryId;
        let planId = context.params.planId;

        return admin.database()
          .ref('/' + ENV.env + '/responsePlan/' + countryId + '/' + planId)
          .once('value', (data) => {
            let plan = data.val();
            let title = `Plan ${plan.name} was expired`;
            let content = `The following plan: ${plan.name} was expired.`;
            return fetchUsersAndSendEmail(ENV.env, countryId, title, content, PLAN_EXPIRED);
          })
          .then(() => {
            console.log("Successfully fetched users and send email");
            return true;
          })
          .catch((error) => {
            console.log("Error occured sending email to user");
            console.error(error);
          });
      }

      return Promise.resolve(true);
    });
}


/**
 * Send email plan rejected by country director
 */
function sendEmailPlanRejectedByCountryDirector(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/approval/countryDirector/{countryDirectorId}')
    .onWrite((snap, context) => {

      return sendEmailPlanRejectedBy(ENV, snap, context, 'country director')
        .then(() => {
          console.log("Send email plan rejected by country director");
          return true;
        })
        .catch((error) => {
          console.log("Send email plan rejected error country");
          console.error(error);
        });
    })
}

/**
 * Send email plan rejected by regional director
 */
function sendEmailPlanRejectedByRegionDirector(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/approval/regionDirector/{regionDirectorId}')
    .onWrite((snap, context) => {
      return sendEmailPlanRejectedBy(ENV, snap, context, 'region director')
        .then(() => {
          console.log("Send email plan rejected by region director");
          return true;
        })
        .catch((error) => {
          console.log("Send email plan rejected error region");
          console.error(error);
        });
    });
}

/**
 * Send email plan rejected by global director
 */
function sendEmailPlanRejectedByGlobalDirector(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{countryId}/{planId}/approval/globalDirector/{globalDirectorId}')
    .onWrite((snap, context) => {
      return sendEmailPlanRejectedBy(ENV, snap, context, 'global director')
        .then(() => {
          console.log("Send email plan rejected by global director");
          return true;
        })
        .catch((error) => {
          console.log("Send email plan rejected error global");
          console.error(error);
        });
    });
}

/**
 *
 * @param ENV
 * @param {Change<DataSnapshot>} event
 * @param {string} rejectedBy The string of who it has been rejected by
 * @param {EventContext} context The context of the function call
 * @returns {Promise<Promise<admin.database.DataSnapshot>|Promise<boolean>>}
 */
async function sendEmailPlanRejectedBy(ENV, event, context, rejectedBy) {
  const currData = event.after.val();
  if (currData === PLAN_NEEDREVIEWING) {
    let countryId = context.params.countryId;
    let planId = context.params.planId;

    return admin.database().ref('/' + ENV.env + '/responsePlan/' + countryId + '/' + planId).once('value', (data) => {
      let plan = data.val();
      let title = `Response plan was rejected`;
      let content = `The following response plan:${plan.name}, was rejected by ${rejectedBy}.`;
      return fetchUsersAndSendEmail('' + ENV.env + '', countryId, title, content, PLAN_REJECTED)
    })
  }
  return Promise.resolve(true);
}

/**
 * Change to the Code of Conduct for all users
 */
function updateLatestCoCAllUsers(ENV) {
  return functions.database.ref('/' + ENV.env + '/system/{systemId}/coc')
    .onWrite((snap) => {
      const currData = snap.after.val();
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
          } else {
            console.error("Cannot process user JSON");
            console.error(data.val());
          }
        }, error => {
          console.error(error);
        });
        console.log("Resolving all");
        return Promise.resolve(promise);
      } else {
        return true;
      }
    });
}

/**
 * Change to the Terms and Conditions of all users
 */
function updateLatestToCAllUsers(ENV) {
  return functions.database.ref('/' + ENV.env + '/system/{systemId}/toc')
    .onWrite(async (snap) => {
      const currData = snap.after.val();
      if (currData) {
        let allUsers = refOnce(ENV.env + '/userPublic/');
        if (allUsers == null) {
          return resolveLog("For some reason, all userPublic is null?!")
        }

        let userIds = Object.keys(allUsers);
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
      } else {
        return Promise.resolve(true);
      }
    });
}


function sendIndicatorAssignedMobileNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/indicator/{hazardId}/{indicatorId}/')
    .onWrite((snap, context) => {
      const preIndicatorData = snap.before.val();
      const currIndicatorData = snap.after.val();

      let preIndicatorAssignee = null;
      let currIndicatorAssignee = null;

      let preIndicatorDueDate = null;
      let currIndicatorDueDate = null;

      if (preIndicatorData) {
        preIndicatorAssignee = preIndicatorData.assignee;
        preIndicatorDueDate = preIndicatorData.dueDate
      }

      if (currIndicatorData) {
        currIndicatorAssignee = currIndicatorData.assignee;
        currIndicatorDueDate = currIndicatorData.dueDate
      }

      const hazardId = context.params.hazardId;
      const indicatorId = context.params.indicatorId;

      const rescheduleNotification = createIndicatorRescheduleNotification(currIndicatorData, hazardId, indicatorId);
      const assignedNotification = createIndicatorAssignedNotification(currIndicatorData, hazardId, indicatorId);

      const promises = [];

      if (currIndicatorAssignee !== preIndicatorAssignee) {
        if (currIndicatorAssignee != null) {
          promises.push(sendNotification(ENV.env, rescheduleNotification, currIndicatorAssignee));
          promises.push(sendNotification(ENV.env, assignedNotification, currIndicatorAssignee));
        }
        if (preIndicatorAssignee != null) {
          promises.push(sendNotification(ENV.env, rescheduleNotification, preIndicatorAssignee));
        }
      } else if (currIndicatorDueDate !== preIndicatorDueDate) {
        promises.push(sendNotification(ENV.env, rescheduleNotification, currIndicatorAssignee));
      }

      return Promise.all(promises);
    });
}

function sendResponsePlanApprovalNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/responsePlan/{groupId}/{responsePlanId}/approval/{groupName}/{approverId}')
    .onWrite((snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      const approverId = context.params.approverId;
      const groupId = context.params.groupId;
      const responsePlanId = context.params.responsePlanId;
      const groupName = context.params.groupName;

      if (preData !== currData && (currData === PLAN_WAITINGAPPROVAL || currData === PLAN_REJECTED)) {
        return admin.database().ref(`/${ENV.env}/responsePlan/${groupId}/${responsePlanId}`).once('value').then(responsePlanSnap => {
          const responsePlan = responsePlanSnap.val();

          if (currData === PLAN_WAITINGAPPROVAL) {
            const notification = createResponsePlanApprovalSubmittedNotification(responsePlan);
            if (groupName === "countryDirector") {
              return admin.database().ref(`/${ENV.env}/directorCountry/${approverId}`).once('value').then(directorCountrySnap => {
                return sendNotification(ENV.env, notification, directorCountrySnap.val())
              })
            }
            else if (groupName === "globalDirector") {
              return admin.database().ref(`/${ENV.env}/globalDirector`).orderByChild(`agencyAdmin/${approverId}`).equalTo(true).once('value').then(globalDirectorSnap => {

                return globalDirectorSnap.forEach(function (childSnapshot) {
                  let key = childSnapshot.key;
                  return sendNotification(ENV.env, notification, key)
                });
              })
            }
            else if (groupName === "regionDirector") {
              return admin.database().ref(`/${ENV.env}/directorRegion/${approverId}`).once('value').then(directorRegionSnap => {
                return sendNotification(ENV.env, notification, directorRegionSnap.val())
              })
            }
            else if (groupName === "partner") {
              return sendNotification(ENV.env, notification, approverId)
            }
          }
          else if (currData === PLAN_REJECTED) {
            console.log("Plan rejected. " + groupId);
            const notification = createResponsePlanApprovalRejectedNotification(responsePlan);
            return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, groupId, NOTIFICATION_SETTING_RESPONSE_PLAN_REJECTED)
          }
        });
      }
      return Promise.resolve(true);
    });

}


function countryOfficeClockSettingsChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/countryOffice/{agencyId}/{countryId}/clockSettings')
    .onWrite((snap, context) => {
      const preClockSettingsData = snap.before.val();
      const currClockSettingsData = snap.after.val();

      const agencyId = context.params.agencyId;
      const countryId = context.params.countryId;

      const prePreparednessClockSettings = preClockSettingsData.preparedness;
      const currPreparednessClockSettings = currClockSettingsData.preparedness;

      const preResponsePlanClockSettings = preClockSettingsData.responsePlans;
      const currResponsePlanClockSettings = currClockSettingsData.responsePlans;

      let notification;

      if (prePreparednessClockSettings !== currPreparednessClockSettings) {
        notification = createActionCountryRescheduleNotification(agencyId, countryId);
        return sendNotificationToCountryUsers(ENV.env, notification, countryId)
      }
      if (preResponsePlanClockSettings !== currResponsePlanClockSettings) {
        notification = createResponsePlanCountryRescheduleNotification(agencyId, countryId);
        return sendNotificationToCountryUsers(ENV.env, notification, countryId)
      }
    });
}


function networkClockSettingsChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/network/{networkId}/clockSettings')
    .onWrite((snap, context) => {
      const preClockSettingsData = snap.before.val();
      const currClockSettingsData = snap.after.val();

      const networkId = context.params.networkId;

      const prePreparednessClockSettings = preClockSettingsData.preparedness;
      const currPreparednessClockSettings = currClockSettingsData.preparedness;

      if (prePreparednessClockSettings !== currPreparednessClockSettings) {
        let notification = createActionLocalNetworkRescheduleNotification(networkId);

        return sendNotificationToLocalNetworkUsers(ENV.env, notification, networkId)
      }
    });
}



function networkCountryClockSettingsChange(ENV) {
  return functions.database.ref('/' + ENV.env + '/networkCountry/{networkId}/{countryId}/clockSettings')
    .onWrite((snap, context) => {
      const preClockSettingsData = snap.before.val();
      const currClockSettingsData = snap.after.val();

      const networkId = context.params.networkId;
      const countryId = context.params.countryId;

      const prePreparednessClockSettings = preClockSettingsData.preparedness;
      const currPreparednessClockSettings = currClockSettingsData.preparedness;

      if (prePreparednessClockSettings !== currPreparednessClockSettings) {
        let notification = createActionNetworkCountryRescheduleNotification(networkId, countryId);
        return sendNotificationToCountryUsers(ENV.env, notification, countryId)
      }
    });
}


function sendActionMobileNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/action/{groupId}/{actionId}/')
    .onWrite((snap, context) => {

      const preActionData = snap.before.val();
      const currActionData = snap.after.val();

      let preActionAssignee = null;
      let currActionAssignee = null;
      let preActionDueDate = null;
      let currActionDueDate = null;
      let preActionCompletedAt = null;
      let currActionCompletedAt = null;
      let preActionUpdatedAt = null;
      let currActionUpdatedAt = null;
      let preActionCreatedAt = null;
      let currActionCreatedAt = null;
      let preActionFrequencyBase = null;
      let currActionFrequencyBase = null;
      let preActionFrequencyValue = null;
      let currActionFrequencyValue = null;

      if (preActionData != null) {
        preActionAssignee = preActionData.asignee;
        preActionDueDate = preActionData.dueDate;
        preActionCompletedAt = preActionData.isCompleteAt;
        preActionUpdatedAt = preActionData.updatedAt;
        preActionCreatedAt = preActionData.createdAt;
        preActionFrequencyBase = preActionData.frequencyBase;
        preActionFrequencyValue = preActionData.frequencyValue;
      }

      if (currActionData != null) {
        currActionAssignee = currActionData.asignee;
        currActionDueDate = currActionData.dueDate;
        currActionCompletedAt = currActionData.isCompleteAt;
        currActionUpdatedAt = currActionData.updatedAt;
        currActionCreatedAt = currActionData.createdAt;
        currActionFrequencyBase = currActionData.frequencyBase;
        currActionFrequencyValue = currActionData.frequencyValue;
      }

      const groupId = context.params.groupId;
      const actionId = context.params.actionId;

      if (currActionData.type === 1 || currActionData.type === 2) {
        const rescheduleNotification = createActionRescheduleNotification(currActionData, groupId, actionId);
        const assignedNotification = createActionAssignedNotification(currActionData, groupId, actionId);

        const promises = [];

        if (currActionAssignee !== preActionAssignee) {
          if (currActionAssignee != null) {
            promises.push(sendNotification(ENV.env, rescheduleNotification, currActionAssignee));
            promises.push(sendNotification(ENV.env, assignedNotification, currActionAssignee))
          }
          if (preActionAssignee != null) {
            promises.push(sendNotification(ENV.env, rescheduleNotification, preActionAssignee))
          }
        } else if (currActionDueDate !== preActionDueDate ||
          currActionCompletedAt !== preActionCompletedAt ||
          currActionUpdatedAt !== preActionUpdatedAt ||
          currActionCreatedAt !== preActionCreatedAt ||
          currActionFrequencyBase !== preActionFrequencyBase ||
          currActionFrequencyValue !== preActionFrequencyValue
        ) {
          promises.push(sendNotification(ENV.env, rescheduleNotification, currActionAssignee))
        }

        return Promise.all(promises)
      }
    });
}

function sendResponsePlanMobileNotification(ENV) {
  return functions.database.ref('/uat/action/{groupId}/{responsePlanId}/')
    .onWrite((snap, context) => {
      const preResponsePlanData = snap.before.val();
      const currResponsePlanData = snap.after.val();

      let preResponsePlanTimeCreated = null;
      let currResponsePlanTimeCreated = null;
      let preResponsePlanTimeUpdated = null;
      let currResponsePlanTimeUpdated = null;
      let currResponsePlanAsignee = null;

      if (preResponsePlanData != null) {
        preResponsePlanTimeCreated = preResponsePlanData.timeCreated;
        preResponsePlanTimeUpdated = preResponsePlanData.timeUpdated
      }
      if (currResponsePlanData != null) {
        currResponsePlanTimeCreated = currResponsePlanData.timeCreated;
        currResponsePlanTimeUpdated = currResponsePlanData.timeUpdated;
        currResponsePlanAsignee = currResponsePlanData.asignee;
      }
      //For Expiration

      const groupId = context.params.groupId;
      const responsePlanId = context.params.responsePlanId;
      const rescheduleNotification = createResponsePlanRescheduleNotification(groupId, responsePlanId);

      if ((currResponsePlanTimeCreated !== preResponsePlanTimeCreated ||
          currResponsePlanTimeUpdated !== preResponsePlanTimeUpdated) && currResponsePlanAsignee != null) {
        return sendNotification(ENV.env, rescheduleNotification, currResponsePlanAsignee)
      }
    });

}

function sendAlertMobileNotification(ENV) {
  return functions.database.ref('/' + ENV.env + '/alert/{id}/{alertId}')
    .onWrite((snap, context) => {
      const preData = snap.before.val();
      const currData = snap.after.val();

      if (preData != null) {
        const preAlertLevel = preData.alertLevel;
        const currAlertLevel = currData.alertLevel;

        let preApprovalKey;
        let preApprovalLevel;
        if (preData.approval != null && preData.approval.countryDirector != null && Object.keys(preData.approval.countryDirector).length > 0) {
          preApprovalKey = Object.keys(preData.approval.countryDirector)[0];
          preApprovalLevel = preData.approval.countryDirector[preApprovalKey]
        }

        let currApprovalKey;
        let currApprovalLevel;
        if (currData.approval != null && currData.approval.countryDirector != null && Object.keys(currData.approval.countryDirector).length > 0) {
          currApprovalKey = Object.keys(currData.approval.countryDirector)[0];
          currApprovalLevel = currData.approval.countryDirector[currApprovalKey]
        }

        let toGreenAmber = preAlertLevel !== currAlertLevel && (currAlertLevel === ALERT_AMBER || currAlertLevel === ALERT_GREEN);
        let toApprovedRed = preApprovalLevel !== currApprovalLevel && currAlertLevel === ALERT_RED && currApprovalLevel === PLAN_APPROVED;
        let redAlertRequested = currAlertLevel === ALERT_RED && currApprovalLevel === PLAN_WAITINGAPPROVAL && (currAlertLevel !== preAlertLevel || preApprovalLevel !== currApprovalLevel);

        if (toGreenAmber || toApprovedRed || redAlertRequested) {
          let id = context.params.id;
          let alertId = context.params.alertId;
          return admin.database().ref(`/${ENV.env}/alert/${id}/${alertId}`).once('value')
            .then(alertSnap => {
              alert = alertSnap.val();
              if (toGreenAmber) {
                let notification = createAlertLevelChangedNotification(alert, alertId, preAlertLevel, currAlertLevel);
                return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, id, NOTIFICATION_SETTING_ALERT_LEVEL_CHANGED)
              } else if (toApprovedRed) {
                let notification = createRedAlertApprovedNotification(alert, alertId);
                return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, id, NOTIFICATION_SETTING_ALERT_LEVEL_CHANGED)
              } else if (redAlertRequested) {
                let notification = createRedAlertRequestedNotification(alert, alertId, preAlertLevel, currAlertLevel);
                return sendCountryNetworkNetworkCountryNotification(ENV.env, notification, id, NOTIFICATION_SETTING_RED_ALERT_REQUEST)
              }
            })
        }
      }
      return Promise.resolve(true);
    });
}

function sendNotificationToLocalNetworkUsers(env, notification, id, notificationSetting) {
  let networkPromise = admin.database().ref(`/${env}/network/${id}`).once('value');

  return networkPromise.then(networkSnap => {
    let network = networkSnap.val();

    if (network) {
      let agencyPromises = [];
      for (const agencyName in network.agencies) {
        if (network.agencies.hasOwnProperty(agencyName) && network.agencies[agencyName].hasOwnProperty('countryCode') && network.agencies[agencyName].isApproved) {
          let countryId = network.agencies[agencyName].countryCode;
          agencyPromises.push(sendNotificationToCountryUsers(env, notification, countryId, notificationSetting))
        }
      }
      return Promise.all(agencyPromises)
    } else {
      return Promise.reject(new Error('Network doesnt exist'))
    }
  })
}

function sendNotificationToNetworkCountry(env, notification, id, notificationSetting) {
  //Sorry for the climb
  return admin.database().ref(`/${env}/networkCountry/`).once('value').then(networkCountrySnap => {
    let networkCountryBase = networkCountrySnap.val();
    for (const networkId in networkCountryBase) {
      //networkCountry/{networkId}
      if (networkCountryBase.hasOwnProperty(networkId)) {
        for (const networkCountryId in networkCountryBase[networkId]) {
          //networkCountry/{networkId}/{networkCountryId}
          if (networkCountryBase[networkId].hasOwnProperty(networkCountryId)) {
            if (networkCountryId === id) {
              let networkCountry = networkCountryBase[networkId][networkCountryId];
              let networkCountryPromises = [];
              if (networkCountry.agencyCountries) {
                for (const agencyId in networkCountry.agencyCountries) {
                  //networkCountry/{networkId}/{networkCountryId}/{agencyId*ignored*}
                  if (networkCountry.agencyCountries.hasOwnProperty(agencyId)) {
                    for (const countryId in networkCountry.agencyCountries[agencyId]) {
                      //networkCountry/{networkId}/{networkCountryId}/{countryId*ignored*}/{countryId}/
                      if (networkCountry.agencyCountries[agencyId].hasOwnProperty(countryId)) {
                        const country = networkCountry.agencyCountries[agencyId][countryId];
                        if (country.isApproved) {
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
function sendCountryNetworkNetworkCountryNotification(env, notification, id, notificationSetting) {
  return sendNotificationToCountryUsers(env, notification, id, notificationSetting)
    .then(
      //Success
      function () {
        return Promise.resolve()
      },
      //Fail
      function (error) {
        console.log(error);
        return sendNotificationToLocalNetworkUsers(env, notification, id, notificationSetting);
      }
    )
    .then(
      function () {
        return Promise.resolve()
      },
      function (error) {
        console.log(error);
        return sendNotificationToNetworkCountry(env, notification, id, notificationSetting)
      }
    )
}
function sendNotificationToCountryUsers(env, notification, countryId, notificationSetting) {
  if (notificationSetting === undefined) {
    notificationSetting = null;
  }
  return admin.database().ref(`/${env}/group/country/${countryId}/`).once('value').then(countryGroupSnap => {
    let countryGroup = countryGroupSnap.val();
    if (countryGroup) {
      const sendAlertPromises = [];
      for (const userId in countryGroup.countryallusersgroup) {
        if (countryGroup.countryallusersgroup.hasOwnProperty(userId)) {
          if (notificationSetting == null) {
            sendAlertPromises.push(sendNotification(env, notification, userId))
          } else {
            sendAlertPromises.push(sendNotificationWithSetting(env, notification, userId, countryId, notificationSetting))
          }
        }
      }
      return Promise.all(sendAlertPromises)
    } else {
      return Promise.reject(new Error(`Country doesnt exist: ${countryId}`))
    }
  })
}

function createAlertLevelChangedNotification(alert, alertId, preAlertLevel, currAlertLevel) {
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

function createRedAlertApprovedNotification(alert, alertId) {
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

function createRedAlertRequestedNotification(alert, alertId) {
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

function createIndicatorAssignedNotification(indicator, hazardId, indicatorId) {
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

function createIndicatorRescheduleNotification(indicator, hazardId, indicatorId) {
  return {
    'data': {
      'indicatorId': indicatorId,
      'hazardId': hazardId,
      'type': NOTIFICATION_INDICATOR_RESCHEDULE.toString()
    }
  }
}

//LEVEL is apa/mpa
function createActionAssignedNotification(action, groupId, actionId) {
  return {
    'notification': {
      'title': `An ${action.level === 1 ? "minimum" : "advanced"} has been assigned to you`,
      'body': `The following ${action.level === 1 ? "minimum" : "advanced"} preparedness action: ${action.task} has been assigned to you`
    },
    'data': {
      'actionId': actionId,
      'groupId': groupId,
      'actionLevel': action.level.toString(),
      'type': NOTIFICATION_ACTION_ASSIGNED.toString()
    }
  }
}

function createActionRescheduleNotification(action, groupId, actionId) {
  return {
    'data': {
      'actionId': actionId,
      'groupId': groupId,
      'actionLevel': action.level.toString(),
      'type': NOTIFICATION_ACTION_RESCHEDULE.toString()
    }
  }
}

function createResponsePlanRescheduleNotification(groupId, responsePlanId) {
  return {
    'data': {
      'responsePlanId': responsePlanId,
      'groupId': groupId,
      'type': NOTIFICATION_RESPONSE_PLAN_RESCHEDULE.toString()
    }
  }
}

function createActionCountryRescheduleNotification(agencyId, countryId) {
  return {
    'data': {
      'agencyId': agencyId,
      'countryId': countryId,
      'type': NOTIFICATION_ACTION_COUNTRY_RESCHEDULE.toString()
    }
  }
}

function createResponsePlanCountryRescheduleNotification(agencyId, countryId) {
  return {
    'data': {
      'agencyId': agencyId,
      'countryId': countryId,
      'type': NOTIFICATION_RESPONSE_PLAN_COUNTRY_RESCHEDULE.toString()
    }
  }
}

function createActionLocalNetworkRescheduleNotification(networkId) {
  return {
    'data': {
      'networkId': networkId,
      'type': NOTIFICATION_ACTION_LOCAL_NETWORK_RESCHEDULE.toString()
    }
  }
}

function createActionNetworkCountryRescheduleNotification(networkId, countryId) {
  return {
    'data': {
      'networkId': networkId,
      'countryId': countryId,
      'type': NOTIFICATION_ACTION_NETWORK_COUNTRY_RESCHEDULE.toString()
    }
  }
}

function createResponsePlanApprovalSubmittedNotification(responsePlan) {
  return {
    'notification': {
      'title': "A response plan has been submitted for approval",
      'body': `The following response plan: ${responsePlan.name} has been submitted for approval`
    }
  }
}

function createResponsePlanApprovalRejectedNotification(responsePlan) {
  return {
    'notification': {
      'title': "A response plan has been rejected",
      'body': `The following response plan: ${responsePlan.name} has been rejected`
    }
  }
}

function sendNotification(env, payload, userId) {
  console.log("Sending Notification");
  return admin.database().ref(`/${env}/userPublic/${userId}/deviceNotificationIds`).once('value')
    .then(deviceNotificationIdsSnap => {
      let deviceNotificationIds = deviceNotificationIdsSnap.val();
      if (deviceNotificationIds) {
        let promises = [];
        for (let i = deviceNotificationIds.length - 1; i >= 0; i--) {
          let deviceNotificationId = deviceNotificationIds[i].val();
          promises.push(admin.messaging().sendToDevice(deviceNotificationId, payload))
        }
        return Promise.all(promises)
      } else {
        return Promise.resolve()
      }
    })
}

function sendNotificationWithSetting(env, payload, userId, countryId, notificationGroup) {
  console.log("Send Notification With Setting " + userId + " - " + notificationGroup);
  return admin.database().ref(`/${env}/staff/${countryId}/${userId}/notification/`).once('value')
    .then(notificationSnap => {
      if (notificationSnap.val() != null) {
        for (let i = notificationSnap.val().length - 1; i >= 0; i--) {
          if (notificationSnap.val()[i] === notificationGroup) {
            return Promise.resolve()
          }
        }
        return Promise.reject(new Error('fail'))
      } else {
        console.log(`Notification Setting Error: user (${userId}) setting (${notificationGroup})`);
        return Promise.reject(new Error('fail'))
      }
    })
    .then(function () {
      return sendNotification(env, payload, userId)
    })
    .catch(function (error) {
      console.log(error);
      return Promise.resolve()
    });
}


/**
 * Private functions
 */
// Return a promise resolution with a message logged beforehand
function resolveLog(msg) {
  console.log(msg);
  return Promise.resolve(true);
}

// Get the value of something at a specific reference
async function refOnce(path) {
  let snapshot = await admin.database().ref(path).once('value');
  if (!snapshot.exists()) {
    return null;
  } else {
    return snapshot.val();
  }
}

// Fetching users and send an email
function fetchUsersAndSendEmail(node, countryId, title, content, setting, assignee) {
  if (assignee === undefined) { assignee = null; }
  console.log("fetchUsersAndSendEmail - gets called!!! " + node);
  return admin.database().ref('/' + node + '/externalRecipient/' + countryId).once('value', (data) => {
    let exObj = data.val();
    if (exObj) {
      let recipients = Object.keys(exObj).map(key => exObj[key]);
      return Promise.all(
        recipients.map((recipient) => {
          if (recipients[i].notificationsSettings[setting]) {
            return sendEmail(recipient.email, title, content);
          }
          return Promise.resolve(true);
        })
      );
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
function sendWelcomeEmailWith(email, userPassword) {
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
  return mailTransport.sendMail(mailOptions, null).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

//send general email
function sendEmail(email, title, content) {
  const mailOptions = {
    from: '"ALERT" <noreply@firebase.com>',
    to: email
  };
  mailOptions.subject = title;
  mailOptions.text = content;
  return mailTransport.sendMail(mailOptions, null).then(() => {
    console.log('normal email sent to:', email);
    return true;
  });
}

// Generate random password between 8-10 characters long
function generateRandomPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789";
  const string_length = getRandomInt(8, 10);
  let randomstring = '';
  let rnum;
  let charCount = 0;
  let numCount = 0;

  for (let i = 0; i < string_length; i++) {
    if ((Math.floor(Math.random() * 2) === 0) && numCount < 3 || charCount >= 5) {
      rnum = Math.floor(Math.random() * 10);
      randomstring += rnum;
      numCount += 1;
    } else {
      rnum = Math.floor(Math.random() * chars.length);
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
