var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function totalsQuery() {
	const query = SQL`
SELECT
  sample,
  seqgroup,
  sequence,
  seqrelation,
  alignedannot,
  geneprediction
FROM totals
LIMIT 1
`;
	return query;
}

/* GET totals listing. */
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		const qAll = await dbLink.dbQueryAllToJRes(totalsQuery());
		res.json(Object.assign({ total: 1 }, qAll));
	})
);

module.exports = router;
