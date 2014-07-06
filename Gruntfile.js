'use strict';

module.exports = function (grunt) {

   // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // default task
  grunt.registerTask('default', ['jshint', 'karma:unit']);
  grunt.registerTask('watch', ['karma:watch']);
  grunt.registerTask('coverage', ['karma:unit', 'coveralls']);
  grunt.registerTask('coverage2', ['karma:coverage', 'coveralls']);


  // perform test in Firefox on travis ci
  var testConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({

    karma: {
      unit: {
        options: testConfig('test/karma.conf.js')
      },
      watch: {
        options: testConfig('test/karma.conf.js'),
        singleRun: false,
        autoWatch: true
      },
      coverage: {
        options: testConfig('test/karma.conf.js'),
        browsers: ['PhantomJS']
      }
    },

    coveralls: {
      options: {
        debug: true,
        coverage_dir: 'coverage'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      angularChart: 'angular-chart.js',
      test: 'test/*.js',
      demo: 'demo/*.js'
    }

  });

};