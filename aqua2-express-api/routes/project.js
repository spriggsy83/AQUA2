var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings');
const asyncHandler = require('express-async-handler');

var dbLink = require('../util/db-link.js');

function projectQuery() {
	const query = SQL`
SELECT
  shortTitle,
  longTitle,
  description,
  contacts
FROM project
LIMIT 1
`;
	return query;
}

/* GET project listing. */
router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		const qAll = await dbLink.dbQueryToJRes(projectQuery());
		res.json({ total: 1, ...qAll });
	}),
);

module.exports = router;
