// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  custom: {
    LOGIN_URL: 'http://localhost:3000/RklSRS1GUkVF=login',
    SIGNUP_URL: 'http://localhost:3000/RklSRS1GUkVF=signup',
    REGISTRATION_URL: 'http://localhost:3000/RklSRS1GUkVF=registration',
    ADMIN_URL: 'http://localhost:3000/RklSRS1GUkVF=admin',
    VIEW_URL: 'http://localhost:3000/RklSRS1GUkVF=viewerData',
    NOTIFICATION_URL: 'http://localhost:3000/RklSRS1GUkVF=notification',
    SET_SOLVED_NOTIFICATION_URL: 'http://localhost:3000/RklSRS1GUkVF=solvedNotification',
    SOCIAL: {
      FACEBOOK: 'https://facebook.com/rafsunjany.arman.1',
      BLOG: 'https://heaplinker.com',
      GIT: 'https://github.com/rjarman/Fire-Free',
      LINKEDIN: 'https://linkedin.com/in/rafsun-jany-arman/',
      GITKRAKEN: 'https://timelines.gitkraken.com/timeline/eb34496854364cfbb787a7ca282c9af1'
    },
    PATH: {
      ADMIN_PATH: 'http://localhost:3000/adminsPhotos/',
      CONSUMER_PATH: 'http://localhost:3000/customerPhotos/'
    }
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
