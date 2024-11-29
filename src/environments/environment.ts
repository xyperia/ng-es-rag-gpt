// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  encryptSalt: 'VTIDEV',
  appTitle: 'VTI-DEV',
  devName: 'VTI DevTeam',
  apiUrl: 'https://api.virtusindonesia.cloud',
  ragUrl: 'https://rag.virtusindonesia.cloud',
  sessionTimeout: 900000,
  apmServerAppName: 'ng-vti-portal',
  apmServerUrl: 'https://apm-server.virtusindonesia.cloud',
  apmServerEnv: 'Development'
};

/*

  Time Cheat Sheet

  60 Minutes = 3600000
  30 Minutes = 1800000
  15 Minutes = 900000
  10 Seconds = 10000
  1 Second = 1000

*/



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
