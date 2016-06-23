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

		res.render('user/create',{
			error:error,
			first:req.session.first,
			last:req.session.last,
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
		req.session.first = body.first
		req.session.last = body.last
		req.session.email = body.email

		if (body.first && body.last && body.email && body.password && body.password_confirm) {
			if (body.password == body.password_confirm) {
				if (validator.isEmail(body.email)) {
					delete body.password_confirm
					body.password = sha.x2(body.password)
					Users.store(body,function(err,rows) {
						if (err) {
							console.log(err)
							req.session.error = 'Internal server error. Please contact an administrator.'
							res.redirect('back')
						} else {
							res.redirect('/session/create')
						}

					})
				} else {
					req.session.error = 'The email must be valid'
					res.redirect('back')
				}
			} else {
				req.session.error = 'The passwords must match'
				res.redirect('back')
			}
		} else {
			req.session.error = 'The form must be completely filled out'
			res.redirect('back')
		}

	})

module.exports = router