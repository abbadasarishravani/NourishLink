const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Donor', 'NGO', 'Admin'],
        required: true,
    },
    phone: {
        type: String,
    },
    profilePic: {
        type: String,
        default: '',
    },
    organizationName: {
        type: String, // mostly for NGOs
    },
    address: {
        type: String,
    },
    ngoApproved: {
        type: Boolean,
        default: false,
    },
    points: {
        type: Number,
        default: 0,
    },
    totalPoints: {
        type: Number,
        default: 0,
    },
    redeemedPoints: {
        type: Number,
        default: 0,
    },
    badges: {
        type: [String],
        default: [],
    },
    vouchers: {
        type: [
            {
                code: { type: String, required: true },
                provider: {
                    type: String,
                    enum: ['Meesho', 'Flipkart'],
                    required: true,
                },
                pointsUsed: { type: Number, required: true },
                discountValue: { type: Number, required: true },
                status: {
                    type: String,
                    enum: ['active', 'redeemed'],
                    default: 'active',
                },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    },
}, { timestamps: true });

userSchema.index({ role: 1, totalPoints: -1, createdAt: 1 });

module.exports = mongoose.model('User', userSchema);
