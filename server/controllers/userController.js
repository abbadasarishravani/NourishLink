const User = require('../models/User');
const { serializeUser, badgeForPoints } = require('../utils/userSerializer');
const { POINTS_PER_RUPEE, generateVoucherCode, pointsToDiscount } = require('../utils/voucherUtils');

// Get current user
const getMe = async (req, res) => {
  try {
    res.json(serializeUser(req.userDoc));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const top = await User.find({ role: 'Donor' })
      .select('name totalPoints points badges profilePic')
      .sort({ totalPoints: -1, createdAt: 1 })
      .limit(20);

    res.json(
      top.map((user) => ({
        _id: user._id,
        name: user.name,
        profilePic: user.profilePic || '',
        profileImage: user.profilePic || '',
        points: user.totalPoints || user.points || 0,
        totalPoints: user.totalPoints || user.points || 0,
        badges: user.badges || [],
        currentBadge: badgeForPoints(user.totalPoints || user.points || 0),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.userDoc._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }

    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = normalizedEmail;
    }

    if (typeof phone === 'string') {
      user.phone = phone.trim();
    }

    const updatedUser = await user.save();

    res.json(serializeUser(updatedUser));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const redeemPoints = async (req, res) => {
  try {
    const { provider, points } = req.body;
    const pointsToRedeem = Number(points);
    const normalizedProvider = String(provider || '').trim();

    if (!['Meesho', 'Flipkart'].includes(normalizedProvider)) {
      return res.status(400).json({ message: 'Please choose a valid provider' });
    }

    if (!Number.isFinite(pointsToRedeem) || pointsToRedeem < POINTS_PER_RUPEE * 10) {
      return res.status(400).json({ message: `Minimum redemption is ${POINTS_PER_RUPEE * 10} points` });
    }

    const user = await User.findById(req.userDoc._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalPoints = user.totalPoints || user.points || 0;
    const redeemedPoints = user.redeemedPoints || 0;
    const availablePoints = totalPoints - redeemedPoints;

    if (pointsToRedeem > availablePoints) {
      return res.status(400).json({ message: 'Not enough points available for redemption' });
    }

    const discountValue = pointsToDiscount(pointsToRedeem);
    if (discountValue <= 0) {
      return res.status(400).json({ message: 'Points do not convert to a valid voucher value' });
    }

    const voucher = {
      code: generateVoucherCode(normalizedProvider),
      provider: normalizedProvider,
      pointsUsed: pointsToRedeem,
      discountValue,
      status: 'active',
    };

    user.redeemedPoints = redeemedPoints + pointsToRedeem;
    user.vouchers.push(voucher);
    await user.save();

    res.json({
      message: `Voucher created successfully for ${normalizedProvider}`,
      voucher,
      conversion: {
        pointsUsed: pointsToRedeem,
        discountValue,
        rate: `100 points = Rs.10 discount`,
      },
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMe,
  getLeaderboard,
  updateUserProfile,
  redeemPoints,
};
