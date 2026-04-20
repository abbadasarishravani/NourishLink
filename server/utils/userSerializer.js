const badgeForPoints = (points = 0) => {
    if (points >= 100) return 'Gold';
    if (points >= 51) return 'Silver';
    return 'Bronze';
};

const serializeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || '',
    organizationName: user.organizationName || '',
    profilePic: user.profilePic || '',
    profileImage: user.profilePic || '',
    points: user.totalPoints || user.points || 0,
    totalPoints: user.totalPoints || user.points || 0,
    redeemedPoints: user.redeemedPoints || 0,
    availablePoints: Math.max(0, (user.totalPoints || user.points || 0) - (user.redeemedPoints || 0)),
    badges: user.badges || [],
    vouchers: user.vouchers || [],
    currentBadge: badgeForPoints(user.totalPoints || user.points || 0),
    ngoApproved: Boolean(user.ngoApproved),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

module.exports = { serializeUser, badgeForPoints };
