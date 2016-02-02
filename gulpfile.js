//引入插件
var gulp = require('gulp');
// import gulp from 'gulp';

var minifyHTML = require('gulp-minify-html');
var	minifycss = require('gulp-minify-css');
var	jshint = require('gulp-jshint');
var	uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var	concat = require('gulp-concat');
var	notify = require('gulp-notify');
var	cache = require('gulp-cache');
var connect = require('gulp-connect');
var	livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
del = require('del');
var server = require('gulp-server-livereload');
var serve = require('gulp-serve');
var pngquant = require('imagemin-pngquant');
var babel = require("gulp-babel");
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');

//postcss
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var color_rgba_fallback = require('postcss-color-rgba-fallback');
var opacity = require('postcss-opacity');
var pseudoelements = require('postcss-pseudoelements');
var vmin = require('postcss-vmin');
var pixrem = require('pixrem');
var will_change = require('postcss-will-change');
var atImport = require('postcss-import');
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var bem = require('postcss-bem');
var alias = require('postcss-alias');
var crip = require('postcss-crip');
var magician = require('postcss-font-magician');
var triangle = require('postcss-triangle');
var circle = require('postcss-circle');
var linkColors = require('postcss-all-link-colors');
var center = require('postcss-center');
var clearfix = require('postcss-clearfix');
var position = require('postcss-position');
var size = require('postcss-size');
// var verthorz = require('postcss-verthorz');
var colorShort = require('postcss-color-short');
var sass = require('gulp-sass');


//postcss编译
gulp.task('postcss', function () {
  var processors = [
        // cssnano,
        will_change,
        autoprefixer,
        cssnext,
        atImport,
        precss,
        bem,
        // color_rgba_fallback,
        // opacity,
        pseudoelements,
        // vmin,
        pixrem,  
        mqpacker,
        // alias,
        // crip,
        magician,
        triangle,
        circle,
        linkColors,
        center,
        clearfix,
        position,
        size,
        // verthorz,
        colorShort,
        
  ];
  return gulp.src('./app/postcss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./app/css/'));
});


//html压缩
gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./app/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('build/'));
});



//es6编译
gulp.task("jsx", function () {
  return browserify("app/src/test.js")
    .transform("babelify")
    .bundle()
    .pipe(source('bundle.js'))
    // .pipe(babel({
    //   presets: ['es2015'],
    //   plugins: ['transform-runtime']
    // }))
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./app/js'));
});

//jsx

// gulp.task('jsx',function() {
//   gulp.src("app/src/*.jsx")
//   .pipe(react())
//   .pipe(gulp.dest('./app/js')).pipe(livereload());
// });



//压缩图片
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

//清除文件

gulp.task('clean', function(cb) {
	del(['bulid/img/', 'build/js/', 'build/css/', 'build/'], cb)
});

//js压缩

gulp.task('minify-js', function () {
   gulp.src('./app/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('build/js'))
});

//css 压缩

gulp.task('minify-css', function () {
   gulp.src('./app/css/*.css')
      .pipe(gulp.dest('build/css'))
});



//默认任务

gulp.task('default', ['clean'], function() {
	gulp.run('images', 'minify-js','minify-html');
});

//reload
gulp.task('reload', ['clean'], function() {
  gulp.run('watch','browser-sync');
});

//监听文件
gulp.task('watch', function() {
  livereload.listen();
	// Watch .scss files
	gulp.watch('app/postcss/**/*.scss', ['postcss']);
	// Watch .js files
	gulp.watch('app/src/**/*.js', ['jsx']);
	// Watch image files
	gulp.watch('app/img/**/*', ['images']);
// Watch html files
 gulp.watch(['./app/*.html'], ['html']);
	});

//serve
// gulp.task('connect', function() {
//   connect.server({
//     port: 8888,
//     root: 'app',
//     livereload: true
//   });
// });
gulp.task('html', function () {
  gulp.src(['./app/*.html','./app/postcss/**/*','./app/src/**/*'])
   .pipe(livereload());
});

//无刷新

gulp.task('browser-sync', function () {
   var files = [
      'app/**/*.html',
      'app/css/**/*.css',
      'app/assets/img/**/*',
      'app/js/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './app'
      }
   });
});