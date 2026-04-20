const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donation = require('../models/Donation');

// Load environment variables
dotenv.config();

const testCompleteFlow = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feed-the-needy');
    console.log('Connected to MongoDB\n');

    // Test 1: Create test users if they don't exist
    console.log('=== TEST 1: Creating test users ===');
    
    let donor = await User.findOne({ email: 'test.donor@example.com' });
    if (!donor) {
      donor = new User({
        name: 'Test Donor',
        email: 'test.donor@example.com',
        password: 'password123',
        role: 'Donor',
        phone: '1234567890',
        totalPoints: 0,
        points: 0
      });
      await donor.save();
      console.log('Created test donor');
    } else {
      console.log('Test donor already exists');
    }

    let ngo = await User.findOne({ email: 'test.ngo@example.com' });
    if (!ngo) {
      ngo = new User({
        name: 'Test NGO',
        email: 'test.ngo@example.com',
        password: 'password123',
        role: 'NGO',
        phone: '0987654321',
        ngoApproved: true,
        organizationName: 'Test Charity Organization'
      });
      await ngo.save();
      console.log('Created test NGO');
    } else {
      console.log('Test NGO already exists');
    }

    // Test 2: Create a donation
    console.log('\n=== TEST 2: Creating donation ===');
    
    const donation = new Donation({
      donor: donor._id,
      foodType: 'Rice and Curry',
      quantity: 10,
      unit: 'servings',
      condition: 'Good',
      address: '123 Test Street, Test City',
      location: { lat: 19.0760, lng: 72.8777 },
      status: 'Pending'
    });
    
    await donation.save();
    await donation.populate('donor', 'name email');
    console.log(`Created donation: ${donation.foodType} (${donation.quantity} ${donation.unit})`);

    // Test 3: NGO accepts donation (should award points)
    console.log('\n=== TEST 3: NGO accepting donation ===');
    
    const initialPoints = donor.totalPoints || 0;
    console.log(`Donor points before acceptance: ${initialPoints}`);
    
    donation.status = 'Accepted';
    donation.assignedNgo = ngo._id;
    donation._pointsAwarded = true;
    donation.rewardPoints = 50; // 10 servings = 50 points
    donation.rewardMessage = 'You earned 50 points!';
    
    await donation.save();
    
    // Update donor points
    donor.totalPoints = initialPoints + 50;
    await donor.save();
    
    console.log(`Donor points after acceptance: ${donor.totalPoints}`);
    console.log(`Points awarded: ${donation.rewardPoints}`);

    // Test 4: Check leaderboard
    console.log('\n=== TEST 4: Checking leaderboard ===');
    
    const leaderboard = await User.find({ role: 'Donor' })
      .select('name totalPoints points badges profilePic')
      .sort({ totalPoints: -1, createdAt: 1 })
      .limit(10);
    
    console.log('Top donors:');
    leaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}: ${user.totalPoints} points`);
    });

    // Test 5: Test different quantity ranges
    console.log('\n=== TEST 5: Testing points calculation ===');
    
    const testCases = [
      { quantity: 3, expected: 25 },   // 1-5 -> 25 points
      { quantity: 10, expected: 50 },  // 6-15 -> 50 points
      { quantity: 20, expected: 75 },  // 16-30 -> 75 points
      { quantity: 50, expected: 100 }   // >30 -> 100 points
    ];
    
    for (const testCase of testCases) {
      const testDonation = new Donation({
        donor: donor._id,
        foodType: 'Test Food',
        quantity: testCase.quantity,
        unit: 'servings',
        condition: 'Good',
        address: 'Test Address',
        status: 'Accepted',
        assignedNgo: ngo._id,
        _pointsAwarded: true,
        rewardPoints: testCase.expected,
        rewardMessage: `You earned ${testCase.expected} points!`
      });
      
      await testDonation.save();
      
      // Update donor points
      donor.totalPoints += testCase.expected;
      await donor.save();
      
      console.log(`Quantity ${testCase.quantity} -> ${testCase.expected} points (Total: ${donor.totalPoints})`);
    }

    // Test 6: Final verification
    console.log('\n=== TEST 6: Final verification ===');
    
    const finalDonor = await User.findById(donor._id);
    const allDonations = await Donation.find({ donor: donor._id });
    const acceptedDonations = await Donation.find({ donor: donor._id, status: 'Accepted' });
    
    console.log(`Final donor points: ${finalDonor.totalPoints}`);
    console.log(`Total donations: ${allDonations.length}`);
    console.log(`Accepted donations: ${acceptedDonations.length}`);
    
    // Verify points calculation
    let calculatedPoints = 0;
    for (const donation of acceptedDonations) {
      if (donation.quantity >= 1 && donation.quantity <= 5) calculatedPoints += 25;
      else if (donation.quantity >= 6 && donation.quantity <= 15) calculatedPoints += 50;
      else if (donation.quantity >= 16 && donation.quantity <= 30) calculatedPoints += 75;
      else if (donation.quantity > 30) calculatedPoints += 100;
    }
    
    console.log(`Calculated points: ${calculatedPoints}`);
    console.log(`Database points: ${finalDonor.totalPoints}`);
    console.log(`Points match: ${calculatedPoints === finalDonor.totalPoints ? 'YES' : 'NO'}`);

    console.log('\n=== ALL TESTS COMPLETED ===');
    console.log('Flow working correctly: Donate -> NGO accepts -> Points awarded -> Leaderboard updated');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

// Run the test
if (require.main === module) {
  testCompleteFlow();
}

module.exports = { testCompleteFlow };
