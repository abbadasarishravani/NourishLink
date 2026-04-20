const express = require('express');
const router = express.Router();
const multer = require('multer');

const { protect } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG and PNG images are allowed'));
        }
        cb(null, true);
    },
});

const uploadProfilePicMiddleware = (req, res, next) => {
    const middleware = upload.fields([
        { name: 'profilePic', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 },
    ]);

    middleware(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: error.message || 'Image upload failed' });
        }
        next();
    });
};

router.post('/profile-image', protect, uploadProfilePicMiddleware, uploadProfileImage);
router.post('/profile-pic', protect, uploadProfilePicMiddleware, uploadProfileImage);

module.exports = router;
