var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    include = require('gulp-include'),
    replace = require('gulp-replace'),
    version = new Date().getTime(),
    comment = /<comment>([\s\S]*?)<\/comment>/g,
    browserSync = require("browser-sync").create();

var paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "src/sass/*.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "dist/css"
    },
    html: {
        src: "src/*.html",
        srcinclude: "src/**/*.html",
        dest: "dist"
    },
    js: {
        src: "src/script/*.js",
        dest: "dist/script"
    },
    img: {
        src: "src/images/**/*.+(png|jpg|gif|svg)",
        dest: "dist/images"
    }

    // Easily add additional paths
    // ,html: {
    //  src: '...',
    //  dest: '...'
    // }
};

function cacheVersion() {
    return gulp
        .src(paths.html.src)
        .pipe(replace(/version=\d+/g, 'version=' + version))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(include({
            extensions: 'html',
            includePaths: [
                __dirname + '/src/include'
            ]
        }))
        .pipe(replace(/version=\d+/g, 'version=' + version))
        .pipe(replace(comment, ''))
        .pipe(replace(/\/\*([\s\S]*?)\*\//g, ' '))
        .pipe(replace(/\<\!\-\-([\s\S]*?)\-\-\>/g, ' '))
        .on('error', console.log)
        .pipe(gulp.dest(paths.html.dest))
}

function script() {
    return gulp
        .src(paths.js.src)
        .pipe(gulpIf(paths.js.dest, uglify()))
        .pipe(include())
        .on('erroe', console.log)
        .pipe(gulp.dest(paths.js.dest))
}

function img() {
    return gulp
        .src(paths.img.src)
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest(paths.img.dest))
}


// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./dist"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    gulp.watch(paths.styles.src, style);
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.html.srcinclude, html);
    gulp.watch(paths.js.src, script);
    gulp.watch(paths.img.src, img);
    gulp.watch([paths.html.srcinclude, paths.styles.src, paths.html.src, paths.js.src, paths.img.src]).on('change', browserSync.reload);
}

// We don't have to expose the reload function
// It's currently only useful in other functions


// Don't forget to expose the task!
exports.watch = watch

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, watch);

/*
 * You can still use `gulp.task` to expose tasks
 */
// gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);