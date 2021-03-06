var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings');
const asyncHandler = require('express-async-handler');

var dbLink = require('../util/db-link.js');

function sequenceQuery({
	id = null,
	name = null,
	limit = 100,
	offset = 0,
	sort = null,
	filterSQL = null,
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
  seq.extLink,
  seq.extLinkLabel
FROM sequence AS seq
JOIN seqgroup AS grp
  ON grp.id=seq.belongsGroup
JOIN sample AS samp
  ON samp.id=seq.isSample
JOIN seqtype AS stype
  ON stype.id=seq.isType
WHERE 1 = 1
`;
	if (id) {
		query.append(SQL` AND seq.id = ${id}`);
	} else if (name) {
		query.append(SQL` AND seq.name = ${name}`);
	} else if (filterSQL) {
		query.append(filterSQL);
	}
	if (sort) {
		query.append(SQL` ORDER BY `).append(sort);
	}
	query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
	return query;
}

function sequenceCountQuery({ filterSQL = null } = {}) {
	const countQuery = SQL`
SELECT 
  count(*) AS total
FROM sequence
WHERE 1 = 1
`;
	if (filterSQL) {
		countQuery.append(filterSQL);
	}
	return countQuery;
}

function sequenceUpdateQuery({ id = null, annotNote = null } = {}) {
	const query = SQL`
UPDATE sequence
SET annotNote = ${annotNote}
WHERE id = ${id}
`;
	return query;
}

/* Parse 'filter=' param for valid entry.
 Returns SQL WHERE clause component string "AND key IN ( values )"
 Or null/error */
function filterParamJsonToSql({ filterParamStr = null } = {}) {
	var filterableTables = ['sample', 'seqgroup', 'seqtype'];
	var queryAliases = ['isSample', 'belongsGroup', 'isType'];
	var doFilter = false;
	var filterSQL = '';
	if (filterParamStr) {
		try {
			let filterParam = JSON.parse(filterParamStr);
			for (let i = 0; i < 3; i++) {
				let tablename = filterableTables[i];
				let queryAlias = queryAliases[i];
				if (filterParam[tablename]) {
					let IDs = [];
					for (let j = 0; j < filterParam[tablename].length; j++) {
						if (Number.isInteger(filterParam[tablename][j])) {
							IDs.push(filterParam[tablename][j]);
						}
					}
					if (IDs.length > 0) {
						filterSQL += ` AND ${queryAlias} IN ( `;
						for (let j = 0; j < IDs.length; j++) {
							if (j === 0) {
								filterSQL += `${IDs[j]}`;
							} else {
								filterSQL += `, ${IDs[j]}`;
							}
						}
						filterSQL += ` )`;
						doFilter = true;
					}
				}
			}
		} catch (error) {
			/* Filter Param not valid JSON.*/
			throw error;
		}
	}
	if (doFilter) {
		return filterSQL;
	} else {
		return null;
	}
}

/** GET 1 sequence listing.
 * Integer-only = seq ID
 * OR Starting with alphanumeric char = seq name
 */
router.get(
	'/:id([0-9]{1,})',
	asyncHandler(async (req, res, next) => {
		const qRes = await dbLink.dbQueryToJRes(
			sequenceQuery({ id: req.params.id }),
		);
		res.json(qRes);
	}),
);
router.get(
	'/:name(\\w\\S{0,})',
	asyncHandler(async (req, res, next) => {
		const qRes = await dbLink.dbQueryToJRes(
			sequenceQuery({ name: req.params.name }),
		);
		res.json(qRes);
	}),
);

/* GET sequences listing. */
router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		var limit = parseInt(req.query.limit, 10) || 100;
		var offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var sort = null;
		if (req.query.sort) {
			if (
				/^(name|length|groupName|sampleName|typeName)( (ASC|DESC))?$/i.test(
					req.query.sort,
				)
			) {
				sort = req.query.sort;
			} else {
				res.json({
					status: 400,
					error: "Invalid 'sort=' parameter, " + req.query.sort,
					data: null,
				});
				return;
			}
		}
		try {
			var filterSQL = filterParamJsonToSql({
				filterParamStr: req.query.filter,
			});
		} catch (error) {
			/* Filter Param not valid JSON.*/
			res.json({
				status: 400,
				error: "Invalid JSON in 'filter=' query.  " + error,
				data: null,
			});
			return;
		}

		/* Submit series of async queries */
		/* qTotal is either a fast totals-table-lookup
		  or a slow WHERE query, depending on 'filterSQL' */
		const [qTotal, qAll] = await Promise.all([
			filterSQL
				? dbLink.dbCountQueryToJRes(
						sequenceCountQuery({ filterSQL: filterSQL }),
				  )
				: dbLink.dbCountAllToJRes('sequence'),
			dbLink.dbQueryToJRes(
				sequenceQuery({
					limit: limit,
					offset: offset,
					sort: sort,
					filterSQL: filterSQL,
				}),
			),
		]);

		res.json({
			...qTotal,
			...qAll,
		});
	}),
);

/** PATCH 1 sequence listing.
 * Takes seq ID as primary param
 * Currently only allows Patch of seq.annotNote
 */
router.patch(
	'/:id([0-9]{1,})',
	asyncHandler(async (req, res, next) => {
		var id = req.params.id || null;
		var pdata = req.body.data || null;
		var annotNote = null;
		if (typeof pdata.annotNote === 'string') {
			annotNote = pdata.annotNote;
		}

		if (id && typeof annotNote === 'string') {
			const qRes = await dbLink.dbUpdateToJRes(
				sequenceUpdateQuery({ id: id, annotNote: annotNote }),
			);
			if (qRes.status === 200) {
				const qRes2 = await dbLink.dbQueryToJRes(
					sequenceQuery({ id: req.params.id }),
				);
				res.json(qRes2);
			} else {
				res.json(qRes);
			}
		}
	}),
);

module.exports = router;
