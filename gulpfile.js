var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var jasmine = require('gulp-jasmine');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('test', function() {
	return gulp.src('./src/Test.js')
		.pipe(jasmine());
});

gulp.task('min', function(cb) {
	return gulp.src(['src/AppController.js', 'src/treemap.js'])
		.pipe(uglify())
		.pipe(concat('treemap.min.js'))
		.pipe(gulp.dest('./src'));
});

gulp.task('clean', function(cb) {
	rimraf('src/treemap.min.js', cb);
});

gulp.task('default', ['test', 'clean', 'min']);