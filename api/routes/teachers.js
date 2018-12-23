const multer = require('multer');
const express = require('express');
const role = require('../utility/userRoleUtil');
const { multerConfig } = require('../utility/multerConfig');
const teacherController = require('../controllers/teacher');
const validateObjectId = require('../middleware/validateObjectId');
const asyncErrorHandler = require('../middleware/asyncErrorHandler');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();
const upload = multerConfig(multer);

router.get('/',
    auth,
    authorize([role.ADMIN, role.SUPER_ADMIN]),
    asyncErrorHandler(teacherController.getTeachers));

router.get('/:id',
    auth,
    authorize([role.ADMIN, role.SUPER_ADMIN, role.TEACHER]),
    validateObjectId,
    asyncErrorHandler(teacherController.getTeacherById));

router.post('/',
    auth,
    authorize([role.ADMIN, role.SUPER_ADMIN]),
    upload.single('image'),
    asyncErrorHandler(teacherController.createTeacher));

router.put('/:id',
    auth,
    authorize([role.ADMIN, role.SUPER_ADMIN, role.TEACHER]),
    upload.single('image'),
    validateObjectId,
    asyncErrorHandler(teacherController.updateTeacherById));

router.delete('/:id',
    auth,
    authorize([role.ADMIN, role.SUPER_ADMIN]),
    validateObjectId,
    asyncErrorHandler(teacherController.deleteTeacherById));

module.exports = router;