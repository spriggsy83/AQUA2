var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function sampleQuery({ id = null, limit = 50, offset = 0, sort = null } = {}) {
	const query = SQL`
SELECT 
  samp.id,
  samp.name, 
  samp.species, 
  samp.description, 
  groups.ingroups, 
  seq.numseqs
FROM sample AS samp
LEFT JOIN (
  SELECT 
    sample_inGroups, 
    COUNT(DISTINCT seqgroup_fromSamples) AS ingroups
  FROM sample_ingroups__seqgroup_fromsamples
  GROUP BY sample_inGroups
) AS groups 
  ON groups.sample_inGroups = samp.id
LEFT JOIN (
  SELECT 
    isSample, 
    COUNT(DISTINCT id) AS numseqs
  FROM sequence
  GROUP BY isSample
) AS seq 
  ON seq.isSample = samp.id
`;
	if (id) {
		query.append(SQL` WHERE samp.id = ${id}`);
	}
	if (sort) {
		query.append(SQL` ORDER BY `).append(sort);
	}
	query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
	return query;
}

/* GET 1 sample listing. */
router.get(
	"/:id([0-9]{1,})",
	asyncHandler(async (req, res, next) => {
		const qRes = await dbLink.dbQueryAllToJRes(
			sampleQuery({ id: req.params.id })
		);
		res.json(qRes);
	})
);

/* GET samples listing. */
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		var limit = parseInt(req.query.limit, 10) || 50;
		var offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var sort = null;
		if (req.query.sort) {
			if (
				/^(name|species|ingroups|numseqs)( (ASC|DESC))?$/i.test(
					req.query.sort
				)
			) {
				sort = req.query.sort;
			}
		}
		const [qTotal, qAll] = await Promise.all([
			dbLink.dbCountAllToJRes("sample"),
			dbLink.dbQueryAllToJRes(
				sampleQuery({
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
