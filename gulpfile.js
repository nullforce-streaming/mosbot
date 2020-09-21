"use strict";

const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const gulpSourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

// Build
gulp.task("build", () => {
    gulp.src("./src/config.json")
        .pipe(gulp.dest("dist/"));

    // source -> TypeScript -> dist
    return gulp.src("./src/**/*.ts")
        .pipe(gulpSourcemaps.init())
        .pipe(tsProject())
        .pipe(gulpSourcemaps.write("."))
        .pipe(gulp.dest("dist/"));
});

// Test
gulp.task("test", gulp.series("build", () => {
    // TODO: implement tests
}));

// Watch
gulp.task("watch", gulp.series("build", () => {
    // Watch the TypeScript source files and recompile as needed
    gulp.watch("./src/**/*.ts", gulp.series("build"));
}));

// start - build first, otherwise we intially run a stale index.js
gulp.task("start", gulp.series("build", gulp.parallel("watch", () => {
    // Have nodemon watch for changes in dist and restart the bot as needed
    return nodemon({
        script: "./dist/index.js",
        watch: "./dist"
    });
}), () => {
}));
