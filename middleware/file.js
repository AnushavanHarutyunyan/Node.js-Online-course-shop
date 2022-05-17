const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images');
    },
    filename(req, file, cb) {
        const name = new Date().toISOString().replaceAll(':', '-');

        cb(null, `${name}${file.originalname}`);
    },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage,
    fileFilter,
});
