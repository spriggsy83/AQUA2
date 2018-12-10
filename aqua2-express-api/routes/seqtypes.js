var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function seqtypeQuery({ id = null } = {}) {
	const query = SQL`
SELECT
  styp.id,
  styp.type,
  IFNULL(seq.numseqs, 0) AS numseqs
FROM seqtype AS styp
LEFT JOIN (
  SELECT 
    isType, 
    COUNT(DISTINCT id) AS numseqs
  FROM sequence
  GROUP BY isType
) AS seq 
  ON seq.isType = styp.id
`;
	if (id) {
		query.append(SQL` WHERE styp.id = ${id}`);
	}
	query.append(SQL` ORDER BY numseqs DESC`);
	return query;
}

/* GET 1 seqtype listing. */
router.get(
	"/:id([0-9]{1,})",
	asyncHandler(async (req, res, next) => {
		const qRes = await dbLink.dbQueryAllToJRes(
			seqtypeQuery({ id: req.params.id })
		);
		res.json(qRes);
	})
);

/* GET seqtypes listing. */
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		const [qTotal, qAll] = await Promise.all([
			dbLink.dbCountAllToJRes("seqtype"),
			dbLink.dbQueryAllToJRes(seqtypeQuery())
		]);
		res.json(Object.assign(qTotal, qAll));
	})
);

module.exports = router;
