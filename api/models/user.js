const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: [true, 'email is required!'],
    },
    model: {
        type: String,
        minlength: 4,
        maxlength: 10,
        required: [true, 'model is required!']
    },
    role: {
        type: String,
        minlength: 4,
        maxlength: 10,
        required: [true, 'role is required!']
    },
    detailsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'detailsId is required!']
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        role: this.role,
        detailsId: this.detailsId
    }, '12345', { expiresIn: '1h' });
    return token;
};

const validate = (user) => {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        model: Joi.string().min(4).max(10).required(),
        role: Joi.string().min(4).max(10).required(),
        detailsId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }
    return (Joi.validate(user, schema));
};

exports.validateUser = validate;
exports.User = mongoose.model('User', userSchema);


