const gulp = require("gulp");
const apidoc = require("gulp-apidoc");

gulp.task("apidoc", (done) => {
    apidoc({
        src: "./routes",
        dest: "./public/docs/"
    }, done);
});

gulp.task("watch", () => {
    gulp.watch(["./routes/**"], ["apidoc"]);
});
