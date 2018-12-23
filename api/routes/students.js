const multer = require('multer');
const express = require('express');
const role = require('../utility/userRoleUtil');
const { multerConfig } = require('../utility/multerConfig');
const studentController = require('../controllers/student');
const asyncErrorHandler = require('../middleware/asyncErrorHandler');
const validateObjectId = require('../middleware/validateObjectId');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();
const upload = multerConfig(multer);

router.get('/',
    auth,
    authorize([role.ADMIN, role.TEACHER, role.SUPER_ADMIN]),
    asyncErrorHandler(studentController.getStudents));

router.get('/:id',
    auth,
    authorize([role.ADMIN, role.TEACHER, role.SUPER_ADMIN, role.STUDENT]),
    validateObjectId,
    asyncErrorHandler(studentController.getStudentById));

router.post('/',
    auth,
    authorize([role.ADMIN, role.TEACHER, role.SUPER_ADMIN]),
    upload.single('image'),
    asyncErrorHandler(studentController.createStudent));

router.put('/:id',
    auth,
    authorize([role.ADMIN, role.TEACHER, role.SUPER_ADMIN, role.STUDENT]),
    upload.single('image'),
    validateObjectId,
    asyncErrorHandler(studentController.updateStudentById));

router.delete('/:id',
    auth,
    authorize([role.ADMIN, role.TEACHER, role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(studentController.deleteStudentById));

module.exports = router;