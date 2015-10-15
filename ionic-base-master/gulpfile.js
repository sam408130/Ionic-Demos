var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var header = require('gulp-header');

var pkg = require('./package.json');

var paths = {
  sass: ['src/scss/**/*.scss'],
  js: ['src/js/**/*.js'],
  templates: ['src/templates/**/*.html']
};

gulp.task('bump', require('gulp-cordova-bump'));


gulp.task('default', ['sass', 'templates', 'build']);

gulp.task('sass', function(done) {
  gulp.src('src/scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/dist/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/dist/css/'))
    .on('end', done);
});

gulp.task('build', function () {
  return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
          .pipe(ngAnnotate({
            single_quotes: true
          }))
          .pipe(concat('app.js'))
          .pipe(uglify())
          .pipe(sourcemaps.write())
          .pipe(header('window.VERSION = "<%= pkg.version %>";', { pkg : pkg } ))
        .pipe(gulp.dest('www/dist'));
});

gulp.task('templates', function(){
  return gulp.src('src/templates/**/*.html')
    .pipe(templateCache('templates.js',{module: 'starter', root:'templates/'}))
    .pipe(gulp.dest('www/dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['build']);
  gulp.watch(paths.templates, ['templates']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
