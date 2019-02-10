var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUi = require("swagger-ui-express");
var YAML = require("yamljs");

require("dotenv").config();

var swaggerDocument = YAML.load("./docs/swagger.yaml");

var indexRouter = require("./routes/index");
var totalsRouter = require("./routes/totals");
var samplesRouter = require("./routes/samples");
var seqgroupsRouter = require("./routes/seqgroups");
var seqtypesRouter = require("./routes/seqtypes");
var sequencesRouter = require("./routes/sequences");
var seqstringRouter = require("./routes/seqstring");
var searchRouter = require("./routes/search");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api2-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", indexRouter);
app.use("/api/v2/totals", totalsRouter);
app.use("/api/v2/samples", samplesRouter);
app.use("/api/v2/seqgroups", seqgroupsRouter);
app.use("/api/v2/seqtypes", seqtypesRouter);
app.use("/api/v2/sequences", sequencesRouter);
app.use("/api/v2/seqstring", seqstringRouter);
app.use("/api/v2/search", searchRouter);

module.exports = app;
