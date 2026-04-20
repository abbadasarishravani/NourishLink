const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { serializeUser } = require('../utils/userSerializer');

const uploadsDir = path.join(__dirname, '..', 'uploads', 'profiles');

const ensureUploadsDir = () => {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
};

const uploadToCloudinary = async (fileDataUri) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return null;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_FOLDER || 'feed-the-needy/profile-images';
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    const formData = new FormData();
    formData.append('file', fileDataUri);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const payload = await response.json();
    if (!response.ok) {
        throw new Error(payload?.error?.message || 'Image upload failed');
    }

    return payload.secure_url;
};

const saveLocally = async (file) => {
    ensureUploadsDir();

    const extension = path.extname(file.originalname || '') || '.jpg';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const targetPath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(targetPath, file.buffer);

    return `/uploads/profiles/${fileName}`;
};

const uploadProfileImage = async (req, res) => {
    try {
        const file = req.file
            || req.files?.profilePic?.[0]
            || req.files?.profileImage?.[0];

        if (!file) {
            return res.status(400).json({ message: 'Please upload an image file' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const mimeType = file.mimetype || 'image/jpeg';
        const dataUri = `data:${mimeType};base64,${file.buffer.toString('base64')}`;
        
        let imageUrl;
        try {
            imageUrl = await uploadToCloudinary(dataUri);
        } catch (cloudinaryError) {
            console.warn('Cloudinary upload failed, saving locally:', cloudinaryError.message);
            imageUrl = await saveLocally(file);
        }

        user.profilePic = imageUrl;
        await user.save();

        res.json({
            message: 'Profile image uploaded successfully',
            imageUrl,
            profilePic: imageUrl,
            user: serializeUser(user),
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message || 'Could not upload image' });
    }
};

module.exports = { uploadProfileImage };
