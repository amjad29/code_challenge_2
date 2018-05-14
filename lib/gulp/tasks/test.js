(function () {
  'use strict';

  const gulp = require('gulp'),
    babel = require('gulp-babel'),
    mergeStream = require('merge-stream'),
    paths = require('../paths'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-babel-istanbul');
  // coverageEnforcer = require('gulp-istanbul-enforcer');

  require('babel-polyfill');
  require('babel-core/register');

  process.env.NODE_ENV = 'test';

  gulp.task('test', function (done) {
    mergeStream(
      gulp.src([paths.js])
        .pipe(istanbul()),
      gulp.src([paths.unit_tests_files, 'src/utilities/*.js'])
        .pipe(babel())
    ).pipe(istanbul.hookRequire()) // Force `require` to return covered files
      .on('finish', function () {
        gulp.src([paths.unit_tests])
          .pipe(mocha({ reporter: 'spec', timeout: 10000 }))
          .pipe(istanbul.writeReports())
          .on('end', done);
      });
  });
})();