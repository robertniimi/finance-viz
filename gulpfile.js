var gulp = require('gulp');
var webpack = require('webpack-stream');
var $ = require('gulp-load-plugins')();

var webpackConfig = require('./web/webpack.config');
console.log('[gulpfile] webpackConfig: ', webpackConfig);

// PATHS

gulp.task('default', () => {

});

gulp.task('webpack', () => {
  return gulp.src('./web/app/js/main')
    .pipe($.plumber())
    .pipe(webpack())
    .pipe($.plumber.stop())
    .pipe(gulp.dest('./web/app'))
    ;
});

gulp.task('serve', () => {
  return $.nodemon({
    script: './server/server.js',
    ignore: ['./server/data/']
  })
  .pipe($.plumber())
  ;
});
