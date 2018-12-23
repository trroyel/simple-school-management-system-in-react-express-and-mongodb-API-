const { AppError } = require('../utility/responseUtil');

module.exports = (req, res) => res.status(404)
    .send(new AppError('page not found!', 404));