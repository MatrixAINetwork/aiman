/* jshint ignore:start */
Package.describe({
  name: 'matrix:aiman',
  version: '0.0.1',
  summary: 'Matrix JavaScript API, middleware to talk to a matrix node over RPC',
  git: 'https://github.com/matrix/aiman.js',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "xmlhttprequest": "1.0.0"
});


Package.onUse(function(api) {
  api.versionsFrom('1.0.0.0');

  // api.use('3stack:bignumber@2.0.0', 'client');

  api.export(['Aiman', 'BigNumber'], ['client', 'server']);

  api.addFiles('dist/man.js', ['client', 'server']);
  api.addFiles('package-init.js', ['client', 'server']);
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('test');
//   api.addFiles('test-tests.js');
// });
/* jshint ignore:end */
