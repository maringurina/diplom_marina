const browserSync = require("browser-sync");

const gulp = require("gulp"),
  sass = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  pug = require("gulp-pug"),
  plumber = require("gulp-plumber");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });
}

function html() {
  return gulp
    .src("src/pug/*.pug")
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest("build"))
    .on("end", browserSync.reload);
}

function css() {
  return gulp
    .src("src/assets/scss/app.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        grid: "autoplace",
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest("build/assets/css"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src("src/assets/imgs/**/*")
    .pipe(gulp.dest("build/assets/imgs"))
    .pipe(browserSync.stream());
}

function watcher() {
  gulp.watch("src/pug/**/*.pug", html);
  gulp.watch("src/assets/scss/**/*.scss", css);
  gulp.watch("src/assets/imgs/**/*", images);
}

gulp.task(
  "default",
  gulp.series(
    gulp.parallel(html, css, images),
    gulp.parallel(browsersync, watcher)
  )
);
