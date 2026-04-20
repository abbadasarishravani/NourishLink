const calculateRewardPoints = ({ quantity = 0 }) => {
    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0) return 0;
    if (qty <= 5) return 25;
    if (qty <= 15) return 50;
    if (qty <= 30) return 75;
    return 100;
};

const buildRewardMessage = (points) => `Wow! Congratulations! You earned ${points} points for your donation!`;

module.exports = {
    calculateRewardPoints,
    buildRewardMessage,
};
