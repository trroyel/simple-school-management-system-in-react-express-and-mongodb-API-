const multer = require('multer');
const express = require('express');
const role = require('../utility/userRoleUtil');
const adminController = require('../controllers/admin');
const { multerConfig } = require('../utility/multerConfig');
const asyncErrorHandler = require('../middleware/asyncErrorHandler');
const validateObjectId = require('../middleware/validateObjectId');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();
const upload = multerConfig(multer);

router.get('/',
    auth,
    authorize([role.SUPER_ADMIN]),
    asyncErrorHandler(adminController.getAdmins));

router.get('/:id',
    auth,
    authorize([role.ADMIN, role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(adminController.getAdminById));

router.post('/',
    // auth,
    // authorize([role.SUPER_ADMIN]),
    upload.single('image'),
    asyncErrorHandler(adminController.createAdmin));

router.put('/:id',
    auth,
    authorize([role.SUPER_ADMIN, role.ADMIN]),
    upload.single('image'),
    validateObjectId,
    asyncErrorHandler(adminController.updateAdminById));

router.delete('/:id',
    auth,
    authorize([role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(adminController.deleteAdminById));

module.exports = router;