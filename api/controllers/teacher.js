const _ = require('lodash');
const Fawn = require('fawn');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

const model = require('../utility/modelUtil');
const role = require('../utility/userRoleUtil');
const { deleteFile } = require('../utility/fileUtility');
const { User } = require('../models/user');
const { Teacher, validate } = require('../models/teacher');
const { AppSuccess, AppError } = require('../utility/responseUtil');

Fawn.init(mongoose);

exports.getTeacherById = async (req, res) => {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) throw new AppError('no teacher is found!', 404);

    res.send(new AppSuccess(teacher, 'teacher retrive successfully!', 200));
};

exports.getTeachers = async (req, res) => {
    const teachers = await Teacher
        .find()
        .select('name fatherName qualification mobile image')
        .sort('_id');
    if (teachers.length === 0)
        throw new AppError('no teacher is found!', 404);

    res.send(new AppSuccess(teachers, 'teachers retrive successfully!'));
};


exports.createTeacher = async (req, res) => {
    const image = (req.file) ? req.file.path : '';
    const { error } = validate({ ...req.body, image });

    if (error) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError(error.details[0].message, 400)
    };

    const { name, fatherName, motherName, address, qualification,
        nid, joined, salary, mobile, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        deleteFile(image);
        throw new AppError('teacher is already exists!', 409)
    };

    const salt = await bcrypt.genSalt(11);
    const _id = mongoose.Types.ObjectId();

    const newTeacher = new Teacher({
        _id, name, fatherName, motherName, address, qualification,
        nid, joined, salary, mobile, password, image
    });
    newTeacher.password = await bcrypt.hash(newTeacher.password, salt);

    const user = new User({
        email,
        model: model.Teacher,
        role: role.TEACHER,
        detailsId: newTeacher._id
    });

    new Fawn.Task()
        .save('teachers', newTeacher)
        .save('users', user)
        .run();

    res.send(new AppSuccess({
        teacher: newTeacher,
        user: _.pick(user, ['email', 'role'])
    }, 'user is saved', 200))
};

exports.updateTeacherById = async (req, res) => {

    const image = (req.file) ? req.file.path : req.body.image;
    let newPassword = (req.body.password) ? req.body.password : null;

    const { error } = validate({
        ...req.body,
        email: 'demo@gmailcom',
        password: 'demopass',
        image: image

    });

    if (error) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError(error.details[0].message, 400)
    };

    const isTeacherExist = await Teacher.findById(req.params.id);
    if (!isTeacherExist) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError('no teacher is found!', 404)
    };

    const updatedData = _.pick(req.body,
        ['name', 'fatherName', 'motherName', 'address',
            'qualification', 'nid', 'joined', 'salary', 'mobile']);

    if (newPassword !== null) {
        let salt = await bcrypt.genSalt(11);
        newPassword = await bcrypt.hash(newPassword, salt);
        updatedData.password = newPassword;
    } else {
        updatedData.password = isTeacherExist.password
    }
    updatedData.image = image;

    const updtedTeacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { ...updatedData },
        { new: true }
    );

    if (!updtedTeacher) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError('teacher is not updated!', 500);
    }

    if (isTeacherExist.image !== image) deleteFile(isTeacherExist.image);

    res.send(new AppSuccess(_.pick(updtedTeacher, ['name', 'address', 'mobile']), 'teacher data is updated', 200));
};

exports.deleteTeacherById = async (req, res) => {
    const { id } = req.params;
    const isTeacherExist = await Teacher.findById(id);

    if (!isTeacherExist) throw new AppError('no teacher is found to delete!', 404);
    if (isTeacherExist.image) deleteFile(isTeacherExist.image)

    let user = await User.findOne({ detailsId: id });
    user = await User.findByIdAndRemove(user._id);

    const teacher = await Teacher.findByIdAndRemove(id);

    res.send(new AppSuccess(_.pick(teacher, ['name', 'address', 'mobile']), 'teacher is deleted successfully!'));
}
