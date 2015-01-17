'use strict';

module.exports = function (grunt) {

  // default task
  grunt.registerTask('default', ['jshint', 'karma:unit', 'build']);

  // automatically execute the unit tests when a file changes
  grunt.registerTask('watch', ['karma:watch']);

  // generate coverage report and send it to coveralls
  grunt.registerTask('coverage', ['karma:coverage', 'coveralls']);

  // generate combined and minified distribution files
  grunt.registerTask('build', ['compass', 'cssmin', 'concat', 'uglify']);


  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // perform test in Firefox on travis ci
  var testConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'] };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({

    // Compiles the SCSS files to CSS
    //
    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          specify: 'scss/angular-chart.scss', // only compile this
          cssDir: '.',
        }
      }
    },

    // Minifies the CSS code
    //
    cssmin: {
      target: {
        files: {
          'angular-chart.min.css': ['angular-chart.css']
        }
      }
    },

    // Combines the JavaScript files
    //
    concat: {
      dist: {
        src: ['src/legend.js', 'src/chart.js'],
        dest: 'angular-chart.js',
      },
    },

    // Minifies the JavaScript code
    //
    uglify: {
      dist: {
        files: {
          'angular-chart.min.js': ['src/legend.js', 'src/chart.js']
        }
      }
    },

    // Runs unit tests
    //
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
        reporters: ['coverage']
      }
    },

    // Sends coverage report to Coveralls
    //
    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage'
      }
    },

    // Lints the code
    //
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      src: 'src/*.js',
      test: 'test/*.js',
      demo: 'demo/*.js'
    }

  });

};
