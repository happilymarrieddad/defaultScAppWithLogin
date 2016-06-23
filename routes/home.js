var express = require("express"),
	router = express.Router(),
	bodyParser = require("body-parser"),
	parseUrlencoded = bodyParser.urlencoded({ extended:false }),
	async = require('async'),
	pool = process.pool

// Session Middleware
router.use(function(req,res,next) {

  	next()
})

router.route("/")
	.get(function(req,res) {
		if (req.session.error){
			var error = req.session.error
			delete req.session.error
		}

	    async.parallel([
	    	function(cb) {
				cb()
	    	}
	   	// Async "callback"
	    ],function() {
			res.render("home/index", {
				user:req.session.user || {},
				ENV:process.env.ENV,
				error:error
			})
	    })

	})

module.exports = router