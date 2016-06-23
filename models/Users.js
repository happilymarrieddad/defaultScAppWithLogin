var pool = process.pool,
	async = require('async')

module.exports = {
	store:function(new_user,respond) {
		pool.query('INSERT INTO users SET ?',new_user,respond)
	},
	findByEmail:function(email,respond) {
		pool.query('SELECT * FROM users WHERE email = ? LIMIT 1',[email],function(err,rows) {
			if (err) { console.log(err);respond('Internal server error. Please contact an administrator') }
			else { 
				if (rows.length) { 
					respond(null,rows[0]) 
				} else { 
					respond(null,null) 
				} 
			}
		})
	}
}