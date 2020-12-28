/*eslint-disable*/
'use strict';

const gulp = require('gulp');
const del = require('del');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject: any = tsc.createProject('server/tsconfig.json');
const nodemon = require('gulp-nodemon');

/**
 * Remove build directory.
 */
gulp.task('clean', (cb: any) => del(['dist/server'], cb));

/**
 * Build Express server
 */
gulp.task('compile', () => {
  const tsResult = gulp
    .src('server/src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('dist/server'));
});

/**
 * Copy bin directory for www
 */
gulp.task('serverResources', () => gulp.src(['server/src/bin/**']).pipe(gulp.dest('dist/server/bin')));

/**
 * Start the express server
 */
gulp.task('start', () =>
  nodemon({
    script: 'dist/server/bin/www',
    ext: 'js',
  }).on('restart', () => {
    console.log('restarted!');
  })
);

/**
 * Build the project.
 * 1. Clean the build directory
 * 2. Build Express server
 * 3. Copy the dependencies.
 */

gulp.task('build', gulp.series('clean', 'compile', 'serverResources'));
