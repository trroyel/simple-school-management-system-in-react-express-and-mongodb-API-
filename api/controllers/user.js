const _ = require('lodash');
const Fawn = require('fawn');

const userRole = require('../utility/userRoleUtil');
const model = require('../utility/modelUtil');
const { Student } = require('../models/student');
const { Teacher } = require('../models/teacher');
const { Admin } = require('../models/admin');
const { deleteFile } = require('../utility/fileUtility');
const { User } = require('../models/user');
const { AppSuccess, AppError } = require('../utility/responseUtil');


exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('no user is found!', 404);

    res.send(new AppSuccess(user, 'user retrive successfully!', 200));
};

exports.getUsers = async (req, res) => {
    const users = await User.find().sort('_id');
    if (users.length === 0)
        throw new AppError('no user is found!', 404);

    res.send(new AppSuccess(users, 'users retrive successfully!'));
};

exports.updateUserRole = async (req, res) => {
    if (!((role !== undefined &&
        role !== userRole.SUPER_ADMIN) && (
            role === userRole.ADMIN ||
            role === userRole.TEACHER ||
            role === userRole.STUDENT))) {
        throw new AppError('invalid user role! ', 400);
    }

    let user = await User.findById(req.params.id);
    if (!user) throw new AppError('no user is found!', 404);

    user.role = role;
    console.log(user);

    user = await user.save();
    if (!user) throw new AppError('user is faied to change!', 404);

    res.send(new AppSuccess(user, `user ${user.email} role changed to ${role}`, 202));
};

exports.deleteUserById = async (req, res) => {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) throw new AppError('no user is found to delete!', 404);
    console.log(existingUser.model);

    let selectedModel;

    switch (existingUser.model) {
        case model.Student:
            selectedModel = Student//await Student.findById(existingUser.detailsId);
            break;
        case model.Teacher:
            selectedModel = Teacher//await Teacher.findById(existingUser.detailsId);
            break;
        case model.Admin:
            selectedModel = Admin//await Admin.findById(existingUser.detailsId);
            break;
        default:
            break;
    };

    let userData = await selectedModel.findById(existingUser.detailsId)
    if (!userData) throw new AppError('user details is not found!', 404);

    userData = await selectedModel.findByIdAndRemove(existingUser.detailsId);
    if (userData) deleteFile(userData.image);

    const deletedUser = await User.findByIdAndRemove(req.params.id);
    if (!deletedUser) throw new AppError(`user is not deleted!`);

    res.send(new AppSuccess(deletedUser, `user ${deletedUser.email} is deleted}`), 200);
};




