// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var fs            = require('fs');
var header        = require('gulp-header');
var jshint        = require('gulp-jshint');
var babel         = require('gulp-babel');
var concat        = require('gulp-concat');
var concatCss     = require('gulp-concat-css');
var templateCache = require('gulp-angular-templatecache');
var addStream     = require('add-stream');

var directories = {
	assets:       'dist/assets',
	outresources: 'dist/resources',
    outbower:    'dist/bower_components',
	source:       'source',
	resources:    'resources',
    views:       'views'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(directories.source + '/**/*.js')
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('default'));
});

gulp.task('resources', function () {
    return gulp.src(directories.resources + '/**/*')
        .pipe(gulp.dest(directories.outresources));
});

gulp.task('views', function () {
    return gulp.src(directories.views + '/*')
        .pipe(gulp.dest('dist'));
});

//Concatenate & Minify JS
gulp.task('commonScripts', function() {
   return prepareScripts('common');
});

//Concatenate & Minify JS
gulp.task('loanScripts', function() {
   return prepareScripts('loan');
});

//Concatenate & Minify JS
gulp.task('scripts', gulp.parallel("commonScripts", 'loanScripts'));


function prepareScripts(name) {
   return gulp.src(directories.source + '/' + name + '/**/*.js')
      .pipe(babel({
         presets: ['@babel/env']
      }))
	   .pipe(addStream.obj(prepareNamedTemplates(name)))
      .pipe(concat(name + '.js'))
      .pipe(header(fs.readFileSync(directories.source + '/licence.txt', 'utf8')))
      .pipe(gulp.dest(directories.assets));
}

// Watch Files For Changes
gulp.task('watch', function(done) {
	// We watch both JS and HTML files.
    gulp.watch(directories.source + '/**/*(*.js|*.html)', gulp.series('lint'));
    gulp.watch(directories.source + '/common/**/*(*.js|*.html)', gulp.series('commonScripts'));
    gulp.watch(directories.source + '/loan/**/*(*.js|*.html)', gulp.series('loanScripts'));
    gulp.watch(directories.source + '/**/*.css', gulp.series('concatCss'));
    gulp.watch(directories.views +  '/*', gulp.series('views'));
    gulp.watch(directories.resources + '/**/*', gulp.series('resources'));
    done();
});

gulp.task('concatCss', function () {
  return gulp.src(directories.source + '/**/*.css')
    .pipe(concatCss("loan.css"))
    .pipe(gulp.dest(directories.assets));
});

gulp.task('package', function() {
   return gulp.src('package.json')
      .pipe(gulp.dest(directories.assets));
});

gulp.task('build', gulp.series('views', 'package', 'scripts', 'concatCss', 'resources'));

// Default Task
gulp.task('default', gulp.series('lint', 'build', 'watch'));

function prepareNamedTemplates(name) {
   return gulp.src(directories.source + '/' + name + '/**/*.html')
      .pipe(templateCache({module: name + ".templates", root:name, standalone : true}));
}