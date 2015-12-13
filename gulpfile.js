var gulp = require('gulp');
var webpack = require('webpack-stream');
var $ = require('gulp-load-plugins')();

var webpackConfig = require('./web/webpack.config');

// PATHS

gulp.task('default', () => {

});

gulp.task('webpack', () => {
  return gulp.src('web/app/js/**/*')
    .pipe($.plumber())
    .pipe(webpack(webpackConfig))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('web/app'))
    ;
});

gulp.task('serve', () => {
  return $.nodemon({
    script: './server/server.js',
    ignore: ['./server/data/']
  })
  ;
});
