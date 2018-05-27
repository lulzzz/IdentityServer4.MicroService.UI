module.exports = function (gulp, concat, templateCache, useref, bom, uglify, clean, sequence)
{
    var directoryName = 'demo';

    // 任务key
    var taskKey = '__' + directoryName;

    // 发布目录
    var releasePath = './wwwroot/apps/' + directoryName;

    // 开发目录
    var devPath = './wwwroot/_apps/' + releasePath;

    // 清空发布路径
    gulp.task(`${taskKey}.clean.before`, () => gulp.src([releasePath]).pipe(clean({ force: true })));

    // 删除合并后不需要的templates.js文件
    gulp.task(`${taskKey}.clean.after`, () => gulp.src([releasePath +'/dist/templates.js']).pipe(clean({ force: true })));

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

    // 合并项目html文件为template.js文件
    gulp.task(`${taskKey}.templateCache`, () => gulp.src([
        "!" + devPath + "/index.html",
        "!" + devPath + "/node_modules/**/*",
        './wwwroot/_apps/' + directoryName + '/**/*.html'
    ])
        .pipe(templateCache({ module: 'h5' }))
        .pipe(bom())
        .pipe(gulp.dest(releasePath + '/dist')));

    // 复制index.html文件到发布目录，并合并引用的资源文件
    gulp.task(`${taskKey}.indexPage`, () => gulp.src([
        devPath + "/index.html"
    ])
        .pipe(useref())
        .pipe(bom())
        .pipe(gulp.dest(releasePath)));

    // 合并、压缩 项目所有js文件和templates.js文件
    gulp.task(`${taskKey}.combine`, () => gulp.src([
        releasePath + "/dist/app.min.js",
        releasePath + "/dist/templates.js",
    ])
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(bom())
        .pipe(gulp.dest(releasePath + '/dist')));

    // 返回任务队列
    return sequence(
        `${taskKey}.clean.before`,
        [
            `${taskKey}.fonts`,
            `${taskKey}.icons`,
            `${taskKey}.templateCache`,
            `${taskKey}.indexPage`
        ],
        `${taskKey}.combine`,
        `${taskKey}.clean.after`);
}