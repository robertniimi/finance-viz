var gulp = require('gulp');
var webpack = require('webpack-stream');
var postcssImport = require('postcss-import');
var $ = require('gulp-load-plugins')();

var webpackConfig = require('./web/webpack.config');

/* ========== JS Tasks ========== */


gulp.task('default', () => {

});

/* ========== JS Tasks ========== */
gulp.task('webpack', ['styles'], () => {
  return gulp.src('web/app/js/**/*')
    .pipe($.plumber())
    .pipe(webpack(webpackConfig))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('web/app'))
    ;
});

gulp.task('sass:watch', () => {
  gulp.watch('./web/app/style/**/*.scss', ['_sass']);
});

/* ========== Server Tasks ========== */
gulp.task('serve', () => {
  return $.nodemon({
    script: './server/server.js',
    ignore: ['./server/data/']
  })
  ;
});

/* ========== Style Tasks ========== */
gulp.task('styles', ['_sass', '_css']);

gulp.task('_sass', () => {
  return gulp.src('./web/app/style/sass/**/*.scss')
    .pipe($.sass({
      includePaths: ['./node_modules', './node_modules/support-for/sass'],
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./web/app/style'))
    ;
});

gulp.task('_css', () => {
  return gulp.src('./web/app/style/css/vendor_import.css')
    .pipe($.postcss([postcssImport]))
    .pipe($.debug())
    .pipe($.rename('vendor.css'))
    .pipe(gulp.dest('./web/app/style'))
    ;
});
