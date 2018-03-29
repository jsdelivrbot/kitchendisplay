var jasmine = require("gulp-jasmine");
var gulp = require("gulp");
var    exec = require('child_process').exec;
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var cache = require("gulp-cache");
var imagemin = require("gulp-imagemin");
gulp.task('scripts', function() {
	gulp.src('controllers/*.js')
		.pipe(concat('main.js'))
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('controllers/'));
});
gulp.task('images', function() {
	gulp.src('public/images/**/*')
		.pipe(cache(imagemin({optimizationLevel:5, interlaced:true, progressive:true})))
		.pipe(gulp.dest('public/images/dist/'));
});
gulp.task('case', function() {
	gulp.src('controllers/appData.js')
		// gulp-jasmine works on filepaths so you can't have any plugins before it
		.pipe(jasmine())});

gulp.task('server', function (cb) {
	exec('npm start', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
})
gulp.task('default', ['case']);
