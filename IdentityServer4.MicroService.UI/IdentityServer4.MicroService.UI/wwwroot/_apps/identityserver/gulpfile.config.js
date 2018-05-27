module.exports = function (gulp, concat, templateCache, useref, bom, uglify, clean, sequence, jeditor)
{
    var directoryName = 'identityserver';

    // 任务key
    var taskKey = '__' + directoryName;

    // 发布目录
    var releasePath = './wwwroot/apps/' + directoryName;

    // 开发目录
    var devPath = './wwwroot/_apps/' + directoryName;

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

    // 复制images资源文件
    gulp.task(`${taskKey}.images`, () => gulp.src([
        devPath + "/images/**/*"
    ])
        .pipe(gulp.dest(releasePath + "/images")));

    // 复制package.json文件
    gulp.task(`${taskKey}.package.json`, () => gulp.src([
        devPath + "/package.json"
    ])
        .pipe(jeditor(function (json) {
            delete json.dependencies;
            return json;
        }))
        .pipe(gulp.dest(releasePath)));

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
            `${taskKey}.images`,
            `${taskKey}.templateCache`,
            `${taskKey}.indexPage`,
            `${taskKey}.package.json`,
        ],
        `${taskKey}.combine`,
        `${taskKey}.clean.after`);
}