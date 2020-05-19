let proj_folder = "2",
    src_folder = "1",
    path = {
      build:{
        html:proj_folder + "/",
        css:proj_folder + "/css/",
        js:proj_folder + "/js/",
        img:proj_folder + "/img/",
        fonts:proj_folder + "/fonts/"
      },
      src:{
        html:[src_folder + "/**/*.html", "!" + src_folder + "/pug/_*.html"],
        css:src_folder + "/scss/style.scss",
        js:src_folder + "/js/script.js",
        img:src_folder + "/img/**/*.{png,jpg,svg,gif,ico,webp}",
        fonts:src_folder + "/fonts/*.ttf"
      },
      watch:{
        html:src_folder + "/*.html",
        css:src_folder + "/scss/**/*.scss",
        js:src_folder + "/js/**/*.js",
        img:src_folder + "/img/**/*.{png,jpg,svg,gif,ico,webp}",
      },
      clean:"./" + proj_folder + "/"
    },
    {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    // pug = require('gulp-pug'),
    fileinclude = require('gulp-file-include'),
    del = require('del');
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    media_queries = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    gulp_rename = require('gulp-rename'),
    uglify_js = require('gulp-uglify-es').default,
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webp_html = require('gulp-webp-html');
    // webpcss = require('gulp-webpcss')


function browserSync() {
    browsersync.init({
      server: {
        baseDir: "./" + proj_folder + "/"
      },
      port: 3000,
      notify: false
    })
  };

function html() {
  return src(path.src.html)
    // .pipe(pug())
    .pipe(fileinclude())
    .pipe(webp_html())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"]
      })
    )
    .pipe(media_queries())
    // .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      gulp_rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
};

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(babel({
            presets: ['@babel/env']
        }))
    .pipe(uglify_js())
    .pipe(
      gulp_rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

function img() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 3,
      })
    )

    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
};

function watcher() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.img], img)
};

function clean () {
  return del(path.clean);
};

let build = gulp.series(clean, gulp.parallel(css, js, html, img));
let watch = gulp.parallel(build, watcher, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.build = build;
exports.watch = watch;
exports.default = watch;
