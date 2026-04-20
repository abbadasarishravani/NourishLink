const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    foodType: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        enum: ['kg', 'liters', 'servings', 'boxes'],
        default: 'servings',
    },
    condition: {
        type: String,
        enum: ['Fresh', 'Good', 'Cooked', 'Packed', 'Needs Attention'],
        default: 'Good',
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        lat: { type: Number },
        lng: { type: Number },
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'In Progress', 'Delivered', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    assignedNgo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    _pointsAwarded: {
        type: Boolean,
        default: false,
        select: false,
    },
    pickupTime: {
        type: Date,
    },
    rewardPoints: {
        type: Number,
        default: 0,
    },
    rewardMessage: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
