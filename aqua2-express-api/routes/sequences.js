var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function sequenceQuery({
	id = null,
	limit = 50,
	offset = 0,
	sort = null
} = {}) {
	const query = SQL`
SELECT 
  seq.id,
  seq.name,
  seq.length,
  seq.belongsGroup AS groupId,
  grp.name AS groupName,
  seq.isSample AS sampleId,
  samp.name AS sampleName,
  seq.isType AS typeId,
  stype.type AS typeName,
  seq.annotNote,
  seq.extLink
FROM sequence AS seq
JOIN seqgroup AS grp
  ON grp.id=seq.belongsGroup
JOIN sample AS samp
  ON samp.id=seq.isSample
JOIN seqtype AS stype
  ON stype.id=seq.isType
`;
	if (id) {
		query.append(SQL` WHERE seq.id = ${id}`);
	}
	if (sort) {
		query.append(SQL` ORDER BY `).append(sort);
	}
	query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
	return query;
}

/* GET 1 sequence listing. */
router.get(
	"/:id([0-9]{1,})",
	asyncHandler(async (req, res, next) => {
		const qRes = await dbLink.dbQueryAllToJRes(
			sequenceQuery({ id: req.params.id })
		);
		res.json(qRes);
	})
);

/* GET sequences listing. */
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		var limit = parseInt(req.query.limit, 10) || 50;
		var offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var sort = null;
		if (req.query.sort) {
			if (
				/^(name|length|groupName|sampleName|typeName)( (ASC|DESC))?$/i.test(
					req.query.sort
				)
			) {
				sort = req.query.sort;
			}
		}
		const [
			qTotal,
			qAll,
			filterbySamps,
			filterbyGroups,
			filterbyType
		] = await Promise.all([
			dbLink.dbCountAllToJRes("sequence"),
			dbLink.dbQueryAllToJRes(
				sequenceQuery({
					limit: limit,
					offset: offset,
					sort: sort
				})
			),
			dbLink.dbFilterListToJRes("sample", "name"),
			dbLink.dbFilterListToJRes("seqgroup", "name"),
			dbLink.dbFilterListToJRes("seqtype", "type")
		]);

		res.json(
			Object.assign(qTotal, qAll, {
				filterby: Object.assign(
					filterbySamps,
					filterbyGroups,
					filterbyType
				)
			})
		);
	})
);

module.exports = router;
