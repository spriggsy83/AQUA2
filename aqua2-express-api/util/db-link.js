var mysql = require("mysql");

var dbpool = mysql.createPool({
	connectionLimit: 10,
	host: "cowpea.it.csiro.au",
	user: "sails",
	password: "sailsDBpw",
	database: "annotQDB"
});

module.exports = dbpool;
