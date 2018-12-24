const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const model = require('../utility/modelUtil');

const { User } = require('../models/user');
const { Admin } = require('../models/admin');
const { Student } = require('../models/student');
const { Teacher } = require('../models/teacher');

const { AppSuccess, AppError } = require('../utility/responseUtil');

exports.userLogin = async (req, res) => {

    const { error } = validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new AppError('invalid email or password!', 400);

    let selectedModel;
    switch (user.model) {
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

    let userData = await selectedModel.findById(user.detailsId)
    if (!userData) throw new AppError('user details is not found!', 404);

    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) throw new AppError('invalid email or password!', 400);

    const token = user.generateAuthToken()
    const resObject = {
        token,
        user: {
            _id: user._id,
            name: userData.name,
            email: user.email,
            image: userData.image
        }
    };
    res.header('x-auth-token', token).send(new AppSuccess(resObject, 'log in successful!', 200));
};

const validate = (req) => {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(req, schema);
};
