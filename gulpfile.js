const gulp = require('gulp');

const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', () => {
    return gulp.src('static/js/index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
            // exclude: ['tasks'],
            // ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('_dist/static/js'));
});

gulp.task('lint:scripts', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['static/js/**/*.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint('.eslintrc.json'))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
})

gulp.task('sass', () => {
    let processors = [autoprefixer, cssnano];

    return gulp.src('./static/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_dist/css'));
});

/**
 * Optimizes images.
 */
gulp.task('images', () => {
     gulp.src('static/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('_dist/static/img'))
});

gulp.task('copy:source', () => {
    return gulp.src('./src/**/*')
    .pipe(gulp.dest('_dist/src'))
});

// gulp.task('watch', function() {
//   // gulp.watch('./*.js', ['js']);
//   gulp.watch(['./sass/*.scss','./sass/**/*.scss'], ['sass','prefix']);
//   // gulp.watch(['/*.css','./css/*.css'] );
//   gulp.watch('/*.html', ['default']);
// });

gulp.task('default',['sass', 'watch']);