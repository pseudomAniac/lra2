var gulp 	= require('gulp');
var app		= require('express')();

gulp.task('default', function() {
	app.listen(3000);
})