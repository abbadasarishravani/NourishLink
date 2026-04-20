const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { serializeUser } = require('../utils/userSerializer');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone, organizationName, address } = req.body;

    try {
        console.log('Registration attempt:', { name, email, role });
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const normalizedEmail = email.toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            phone,
            organizationName,
            address,
            ngoApproved: true,
        });

        if (user) {
            res.status(201).json({
                ...serializeUser(user),
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt:', { email: email.toLowerCase() });
        
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('User found:', !!user);

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('Login successful for:', user.email);
            res.json({
                ...serializeUser(user),
                token: generateToken(user._id, user.role),
            });
        } else {
            console.log('Login failed: Invalid credentials');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Login failed' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(serializeUser(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/update
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, phone, profilePic } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (profilePic) user.profilePic = profilePic;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            profilePic: updatedUser.profilePic,
            profileImage: updatedUser.profilePic,
            role: updatedUser.role,
            points: updatedUser.totalPoints || updatedUser.points,
            totalPoints: updatedUser.totalPoints || updatedUser.points,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
