const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function(){

    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js
        .pipe(gulp.dest('dist'));

});

gulp.task('static', function(){
    return gulp.src(['src/**/*.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('watch', function(){
    return gulp.watch(['src/**/*.ts', 'src/**/*.json'], gulp.series('build'));
});

gulp.task('build', gulp.series('clean', 'static', 'scripts', 'watch'));

gulp.task('default', gulp.series('build'));