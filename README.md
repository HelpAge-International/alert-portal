# AlertPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.0.

>**Please install [Angular CLI](https://github.com/angular/angular-cli) before continuing.**

## Development server
Run `ng serve` in root folder of the project for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files. Note: Typescript 2.3.x and node version 9.9.x or below is required. See below for configuring this

> If `ng serve` fails, try running `npm install` first. Make sure you are on a supported branch (master is not supported)

> If you see an error which says `Error. 'make' is not supported` and a reference to a node package called gcpr, then you need to downgrade the version of node to 9.9.x or below. You can do this by running the following

```
sudo npm install -g n && sudo n 9.9.0
```

> If you get a lot of errors about `mapTo` or `flatMap` not being supported in the build, you are probably running a version of typescript that is too new. Run the following to downgrade to a supported version

```
npm install typescript@'>=2.1.0 <2.4.0'
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## IDE
Basically, any IDE can be used to develop Angular2 applications. But in case you are using **IntelliJ IDEA** please refer to the [Documentation on setting up Angular2 settings](https://www.jetbrains.com/help/idea/2016.3/using-angularjs.html) before continuing.

## Translations - i18n
Every string in .html templates should be available for translation. This includes image attributes along with paragrpahs or any other element containing text.

For detailed instructions on how to mark text for translation, please refer to [Angular's official documentation on i18n](https://angular.io/docs/ts/latest/cookbook/i18n.html#!#i18n-attribute)
 
## Routing
All the routes are defined in the `src/app/app-routing.module.ts`. As an example `/login` route is already defined.

##Firebase
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
