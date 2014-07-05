'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      angularChart: 'angular-chart.js',
      demo: 'demo/*.js'
    }

  });

  grunt.registerTask('default', ['jshint']);
};