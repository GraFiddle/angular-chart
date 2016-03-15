'use strict';

var gulp = require('gulp');


gulp.task('default', ['jshint', 'test', 'build']);
gulp.task('build', ['scripts']);


// CODE FORMATTING
//
var jshint = require('gulp-jshint');
gulp.task('jshint', function () {
  return gulp.src([
    '*.js',
    '!angular-chart.min.js',
    'src/js/**/*.js',
    'test/**/*.js',
    'debug/**/*.js'
  ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});


// UNIT TESTS
//
var Server = require('karma').Server;
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done()).start();
});

// JAVASCRIPT PROCESSING
//
var ngAnnotate = require('gulp-ng-annotate');
var ngFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
gulp.task('scripts', function () {
  var scriptsFile = 'angular-chart.js';
  return gulp.src([
    'src/js/**/*.js'
  ])
    .pipe(ngAnnotate({
      single_quotes: true
    }))
    .pipe(ngFilesort())
    .pipe(concat(scriptsFile))
    .pipe(gulp.dest(''))
    .pipe(uglify())
    .pipe(concat('angular-chart.min.js'))
    .pipe(gulp.dest(''));
});
