var dbm = global.dbm || require('db-migrate'),
	type = dbm.dataType,
	async = require('async')

exports.up = function(db, callback) {
	async.series([
		db.createTable.bind(db,'user_types', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			name: { type: "string", length:100 },
			timestamp: { type: "timestamp" }
		}),
		db.insert.bind(db,'user_types',[ 'name' ],[ 'admin' ]),
		db.insert.bind(db,'user_types',[ 'name' ],[ 'standard' ]),
		db.createTable.bind(db,'users', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			first: { type: "string", length:100 },
			last: { type: "string", length:100 },
			email: { type: "string", length:100,unique:true },
			password: { type: "string", length:100 },
			type_id: { type: "int", length:11 },
			visible: { type: "smallint", length:1 },
			timestamp: { type: "timestamp" }
		})
	], callback)
};

exports.down = function(db, callback) {
	async.series([
		db.dropTable('user_types', callback),
		db.dropTable('users', callback)
	], callback);
};