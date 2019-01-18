var express = require("express");
var router = express.Router();
const SQL = require("sql-template-strings");
const asyncHandler = require("express-async-handler");

var dbLink = require("../util/db-link.js");

function searchQuery({
	searchTerm = null,
	searchType = null,
	limit = 100,
	offset = 0,
	sort = null
} = {}) {
	if (searchTerm) {
		const query = SQL``;
		if (!searchType || searchType === "all" || searchType === "seqs") {
			query.append(SQL`
SELECT
  'sequence' AS resultType,
  seq.id AS seqId,
  seq.name AS seqName,
  seq.length AS seqLength,
  seq.belongsGroup AS seqGroupId,
  grp.name AS seqGroupName,
  seq.isSample AS seqSampleId,
  samp.name AS seqSampleName,
  seq.isType AS seqTypeId,
  stype.type AS seqTypeName,
  seq.extLink AS seqExtLink,
  seq.extLinkLabel AS seqExtLinkLabel,
  seq.annotNote AS annotation,
  NULL AS alignId,
  NULL AS alignName,
  NULL AS alignStart,
  NULL AS alignEnd,
  NULL AS alignStrand,
  NULL AS alignSpecies,
  NULL AS alignSource,
  NULL AS alignMethod,
  NULL AS alignScore
FROM sequence AS seq
JOIN seqgroup AS grp
  ON grp.id=seq.belongsGroup
JOIN sample AS samp
  ON samp.id=seq.isSample
JOIN seqtype AS stype
  ON stype.id=seq.isType
`);
			if (!searchType || searchType === "all") {
				query.append(
					SQL`WHERE ( seq.name LIKE ${searchTerm} OR seq.annotNote LIKE ${searchTerm} )`
				);
			} else if (searchType === "seqs") {
				query.append(SQL`WHERE seq.name LIKE ${searchTerm}`);
			} else if (searchType === "annots") {
				query.append(SQL`WHERE seq.annotNote LIKE ${searchTerm}`);
			}
		}

		if (!searchType || searchType === "all") {
			query.append(SQL`
UNION ALL
`);
		}

		if (!searchType || searchType === "all" || searchType === "annots") {
			query.append(SQL`
SELECT
  'alignedannot' AS resultType,
  seq.id AS seqId,
  seq.name AS seqName,
  seq.length AS seqLength,
  seq.belongsGroup AS seqGroupId,
  grp.name AS seqGroupName,
  seq.isSample AS seqSampleId,
  samp.name AS seqSampleName,
  seq.isType AS seqTypeId,
  stype.type AS seqTypeName,
  seq.extLink AS seqExtLink,
  seq.extLinkLabel AS seqExtLinkLabel,
  aln.annotation AS annotation,
  aln.id AS alignId,
  aln.name AS alignName,
  aln.start AS alignStart,
  aln.end AS alignEnd,
  aln.strand AS alignStrand,
  aln.species AS alignSpecies,
  aln.source AS alignSource,
  aln.method AS alignMethod,
  aln.score AS alignScore
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
		query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`);

		return query;
	} else {
		return null;
	}
}

function searchCountQuery({ searchTerm = null, searchType = null } = {}) {
	if (searchTerm) {
		const countQuery = SQL`
SELECT sum(counts) AS total
FROM (
`;
		if (!searchType || searchType === "all" || searchType === "seqs") {
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM sequence AS seq
`);
			if (!searchType || searchType === "all") {
				countQuery.append(
					SQL` WHERE ( seq.name LIKE ${searchTerm} OR seq.annotNote LIKE ${searchTerm} )`
				);
			} else if (searchType === "seqs") {
				countQuery.append(SQL` WHERE seq.name LIKE ${searchTerm}`);
			} else if (searchType === "annots") {
				countQuery.append(SQL` WHERE seq.annotNote LIKE ${searchTerm}`);
			}
		}
		if (!searchType || searchType === "all") {
			countQuery.append(SQL`
UNION ALL
`);
		}
		if (!searchType || searchType === "all" || searchType === "annots") {
			countQuery.append(SQL`
  SELECT count(id) AS counts 
  FROM alignedannot AS aln
  WHERE aln.name LIKE ${searchTerm} 
  OR aln.annotation LIKE ${searchTerm}
`);
		}
		countQuery.append(SQL`
) sum`);
		return countQuery;
	} else {
		return null;
	}
}

/* GET keyword/phrase search */
router.get(
	"/:searchterm",
	asyncHandler(async (req, res, next) => {
		var searchTerm = "%" + req.params.searchterm.replace(/\*/g, "%") + "%";
		var limit = parseInt(req.query.limit, 10) || 100;
		var offset =
			parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
		var searchType = null;
		if (req.query.searchtype) {
			if (["seqs", "annots", "all"].includes(req.query.searchtype)) {
				searchType = req.query.searchtype;
			}
		}
		var sort = null;
		if (req.query.sort) {
			var sortParamTest = /^(\S+)( (ASC|DESC))?$/i.exec(req.query.sort);
			if (sortParamTest) {
				if (
					[
						"resultType",
						"seqName",
						"seqLength",
						"seqGroupName",
						"seqSampleName",
						"seqTypeName",
						"alignName",
						"alignSpecies",
						"alignSource",
						"alignMethod"
					].includes(sortParamTest[1])
				) {
					sort = req.query.sort;
				}
			}
		}

		/* Submit series of async queries */
		const [qTotal, qAll] = await Promise.all([
			dbLink.dbCountQueryToJRes(
				searchCountQuery({
					searchTerm: searchTerm,
					searchType: searchType
				})
			),
			dbLink.dbQueryToJRes(
				searchQuery({
					searchTerm: searchTerm,
					searchType: searchType,
					limit: limit,
					offset: offset,
					sort: sort
				})
			)
		]);

		res.json({
			...qTotal,
			...qAll
		});
	})
);

module.exports = router;
