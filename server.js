var SocketCluster = require('socketcluster').SocketCluster,
    env = require('node-env-file'),
    async = require('async')

env('.env')


var options = {
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


var socketCluster = new SocketCluster(options)