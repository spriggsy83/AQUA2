var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function seqstringQuery({ seqid = null, start = null, length = null } = {}) {
	const query = SQL`
SELECT `;
	if (start && length) {
		query.append(SQL`
SUBSTRING(theString, ${start}, ${length}) AS seqstring `);
	} else {
		query.append(SQL`
theString AS seqstring `);
	}
	query.append(SQL`
FROM seqstring 
WHERE fromSeq = ${seqid}`);
	return query;
}

/** GET seqstring or substring.
 */
router.get(
	"/:seqid([0-9]{1,})",
	asyncHandler(async (req, res, next) => {
		var start = parseInt(req.query.start, 10) || null;
		var length = parseInt(req.query.length, 10) || null;

		const qRes = await dbLink.dbQueryToJRes(
			seqstringQuery({ seqid: req.params.seqid, start: start, length: length })
		);
		res.json(qRes);
	})
);

module.exports = router;
