'use strict';

var gulp = require('gulp');


gulp.task('default', ['jshint', 'test', 'build']);
gulp.task('build', ['scripts', 'styles']);


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
var karma = require('karma').server;
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  });
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


// STYLESHEETS PROCESSING
//
var compass = require('gulp-compass');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
gulp.task('styles', function () {
  return gulp.src('./src/scss/angular-chart.scss')
    .pipe(compass({
      sass: './src/scss',
      css: './css'
    }))
    .pipe(minifyCSS())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('css'));
});
