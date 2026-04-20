const POINTS_PER_RUPEE = 10;

const generateVoucherCode = (provider) => {
    const prefix = provider.toUpperCase().slice(0, 4);
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${Date.now().toString().slice(-6)}-${random}`;
};

const pointsToDiscount = (points) => Math.floor(points / POINTS_PER_RUPEE);

module.exports = {
    POINTS_PER_RUPEE,
    generateVoucherCode,
    pointsToDiscount,
};
