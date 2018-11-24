var express = require("express");
var router = express.Router();

/* GET samples listing. */
router.get("/", function(req, res, next) {
	//res.locals.connection.query('SELECT * from sample', function (error, results, fields) {
	dbpool.query("SELECT * from sample", function(error, results, fields) {
		if (error) {
			res.send(JSON.stringify({ status: 500, error: error, data: null }));
			//If there is error, we send the error in the error section with 500 status
		} else {
			res.send(
				JSON.stringify({ status: 200, error: null, data: results })
			);
			//If there is no error, all is good and response is 200OK.
		}
	});
});

module.exports = router;
