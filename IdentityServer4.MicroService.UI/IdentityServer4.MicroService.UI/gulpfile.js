"use strict";
/**
 * ��������ʹ�õĴ���ű�Ϊ��vendor��js��css
�����ļ�Ϊ��
vendor.min.js
vendor.min.css
app.js
app.css

 * ������������ű���build
����
app.min.js (�ϲ�vendor.js��app.js)
app.min.css (�ϲ�vendor.css��app.css)

������������ֻ���� build���js��css
 */


var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify-es").default,
    merge = require("merge-stream"),
    clean = require('gulp-clean'),
    sequence = require('gulp-sequence'),
    templateCache = require('gulp-angular-templatecache'),
    bom = require('gulp-bom'),
    useref = require('gulp-useref'),
    jeditor = require("gulp-json-editor");


// ���APP
var app = require('./wwwroot/_apps/base/gulpfile.config.js');
gulp.task("app.build", app(
    gulp,
    concat,
    bom,
    uglify,
    clean,
    sequence,
    cssmin
));

// identityserver APP
var identityserver = require('./wwwroot/_apps/identityserver4.microservice.ui/gulpfile.config.js');

gulp.task("identityserver.build", identityserver(
    gulp,
    concat,
    templateCache,
    useref,
    bom,
    uglify,
    clean,
    sequence,
    jeditor
));


// start APP
var start = require('./wwwroot/_apps/identityserver4.microservice.start/gulpfile.config.js');

gulp.task("start.build", start(
    gulp,
    concat,
    templateCache,
    useref,
    bom,
    uglify,
    clean,
    sequence,
    jeditor
));