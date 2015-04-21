var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('watch', function () {
  gulp.watch('app/styles/**.scss', ['styles']);
});

gulp.task('styles', function () {
  var options = {
    includePaths: ['bower_components']
  };

  gulp.src('./app/styles/*.scss')
    .pipe(sass(options))
    .pipe(gulp.dest('./build'));
});
