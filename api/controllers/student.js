const _ = require('lodash');
const Fawn = require('fawn');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

const model = require('../utility/modelUtil');
const role = require('../utility/userRoleUtil');
const { deleteFile } = require('../utility/fileUtility');
const { User } = require('../models/user');
const { Student, validate } = require('../models/student');
const { AppSuccess, AppError } = require('../utility/responseUtil');

exports.getStudentById = async (req, res) => {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) throw new AppError('no student is found!', 404);

    res.send(new AppSuccess(student, 'student retrive successfully!', 200));
};

exports.getStudents = async (req, res) => {
    const students = await Student.find()
        .select('name fatherName address class mobile')
        .sort('_id');
    if (students.length === 0)
        throw new AppError('no student is found!', 404);

    res.send(new AppSuccess(students, 'students retrive successfully!'));
};


exports.createStudent = async (req, res) => {
    const image = (req.file) ? req.file.path : '';
    const { error } = validate({ ...req.body, image });

    if (error) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError(error.details[0].message, 400)
    };

    const { name, fatherName, motherName, address,
        className, roll, mobile, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        deleteFile(image);
        throw new AppError('student is already exists!', 409)
    };

    const salt = await bcrypt.genSalt(11);
    const _id = mongoose.Types.ObjectId();

    const newStudent = new Student({
        _id, name, fatherName, motherName, address,
        className, roll, mobile, password, image
    });
    newStudent.password = await bcrypt.hash(newStudent.password, salt);

    const user = new User({
        email,
        model: model.Student,
        role: role.STUDENT,
        detailsId: newStudent._id
    });

    new Fawn.Task()
        .save('students', newStudent)
        .save('users', user)
        .run();

    res.send(new AppSuccess({
        student: _.pick(newStudent, ['name', 'address', 'className', 'roll', 'mobile']),
        user: _.pick(user, ['email', 'role'])
    }, 'user is saved', 200));
};

exports.updateStudentById = async (req, res) => {

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

    const oldStudent = await Student.findById(req.params.id);
    if (!oldStudent) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError('no student is found!', 404)
    };

    const updatedData = _.pick(req.body,
        ['name', 'fatherName', 'motherName', 'address',
            'className', 'roll', 'mobile']);

    if (newPassword !== null) {
        let salt = await bcrypt.genSalt(11);
        newPassword = await bcrypt.hash(newPassword, salt);
        updatedData.password = newPassword;
    } else {
        updatedData.password = oldStudent.password
    }
    updatedData.image = image;

    const updtedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { ...updatedData },
        { new: true }
    );

    if (!updtedStudent) {
        if (req.file) deleteFile(req.file.path);
        throw new AppError('student is not updated!', 500);
    }

    if (oldStudent.image !== image) deleteFile(oldStudent.image);

    res.send(new AppSuccess(_.pick(updtedStudent, ['name', 'address', 'mobile']), 'student data is updated', 200));
};

exports.deleteStudentById = async (req, res) => {
    const { id } = req.params;

    let student = await Student.findById(id);
    if (!student) throw new AppError('no student is found to delete!', 404);

    let user = await User.findOne({ detailsId: id });
    if (user.role === role.SUPER_ADMIN || user.role === role.ADMIN) {
        throw new AppError('Acces denied!', 403);
    }
    if (student.image) deleteFile(student.image)

    user = await User.findByIdAndRemove(user._id);
    student = await Student.findByIdAndRemove(id);

    res.send(new AppSuccess(_.pick(student, ['name', 'address', 'mobile']), 'student is deleted successfully!'));
}