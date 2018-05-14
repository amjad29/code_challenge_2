(function () {
  'use strict';

  const gulp = require('gulp'),
    babel = require('gulp-babel'),
    paths = require('../paths');

  gulp.task('build:json', ['clean'], function (done) {
    return gulp.src('src/**/*.json')
      .pipe(gulp.dest(paths.build), done);
  });

  gulp.task('build', ['clean', 'build:json', 'inspect'], function (done) {
    return gulp.src('src/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest(paths.build), done);
  });

})();