var dbm = global.dbm || require('db-migrate'),
	type = dbm.dataType,
	async = require('async')

exports.up = function(db, callback) {
	callback()

	/*
	async.series([
		db.createTable.bind(db,'table_name', {
			id: { type: "int", primaryKey:true, autoIncrement: true, notNull: true },
			first: { type: "string", length:100 },
			mobile: { type: "bigint", length:20 },
			status_id: { type: "int", length:11 },
			last_login: { type: "timestamp" },
			is_transportation: { type: "smallint", length:1 },
			visible: { type: "smallint", length:1 },
			timestamp: { type: "timestamp" }
		})
	], callback)
	*/
};

exports.down = function(db, callback) {
  //db.dropTable('table_name', callback)
  callback()
};