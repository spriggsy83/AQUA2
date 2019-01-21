const mysql = require("mysql");
const map = require("lodash");
const SQL = require("sql-template-strings");

const dbpool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DBNAME
});

/** Turns a SELECT COUNT(*) into a {total: X}
 Only a 'tableName' is provided **/
async function dbCountAllToJRes(tableName) {
	return new Promise(function(resolve, reject) {
		var sqlTQuery;
		if (
			/^(sample|seqgroup|sequence|seqrelation|alignedannot|geneprediction)$/i.test(
				tableName
			)
		) {
			sqlTQuery = SQL`SELECT `
				.append(tableName)
				.append(SQL` AS total FROM totals`);
		} else {
			sqlTQuery = SQL`SELECT COUNT(id) AS total FROM `.append(tableName);
		}
		dbpool.query(sqlTQuery, function(error, results, fields) {
			if (error) {
				resolve({ total: null });
			} else if (results && results.length) {
				resolve({ total: results[0].total });
			} else {
				resolve({ total: 0 });
			}
		});
	});
}

/** Turns a SELECT COUNT(*) AS total into a {total: X}
 Whole sql query must be specified 
 !!! COUNT must be aliased AS 'total' !!! **/
async function dbCountQueryToJRes(sqlTemplateQuery) {
	return new Promise(function(resolve, reject) {
		dbpool.query(sqlTemplateQuery, function(error, results, fields) {
			if (error) {
				resolve({ total: null });
			} else if (results && results.length) {
				resolve({ total: results[0].total });
			} else {
				resolve({ total: 0 });
			}
		});
	});
}

/** Returns a SQL query result as { data: result }
 Whole sql query must be specified **/
async function dbQueryToJRes(sqlTemplateQuery) {
	return new Promise(function(resolve, reject) {
		dbpool.query(sqlTemplateQuery, function(error, results, fields) {
			if (error) {
				resolve({ status: 500, error: error, data: null });
			} else if (results && results.length) {
				resolve({ status: 200, error: null, data: results });
			} else {
				resolve({ status: 404, error: null, data: "Not found" });
			}
		});
	});
}

/** Returns a list of valid id/name pairs as { tableName: result }
 Returned information intended for use in filtering a joined table **/
async function dbFilterListToJRes(tableName, labelCol) {
	return new Promise(function(resolve, reject) {
		const sqlTQuery = SQL`SELECT id, `
			.append(labelCol)
			.append(SQL` AS label FROM `)
			.append(tableName);
		dbpool.query(sqlTQuery, function(error, results, fields) {
			if (error) {
				resolve({});
			} else if (results && results.length) {
				var idMap = {};
				results.map(function(row) {
					idMap[row.label] = row.id;
				});
				resolve({ [tableName]: idMap });
			} else {
				resolve({});
			}
		});
	});
}

module.exports.dbpool = dbpool;
module.exports.dbCountAllToJRes = dbCountAllToJRes;
module.exports.dbCountQueryToJRes = dbCountQueryToJRes;
module.exports.dbQueryToJRes = dbQueryToJRes;
module.exports.dbFilterListToJRes = dbFilterListToJRes;
