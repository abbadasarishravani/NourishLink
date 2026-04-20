const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donation = require('../models/Donation');

// Load environment variables
dotenv.config();

const debugNgoAcceptance = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check existing donations
    const pendingDonations = await Donation.find({ status: 'Pending' }).populate('donor', 'name email');
    console.log(`Found ${pendingDonations.length} pending donations:`);
    
    pendingDonations.forEach((donation, index) => {
      console.log(`${index + 1}. ID: ${donation._id}, Food: ${donation.foodType}, Quantity: ${donation.quantity}, Donor: ${donation.donor?.name}`);
    });

    // Check NGOs
    const ngos = await User.find({ role: 'NGO' });
    console.log(`\nFound ${ngos.length} NGOs:`);
    
    ngos.forEach((ngo, index) => {
      console.log(`${index + 1}. ID: ${ngo._id}, Name: ${ngo.name}, Email: ${ngo.email}, Approved: ${ngo.ngoApproved}`);
    });

    // Test acceptance logic
    if (pendingDonations.length > 0 && ngos.length > 0) {
      const testDonation = pendingDonations[0];
      const testNgo = ngos[0];
      
      console.log(`\n=== Testing NGO Acceptance ===`);
      console.log(`NGO: ${testNgo.name} (${testNgo._id})`);
      console.log(`Donation: ${testDonation.foodType} (${testDonation._id})`);
      console.log(`Current status: ${testDonation.status}`);

      // Simulate the acceptance logic
      if (testDonation.status === 'Pending') {
        testDonation.status = 'Accepted';
        testDonation.assignedNgo = testNgo._id;
        
        // Award points
        const calculatePoints = (quantity) => {
          if (quantity >= 1 && quantity <= 5) return 25;
          if (quantity >= 6 && quantity <= 15) return 50;
          if (quantity >= 16 && quantity <= 30) return 75;
          if (quantity > 30) return 100;
          return 0;
        };
        
        const pointsEarned = calculatePoints(testDonation.quantity);
        testDonation.rewardPoints = pointsEarned;
        testDonation.rewardMessage = `You earned ${pointsEarned} points!`;
        testDonation._pointsAwarded = true;

        await testDonation.save();

        // Update donor points
        const donor = await User.findById(testDonation.donor._id);
        if (donor) {
          donor.totalPoints = (donor.totalPoints || 0) + pointsEarned;
          await donor.save();
          console.log(`Updated donor points: ${donor.totalPoints}`);
        }

        console.log(`Donation accepted successfully! Status: ${testDonation.status}`);
        console.log(`Points awarded: ${pointsEarned}`);
      } else {
        console.log('Donation is not in pending status');
      }
    } else {
      console.log('\nNeed at least 1 pending donation and 1 NGO to test acceptance');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Debug error:', error);
    process.exit(1);
  }
};

// Run the debug script
if (require.main === module) {
  debugNgoAcceptance();
}

module.exports = { debugNgoAcceptance };
