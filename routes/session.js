var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	parseUrlencoded = bodyParser.urlencoded({ extended:false }),
	async = require('async'),
	pool = process.pool,
	validator = require('validator'),
	Users = require('./../models/Users.js'),
	sha = require('sha256')

// Session Middleware
router.use(function(req,res,next) {

  	next()
})

router.route("/create")
	.get(function(req,res) {
		if (req.session.error){
			var error = req.session.error
			delete req.session.error
		}

		res.render('session/create',{
			error:error,
			email:req.session.email
		})

	})

router.route("/")
	.post(function(req,res) {
		if (req.session.error){
			var error = req.session.error
			delete req.session.error
		}

		var body = req.body

		if (body.email && body.password) {
			if (validator.isEmail(body.email)) {
				Users.findByEmail(body.email,function(err,user) {
					if (err) {
						res.session.error = err
						res.redirect('back')
					} else if (!user) {
						res.session.error = 'No account with that email'
						res.redirect('back')
					} else {
						if (sha.x2(body.password) == user.password) {
							delete user.password
							req.session.user = user
							res.redirect('/')
						} else {
							res.session.error = 'Password does not match.'
							res.redirect('back')
						}
					}
				})
			} else {
				req.session.error = 'Email is invalid.'
				res.redirect('back')
			}
		} else {
			req.session.error = 'Login request requires an email and password.'
			res.redirect('back')
		}

	})

router.route("/destroy")
	.get(function(req,res) {
		if (req.session.error){
			var error = req.session.error
			delete req.session.error
		}

		req.session.destroy()
		res.redirect('/session/create')

	})

module.exports = router