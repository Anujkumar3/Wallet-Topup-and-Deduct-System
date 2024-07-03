const express = require('express');
const router = express.Router();
const httpController = require('../controllers/httpController');

router.use('/', httpController);

module.exports = router;
