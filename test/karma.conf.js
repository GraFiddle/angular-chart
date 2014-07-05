'use strict';

// Contents of: test/karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '..',
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/d3/d3.js',
      'bower_components/c3/c3.js',
      'angular-chart.js',
      'test/*_spec.js'
    ],

    singleRun: true,

    browsers: ['Chrome'],

    frameworks: ['jasmine'],

    preprocessors: {
      'angular-chart.js': 'coverage'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['progress', 'coverage']

  });
};