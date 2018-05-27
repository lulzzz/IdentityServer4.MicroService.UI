module.exports = function (gulp, concat, bom, uglify, clean, sequence, cssmin)
{
    // 任务key
    var taskKey = '__app';

    // 发布目录
    var releasePath = './wwwroot';

    // 开发目录
    var devPath = './wwwroot/_apps/base';

    // 清空发布路径
    gulp.task(`${taskKey}.clean`, () => gulp.src([
        releasePath + '/dist',
        releasePath + '/fonts',
        releasePath + '/icons',
    ]).pipe(clean({ force: true })));

    // 合并引用的第三方js
    gulp.task(`${taskKey}.vendor.js`, () => gulp.src([
        devPath + "/node_modules/jquery/dist/jquery.min.js",
        devPath + "/node_modules/mdui/dist/js/mdui.min.js",
        devPath + "/node_modules/iframe-resizer/js/iframeResizer.min.js",
        devPath + "/node_modules/oidc-client/dist/oidc-client.min.js",
        devPath + "/oidc.init.js",
    ])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(releasePath + "/dist")));

    // 合并引用的第三方css
    gulp.task(`${taskKey}.vendor.css`, () => gulp.src([
        devPath + "/node_modules/mdui/dist/css/mdui.min.css"
    ])
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(releasePath + "/dist")));

    // 复制fonts资源文件
    gulp.task(`${taskKey}.fonts`, () => gulp.src([
        devPath + "/node_modules/mdui/dist/fonts/**/*"
    ])
        .pipe(gulp.dest(releasePath + "/fonts")));

    // 复制icons资源文件
    gulp.task(`${taskKey}.icons`, () => gulp.src([
        devPath + "/node_modules/mdui/dist/icons/**/*"
    ])
        .pipe(gulp.dest(releasePath + "/icons")));

    // 合并项目所有js文件
    gulp.task(`${taskKey}.app.js`, () => gulp.src([
        "!" + devPath + "/gulpfile.config.js",
        "!" + devPath + "/oidc.init.js",
        "!" + devPath + "/node_modules/**/*",
        devPath + "/**/*.js",
    ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(releasePath + "/dist")));

    // 合并项目所有css文件
    gulp.task(`${taskKey}.app.css`, () => gulp.src([
        "!" + devPath + "/node_modules/**/*",
        devPath + "/**/*.css",
    ])
        .pipe(concat('app.min.css'))
        .pipe(cssmin())
        .pipe(bom())
        .pipe(gulp.dest(releasePath + "/dist")));


    // 返回任务队列
    return sequence(
        `${taskKey}.clean`,
        [
            `${taskKey}.fonts`,
            `${taskKey}.icons`,
            `${taskKey}.vendor.js`,
            `${taskKey}.vendor.css`,
            `${taskKey}.app.js`,
            `${taskKey}.app.css`,
        ]);
}