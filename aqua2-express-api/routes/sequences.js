var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbpool = require('../util/db-link.js');

function sampleQuery({ id = null, limit = 50, offset = 0, sort = null } = {}) {
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
		const qRes = await queryAll({ id: req.params.id });
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
		const [qTotal, qAll] = await Promise.all([
			countAll(),
			queryAll({ limit: limit, offset: offset, sort: sort })
		]);
		res.json(Object.assign(qTotal, qAll));
	})
);

async function countAll() {
	return new Promise(function(resolve, reject) {
		dbpool.query("SELECT count(*) AS total FROM sequence", function(
			error,
			results,
			fields
		) {
			if (error) {
				resolve({ error: error, total: null });
			} else if (results && results.length) {
				resolve({ error: null, total: results[0].total });
			} else {
				resolve({ error: null, total: 0 });
			}
		});
	});
}

async function queryAll({
	id = null,
	limit = 50,
	offset = 0,
	sort = null
} = {}) {
	return new Promise(function(resolve, reject) {
		dbpool.query(
			sampleQuery({ id: id, limit: limit, offset: offset, sort: sort }),
			function(error, results, fields) {
				if (error) {
					resolve({ status: 500, error: error, data: null });
				} else if (results && results.length) {
					resolve({ status: 200, error: null, data: results });
				} else {
					resolve({ status: 404, error: null, data: "Not found" });
				}
			}
		);
	});
}

module.exports = router;
