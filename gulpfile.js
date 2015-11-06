var del = require('del');
var gulp = require('gulp');
var gutil = require("gulp-util");
var runSequence = require('run-sequence');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');
var devWebpackConfig = Object.create(webpackConfig);


/**
 * Default
 */

gulp.task('default', ['dev:webpack']);


/**
 * Production Build
 */

var SOURCE_DEST = "src";
var BUILD_DEST = "build";

gulp.task('build', function(callback) {
 runSequence(
   'dist:clean',
   'dist:copy',
   'dist:webpack',
   callback
 );
});

gulp.task('dist:clean', function() {
  return del([BUILD_DEST + '/**/*']);
});

gulp.task('dist:copy', function() {
  return gulp.src(SOURCE_DEST + '/**/!(*.ts)', {base: SOURCE_DEST})
    .pipe(gulp.dest(BUILD_DEST));
});

gulp.task('dist:webpack', function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
      gutil.log("[webpack]", stats.toString({
        colors: true,
        chunks: false
      }));
      if (callback) callback();
  });

});


/**
 * Deveolpment Server
 */

gulp.task('dev:webpack', function(callback) {
  webpackConfig.plugins = [];

  var compiler = webpack(devWebpackConfig);

  new WebpackDevServer(compiler, devWebpackConfig.devServer
  ).listen(8080, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
  });
});