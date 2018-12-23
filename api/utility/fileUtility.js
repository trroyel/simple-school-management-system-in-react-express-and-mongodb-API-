const fs = require('fs');

exports.deleteFile = (filePath) => {
    fs.unlink(filePath, err => {
        if (err) {
            console.log(`${filePath} is not found! `);
            return;
        }
        console.log(`${filePath} is deleted!`);
    });
};