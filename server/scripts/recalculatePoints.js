const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donation = require('../models/Donation');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Calculate points based on quantity
const calculatePoints = (quantity) => {
  if (quantity >= 1 && quantity <= 5) return 25;
  if (quantity >= 6 && quantity <= 15) return 50;
  if (quantity >= 16 && quantity <= 30) return 75;
  if (quantity > 30) return 100;
  return 0;
};

const recalculatePoints = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feed-the-needy');
    console.log('Connected to MongoDB');

    // Get all accepted donations
    const acceptedDonations = await Donation.find({ 
      status: 'Accepted' 
    }).populate('donor', '_id totalPoints points');

    console.log(`Found ${acceptedDonations.length} accepted donations`);

    // Reset all users' points to 0 first
    const users = await User.find({ role: 'Donor' });
    console.log(`Resetting points for ${users.length} donors`);
    
    for (const user of users) {
      user.totalPoints = 0;
      user.points = 0;
      await user.save();
    }

    // Recalculate points for each accepted donation
    let totalPointsAwarded = 0;
    const userPointsMap = new Map();

    for (const donation of acceptedDonations) {
      const pointsEarned = calculatePoints(donation.quantity);
      
      // Update donation record
      donation.rewardPoints = pointsEarned;
      donation.rewardMessage = `You earned ${pointsEarned} points!`;
      donation._pointsAwarded = true;
      await donation.save();

      // Track points per user
      const userId = donation.donor._id.toString();
      const currentPoints = userPointsMap.get(userId) || 0;
      userPointsMap.set(userId, currentPoints + pointsEarned);
      
      totalPointsAwarded += pointsEarned;
      
      console.log(`Donation ${donation._id}: ${donation.quantity} servings = ${pointsEarned} points`);
    }

    // Update users with recalculated points
    console.log('\nUpdating user points...');
    for (const [userId, points] of userPointsMap) {
      const user = await User.findById(userId);
      if (user) {
        user.totalPoints = points;
        user.points = points;
        await user.save();
        console.log(`User ${user.name}: ${points} total points`);
      }
    }

    console.log(`\nRecalculation complete!`);
    console.log(`Total points awarded: ${totalPointsAwarded}`);
    console.log(`Users updated: ${userPointsMap.size}`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error during recalculation:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  recalculatePoints();
}

module.exports = { recalculatePoints, calculatePoints };
