(function () {
  'use strict';

  const gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    paths = require('../paths')

  gulp.task('inspect', function () {
    return gulp.src([paths.js, paths.unit_tests, paths.unit_tests_files])
      .pipe(eslint())
      .pipe(eslint.failAfterError());
  });
})();