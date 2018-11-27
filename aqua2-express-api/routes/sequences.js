var express = require("express");
var router = express.Router();
const SQL = require('sql-template-strings')

function sampleQuery({id, limit=50, offset=0, sort=null} = {}) {
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
`
	if(id){
		query.append(SQL` WHERE seq.id = ${id}`)
	}
	if(sort){
		query.append(SQL` ORDER BY `).append(sort)
	}
	query.append(SQL` LIMIT ${limit} OFFSET ${offset || 0}`)
	return query;
}

/* GET 1 sequence listing. */
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


/* GET sequences listing. */
router.get("/", function(req, res, next) {

	var limit = parseInt(req.query.limit, 10) || 50;
	var offset = parseInt(req.query.offset, 10) || parseInt(req.query.skip, 10) || 0;
	var sort = null;
	if(req.query.sort){
		if( /^(name|length|groupName|sampleName|typeName)( (ASC|DESC))?$/i.test(req.query.sort) ){
			sort = req.query.sort;
		}
	}

	dbpool.query('SELECT count(*) AS total FROM sequence', function(error, results, fields) {
		if (error) {
			res.json({ status: 500, error: error, data: null, total: null });

		}else if(results && results.length){
			var total = results[0].total;

			dbpool.query(sampleQuery( { limit: limit, offset: offset, sort: sort }
				), function(error, results, fields) {
				if (error) {
					res.json({ status: 500, error: error, data: null, total: total });

				} else if(results && results.length){
					res.json({ status: 200, error: null, data: results, total: total });
				}else{
					res.json({ status: 404, error: null, data: 'Not found', total: total });
				}
			});
		}else{
			res.json({ status: 404, error: null, data: 'Not found', total: 0 });
		}
	});
});

module.exports = router;
