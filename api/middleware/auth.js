const jwt = require('jsonwebtoken');
const {AppError} = require('../utility/responseUtil');

module.exports = (req, res, next)=>{
    const token = req.header('Authorization');
    if(!token) throw new AppError('Access denied! No token provided!', 401);

    try {
        const decoded = jwt.verify(token, '12345');
        req.user = decoded;
        next();
    } catch (error) {
        throw new AppError('Invalid token', 400);
    }
};