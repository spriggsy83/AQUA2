var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function seqgroupQuery({
	id = null,
	limit = 100,
	offset = 0,
	sort = null
} = {}) {
	const query = SQL`
SELECT
  sgroup.id,
  sgroup.name,
  sgroup.description,
  IFNULL(samps.fromsamps, 0) AS fromsamps,
  IFNULL(seq.numseqs, 0) AS numseqs,
  sgroup.avlength,
  sgroup.n50length,
  sgroup.maxlength
FROM seqgroup AS sgroup
LEFT JOIN (
  SELECT 
    seqgroup_fromSamples, 
    COUNT(DISTINCT sample_inGroups) AS fromsamps
  FROM sample_ingroups__seqgroup_fromsamples
  GROUP BY seqgroup_fromSamples
) AS samps 
  ON samps.seqgroup_fromSamples = sgroup.id
LEFT JOIN (
  SELECT 
    belongsGroup, 
    COUNT(DISTINCT id) AS numseqs
  FROM sequence
  GROUP BY belongsGroup
) AS seq 
  ON seq.belongsGroup = sgroup.id
`;
	if (id) {
		query.append(SQL` WHERE sgroup.id = ${id}`);
	}
	if (sort) {
		query.append(SQL` ORDER BY `).append(sort);
	}
	query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
	return query;
}

/* GET 1 seqgroup listing. */
router.get(
	"/:id([0-9]{1,})",
	asyncHandler(async (req, res, next) => {
		const qRes = await dbLink.dbQueryAllToJRes(
			seqgroupQuery({ id: req.params.id })
		);
		res.json(qRes);
	})
);

/* GET seqgroups listing. */
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		var limit = parseInt(req.query.limit, 10) || 100;
		var offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var sort = null;
		if (req.query.sort) {
			if (
				/^(name|fromsamps|numseqs|avlength|n50length|maxlength)( (ASC|DESC))?$/i.test(
					req.query.sort
				)
			) {
				sort = req.query.sort;
			}
		}
		const [qTotal, qAll] = await Promise.all([
			dbLink.dbCountAllToJRes("seqgroup"),
			dbLink.dbQueryAllToJRes(
				seqgroupQuery({
					limit: limit,
					offset: offset,
					sort: sort
				})
			)
		]);
		res.json(Object.assign(qTotal, qAll));
	})
);

module.exports = router;
