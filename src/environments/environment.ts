// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCz1QCypERKfLxB8yHvsr7A3VR2HrVWBWU',
    authDomain: 'haven-hawaii.firebaseapp.com',
    databaseURL: 'https://haven-hawaii.firebaseio.com',
    projectId: 'haven-hawaii',
    storageBucket: 'haven-hawaii.appspot.com',
    messagingSenderId: '138707248833'
  }
};
