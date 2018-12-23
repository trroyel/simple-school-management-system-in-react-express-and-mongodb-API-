const mongoose = require('mongoose');
const dbURL = require('../config/dbConfig').dbURL;

module.exports = function () {
    mongoose.connect(dbURL,
        {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(() => console.log(`connected to ${dbURL}..`))
        .catch(err => console.log(`error occured: ${err.message}`));
};
