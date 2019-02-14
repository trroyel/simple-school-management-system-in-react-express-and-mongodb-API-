const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = app => {
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    
    app.use('/api/login/', require('../routes/login'));
    app.use('/api/users/', require('../routes/users'));
    app.use('/api/admins/', require('../routes/admins'));
    app.use('/api/students/', require('../routes/students'));
    app.use('/api/teachers/', require('../routes/teachers'));

    app.use('/uploads/', express.static('uploads'));
    app.use('/invoice/', express.static(path.join('data', 'pdfdoc')));

    app.use('/*', require('../routes/404'));
    app.use(require('../middleware/errorHandler'));
};