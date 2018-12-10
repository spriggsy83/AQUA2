const mysql = require("mysql");
const SQL = require("sql-template-strings");

const dbpool = mysql.createPool({
	connectionLimit: 10,
	host: "cowpea.it.csiro.au",
	user: "sails",
	password: "sailsDBpw",
	database: "annotQDB"
});

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

async function dbQueryAllToJRes(sqlTemplateQuery) {
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

async function dbFilterListToJRes(tableName, labelCol) {
	return new Promise(function(resolve, reject) {
		const sqlTQuery = SQL`SELECT id, `
			.append(labelCol)
			.append(SQL` FROM `)
			.append(tableName);
		dbpool.query(sqlTQuery, function(error, results, fields) {
			if (error) {
				resolve({});
			} else if (results && results.length) {
				resolve({ [tableName]: results });
			} else {
				resolve({});
			}
		});
	});
}

module.exports.dbpool = dbpool;
module.exports.dbCountAllToJRes = dbCountAllToJRes;
module.exports.dbQueryAllToJRes = dbQueryAllToJRes;
module.exports.dbFilterListToJRes = dbFilterListToJRes;
