const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');



gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('static', gulp.series('clean', function(){
    return gulp.src(['src/**/*.json'])
        .pipe(gulp.dest('dist'));
}));

gulp.task('scripts', gulp.series('static', function(){

    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js
        .pipe(gulp.dest('dist'));

}));


gulp.task('build', gulp.series('scripts'));

gulp.task('watch', gulp.series('build', function(){
    return gulp.watch(['src/**/*.ts', 'src/**/*.json'], gulp.series('build'));
}));

gulp.task('default', gulp.series('watch'));