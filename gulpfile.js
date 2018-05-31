let gulp = require("gulp");
let server = require("gulp-webserver")
let sass = require("gulp-sass");
//
let autoprefixer = require("gulp-autoprefixer");
let minCss = require("gulp-clean-css")
    //
let minJs = require("gulp-uglify");
let minHtml = require("gulp-htmlmin");
let rev = require("gulp-rev")
let revCollector = require("gulp-rev-collector")
let sequence = require("gulp-sequence");
let clean = require("gulp-clean")
gulp.task("clean", function() {
    return gulp.src("build")
        .pipe(clean())
})
gulp.task("css", function() {
    return gulp.src("./src/css/**/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: [
                "last 2 versions", "Android>=4.0"
            ]
        }))
        .pipe(minCss())
        // .pipe(rev())
        .pipe(gulp.dest("build/css"))
        // .pipe(rev.manifest())
        // .pipe(gulp.dest("rev/css"))
})
gulp.task("copyCss", function() {
    return gulp.src("./src/css/**/*.css")
        .pipe(gulp.dest("build/css"))
})
gulp.task("minJs", function() {
    return gulp.src(["./src/js/**/*.js", "!./src/js/**/*.min.js"])
        .pipe(minJs())
        .pipe(gulp.dest("build/js"))
})
gulp.task("copyJs", function() {
    return gulp.src("./src/js/**/*.min.js")
        .pipe(gulp.dest("build/js"))
})
gulp.task("minHtml", ["css"], function() {
    return gulp.src("./src/**/*.html")
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(minHtml())
        .pipe(gulp.dest("build"))
})
gulp.task("watch", function() {
    gulp.watch("./src/css/**/*.scss", ["css"])
    gulp.watch("./src/**/*.html", ["minHtml"])
    gulp.watch("./src/js/**/*.js", ["minJs"])

})
gulp.task("server", function() {
    gulp.src("build")
        .pipe(server({
            port: 9090,
            livereload: true,
            middleware: function(req, res, next) {
                next()
            }
        }))
})
gulp.task("default", function(cb) {
    sequence("clean", ["css", "copyCss", "minJs", "copyJs"], "minHtml", ["watch", "server"], cb)
})