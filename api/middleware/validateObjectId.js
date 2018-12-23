const mongoose = require('mongoose');
const { AppError } = require('../utility/responseUtil');

module.exports = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new AppError('invalid object id!', 400);
    }
    next();
};