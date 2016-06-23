var fs = require('fs'),
    express = require('express'),
    serveStatic = require('serve-static'),
    path = require('path'),
    env = require('node-env-file'),
    async = require('async'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    sessions = require('client-sessions'),
    moment = require('moment'),
    compression = require('compression')

env('.env')

module.exports.run = function (worker) {
    console.log('   >> Worker PID:', process.pid)

    var app = require('express')(),
        httpServer = worker.httpServer,
        scServer = worker.scServer,
        exchange = worker.exchange


    pool = require('mysql').createPool({
        host            : process.env.DB_HOST,
        user            : process.env.DB_USERNAME,
        password        : process.env.DB_PASSWORD,
        database        : process.env.DB_DATABASE
    })
    process.pool = pool

    app.set('views', __dirname+'/views')
    app.set('view engine', 'pug')

    app.use(compression())
    app.use(express.static(__dirname + '/public'))
    app.use(bodyParser.json({limit: '512mb'}))
    app.use(bodyParser.urlencoded({limit: '512mb', extended: true}))
    app.use(bodyParser.json())
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        next()
    })
    app.use(cookieParser())
    app.use(sessions({
        cookieName: 'session',
        secret: process.env.SESSION_SECRET || "keyboard-cat",
        duration: 1 * 24 * 60 * 60 * 1000  // 1 Day
    }))
    app.use(function(req,res,next) {
        if (req.session.seenyou) {
            res.setHeader('X-Seen-You','true')
            next()
        } else {
            req.session.seenyou = true
            res.setHeader('X-Seen-You','false')
            next()
        }
    })
    app.use(function(req,res,next) {
        var url = req.url;
        if (req.session.user) {
            if (url == '/admin' && req.session.user.type_id != 1) {
                res.redirect('/');
            } else if (url == '/session/create' || url == '/session' || url == '/user/create' || url == '/user') {
                res.redirect('/');
            } else {
                next();
            }
        } else {
            if (url == '/session/create' || url == '/session' || url == '/user/create' || url == '/user') next();
            else res.redirect('/session/create');
        }
    })

    httpServer.on('request', app)


    app.use("/",require('./routes/home.js'))
    app.use("/admin",require('./routes/admin.js'))
    app.use("/session",require('./routes/session.js'))
    app.use("/user",require('./routes/user.js'))

    app.all('*',function(req,res) { res.redirect('/') })


    scServer.on('connection', function (socket) {


        socket.on('disconnect', function () {

        })

    })
}
