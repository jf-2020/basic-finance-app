const express = require('express');
const router = express.Router();

const searchController = require('../controllers/Search');

/* GET search page */
router.get('/', searchController.searchForCompany_get);

/* POST search page */
router.post('/', searchController.searchForCompany_post);

module.exports = router;