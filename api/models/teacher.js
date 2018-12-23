const Joi = require('joi');
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'name is required!'],
    },
    fatherName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'father name is required!'],
    },
    motherName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'mother name is required!'],
    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 500,
        required: [true, 'address is required!'],
    },
    qualification: {
        type: String,
        minlength: 5,
        maxlength: 500,
        required: [true, 'qualification is required!'],
    },
    nid: {
        type: String,
        min: 17,
        max: 17,
        required: [true, 'nid is required']
    },
    joined: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        required: [true, 'salary is required']
    },
    mobile: {
        type: String,
        minlength: 11,
        maxlength: 14,
        required: [true, "mobile no. is required!"]
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: [true, "password is required!"]
    },
    image: {
        type: String,
        required: [true, "image is required."]
    }
});

const validate = (teacher) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        fatherName: Joi.string().min(3).max(50).required(),
        motherName: Joi.string().min(3).max(50).required(),
        address: Joi.string().min(5).max(500).required(),
        qualification: Joi.string().min(5).max(500).required(),
        nid: Joi.string().min(17).max(17).required(),
        joined: Joi.date(),
        salary: Joi.number().required(),
        mobile: Joi.string().min(11).max(14).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        image: Joi.string().empty('').required()
    }
    return (Joi.validate(teacher, schema));
};

exports.validate = validate;
exports.Teacher = mongoose.model('Teacher', teacherSchema);


