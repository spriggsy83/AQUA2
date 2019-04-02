var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings');
const asyncHandler = require('express-async-handler');
const { Transform } = require('stream');

var dbLink = require('../util/db-link.js');

function sequenceQuery({
	id = null,
	name = null,
	limit = null,
	offset = 0,
	sort = null,
	filterSQL = null,
} = {}) {
	const query = SQL`
SELECT 
  seq.name,
  seq.length,
  grp.name AS groupName,
  samp.name AS sampleName,
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
	if (limit) {
		query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
	}
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

/* GET sequences listing and stream to csv file. */
router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		var limit = parseInt(req.query.limit, 10) || null;
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
			});
			return;
		}

		try {
			dbLink.dbpool.getConnection(function(err, connection) {
				if (err) throw err; // not connected!

				res.setHeader('Content-Type', 'text/csv');
				res.setHeader(
					'Content-disposition',
					'attachment;filename=sequenceList.csv',
				);
				res.write(
					[
						'name',
						'length',
						'groupName',
						'sampleName',
						'typeName',
						'annotNote',
						'extLink',
						'extLinkLabel',
					].join(',') + '\r\n',
				);

				const queryTransformer = new Transform({
					writableObjectMode: true,
					readableObjectMode: false,
					transform(chunk, encoding, callback) {
						let line =
							[
								chunk.name,
								chunk.length,
								chunk.groupName,
								chunk.sampleName,
								chunk.typeName,
							].join(',') + ',';
						if (chunk.annotNote) {
							if (chunk.annotNote !== 'null' && chunk.annotNote !== 'NULL') {
								line += '"' + chunk.annotNote + '"';
							}
						}
						if (chunk.extLink) {
							if (chunk.extLink !== 'null' && chunk.extLink !== 'NULL') {
								line += ',' + chunk.extLink + ',' + chunk.extLinkLabel + '\r\n';
							} else {
								line += ',,\r\n';
							}
						} else {
							line += ',,\r\n';
						}
						this.push(line);
						callback();
					},
				});

				connection
					.query(
						sequenceQuery({
							limit: limit,
							offset: offset,
							sort: sort,
							filterSQL: filterSQL,
						}),
					)
					.on('end', function() {
						connection.release();
					})
					.stream({ highWaterMark: 5 })
					.pipe(queryTransformer)
					.pipe(res);
			});
		} catch (error) {
			res.json({
				status: 500,
				error: 'Download error' + error,
			});
			return;
		}
	}),
);

module.exports = router;
