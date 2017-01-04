var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var jade = require('gulp-jade');

gulp.task('sass', function() {
    return gulp.src('src/assets/sass/**/main.scss')
        .pipe(sass())
        .pipe(autoprefixer([
            'last 15 versions',
            '> 1%'
        ], {
            cascade: true
        }))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('jade', function() {
    return gulp.src('src/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('src'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('clean', function() {
    return del.sync('build');
});

gulp.task('clearcache', function() {
    return cache.clearAll();
});
gulp.task('css-minify', ['sass'], function() {
    return gulp.src('src/assets/css/main.css')
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/assets/css'));
});
gulp.task('image', function() {
    return gulp.src('src/assets/img/**/*')
        .pipe(cache(imagemin({
            interlaces: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('build/img'));
});

gulp.task('watch', ['browser-sync', 'css-minify','jade', 'sass'], function() {
    gulp.watch('src/assets/sass/**/*.scss', ['sass']);
    gulp.watch('src/*.jade', ['jade']);
    gulp.watch('src/assets/js/*.js', browserSync.reload);
    gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('build', ['clean', 'image', 'sass'], function() {
    var buildCss = gulp.src(['src/assets/css/main.css', 'src/assets/css/main.min.css'])
        .pipe(gulp.dest('build/css'));
    var buildFonts = gulp.src(['src/assets/fonts/**/*'])
        .pipe(gulp.dest('build/fonts'));
    var buildJs = gulp.src(['src/assets/js/main.js'])
        .pipe(gulp.dest('build/js'));
    var buildHTML = gulp.src(['src/*.html'])
        .pipe(gulp.dest('build'));
});
