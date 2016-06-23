var SocketCluster = require('socketcluster').SocketCluster,
    env = require('node-env-file'),
    gulp = require('gulp'),
    async = require('async')

env('.env')


var sc_config = {
    workers: require('os').cpus().length,
    brokers: 1,
    port: process.env.PORT || 8000,
    wsEngine: 'uws',
    appName: 'sp2',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    socketChannelLimit: 1000,
    crashWorkerOnError: true
}


gulp.task('default',['templates','minify','start-server']);


gulp.task('start-server',function() {
    console.log("   Starting in "+process.env.ENV+" mode.")

    socketCluster = new SocketCluster(sc_config)
})

gulp.task('templates',function() {

})

gulp.task('minify',function() {

})
