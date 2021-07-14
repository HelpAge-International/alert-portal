# AlertPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.0. Please install [Angular CLI](https://github.com/angular/angular-cli) before continuing.

* Continuing Angular Update


- Setting up the dev environment (information surrounding this)
- Running the project
- Deploying the project
- Backups



## Continuing Angular Update

This branch has been created to upgrade the project from Angular 4.1 to Angular 11.2 as well as from Node 8 to Node 14.

Through that process some dependency had to be updated, mostly:

- angularfire2 to @angular/fire
- rxjs 5.1 to rxjs 6.6

These changes lead to a lot of refactoring needed in almost every files of the project. To help with continuing this process, here are the most common changes needed:

#### angularfire2 to @angular/fire

Change all occurrences of 

```typescript
import {AngularFire} from "angularfire2";
```

to

```typescript
import {AngularFireDatabase} from "@angular/fire/database";
```

Then update the denpendency injection in the constructor from:

```typescript
private af: AngularFire,
```

to

```typescript
private afd: AngularFireDatabase,
```

Update query, such as:

```typescript
this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments', {preserveSnapshot: true})
      .takeUntil(this.ngUnsubscribe)
      .subscribe(snap => {
        snap.forEach((snapshot) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = snapshot.key;
          x.name = snapshot.val().name;
          this.departments.push(x);
          this.departmentMap.set(x.id, x.name);
        })
      });
```

to

```typescript
this.afd.object<ModelDepartment[]>(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments')
      .snapshotChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(snap => {
        const departments = snap.payload.val()
        departments.forEach((department) => {
          let x: ModelDepartment = new ModelDepartment();
          x.id = department.id;
          x.name = department.name;
          this.departments.push(x);
          this.departmentMap.set(x.id, x.name);
        })
      });
```

let's break down the changes:

```typescript
this.af.database.object(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments', {preserveSnapshot: true})
```

to

```typescript
this.afd.object<ModelDepartment[]>(Constants.APP_STATUS + '/agency/' + this.agencyAdminId + '/departments')
```

* We use directly the AngularFireDatabase instance by calling `this.afd`. 
* We provide the type of the data for the object in the database `object<ModelDepartment[]>` 
* We remove the preserve snapshot option `, {preserveSnapshot: true}`
* anfularfire2 `object` method used to return an `Observable` but @angular/fire now return a `AngularFireObject` . We need to add either `.snapshotChanges()` or `.valueChanges()` to get an `Observable`. As we need to `preserveSnapshot` we use `.snapshotChanges()` to keep the snapshot information.
* We now need to use the `.pipe()` operator to use the `takeUntil` function.
* We can still get the object key by using  `snapshot.key;`
* But we now need to use `snap.payload.val()` rather than `snap.val()`



The process is similar for a list. From:

```typescript
this.af.database.list(Constants.APP_STATUS + '/staff/' + this.countryId)
      .do(list => {
        list.forEach(item => {
          this.staffList.push(this.addStaff(item));
          this.getStaffPublicUser(item.$key);
        });
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe();
```

to

```typescript
this.afd.list<ModelStaff>(Constants.APP_STATUS + '/staff/' + this.countryId)
      .snapshotChanges()
      .pipe(tap(snapshotList => {
          snapshotList.forEach(snapshot => {
          this.staffList.push(this.addStaff(snapshot.payload.val()));
          this.getStaffPublicUser(snapshot.key);
        });
      }),
      takeUntil(this.ngUnsubscribe))
      .subscribe();
```



* `do` has been replaced with `tap`
* the list operator used to return the item value with the key added as $key. now use `snapshot.payload.val()` to get the item value and `snapshot.key ` 



another example, from:

```typescript
this.af.database.object(Constants.APP_STATUS + '/userPublic/' + userId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(userPublic => {
        this.staffPublicUser[userId] =
          new ModelUserPublic(userPublic.firstName, userPublic.lastName, userPublic.title, userPublic.email);

        this.staffPublicUser[userId].phone = userPublic.phone;
      });
```

to

```typescript
this.afd.object<ModelUserPublic>(Constants.APP_STATUS + '/userPublic/' + userId)
      .valueChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(userPublic => {
        this.staffPublicUser[userId] =
          new ModelUserPublic(userPublic.firstName, userPublic.lastName, userPublic.title, userPublic.email);

        this.staffPublicUser[userId].phone = userPublic.phone;
      });
```





## Setting up the dev environment

Run `ng serve` in root folder of the project for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files. Note: Typescript 2.3.x and node version 9.9.x or below is required. See below for configuring this

> If `ng serve` fails, try running `npm install` first. Make sure you are on a supported branch (master is not supported)

> If you see an error which says `Error. 'make' is not supported` and a reference to a node package called gcpr, then you need to downgrade the version of node to 9.9.x or below. You can do this by running the following

```
sudo npm install -g n && sudo n 9.9.0
```

You can revert to the latest by `sudo n latest`

> If you get a lot of errors about `mapTo` or `flatMap` not being supported in the build, you are probably running a version of typescript that is too new. Run the following to downgrade to a supported version

```
npm install typescript@'>=2.1.0 <2.4.0'
```

## Running the project

Running the project can be done with `ng serve` once node modules are installed

## Deploying to firebase

|--------------|---------------------|-------------|-----------------|-------------|-------------|-------------|
| Project      | Firebase Project Id | APP_STATUS  | app.module.ts   | Hosting     | Database    | Functions   |
|--------------|---------------------|-------------|-----------------|-------------|-------------|-------------|
| sand         | alert-190fa         | /sand       | sand            | alert-190fa | alert-190fa | alert-190fa |
| test         | alert-test          | /test       | sand            | alert-test  | alert-190fa | alert-190fa |
| uat          | alert-uat           | /uat        | sand            | alert-uat   | alert-190fa | alert-190fa |
| live         | alert-live          | /live       | live            | alert-live  | alert-live  | alert-live  |

To run this project you need to 

- Backup user auths (see below)
- Backup database

Then run the following;

```
// Move the APP_STATUS string in Constants.ts to the relevant endpoint
// Comment or uncomment the Firebase config from app.module.ts
firebase list
firebase use <project> 
npm run build-prod 
firebase deploy --only hosting
```

### Backups

Database backups can be done via. the console

Authentication backups require using firebase-cli, using `firebase auth:export auth.json --format=json`. This will export the authentication to a 'auth.json' file. It can be imported via. `auth:import` command. Google it

## Build

Run `npm run build-prod` to generate the production build file

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Translations - i18n
Every string in .html templates should be available for translation. This includes image attributes along with paragrpahs or any other element containing text.

For detailed instructions on how to mark text for translation, please refer to [Angular's official documentation on i18n](https://angular.io/docs/ts/latest/cookbook/i18n.html#!#i18n-attribute)

## Routing

All the routes are defined in the `src/app/app-routing.module.ts`. As an example `/login` route is already defined.

## Firebase

For the Firebase connection, [AngularFire2](https://github.com/angular/angularfire2) library is used.
Please see its [Documentation](https://github.com/angular/angularfire2/blob/master/docs/api-reference.md) that describes login and data retrieval/change processes

For detailed instructions on using routes and route parameters, please refer to the [Angular's official documentation on Routing](https://angular.io/docs/ts/latest/guide/router.html)

## Folder Structure

* "src" folder - project sources
* "src/app" folder - main app component
* "src/app/agency-admin" - agency-admin component
* "src/app/country-admin" - country-admin component
* "src/app/**any-other-folder**" - **any-other-folder** component
* "src/app/assets" - images, other JavaScript and CSS fils are located in their respective subfolders
* "src/app/app-routing.module.ts" - All the routes should be defined here. E.g. `/login` route is already defined as an example.

```
.
├── README.md
├── e2e
│   ├── app.e2e-spec.ts
│   ├── app.po.ts
│   └── tsconfig.e2e.json
├── karma.conf.js
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── agency-admin
│   │   │   ├── agency-admin.component.css
│   │   │   ├── agency-admin.component.html
│   │   │   ├── agency-admin.component.spec.ts
│   │   │   └── agency-admin.component.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── country-admin
│   │   │   ├── country-admin.component.css
│   │   │   ├── country-admin.component.html
│   │   │   ├── country-admin.component.spec.ts
│   │   │   └── country-admin.component.ts
│   │   ├── country-office-profile
│   │   │   ├── country-office-profile.component.css
│   │   │   ├── country-office-profile.component.html
│   │   │   ├── country-office-profile.component.spec.ts
│   │   │   └── country-office-profile.component.ts
│   │   ├── dashboard
│   │   │   ├── dashboard.component.css
│   │   │   ├── dashboard.component.html
│   │   │   ├── dashboard.component.spec.ts
│   │   │   └── dashboard.component.ts
│   │   ├── director-dashboard
│   │   │   ├── director-dashboard.component.css
│   │   │   ├── director-dashboard.component.html
│   │   │   ├── director-dashboard.component.spec.ts
│   │   │   └── director-dashboard.component.ts
│   │   ├── donor-module
│   │   │   ├── donor-module.component.css
│   │   │   ├── donor-module.component.html
│   │   │   ├── donor-module.component.spec.ts
│   │   │   └── donor-module.component.ts
│   │   ├── login
│   │   │   ├── login.component.css
│   │   │   ├── login.component.html
│   │   │   ├── login.component.spec.ts
│   │   │   └── login.component.ts
│   │   ├── map
│   │   │   ├── map.component.css
│   │   │   ├── map.component.html
│   │   │   ├── map.component.spec.ts
│   │   │   └── map.service.ts
│   │   ├── preparedness
│   │   │   ├── preparedness.component.css
│   │   │   ├── preparedness.component.html
│   │   │   ├── preparedness.component.spec.ts
│   │   │   └── preparedness.component.ts
│   │   ├── response-plans
│   │   │   ├── response-plans.component.css
│   │   │   ├── response-plans.component.html
│   │   │   ├── response-plans.component.spec.ts
│   │   │   └── response-plans.component.ts
│   │   ├── risk-monitoring
│   │   │   ├── risk-monitoring.component.css
│   │   │   ├── risk-monitoring.component.html
│   │   │   ├── risk-monitoring.component.spec.ts
│   │   │   └── risk-monitoring.component.ts
│   │   └── system-admin
│   │       ├── system-admin.component.css
│   │       ├── system-admin.component.html
│   │       ├── system-admin.component.spec.ts
│   │       └── system-admin.component.ts
│   ├── assets
│   │   ├── css
│   │   │   └── main.css
│   │   ├── images
│   │   │   ├── alert_logo--grey.svg
│   │   │   ├── alert_logo--white.svg
│   │   │   ├── alert_logo.svg
│   │   │   └── grey.svg
│   │   └── js
│   │       ├── main.js
│   │       └── vendor
│   │           └── jquery.js
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   └── tsconfig.spec.json
├── tsconfig.json
└── tslint.json
```


## Firebase structure

Below is a rough outline of the ids used in Firebase, helping clarify which ids mean what: (hopefully it's correct)

```
- action
    - <country_id>
        - <action_id>
            - documents
                - <document_id>
            - department
                - <department_id>
- actionCHS
    - <system_id>
        - <action_id>
- actionGeneric
    - <system_id>
        - <action_id>
- actionMandated
    - <agency_id>
        - <action_id>
            - department
                - <department_id>
- administratorAgency
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- administratorCountry
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
        - countryId: <country_id>
- administratorLocalAgency
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- administratorNetwork
    - <user_id> 
        - systemAdmin: <system_id>
        - networkIds: <network_ids>[]
- administratorNetworkCountry
    - <user_id> 
        - systemAdmin: <system_id>
        - networkCountryIds: <network_country_ids>[]
- adminNotes
    - <user_id> 
        - <note_id>
- agency
    - <agency_id> 
        - admin: <user_id>
        - department
            - <department_id>
        - networks
            - <network_id>
- alert
    - <country_id>
        - <alert_id>
            - approval
                - countryDirector
                    - <country_id> 
            - otherName: <hazard_other_id>
            - updatedBy: <user_id>
- bugReporting
    - <country_id> / <agency_id> / <system_id> / <network_id> / <network_country_id> / <local_network> / etc.
        - <bug_id>
- countryDirector
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
        - countryId: <country_id>
- countryOffice
    - <agency_id> 
        - <country_id>
            - adminId: <country_admin_id>
- countryOfficeProfile
    - capacity / contacts / ... / surgeEquipment
        - <country_id>
            - <item_id>
                - staffMember: <user_id>
- countryUser
    - <user_id>
        - agencyAdmin
            - <agency_id>
        - countryId: <country_id>
        - systemAdmin
            - <system_id>
- directorCountry
    - <country_id>: <user_id> (country director)
- directorLocalAgency
    - <country_id>: <user_id> (local agency director)
- directorRegion
    - <country_id>: <user_id> (region director)
- document
    - <country_id> 
        - <document_id>
            - uploadedBy: <user_id>
- donor
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- ert
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
        - countryId: <country_id>
- ertLeader
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
        - countryId: <country_id>
- fieldOffice
	- <country_id>
		- <field_office_id>
- globalDirector
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- globalUser
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- group
    - agency
        - <agency_id>
            - agencyallusersgroup
                - <user_id>
            - (all other fields)
                - <user_id>
    - country
        - <country_id>
            - countryallusersgroup
                - <user_id>
            - (all other fields)
                - <user_id>
    - network
        - <network_id>
            - networkallusersgroup
                - <user_id>
            - networkcountryadmins
                - <user_id>
    - systemadmin
        - <system_id>
            - allagencyadminsgroup
            - allcountryadminsgroup
            - allnetworkadminsgroup
            - allusersgroup
- hazard
    - <country_id>
        - <hazard_id>
- hazardCountryContext
    - <country_id>
- hazardOther
    - <hazard_other_id>
- indicator
    - <country_id>
        - <indicator_id>
            - asignee: <user_id>
- localAgencyDirector
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- localAgencyProfile
    - capacity / contacts / ... / surgeEquipment
        - <local_agency_id>
            - <item_id>
- localNetworkProfile
    - capacity
        - <local_network_id>
            - <item_id>
- log
    - (where you can add a log from, so <action_id> or <hazard_id> or etc.)
        - <log_id>
            - addedBy: <user_id>
- message
    - <message_id>
- messageRef
    - agency
        - <agency_id>
	    	- countryadmins
	    		- <country_admin_id> (user_id)
	    			- <message_id>: timestamp
			- countrydirectors
				- <country_director_id> (user_id>)
					- <message_id>: timestamp
			- globaldirector
				- <global_director> (user_id>)
					- <message_id>: timestamp
    - country
    	- <country_id>
	    	- ertLeads
	    		- <ert_lead_id> (user_id)
	    			- <message_id>: timestamp
			- ert
				- <ert> (user_id>)
					- <message_id>: timestamp
			- partner
				- <partner> (user_id>)
					- <message_id>: timestamp
    - system
    	- 
- module
    - <country_id>
- network
    - <network_id>
        - agencies
            - <agency_id>
        - leadAgencyId: <agency_id>
        - networkAdminId: <user_id>
- networkAgencyValidation
    - 
- networkCountry
	- <network_id>
		- <network_country_id>
			- adminId: <user_id>
			- agencyCountries
				- <agency_id>
					- <country_id>
- networkCountryOfficeProfile
    - capacity / contacts / ... / surgeEquipment
        - <network_country_id>
            - <item_id>
- networkCountryValidation   
    - <country_id>
- networkUserSelection
	- <user_id>
		- selectedNetwork: <network_id>
		- selectedNetworkCountry: <network_country_id>
- nonAlert
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
        - countryId: <country_id>
- note
    - <country_id>
        - <action_id>
        	- <note_id>
- partner
	- <partner_id>
		- id: <partner_id>
		- partnerOrganisationId: <partner_organisation_id>
- partnerOrganisation
	- <partner_organisation_id>
		- agencyId: <agency_id>
		- countryId: <country_id>
		- id: <partner_organisation_id>
		- partners
			- <partner_id>
		- userId: <user_id>
		- validationPartnerUserIdL <user_id>
- partnerOrganisationValidation
	- <partner_organisation_id>
- partnerUser
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
- region
	- <agency_id>
		- <region_id>
			- countries
				- <country_id>
				- directorId: <user_id>
- regionDirector
    - <user_id>
        - agencyId: <agency_id>
        - systemAdmin: <system_id>
        - countryId: <country_id>
- responsePlan
	- <country_id>
		- <response_plan_id>
			- createdBy: <user_id>
			- editingUserId: <user_id>
			- planLead: <country_id>
- responsePlanValidation
    - <reponse_plan_id>
- season
    - <country_id>
        - <season_id>
- skill
    - <skill_id>
- staff
    - <country_id>
        - <user_id>
            - department: <department_id>
- system
    - <system_admin_id>
        - groups
            - <group_id>
- userPublic
    - <user_id>
```
