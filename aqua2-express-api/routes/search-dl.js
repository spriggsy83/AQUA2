var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings');
const asyncHandler = require('express-async-handler');
const { Transform } = require('stream');

var dbLink = require('../util/db-link.js');

function searchQuery({
	searchTerm = null,
	searchType = null,
	limit = null,
	offset = 0,
	sort = null,
} = {}) {
	if (searchTerm) {
		const query = SQL`
SELECT
  'sequence' AS resultType,
  seq.name AS seqName,
  seq.length AS seqLength,
  grp.name AS seqGroupName,
  samp.name AS seqSampleName,
  stype.type AS seqTypeName,
  seq.extLink AS seqExtLink,
  seq.extLinkLabel AS seqExtLinkLabel,
  seq.annotNote AS seqAnnot,
  NULL AS alignName,
  NULL AS alignStart,
  NULL AS alignEnd,
  NULL AS alignStrand,
  NULL AS alignSpecies,
  NULL AS alignSource,
  NULL AS alignMethod,
  NULL AS alignScore,
  NULL AS alignAnnot
FROM sequence AS seq
JOIN seqgroup AS grp
  ON grp.id=seq.belongsGroup
JOIN sample AS samp
  ON samp.id=seq.isSample
JOIN seqtype AS stype
  ON stype.id=seq.isType
`;
		if (!searchType || searchType === 'all') {
			query.append(
				SQL`WHERE ( seq.name LIKE ${searchTerm} OR seq.annotNote LIKE ${searchTerm} )`,
			);
		} else if (searchType === 'seqs') {
			query.append(SQL`WHERE seq.name LIKE ${searchTerm}`);
		} else if (searchType === 'annots') {
			query.append(SQL`WHERE seq.annotNote LIKE ${searchTerm}`);
		}

		if (searchType !== 'seqs') {
			query.append(SQL`
UNION ALL
SELECT
  'alignedannot' AS resultType,
  seq.name AS seqName,
  seq.length AS seqLength,
  grp.name AS seqGroupName,
  samp.name AS seqSampleName,
  stype.type AS seqTypeName,
  seq.extLink AS seqExtLink,
  seq.extLinkLabel AS seqExtLinkLabel,
  seq.annotNote AS seqAnnot,
  aln.name AS alignName,
  aln.start AS alignStart,
  aln.end AS alignEnd,
  aln.strand AS alignStrand,
  aln.species AS alignSpecies,
  aln.source AS alignSource,
  aln.method AS alignMethod,
  aln.score AS alignScore,
  aln.annotation AS alignAnnot
FROM alignedannot aln
JOIN sequence AS seq
  ON seq.id=aln.onSequence
JOIN seqgroup AS grp
  ON grp.id=seq.belongsGroup
JOIN sample AS samp
  ON samp.id=seq.isSample
JOIN seqtype AS stype
  ON stype.id=seq.isType
WHERE aln.name LIKE ${searchTerm} 
OR aln.annotation LIKE ${searchTerm}
`);
		}

		if (sort) {
			query.append(SQL` ORDER BY `).append(sort);
		}
		if (limit) {
			query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
		}
		return query;
	} else {
		return null;
	}
}

/* GET keyword/phrase search */
router.get(
	'/:searchterm',
	asyncHandler(async (req, res, next) => {
		var searchTerm = '%' + req.params.searchterm.replace(/\*/g, '%') + '%';
		var limit = parseInt(req.query.limit, 10) || null;
		var offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var searchType = null;
		if (req.query.searchtype) {
			if (['seqs', 'annots', 'all'].includes(req.query.searchtype)) {
				searchType = req.query.searchtype;
			}
		}
		var sort = null;
		if (req.query.sort) {
			var sortParamTest = /^(\S+)( (ASC|DESC))?$/i.exec(req.query.sort);
			if (sortParamTest) {
				if (
					[
						'resultType',
						'seqName',
						'seqLength',
						'seqGroupName',
						'seqSampleName',
						'seqTypeName',
						'alignName',
						'alignSpecies',
						'alignSource',
						'alignMethod',
					].includes(sortParamTest[1])
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
			dbLink.dbpool.getConnection(function(err, connection) {
				if (err) throw err; // not connected!

				res.setHeader('Content-Type', 'text/csv');
				res.setHeader(
					'Content-disposition',
					'attachment;filename=searchResult.csv',
				);

				let cols = [
					'resultType',
					'seqName',
					'seqLength',
					'seqGroupName',
					'seqSampleName',
					'seqTypeName',
					'seqAnnot',
					'seqExtLink',
					'seqExtLinkLabel',
				];
				if (searchType !== 'seqs') {
					cols.push(
						'alignName',
						'alignStart',
						'alignEnd',
						'alignStrand',
						'alignSpecies',
						'alignSource',
						'alignMethod',
						'alignScore',
						'alignAnnot',
					);
				}
				res.write(cols.join(',') + '\r\n');

				const queryTransformer = new Transform({
					writableObjectMode: true,
					readableObjectMode: false,
					transform(chunk, encoding, callback) {
						let line =
							[
								chunk.resultType,
								chunk.seqName,
								chunk.seqLength,
								chunk.seqGroupName,
								chunk.seqSampleName,
								chunk.seqTypeName,
							].join(',') + ',';
						if (chunk.seqAnnot) {
							line += '"' + chunk.seqAnnot + '"';
						}
						if (chunk.seqExtLink) {
							if (chunk.seqExtLink !== 'null' && chunk.seqExtLink !== 'NULL') {
								line +=
									',' + chunk.seqExtLink + ',' + chunk.seqExtLinkLabel + ',';
							} else {
								line += ',,,';
							}
						} else {
							line += ',,,';
						}
						if (searchType !== 'seqs') {
							line +=
								[
									chunk.alignName,
									chunk.alignStart,
									chunk.alignEnd,
									chunk.alignStrand,
									chunk.alignSpecies,
									chunk.alignSource,
									chunk.alignMethod,
									chunk.alignScore,
								].join(',') + ',';
							if (chunk.alignAnnot) {
								line += '"' + chunk.alignAnnot + '"';
							}
						}
						line += '\r\n';
						line.replace(/\bNULL\b/gi, '');
						this.push(line);
						callback();
					},
				});

				connection
					.query(
						searchQuery({
							searchTerm: searchTerm,
							searchType: searchType,
							limit: limit,
							offset: offset,
							sort: sort,
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
