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

Npm.depends({
    "md5"           : "2.1.0",
    "stream-buffers": "3.0.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.4.1');
  api.use('npm-bcrypt@=0.8.7', 'server');

  api.use('accounts-base@1.2.8', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base@1.2.8', ['client', 'server']);
  api.use('http', ['server']);
  api.use('srp@1.0.9', ['client', 'server']);
  api.use('sha@1.0.8', ['client', 'server']);
  api.use('email@1.0.14_1', ['server']);
  api.use('random@1.0.10', ['server']);
  api.use('ejson@1.0.12', 'server');
  api.use('callback-hook@1.0.9', 'server');
  api.use('check@1.2.3');
  api.use('underscore@1.0.9');
  api.use('ddp@1.2.5', ['client', 'server']);

  api.addFiles('sms_server.js', 'server');
  api.addFiles('phone_server.js', 'server');
  api.addFiles('phone_client.js', 'client');

  api.export('SMS', 'server');
  api.export('SMSTest', 'server', {testOnly: true});
});

Package.onTest(function(api) {});
