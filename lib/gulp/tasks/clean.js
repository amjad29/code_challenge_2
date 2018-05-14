(function () {
  'use strict';

  const gulp = require('gulp'),
    rimraf = require('rimraf'),
    paths = require('../paths');

  gulp.task('clean', function (cb) {
    rimraf(paths.build, cb);
  });
})();
