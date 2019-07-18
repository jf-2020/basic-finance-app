const express = require('express');
const router = express.Router();

const profileController = require('../controllers/Profile');

/* GET company financial profile */
router.get('/:ticker', profileController.getCompanyFinancialProfile);

module.exports = router;
