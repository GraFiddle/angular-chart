'use strict';

var gulp = require('gulp');

// Code Formatting
//
var jshint = require('gulp-jshint');
gulp.task('jshint', function () {
  return gulp.src([
    '*.js',
    'src/js/**/*.js',
    'test/**/*.js',
    'debug/**/*.js'
  ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Unit Test
//
var karma = require('karma').server;
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  });
});
