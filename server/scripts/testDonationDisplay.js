const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donation = require('../models/Donation');

dotenv.config();

const testDonationDisplay = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Test 1: Check existing donations
    console.log('=== TEST 1: Check Existing Donations ===');
    const allDonations = await Donation.find({})
      .populate('donor', 'name email')
      .populate('assignedNgo', 'name organizationName');

    console.log(`Total donations in database: ${allDonations.length}`);
    allDonations.forEach((donation, index) => {
      console.log(`${index + 1}. ${donation.foodType} - ${donation.quantity} ${donation.unit}`);
      console.log(`   Status: ${donation.status}`);
      console.log(`   Donor: ${donation.donor?.name || 'Unknown'}`);
      console.log(`   Assigned NGO: ${donation.assignedNgo?.name || 'None'}`);
      console.log('');
    });

    // Test 2: Check users
    console.log('=== TEST 2: Check Users ===');
    const donors = await User.find({ role: 'Donor' });
    const ngos = await User.find({ role: 'NGO' });

    console.log(`Found ${donors.length} donors:`);
    donors.forEach((donor, index) => {
      console.log(`${index + 1}. ${donor.name} (${donor.email}) - Points: ${donor.totalPoints || 0}`);
    });

    console.log(`\nFound ${ngos.length} NGOs:`);
    ngos.forEach((ngo, index) => {
      console.log(`${index + 1}. ${ngo.name} (${ngo.email}) - Approved: ${ngo.ngoApproved}`);
    });

    // Test 3: Simulate API calls
    console.log('\n=== TEST 3: Simulate API Calls ===');
    
    if (donors.length > 0) {
      const testDonor = donors[0];
      console.log(`\n--- Donor Perspective (${testDonor.name}) ---`);
      
      // Simulate GET /donations/my
      const donorDonations = await Donation.find({ donor: testDonor._id })
        .populate('assignedNgo', 'name organizationName')
        .sort({ createdAt: -1 });

      console.log(`Donor should see ${donorDonations.length} donations:`);
      donorDonations.forEach((donation, index) => {
        console.log(`${index + 1}. ${donation.foodType} - ${donation.status}`);
      });
    }

    if (ngos.length > 0) {
      const testNgo = ngos[0];
      console.log(`\n--- NGO Perspective (${testNgo.name}) ---`);
      
      // Simulate GET /donations?status=Pending
      const pendingDonations = await Donation.find({ status: 'Pending' })
        .populate('donor', 'name email phone')
        .sort({ createdAt: -1 });

      console.log(`NGO should see ${pendingDonations.length} pending donations:`);
      pendingDonations.forEach((donation, index) => {
        console.log(`${index + 1}. ${donation.foodType} from ${donation.donor?.name}`);
      });

      // Simulate GET /donations/ngo
      const ngoDonations = await Donation.find({ assignedNgo: testNgo._id })
        .populate('donor', 'name email phone')
        .sort({ createdAt: -1 });

      console.log(`NGO should see ${ngoDonations.length} assigned pickups:`);
      ngoDonations.forEach((donation, index) => {
        console.log(`${index + 1}. ${donation.foodType} from ${donation.donor?.name} - ${donation.status}`);
      });
    }

    // Test 4: Create test data if needed
    if (allDonations.length === 0) {
      console.log('\n=== TEST 4: Creating Test Data ===');
      
      if (donors.length > 0 && ngos.length > 0) {
        const testDonation = new Donation({
          donor: donors[0]._id,
          foodType: 'Test Food',
          quantity: 10,
          unit: 'servings',
          condition: 'Good',
          address: 'Test Address',
          status: 'Pending'
        });
        
        await testDonation.save();
        console.log('Created test donation');
      } else {
        console.log('Need at least 1 donor and 1 NGO to create test data');
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log('Database Status:');
    console.log(`- Total Donations: ${allDonations.length}`);
    console.log(`- Donors: ${donors.length}`);
    console.log(`- NGOs: ${ngos.length}`);
    console.log('\nExpected Behavior:');
    console.log('- Donors should see their own donations in dashboard');
    console.log('- NGOs should see pending donations and their assigned pickups');
    console.log('- API endpoints should return correct data');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

// Run the test
if (require.main === module) {
  testDonationDisplay();
}

module.exports = { testDonationDisplay };
