'use strict';

module.exports = function (grunt) {

   // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // default task
  grunt.registerTask('default', ['jshint', 'karma:unit']);
  grunt.registerTask('watch', ['karma:watch']);
  grunt.registerTask('coverage', ['karma:coverage', 'coveralls']);

  grunt.registerTask('build', ['compass', 'cssmin', 'concat', 'uglify']);


  // perform test in Firefox on travis ci
  var testConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'] };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({

    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          specify: 'scss/angular-chart.scss', // only compile this
          cssDir: '.',
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'angular-chart.min.css': ['angular-chart.css']
        }
      }
    },

    concat: {
      dist: {
        src: ['src/legend.js', 'src/chart.js'],
        dest: 'angular-chart.js',
      },
    },


    uglify: {
      dist: {
        files: {
          'angular-chart.min.js': ['src/legend.js', 'src/chart.js']
        }
      }
    },

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

    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage'
      }
    },

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
