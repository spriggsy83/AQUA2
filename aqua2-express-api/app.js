var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");

var indexRouter = require("./routes/index");
var samplesRouter = require("./routes/samples");
var sequencesRouter = require("./routes/sequences");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/api/v1/sequences", sequencesRouter);

module.exports = app;
