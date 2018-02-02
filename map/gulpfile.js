const gulp = require('gulp');
const path = require('path');
const del = require('del');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const sourceDir = path.resolve(__dirname, './src/');
const distDir = path.resolve(__dirname, './public/');

const entryJs = path.join(sourceDir, '/js/entry.js');

gulp.task('cleanOutput', () => {
  return del([path.join(distDir, '/**/*')]);
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

gulp.task('default', gulp.series(
  'cleanOutput',
  gulp.parallel(
    'buildJs',
    'copyHtml'
  )
));
