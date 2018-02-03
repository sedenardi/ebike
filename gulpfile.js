const gulp = require('gulp');
const path = require('path');
const del = require('del');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sass = require('@csstools/postcss-sass');
// const cssnano = require('cssnano');

const moduleAssets = path.resolve(__dirname, './node_modules');
const sourceDir = path.resolve(__dirname, './map/src/');
const distDir = path.resolve(__dirname, './public/');

const entryJs = path.join(sourceDir, '/js/entry.js');

gulp.task('cleanOutput', () => {
  return del([path.join(distDir, '/**/*')]);
});

gulp.task('copyImages', () => {
  return gulp.src(path.join(moduleAssets, '/leaflet/dist/images/**/*'))
    .pipe(gulp.dest(path.join(distDir, '/css/images')));
});

gulp.task('copyHtml', () => {
  return gulp.src(path.join(sourceDir, '/**/*.html'))
    .pipe(gulp.dest(distDir));
});

gulp.task('buildJs', () => {
  return gulp.src(entryJs)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(path.join(distDir, '/js/')));
});

gulp.task('compileStyles', () => {
  const plugins = [
    sass({
      includePaths: [
        moduleAssets
      ]
    }),
    // cssnano({ preset: 'default' })
  ];
  return gulp.src(path.join(sourceDir, '/css/entry.scss'))
    .pipe(postcss(plugins))
    .pipe(rename('site.css'))
    .pipe(gulp.dest(path.join(distDir, '/css')));
});

gulp.task('default', gulp.series(
  'cleanOutput',
  gulp.parallel(
    'buildJs',
    'compileStyles',
    'copyHtml',
    'copyImages'
  )
));

gulp.task('watchJs', () => {
  gulp.watch(path.join(sourceDir, '/js/**/*'), gulp.series('buildJs'));
});

gulp.task('watchStyles', () => {
  gulp.watch(path.join(sourceDir, '/css/**/*'), gulp.series('compileStyles'));
});

gulp.task('watch', gulp.series(
  'default',
  gulp.parallel('watchJs', 'watchStyles')
));
