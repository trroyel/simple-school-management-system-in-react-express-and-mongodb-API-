const express = require('express');
const router = express.Router();

const asyncErrorHandler = require('../middleware/asyncErrorHandler');

const loginController = require('../controllers/login');

router.post('/', asyncErrorHandler(loginController.userLogin));

module.exports = router;