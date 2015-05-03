'use strict';

// Contents of: test/karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',

    files: [
      // libraries
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/d3/d3.js',
      'bower_components/c3/c3.js',

      // the directives
      'src/js/**/*.js',

      // data
      //'test/test-data.js',

      // test
      'test/*_spec.js'
    ],

    singleRun: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    preprocessors: {
      'src/js/**/*.js': ['coverage']
    },

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/'
    }

  });
};
