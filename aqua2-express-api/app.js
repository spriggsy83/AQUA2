var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');
var swaggerDocument = YAML.load('./docs/swagger.yaml');

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

app.use('/api2-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", indexRouter);
app.use("/api/v2/samples", samplesRouter);
app.use("/api/v2/sequences", sequencesRouter);

module.exports = app;
