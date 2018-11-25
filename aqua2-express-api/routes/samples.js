var express = require("express");
var router = express.Router();
const SQL = require('sql-template-strings')

function sampleQuery({id, limit=50, offset=0} = {}) {
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
`
	if(id){
		query.append(SQL` WHERE id = ${id}`)
	}
	query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`)
	return query;
}

/* GET 1 sample listing. */
router.get('/:id([0-9]{1,})', function(req, res){
	dbpool.query(sampleQuery({id: req.params.id}), function(error, results, fields) {
		if (error) {
			res.json({ status: 500, error: error, data: null });
		} else {
			if(results && results.length){
				res.json({ status: 200, error: null, data: results[0] });
			}else{
				res.json({ status: 404, error: null, data: 'Not found' });
			}
		}
	});
});


/* GET samples listing. */
router.get("/", function(req, res, next) {

	var limit = parseInt(req.query.limit, 10) || 50;
	var offset = parseInt(req.query.skip, 10) || 0;

    dbpool.query(sampleQuery( { limit: limit, offset: offset }
		), function(error, results, fields) {
		if (error) {
			res.json({ status: 500, error: error, data: null });
		} else {
			if(results && results.length){
				res.json({ status: 200, error: null, data: results });
			}else{
				res.json({ status: 404, error: null, data: 'Not found' });
			}
		}
	});
});

module.exports = router;
