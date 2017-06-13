"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../utils/Constants");
var Enums_1 = require("../utils/Enums");
var HazardImages_1 = require("../utils/HazardImages");
var GeocoderStatus = google.maps.GeocoderStatus;
/**
 * Created by jordan on 05/05/2017.
 */
var SuperMapComponents = (function () {
    function SuperMapComponents() {
        /**
         *    Markers for the map based on a node (ie. administratorCountry, administratorAdmin, etc.
         */
        this.markersForAgencyAdminMap = new Map();
        this.flagToClear = false;
    }
    SuperMapComponents.init = function (af, handler) {
        var components = new SuperMapComponents();
        components.af = af;
        components.subscriptions = handler;
        components.geocoder = new google.maps.Geocoder;
        return components;
    };
    /**
     *   Get the list of countries to highlight on the map based on the folder
     */
    SuperMapComponents.prototype.highlightedCountriesAgencyAdmin = function (uid, folder, funct) {
        var sub = this
            .getCountryOffice(uid, folder)
            .subscribe(function (countryIds) {
            var red = [];
            var yellow = [];
            var green = [];
            for (var obj in countryIds) {
                green.push(Enums_1.Countries[countryIds[obj].location]);
            }
            funct(red, yellow, green);
        });
        this.subscriptions.add(sub);
    };
    SuperMapComponents.prototype.markersForAgencyAdmin = function (uid, folder, funct) {
        var _this = this;
        var sub = this
            .getCountryOffice(uid, folder)
            .flatMap(function (countryOffice) {
            for (var _i = 0, countryOffice_1 = countryOffice; _i < countryOffice_1.length; _i++) {
                var key = countryOffice_1[_i];
                _this.markersForAgencyAdminMap.set(key.$key, key.location);
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/hazard/" + key.$key, { preserveSnapshot: true });
            }
        })
            .subscribe(function (result) {
            result.forEach(function (snapshot) {
                _this.geocoder.geocode({ "address": Enums_1.Countries[_this.markersForAgencyAdminMap.get(result.key)] }, function (geoResult, status) {
                    if (status == GeocoderStatus.OK && geoResult.length >= 1) {
                        var marker = new google.maps.Marker({
                            position: geoResult[0].geometry.location,
                            icon: HazardImages_1.HazardImages.init().get(snapshot.val().hazardScenario)
                        });
                        funct(marker);
                    }
                });
            });
        });
        this.subscriptions.add(sub);
    };
    ;
    SuperMapComponents.prototype.actionInfoForAgencyAdmin = function (uid, folder, funct) {
        var _this = this;
        var sub = this.getCountryOffice(uid, folder)
            .flatMap(function (countryOffice) {
            for (var _i = 0, countryOffice_2 = countryOffice; _i < countryOffice_2.length; _i++) {
                var key = countryOffice_2[_i];
                _this.markersForAgencyAdminMap.set(key.$key, key.location);
                return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/hazard/" + key.$key, { preserveSnapshot: true });
            }
        })
            .subscribe(function (result) {
            result.forEach(function (snapshot) {
                funct(_this.markersForAgencyAdminMap.get(result.key), snapshot.val());
            });
        });
        this.subscriptions.add(sub);
    };
    /**
     *    Find the agency logo path from firebase
     */
    SuperMapComponents.prototype.logoForAgencyAdmin = function (uid, folder, funct) {
        var sub = this.fbgetAgencyObj(uid, folder)
            .subscribe(function (result) {
            if (result != null) {
                funct(result.val().logoPath);
            }
        });
        this.subscriptions.add(sub);
    };
    /**
     * Get the system information
     */
    SuperMapComponents.prototype.getSystemInfo = function (uid, folder, funct) {
        var _this = this;
        var sub = this.fbgetSystemAdminId(uid, folder)
            .flatMap(function (systemAdmin) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/system/" + systemAdmin);
        })
            .subscribe(function (model) {
            var green = model.minThreshold[0];
            var yellow = model.minThreshold[1];
            var red = model.minThreshold[2];
            funct(red, yellow, green);
        });
        this.subscriptions.add(sub);
    };
    /**
     * Get the list of departments for the country
     */
    SuperMapComponents.prototype.getDepForCountry = function (uid, folder, country, funct) {
        var _this = this;
        var sub = this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + folder + "/" + uid)
            .map(function (result) {
            var s;
            for (var key in result.agencyAdmin) {
                s = key;
            }
            return s;
        })
            .flatMap(function (agencyAdmin) {
            return _this.af.database.list(Constants_1.Constants.APP_STATUS + "/countryOffice/" + agencyAdmin);
        })
            .flatMap(function (result) {
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var x = result_1[_i];
                if (x.location == country) {
                    return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/action/" + x.$key, { preserveSnapshot: true });
                }
            }
        })
            .subscribe(function (result) {
            var returnObj = new SDepHolder(result.key);
            returnObj.departments = [];
            returnObj.location = country;
            result.forEach(function (snapshot) {
                returnObj.departments.push(new DepHolder(snapshot.val().department, snapshot.val().actionStatus == null ? 0 : snapshot.val().actionStatus, snapshot.val().level));
            });
            funct(returnObj);
        });
        this.subscriptions.add(sub);
    };
    SuperMapComponents.prototype.getDepsForAllCountries = function (uid, folder, funct) {
        var _this = this;
        this.mDepCounter = 0;
        this.mDepHolder = [];
        var sub = this.getCountryOffice(uid, folder)
            .subscribe(function (result) {
            for (var _i = 0, result_2 = result; _i < result_2.length; _i++) {
                var r = result_2[_i];
                _this.mDepCounter++;
                _this.mDepHolder = [];
                _this.getDepForCountry(uid, folder, r.location, function (holder) {
                    holder = _this.processDepHolder(holder, 1);
                    _this.getDepsForAllCountriesCounterMethod(holder, funct);
                });
            }
        });
        this.subscriptions.add(sub);
    };
    /**
     *    Method to get all the regions inside an agency
     *    - Could return null, and this needs to be handled! Absense determines view type
     */
    SuperMapComponents.prototype.getRegionsForAgency = function (uid, folder, funct) {
        var sub = this.fbgetRegionsForAgency(uid, folder)
            .subscribe(function (result) {
            if (result.childCount == 0) {
                funct("", null);
            }
            result.forEach(function (snapshot) {
                funct(snapshot.key, snapshot.val());
            });
        });
        this.subscriptions.add(sub);
    };
    /**
     *    Counter method for the returning of the departments for a specific agency
     *    - Needs to count due to nature of firebase list call
     */
    SuperMapComponents.prototype.getDepsForAllCountriesCounterMethod = function (holder, funct) {
        if (!this.flagToClear) {
            this.mDepHolder = [];
            this.flagToClear = true;
        }
        this.mDepCounter--;
        if (holder != null) {
            this.mDepHolder.push(holder);
        }
        if (this.mDepCounter == 0) {
            funct(this.mDepHolder);
            this.flagToClear = false;
        }
    };
    /**
     *    Method to work out the actionStatus result based on how the hazard
     *    - Duplicates in the list - finding the average (and removing duplicates)
     *    - Removing any that don't have the desired level
     * */
    SuperMapComponents.prototype.processDepHolder = function (holder, levelToSelect) {
        var newHolder = new Map();
        var counterMap = new Map();
        for (var _i = 0, _a = holder.departments; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.level == levelToSelect) {
                var mHolder = newHolder.get(x.department);
                if (mHolder != null) {
                    mHolder.actionStatus += (x.actionStatus == 2 ? 100 : 0);
                    counterMap.set(x.department, counterMap.get(x.department) + 1);
                }
                else {
                    counterMap.set(x.department, 1);
                    newHolder.set(x.department, new DepHolder(x.department, (x.actionStatus == 2 ? 100 : 0), x.level));
                }
            }
        }
        // Convert the maps to a list
        var mHolders = [];
        newHolder.forEach(function (value, key) {
            var obj = newHolder.get(key);
            obj.actionStatus /= counterMap.get(key);
            newHolder.set(key, obj);
            mHolders.push(newHolder.get(key));
        });
        holder.departments = mHolders;
        return holder;
    };
    /**
     * Get the country office
     */
    SuperMapComponents.prototype.fbgetAgencyList = function (uid, agencyAdminRefFolder) {
        return this.fbgetListBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "agency");
    };
    SuperMapComponents.prototype.fbgetAgencyObj = function (uid, agencyAdminRefFolder) {
        return this.fbgetObjectBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "agency");
    };
    SuperMapComponents.prototype.getCountryOffice = function (uid, agencyAdminRefFolder) {
        return this.fbgetListBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "countryOffice");
    };
    SuperMapComponents.prototype.fbgetAdministratorAgency = function (uid, agencyAdminRefFolder) {
        return this.fbgetListBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "administratorAgency");
    };
    SuperMapComponents.prototype.fbgetRegionsForAgency = function (uid, agencyAdminRefFolder) {
        return this.fbgetObjectBasedOnAgencyAdmin(uid, agencyAdminRefFolder, "region");
    };
    SuperMapComponents.prototype.fbgetObjectBasedOnAgencyAdmin = function (uid, agencyAdminRefFolder, objectFolder) {
        var _this = this;
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + agencyAdminRefFolder + "/" + uid)
            .map(function (result) {
            var s;
            for (var key in result.agencyAdmin) {
                s = key;
            }
            return s;
        })
            .flatMap(function (agencyAdmin) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + objectFolder + "/" + agencyAdmin, { preserveSnapshot: true });
        });
    };
    SuperMapComponents.prototype.fbgetListBasedOnAgencyAdmin = function (uid, agencyAdminRefFolder, objectFolder) {
        var _this = this;
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + agencyAdminRefFolder + "/" + uid)
            .map(function (result) {
            var s;
            for (var key in result.agencyAdmin) {
                s = key;
            }
            return s;
        })
            .flatMap(function (agencyAdmin) {
            return _this.af.database.list(Constants_1.Constants.APP_STATUS + "/" + objectFolder + "/" + agencyAdmin);
        });
    };
    /**
     * Get system admin id firebase handler
     */
    SuperMapComponents.prototype.fbgetSystemAdminId = function (uid, folder) {
        var _this = this;
        return this.af.database.object(Constants_1.Constants.APP_STATUS + "/" + folder + "/" + uid)
            .map(function (result) {
            var s;
            for (var key in result.agencyAdmin) {
                s = key;
            }
            return s;
        })
            .flatMap(function (agencyAdminId) {
            return _this.af.database.object(Constants_1.Constants.APP_STATUS + "/administratorAgency/" + agencyAdminId);
        })
            .map(function (agency) {
            var s;
            for (var key in agency.systemAdmin) {
                s = key;
            }
            return s;
        });
    };
    /**
     * Utility methods for initialising the map and handling colouring and theming of it
     */
    SuperMapComponents.prototype.initCountries = function (uid, folder, done) {
        this.getDepsForAllCountries(uid, folder, function (holder) {
            done(holder);
        });
    };
    SuperMapComponents.prototype.initMapFrom = function (elementId, uid, folder, done, mapIconClicked) {
        var _this = this;
        if (this.map == null) {
            this.initBlankMap(elementId);
        }
        this.getSystemInfo(uid, folder, function (redThresh, yellowThresh, greenThresh) {
            _this.minThreshGreen = greenThresh;
            _this.minThreshRed = redThresh;
            _this.minThreshYellow = yellowThresh;
            _this.getDepsForAllCountries(uid, folder, function (holder) {
                var red = [];
                var yellow = [];
                var green = [];
                for (var _i = 0, holder_1 = holder; _i < holder_1.length; _i++) {
                    var h = holder_1[_i];
                    if (h.overallAction() >= greenThresh) {
                        green.push(Enums_1.Countries[h.location]);
                    }
                    else if (h.overallAction() >= yellowThresh) {
                        yellow.push(Enums_1.Countries[h.location]);
                    }
                    else {
                        red.push(Enums_1.Countries[h.location]);
                    }
                }
                var returnMap = new Map();
                for (var _a = 0, holder_2 = holder; _a < holder_2.length; _a++) {
                    var h = holder_2[_a];
                    returnMap.set(Enums_1.Countries[h.location].toString(), h);
                }
                _this.doneWithEmbeddedStyles(red, "#CD2811", yellow, "#E3A700", green, "#5BA920", _this.map, mapIconClicked);
                done(returnMap);
            });
        });
    };
    SuperMapComponents.prototype.initBlankMap = function (elementId) {
        var uluru = { lat: 54.339089, lng: -2.140014 };
        this.map = new google.maps.Map(document.getElementById(elementId), {
            zoom: 4,
            center: uluru,
            mapTypeControlOptions: {
                mapTypeIds: []
            },
            streetViewControl: false,
            styles: [
                {
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#b0b1b3"
                        }
                    ]
                },
                {
                    elementType: "labels",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#523735"
                        }
                    ]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            "color": "#c9b2a6"
                        }
                    ]
                },
                {
                    featureType: "administrative.country",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            "color": "#f0f0f1"
                        }
                    ]
                },
                {
                    featureType: "administrative.country",
                    elementType: "labels",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "administrative.land_parcel",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "administrative.land_parcel",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            "color": "#dcd2be"
                        }
                    ]
                },
                {
                    featureType: "administrative.land_parcel",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#ae9e90"
                        }
                    ]
                },
                {
                    featureType: "administrative.locality",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "administrative.neighborhood",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "administrative.province",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "landscape.man_made",
                    stylers: [
                        {
                            "color": "#b0b1b3"
                        }
                    ]
                },
                {
                    featureType: "landscape.natural",
                    elementType: "geometry.fill",
                    stylers: [
                        {
                            "color": "#b0b1b3"
                        }
                    ]
                },
                {
                    featureType: "landscape.natural.terrain",
                    stylers: [
                        {
                            "color": "#b0b1b3"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#93817c"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "poi.business",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry.fill",
                    stylers: [
                        {
                            "color": "#a5b076"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#447530"
                        }
                    ]
                },
                {
                    featureType: "road",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#f5f1e6"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels.icon",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#fdfcf8"
                        }
                    ]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#f8c967"
                        }
                    ]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            "color": "#e9bc62"
                        }
                    ]
                },
                {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#e98d58"
                        }
                    ]
                },
                {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            "color": "#db8555"
                        }
                    ]
                },
                {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#806b63"
                        }
                    ]
                },
                {
                    featureType: "transit",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "transit.line",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "transit.line",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#8f7d77"
                        }
                    ]
                },
                {
                    featureType: "transit.line",
                    elementType: "labels.text.stroke",
                    stylers: [
                        {
                            "color": "#ebe3cd"
                        }
                    ]
                },
                {
                    featureType: "transit.station",
                    elementType: "geometry",
                    stylers: [
                        {
                            "color": "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [
                        {
                            "color": "#e5eff7"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "labels.text",
                    stylers: [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            "color": "#92998d"
                        }
                    ]
                }
            ]
        });
    };
    /** Function for where **/
    SuperMapComponents.prototype.doneWithEmbeddedStyles = function (red, redCol, yellow, yellowCol, green, greenCol, map, funct) {
        var layer = new google.maps.FusionTablesLayer({
            suppressInfoWindows: true,
            query: {
                select: '*',
                from: '1Y4YEcr06223cs93DmixwCGOsz4jzXW_p4UTWzPyi',
                where: this.arrayToQuote(red.concat(yellow.concat(green)))
            },
            styles: [
                {
                    polygonOptions: {
                        fillColor: '#f00ff9',
                        strokeOpacity: 0.0
                    }
                },
                {
                    where: this.arrayToQuote(red),
                    polygonOptions: {
                        fillColor: redCol,
                        fillOpacity: 1.0,
                        strokeOpacity: 0.0,
                        strokeColor: "#FFFFFF"
                    },
                    polylineOptions: {
                        strokeColor: "#FFFFFF",
                        strokeOpacity: 1.0,
                        strokeWeight: 1.0
                    }
                },
                {
                    where: this.arrayToQuote(yellow),
                    polygonOptions: {
                        fillColor: yellowCol,
                        fillOpacity: 1.0,
                        strokeOpacity: 0.0,
                        strokeColor: "#FFFFFF"
                    },
                    polylineOptions: {
                        strokeColor: "#FFFFFF",
                        strokeOpacity: 1.0,
                        strokeWeight: 1.0
                    }
                },
                {
                    where: this.arrayToQuote(green),
                    polygonOptions: {
                        fillColor: greenCol,
                        fillOpacity: 1.0,
                        strokeOpacity: 0.0,
                        strokeColor: "#FFFFFF"
                    },
                    polylineOptions: {
                        strokeColor: "#FFFFFF",
                        strokeOpacity: 1.0,
                        strokeWeight: 1.0
                    }
                }
            ]
        });
        layer.setMap(map);
        google.maps.event.addListener(layer, 'click', function (e) {
            funct(e.row.ISO_2DIGIT.value);
            // let c: Countries = <Countries>Countries["GB"];
        });
    };
    /** Convert array of countries to string list **/
    SuperMapComponents.prototype.arrayToQuote = function (array) {
        if (array.length <= 1) {
            return "'ISO_2DIGIT' = '" + array[0] + "'";
        }
        else {
            var s = "'ISO_2DIGIT' IN (";
            for (var i = 0; i < array.length; i++) {
                s += "'" + array[i] + "',";
            }
            if (array.length != 0) {
                s = s.substring(0, s.length - 1);
            }
            s += ")";
            return s;
        }
    };
    return SuperMapComponents;
}());
exports.SuperMapComponents = SuperMapComponents;
var DepHolder = (function () {
    function DepHolder(department, actionStatus, level) {
        this.department = department;
        this.actionStatus = actionStatus;
        this.level = level;
    }
    return DepHolder;
}());
exports.DepHolder = DepHolder;
var SDepHolder = (function () {
    function SDepHolder(countryId) {
        this.countryId = countryId;
        this.departments = [];
    }
    SDepHolder.prototype.overallAction = function () {
        var diviser = 0;
        for (var _i = 0, _a = this.departments; _i < _a.length; _i++) {
            var dep = _a[_i];
            diviser += dep.actionStatus;
        }
        var x = (diviser) / (this.departments.length);
        if (this.departments.length == 0)
            return -1;
        return x;
    };
    return SDepHolder;
}());
exports.SDepHolder = SDepHolder;
var AgencyAdminPlaceholder = (function () {
    function AgencyAdminPlaceholder() {
    }
    return AgencyAdminPlaceholder;
}());
exports.AgencyAdminPlaceholder = AgencyAdminPlaceholder;
