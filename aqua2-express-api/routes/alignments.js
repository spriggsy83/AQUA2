var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings');
const asyncHandler = require('express-async-handler');

var dbLink = require('../util/db-link.js');

function alignmentsQuery({
	id = null,
	qStart = null,
	qEnd = null,
	filter = null,
	limit = 100,
	offset = 0,
	sort = null,
} = {}) {
	if (id) {
		var first = true;
		const query = SQL``;
		if (!filter || filter.parentseqs) {
			first = false;
			query.append(SQL`
SELECT 
  'parentSeq' AS featureType,
  align.id AS featureId,
  pseq.name AS featureName,
  pseq.id AS seqId,
  pseq.length AS seqLength,
  pseq.belongsGroup AS seqGroupId,
  grp.name AS seqGroupName,
  pseq.isSample AS seqSampleId,
  samp.name AS seqSampleName,
  pseq.isType AS seqTypeId,
  stype.type AS seqTypeName,
  align.cStart AS alignStart,
  align.cEnd AS alignEnd,
  align.strand AS alignStrand,
  align.pStart AS featureAlignStart,
  align.pEnd AS featureAlignEnd,
  NULL AS featureSpecies,
  NULL AS featureSource,
  align.method AS alignMethod,
  align.score AS alignScore,
  NULL AS featureAnnot,
  NULL AS isCdsID,
  NULL AS isCdsName,
  NULL AS isProtID,
  NULL AS isProtName,
  count(subparts.id) AS subParts
FROM seqrelation as align
JOIN sequence AS pseq
  ON align.parentSeq=pseq.id
JOIN seqgroup AS grp
  ON grp.id=pseq.belongsGroup
JOIN sample AS samp
  ON samp.id=pseq.isSample
JOIN seqtype AS stype
  ON stype.id=pseq.isType
LEFT JOIN seqrelpart as subparts
  ON align.id=subparts.fromSeqRel
WHERE align.childSeq = ${id}
`);
			if (qStart && qEnd) {
				query.append(SQL`
AND ( ( align.cStart BETWEEN ${qStart} AND ${qEnd} )
  OR ( align.cEnd BETWEEN ${qStart} AND ${qEnd} )
  OR ( align.cStart < ${qStart} AND align.cEnd > ${qEnd} ) )
`);
			}
			query.append(SQL`
GROUP BY align.id
`);
		}
		if (!filter || filter.childseqs) {
			if (first) {
				first = false;
			} else {
				query.append(SQL`
UNION ALL `);
			}
			query.append(SQL`
SELECT 
  'childSeq' AS featureType,
  align.id AS featureId,
  cseq.name AS featureName,
  cseq.id AS seqId,
  cseq.length AS seqLength,
  cseq.belongsGroup AS seqGroupId,
  grp.name AS seqGroupName,
  cseq.isSample AS seqSampleId,
  samp.name AS seqSampleName,
  cseq.isType AS seqTypeId,
  stype.type AS seqTypeName,
  align.pStart AS alignStart,
  align.pEnd AS alignEnd,
  align.strand AS alignStrand,
  align.cStart AS featureAlignStart,
  align.cEnd AS featureAlignEnd,
  NULL AS featureSpecies,
  NULL AS featureSource,
  align.method AS alignMethod,
  align.score AS alignScore,
  NULL AS featureAnnot,
  NULL AS isCdsID,
  NULL AS isCdsName,
  NULL AS isProtID,
  NULL AS isProtName,
  count(subparts.id) AS subParts
FROM seqrelation as align
JOIN sequence AS cseq
  ON align.childSeq=cseq.id
JOIN seqgroup AS grp
  ON grp.id=cseq.belongsGroup
JOIN sample AS samp
  ON samp.id=cseq.isSample
JOIN seqtype AS stype
  ON stype.id=cseq.isType
LEFT JOIN seqrelpart as subparts
  ON align.id=subparts.fromSeqRel
WHERE align.parentSeq = ${id}
`);
			if (qStart && qEnd) {
				query.append(SQL`
AND ( ( align.pStart BETWEEN ${qStart} AND ${qEnd} )
  OR ( align.pEnd BETWEEN ${qStart} AND ${qEnd} )
  OR ( align.pStart < ${qStart} AND align.pEnd > ${qEnd} ) )
`);
			}
			query.append(SQL`
GROUP BY align.id
`);
		}
		if (!filter || filter.alignedannots) {
			if (first) {
				first = false;
			} else {
				query.append(SQL`
UNION ALL `);
			}
			query.append(SQL`
SELECT 
  'alignedAnnot' AS featureType,
  align.id AS featureId,
  align.name AS featureName,
  NULL AS seqId,
  NULL AS seqLength,
  NULL AS seqGroupId,
  NULL AS seqGroupName,
  NULL AS seqSampleId,
  NULL AS seqSampleName,
  NULL AS seqTypeId,
  NULL AS seqTypeName,
  align.start AS alignStart,
  align.end AS alignEnd,
  align.strand AS alignStrand,
  NULL AS featureAlignStart,
  NULL AS featureAlignEnd,
  align.species AS featureSpecies,
  align.source AS featureSource,
  align.method AS alignMethod,
  align.score AS alignScore,
  align.annotation AS featureAnnot,
  NULL AS isCdsID,
  NULL AS isCdsName,
  NULL AS isProtID,
  NULL AS isProtName,
  count(subparts.id) AS subParts
FROM alignedannot as align
LEFT JOIN alignpart as subparts
  ON align.id=subparts.fromAlignment
WHERE align.onSequence = ${id}
`);
			if (qStart && qEnd) {
				query.append(SQL`
AND ( ( align.start BETWEEN ${qStart} AND ${qEnd} )
  OR ( align.end BETWEEN ${qStart} AND ${qEnd} )
  OR ( align.start < ${qStart} AND align.end > ${qEnd} ) )
`);
			}
			query.append(SQL`
GROUP BY align.id
`);
		}
		if (!filter || filter.genepreds) {
			if (first) {
				first = false;
			} else {
				query.append(SQL`
UNION ALL `);
			}
			query.append(SQL`
SELECT 
  'genePrediction' AS featureType,
  genepred.id AS featureId,
  genepred.name AS featureName,
  NULL AS seqId,
  NULL AS seqLength,
  NULL AS seqGroupId,
  NULL AS seqGroupName,
  NULL AS seqSampleId,
  NULL AS seqSampleName,
  NULL AS seqTypeId,
  NULL AS seqTypeName,
  genepred.start AS alignStart,
  genepred.end AS alignEnd,
  genepred.strand AS alignStrand,
  NULL AS featureAlignStart,
  NULL AS featureAlignEnd,
  NULL AS featureSpecies,
  NULL AS featureSource,
  genepred.method AS genepredMethod,
  genepred.score AS genepredScore,
  NULL AS featureAnnot,
  genepred.isCdsSequence AS isCdsID,
  cdsseq.name AS isCdsName,
  genepred.isProtSequence AS isProtID,
  protseq.name AS isProtName,
  count(subparts.id) AS subParts
FROM geneprediction as genepred
LEFT JOIN sequence AS cdsseq
  ON genepred.isCdsSequence=cdsseq.id
LEFT JOIN sequence AS protseq
  ON genepred.isProtSequence=protseq.id
LEFT JOIN genepart as subparts
  ON genepred.id=subparts.fromGenePred
WHERE genepred.onSequence = ${id}
`);
			if (qStart && qEnd) {
				query.append(SQL`
AND ( ( genepred.start BETWEEN ${qStart} AND ${qEnd} )
  OR ( genepred.end BETWEEN ${qStart} AND ${qEnd} )
  OR ( genepred.start < ${qStart} AND genepred.end > ${qEnd} ) )
`);
			}
			query.append(SQL`
GROUP BY genepred.id
UNION ALL 
SELECT 
  'isGenePrediction' AS featureType,
  genepred.id AS featureId,
  refseq.name AS featureName,
  refseq.id AS seqId,
  refseq.length AS seqLength,
  refseq.belongsGroup AS seqGroupId,
  grp.name AS seqGroupName,
  refseq.isSample AS seqSampleId,
  samp.name AS seqSampleName,
  refseq.isType AS seqTypeId,
  stype.type AS seqTypeName,
  1 AS alignStart,
  cdsseq.length AS alignEnd,
  genepred.strand AS alignStrand,
  genepred.start AS featureAlignStart,
  genepred.end AS featureAlignEnd,
  NULL AS featureSpecies,
  NULL AS featureSource,
  genepred.method AS genepredMethod,
  genepred.score AS genepredScore,
  NULL AS featureAnnot,
  NULL AS isCdsID,
  NULL AS isCdsName,
  genepred.isProtSequence AS isProtID,
  protseq.name AS isProtName,
  count(subparts.id) AS subParts
FROM geneprediction as genepred
JOIN sequence AS refseq
  ON genepred.onSequence=refseq.id
JOIN seqgroup AS grp
  ON grp.id=refseq.belongsGroup
JOIN sample AS samp
  ON samp.id=refseq.isSample
JOIN seqtype AS stype
  ON stype.id=refseq.isType
LEFT JOIN sequence AS cdsseq
  ON genepred.isCdsSequence=cdsseq.id
LEFT JOIN sequence AS protseq
  ON genepred.isProtSequence=protseq.id
LEFT JOIN genepart as subparts
  ON genepred.id=subparts.fromGenePred
WHERE genepred.isCdsSequence = ${id}
GROUP BY genepred.id
UNION ALL 
SELECT 
  'isGenePrediction' AS featureType,
  genepred.id AS featureId,
  refseq.name AS featureName,
  refseq.id AS seqId,
  refseq.length AS seqLength,
  refseq.belongsGroup AS seqGroupId,
  grp.name AS seqGroupName,
  refseq.isSample AS seqSampleId,
  samp.name AS seqSampleName,
  refseq.isType AS seqTypeId,
  stype.type AS seqTypeName,
  1 AS alignStart,
  protseq.length AS alignEnd,
  genepred.strand AS alignStrand,
  genepred.start AS featureAlignStart,
  genepred.end AS featureAlignEnd,
  NULL AS featureSpecies,
  NULL AS featureSource,
  genepred.method AS genepredMethod,
  genepred.score AS genepredScore,
  NULL AS featureAnnot,
  genepred.isCdsSequence AS isCdsID,
  cdsseq.name AS isCdsName,
  NULL AS isProtID,
  NULL AS isProtName,
  count(subparts.id) AS subParts
FROM geneprediction as genepred
JOIN sequence AS refseq
  ON genepred.onSequence=refseq.id
JOIN seqgroup AS grp
  ON grp.id=refseq.belongsGroup
JOIN sample AS samp
  ON samp.id=refseq.isSample
JOIN seqtype AS stype
  ON stype.id=refseq.isType
LEFT JOIN sequence AS cdsseq
  ON genepred.isCdsSequence=cdsseq.id
LEFT JOIN sequence AS protseq
  ON genepred.isProtSequence=protseq.id
LEFT JOIN genepart as subparts
  ON genepred.id=subparts.fromGenePred
WHERE genepred.isProtSequence = ${id}
GROUP BY genepred.id
`);
		}
		if (!filter || filter.repeats) {
			if (first) {
				first = false;
			} else {
				query.append(SQL`
UNION ALL `);
			}
			query.append(SQL`
SELECT 
  'repeat' AS featureType,
  repannot.id AS featureId,
  NULL AS featureName,
  NULL AS seqId,
  NULL AS seqLength,
  NULL AS seqGroupId,
  NULL AS seqGroupName,
  NULL AS seqSampleId,
  NULL AS seqSampleName,
  NULL AS seqTypeId,
  NULL AS seqTypeName,
  repannot.start AS alignStart,
  repannot.end AS alignEnd,
  repannot.strand AS alignStrand,
  NULL AS featureAlignStart,
  NULL AS featureAlignEnd,
  NULL AS featureSpecies,
  NULL AS featureSource,
  repannot.method AS repannotMethod,
  NULL AS repannotScore,
  repannot.annotation AS featureAnnot,
  NULL AS isCdsID,
  NULL AS isCdsName,
  NULL AS isProtID,
  NULL AS isProtName,
  0 AS subParts
FROM repeatannot as repannot
WHERE repannot.onSequence = ${id}
`);
			if (qStart && qEnd) {
				query.append(SQL`
AND ( ( repannot.start BETWEEN ${qStart} AND ${qEnd} )
  OR ( repannot.end BETWEEN ${qStart} AND ${qEnd} )
  OR ( repannot.start < ${qStart} AND repannot.end > ${qEnd} ) )
`);
			}
		}

		if (sort) {
			query.append(SQL` ORDER BY `).append(sort);
		}
		query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);
		return query;
	} else {
		return null;
	}
}

function alignmentsCountQuery({
	id = null,
	qStart = null,
	qEnd = null,
	filter = null,
} = {}) {
	if (id) {
		var first = true;
		const countQuery = SQL`
SELECT sum(counts) AS total
FROM (
`;
		if (!filter || filter.parentseqs) {
			first = false;
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM seqrelation as align
  WHERE align.childSeq = ${id}
`);
			if (qStart && qEnd) {
				countQuery.append(SQL`
  AND ( ( align.cStart BETWEEN ${qStart} AND ${qEnd} )
    OR ( align.cEnd BETWEEN ${qStart} AND ${qEnd} )
    OR ( align.cStart < ${qStart} AND align.cEnd > ${qEnd} ) )
`);
			}
		}
		if (!filter || filter.childseqs) {
			if (first) {
				first = false;
			} else {
				countQuery.append(SQL`
UNION ALL `);
			}
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM seqrelation as align
  WHERE align.parentSeq = ${id}
`);
			if (qStart && qEnd) {
				countQuery.append(SQL`
  AND ( ( align.pStart BETWEEN ${qStart} AND ${qEnd} )
    OR ( align.pEnd BETWEEN ${qStart} AND ${qEnd} )
    OR ( align.pStart < ${qStart} AND align.pEnd > ${qEnd} ) )
`);
			}
		}
		if (!filter || filter.alignedannots) {
			if (first) {
				first = false;
			} else {
				countQuery.append(SQL`
UNION ALL `);
			}
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM alignedannot as align
  WHERE align.onSequence = ${id}
`);
			if (qStart && qEnd) {
				countQuery.append(SQL`
  AND ( ( align.start BETWEEN ${qStart} AND ${qEnd} )
    OR ( align.end BETWEEN ${qStart} AND ${qEnd} )
    OR ( align.start < ${qStart} AND align.end > ${qEnd} ) )
`);
			}
		}
		if (!filter || filter.genepreds) {
			if (first) {
				first = false;
			} else {
				countQuery.append(SQL`
UNION ALL `);
			}
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM geneprediction as genepred
  WHERE genepred.onSequence = ${id}
`);
			if (qStart && qEnd) {
				countQuery.append(SQL`
  AND ( ( genepred.start BETWEEN ${qStart} AND ${qEnd} )
    OR ( genepred.end BETWEEN ${qStart} AND ${qEnd} )
    OR ( genepred.start < ${qStart} AND genepred.end > ${qEnd} ) )
`);
			}

			countQuery.append(SQL`
UNION ALL 
  SELECT count(id) AS counts 
  FROM geneprediction as genepred
  WHERE genepred.isCdsSequence = ${id}
UNION ALL 
  SELECT count(id) AS counts 
  FROM geneprediction as genepred
  WHERE genepred.isProtSequence = ${id}
`);
		}
		if (!filter || filter.repeats) {
			if (first) {
				first = false;
			} else {
				countQuery.append(SQL`
UNION ALL `);
			}
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM repeatannot as repannot
  WHERE repannot.onSequence = ${id}
`);
			if (qStart && qEnd) {
				countQuery.append(SQL`
  AND ( ( repannot.start BETWEEN ${qStart} AND ${qEnd} )
    OR ( repannot.end BETWEEN ${qStart} AND ${qEnd} )
    OR ( repannot.start < ${qStart} AND repannot.end > ${qEnd} ) )
`);
			}
		}
		countQuery.append(SQL`
) sum`);
		return countQuery;
	} else {
		return null;
	}
}

/** GET alignments related to a sequence
 */
router.get(
	'/:seqid([0-9]{1,})',
	asyncHandler(async (req, res, next) => {
		const seqid = req.params.seqid;
		const start = parseInt(req.query.start, 10) || null;
		const end = parseInt(req.query.end, 10) || null;
		const filterParam = req.query.filter || null;
		/** filter={ parentseqs: true, 
					childseqs: true, 
					alignedannots: true, 
					genepreds: true, 
					repeats: true } **/
		var filter = null;
		if (filterParam) {
			try {
				filter = JSON.parse(filterParam);
			} catch (error) {
				/* Filter Param not valid JSON.*/
				res.json({
					status: 400,
					error: "Invalid JSON in 'filter=' query.  " + error,
					data: null,
				});
				return;
			}
			if (
				!(
					filter.parentseqs ||
					filter.childseqs ||
					filter.alignedannots ||
					filter.genepreds ||
					filter.repeats
				)
			) {
				res.json({
					status: 400,
					error: "No valid entries in 'filter=' parameter, " + req.query.filter,
					data: null,
				});
				return;
			}
		}
		const limit = parseInt(req.query.limit, 10) || 100;
		const offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var sort = null;
		if (req.query.sort) {
			var sortParamTest = /^(\S+)( (ASC|DESC))?$/i.exec(req.query.sort);
			if (sortParamTest) {
				if (
					[
						'featureType',
						'featureName',
						'seqLength',
						'seqGroupName',
						'seqSampleName',
						'seqTypeName',
						'alignStart',
						'alignEnd',
						'alignStrand',
						'featureSpecies',
						'featureSource',
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

		/* Submit series of async queries */
		const [qTotal, qAll] = await Promise.all([
			dbLink.dbCountQueryToJRes(
				alignmentsCountQuery({
					id: seqid,
					qStart: start,
					qEnd: end,
					filter: filter,
				}),
			),
			dbLink.dbQueryToJRes(
				alignmentsQuery({
					id: seqid,
					qStart: start,
					qEnd: end,
					filter: filter,
					limit: limit,
					offset: offset,
					sort: sort,
				}),
			),
		]);

		res.json({
			...qTotal,
			...qAll,
		});
	}),
);

module.exports = router;
