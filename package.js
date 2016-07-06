Package.describe({
  name: 'wcsun:accounts-phone',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A login service based on mobile phone number, For Meteor.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/CHAINI-dev/accounts-phone',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.4.1');
  api.use('ecmascript');
  api.mainModule('accounts-phone.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('accounts-phone');
  api.mainModule('accounts-phone-tests.js');
});
