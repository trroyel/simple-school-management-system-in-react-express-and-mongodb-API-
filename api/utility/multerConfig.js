const path = require('path');
const { AppError } = require('./responseUtil');

exports.multerConfig = (multer) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            //cb(null, path.join(__dirname, '/uploads/'));
            console.log('==>>inside destination');
            cb(null, './uploads/');
        },
        filename: (req, file, cb) => {
            console.log('==>>inside fileName');
            cb(null, getNewName(file.mimetype));
        }
    });

    const fileFilter = (req, file, cb) => {
        (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/gif')
            ? cb(null, true)
            : cb(new AppError('Unsupported file. Only jpp, png and gif files is allowed!', 415), false)
    };

    return multer({
        storage: storage,
        limits: { fileSize: 3048576 },
        fileFilter: fileFilter
    });
};

const getExtension = (mimetype) => {
    switch (mimetype) {
        case 'image/png': return '.png'
        case 'image/jpeg':
        case 'image/jpg': return '.jpg'
        case 'image/gif': return '.gif'
        default: return
    };
};

const getNewName = (mimetype) => {
    return (
        'img-' +
        new Date().toISOString() +
        '-' +
        Math.floor(1000 + Math.random() * 9000) +
        getExtension(mimetype)
    );
};