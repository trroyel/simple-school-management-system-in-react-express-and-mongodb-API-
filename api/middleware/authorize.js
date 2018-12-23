module.exports = function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            // user's role is not authorized
            return res.status(403).json({
                result: 'error',
                message: 'Request forbidden!',
                status: 403
            });
        }

        // authentication and authorization successful
        next();
    };
};

//module.exports = authorize;