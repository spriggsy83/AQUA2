var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");

var indexRouter = require("./routes/index");
var samplesRouter = require("./routes/samples");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/*app.use(function(req, res, next){
	res.locals.connection = mysql.createConnection({
		host     : 'cowpea.it.csiro.au',
		user     : 'sails',
		password : 'sailsDBpw',
		database : 'annotQDB'
	});
	res.locals.connection.connect();
	next();
});*/

var dbpool = mysql.createPool({
	connectionLimit: 10,
	host: "cowpea.it.csiro.au",
	user: "sails",
	password: "sailsDBpw",
	database: "annotQDB"
});
global.dbpool = dbpool;

app.use("/", indexRouter);
app.use("/api/v1/samples", samplesRouter);

module.exports = app;
