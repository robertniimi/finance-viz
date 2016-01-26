var gulp = require('gulp');
var webpack = require('webpack-stream');
var postcssImport = require('postcss-import');
var $ = require('gulp-load-plugins')();

var webpackConfig = require('./web/webpack.config');

// DIRECTORY CONSTANTS
var DIST = './web/dist/';
var DIST_STATIC = DIST + 'static/';

var TMP = './web/.tmp/';
var TMP_JS = TMP + 'js/';
var TMP_STYLE = TMP + 'style/';

var APP = './web/app/';
var APP_JS = APP + 'js/';
var APP_STYLE = APP + 'style/';
var APP_STYLE_CSS = APP_STYLE + 'css/';
var APP_STYLE_SASS = APP_STYLE + 'sass/';
// var APP_IMAGES = APP + 'images';
// var APP_FONTS = APP + 'fonts';

var ALL = '**/*'
var ALL_CSS = ALL + '.css';
var ALL_JS = ALL + '.js';
var ALL_SCSS = ALL + '.scss';

/* ========== Tasks ========== */
gulp.task('dev', () => {

  // gulp.watch(APP_JS, [])
  gulp.watch(APP_JS + ALL_JS, ['scripts']);
  gulp.watch(APP_STYLE + ALL_CSS, ['styles']);
});

/* ========== JS Tasks ========== */
gulp.task('scripts', ['_minify-js']);

gulp.task('_minify-js', ['_webpack'], () => {
  return gulp.src(TMP_JS + '*.js')
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.rename({extname: '.min.js'}))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(DIST_STATIC))
    ;
});

gulp.task('_webpack', () => {
  return gulp.src(APP_JS + ALL_JS)
    .pipe($.plumber())
    .pipe(webpack(webpackConfig))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(TMP_JS))
    .pipe(gulp.dest(TMP_STYLE))
    ;
});

/* ========== Style Tasks ========== */
gulp.task('styles', ['_minify-css']);

gulp.task('_sass', () => {
  return gulp.src(APP_STYLE_SASS + ALL_SCSS)
    .pipe($.plumber())
    .pipe($.sass({
      includePaths: ['./node_modules', './node_modules/support-for/sass'],
      errLogToConsole: true
    }))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(TMP_STYLE))
    .pipe(gulp.dest(DIST_STATIC))
    ;
});

gulp.task('_css', () => {
  return gulp.src('./web/app/style/css/vendor_import.css')
    .pipe($.plumber())
    .pipe($.postcss([postcssImport]))
    .pipe($.rename('vendor.css'))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(TMP_STYLE))
    .pipe(gulp.dest(DIST_STATIC))
    ;
});

gulp.task('_minify-css', ['_sass', '_css'], () => {
  return gulp.src(TMP_STYLE + ALL_CSS)
    .pipe($.plumber())
    .pipe($.cssnano())
    .pipe($.rename({
      dirname: 'static',
      extname: '.min.css'
    }))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(DIST))
    ;
});

/* ========== Server Tasks ========== */
gulp.task('serve', () => {
  return $.nodemon({
    script: './server/server.js',
    ignore: ['./server/data/']
  })
  ;
});
