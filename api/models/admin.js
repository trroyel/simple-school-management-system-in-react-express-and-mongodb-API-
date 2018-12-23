const mongoose = require('mongoose');
const Joi = require('joi');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 5,
        required: [true, 'name is required!']
    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 150,
        required: [true, 'address is required!']
    },
    designation: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: [true, 'designation is required!']
    },
    mobile: {
        type: String,
        minlength: 11,
        maxlength: 14,
        required: [true, 'mobile is required!']
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: [true, 'password is required!']
    },
    image: {
        type: String,
        required: [true, "image is required."]
    }
});

const validate = (admin) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        address: Joi.string().min(5).max(150).required(),
        designation: Joi.string().min(3).max(50).required(),
        mobile: Joi.string().min(11).max(14).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        image: Joi.string().empty('').required()
    }
    return (Joi.validate(admin, schema));
};

exports.validate = validate;
exports.Admin = mongoose.model('Admin', adminSchema);
