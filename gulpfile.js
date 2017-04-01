var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var gulpOpen = require('gulp-open'); // open a URL in the browser

var files = ['*.js', 'src/**/*.js', 'static/*'];


gulp.task('open',function(){
  gulp.src(__filename)
    .pipe(gulpOpen({uri: 'http://localhost:3000'}));
});

gulp.task('default', ['open'], function(){
  var options = {
    script: 'index.js',
    delayTime: 1,
    env: {
      'PORT' : 3000
    },
    watch: files
  };

  return nodemon(options)
    .on('restart', function(ev){
      console.log('Restarting...');
    });
});
