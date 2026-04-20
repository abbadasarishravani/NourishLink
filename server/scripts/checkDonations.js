const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donation = require('../models/Donation');
const User = require('../models/User');

dotenv.config();

const checkDonations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const donations = await Donation.find({}).populate('donor', 'name email');
    console.log('All donations:');
    donations.forEach((d, i) => {
      console.log(`${i+1}. ${d._id} - ${d.foodType} (${d.quantity}) - Status: ${d.status} - Donor: ${d.donor?.name}`);
    });

    const users = await User.find({ role: 'NGO' });
    console.log('\nNGOs:');
    users.forEach((u, i) => {
      console.log(`${i+1}. ${u._id} - ${u.name} (${u.email}) - Approved: ${u.ngoApproved}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDonations();
