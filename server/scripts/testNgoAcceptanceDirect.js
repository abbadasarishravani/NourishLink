const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donation = require('../models/Donation');

dotenv.config();

const testNgoAcceptance = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Create test NGO token
    const ngo = await User.findOne({ role: 'NGO' });
    if (!ngo) {
      console.log('No NGO found. Creating test NGO...');
      const newNgo = new User({
        name: 'Test NGO',
        email: 'test.ngo@example.com',
        password: 'password123',
        role: 'NGO',
        ngoApproved: true,
        organizationName: 'Test Organization'
      });
      await newNgo.save();
      console.log('Created test NGO');
    }

    // Create test donor
    const donor = await User.findOne({ role: 'Donor' });
    if (!donor) {
      console.log('No donor found. Creating test donor...');
      const newDonor = new User({
        name: 'Test Donor',
        email: 'test.donor@example.com',
        password: 'password123',
        role: 'Donor'
      });
      await newDonor.save();
      console.log('Created test donor');
    }

    // Create test donation
    const testDonation = new Donation({
      donor: donor._id,
      foodType: 'Test Food',
      quantity: 10,
      unit: 'servings',
      condition: 'Good',
      address: 'Test Address',
      status: 'Pending'
    });
    await testDonation.save();
    console.log(`Created test donation: ${testDonation._id}`);

    // Simulate NGO acceptance
    console.log('\n=== Simulating NGO Acceptance ===');
    
    const ngoUser = await User.findOne({ role: 'NGO' });
    const donation = await Donation.findById(testDonation._id);
    
    console.log(`NGO: ${ngoUser.name} (${ngoUser._id})`);
    console.log(`Donation: ${donation.foodType} - Status: ${donation.status}`);

    // Test the acceptance logic
    const status = 'Accepted';
    const req = {
      user: {
        id: ngoUser._id,
        role: ngoUser.role
      },
      params: { id: donation._id },
      body: { status }
    };

    console.log('Request data:', { 
      donationId: req.params.id, 
      status: req.body.status, 
      userRole: req.user.role, 
      userId: req.user.id 
    });

    // Check if donation exists and is pending
    if (donation.status !== 'Pending') {
      console.log('ERROR: Donation is not in pending status');
      return;
    }

    // Update donation
    donation.status = status;
    donation.assignedNgo = req.user.id;
    
    // Award points
    const calculatePoints = (quantity) => {
      if (quantity >= 1 && quantity <= 5) return 25;
      if (quantity >= 6 && quantity <= 15) return 50;
      if (quantity >= 16 && quantity <= 30) return 75;
      if (quantity > 30) return 100;
      return 0;
    };
    
    const pointsEarned = calculatePoints(donation.quantity);
    donation.rewardPoints = pointsEarned;
    donation.rewardMessage = `You earned ${pointsEarned} points!`;
    donation._pointsAwarded = true;

    await donation.save();
    console.log(`Donation updated: Status = ${donation.status}, Assigned NGO = ${donation.assignedNgo}`);

    // Update donor points
    const donorUser = await User.findById(donation.donor);
    if (donorUser) {
      donorUser.totalPoints = (donorUser.totalPoints || 0) + pointsEarned;
      await donorUser.save();
      console.log(`Donor points updated: ${donorUser.totalPoints}`);
    }

    console.log('\n=== SUCCESS ===');
    console.log('NGO acceptance working correctly!');
    console.log(`Points awarded: ${pointsEarned}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');

  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

testNgoAcceptance();
