const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id, role }
            const userDoc = await User.findById(decoded.id).select('-password');
            if (!userDoc) return res.status(401).json({ message: 'Not authorized, user missing' });
            req.userDoc = userDoc;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Insufficient role' });
};

const requireApprovedNgo = (req, res, next) => {
    if (req.user?.role !== 'NGO') return res.status(403).json({ message: 'NGO role required' });
    if (!req.userDoc?.ngoApproved) return res.status(403).json({ message: 'NGO account pending approval' });
    next();
};

module.exports = { protect, requireRole, requireApprovedNgo };
