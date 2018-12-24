const express = require('express');
const role = require('../utility/userRoleUtil');
const userController = require('../controllers/user');
const asyncErrorHandler = require('../middleware/asyncErrorHandler');
const validateObjectId = require('../middleware/validateObjectId');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/',
    auth,
    authorize([role.SUPER_ADMIN]),
    asyncErrorHandler(userController.getUsers));

router.get('/me',
    auth,
    asyncErrorHandler(userController.currentUser));

router.get('/:id',
    auth,
    authorize([role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(userController.getUserById));

router.put('/:id',
    auth,
    authorize([role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(userController.updateUserRole));

router.delete('/:id',
    auth,
    authorize([role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(userController.deleteUserById));

module.exports = router;
