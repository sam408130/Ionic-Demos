var gulp = require('gulp')
var sass = require('gulp-sass')
var coffee = require('gulp-coffee')
var rename = require('gulp-rename')
var concat = require('gulp-concat')
var minifyCss = require('gulp-minify-css')
var bowerFiles = require("main-bower-files")

var paths = {
  sass  : ['./www/app/scss/*.scss'],
  coffee: ['./www/app/**/*.coffee'],
  bower : ['./www/lib/*.js']
}

var handleError = function(error) {
  console.error(error.toString())
  this.emit('end')
}

gulp.task('sass', function(done) {
  gulp.src('./www/app/scss/app.bundle.scss')
    .pipe(sass().on('error', handleError))
    .pipe(rename({ extname: '.css' }))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./www/css'))
    .on('end', done)
})

gulp.task('coffee', function(done) {
  gulp.src(paths.coffee)
    .pipe(coffee({ bare: true }).on('error', handleError))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www/js'))
    .on('end', done)
})

gulp.task('bower', function(done) {
  console.log(bowerFiles({ filter: /.js$/ }))
  gulp.src(bowerFiles({ filter: /.js$/ }))
    .pipe(concat('vender.js'))
    .pipe(gulp.dest('./www/js'))
    .on('end', done)
})

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.coffee, ['coffee'])
  gulp.watch(paths.bower, ['vender'])
})

gulp.task('build', ['sass', 'coffee', 'bower'])

