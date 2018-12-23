module.exports = route => {
    return async (req, res, next) => {
        try {
            await route(req, res)
        } catch (err) {
            next(err)
        }
    };
};