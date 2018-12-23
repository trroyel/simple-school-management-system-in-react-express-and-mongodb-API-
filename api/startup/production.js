const helemet = require('helmet');
const compression = require('compression');

module.exports = app => {
    app.use(helemet());
    app.use(compression());
};