const Donation = require("../models/Donation");
const User = require("../models/User");

// Create donation
const createDonation = async (req, res) => {
  try {
    const { foodType, quantity, unit, condition, address, location } = req.body;

    if (!foodType || !quantity || !address) {
      return res.status(400).json({ message: "Food type, quantity, and address are required" });
    }

    const donation = new Donation({
      donor: req.user.id,
      foodType,
      quantity,
      unit: unit || 'servings',
      condition: condition || 'Good',
      address,
      location: location || {},
    });

    await donation.save();
    await donation.populate('donor', 'name email phone');

    // Calculate potential points for display
    const potentialPoints = calculatePoints(donation.quantity);
    
    res.status(201).json({
      message: "Donation created successfully",
      donation,
      potentialPoints,
      pointsMessage: `You will earn ${potentialPoints} points when an NGO accepts this donation!`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all donations
const getDonations = async (req, res) => {
  try {
    const { status, my_requests } = req.query;
    let query = {};

    console.log('Get donations request:', { status, my_requests, userRole: req.user?.role, userId: req.user?.id });

    if (status) {
      // Handle both 'Pending' and 'pending' for case-insensitive matching
      query.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    if (my_requests === 'true' && req.user.role === 'NGO') {
      query.assignedNgo = req.user.id;
    }

    console.log('Final query:', query);

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone')
      .populate('assignedNgo', 'name organizationName')
      .sort({ createdAt: -1 });

    console.log(`Found ${donations.length} donations`);
    donations.forEach(d => console.log(`- ${d._id}: ${d.foodType} (${d.status})`));

    res.json(donations);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update donation status
const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Update donation status request:', { id, status, userRole: req.user?.role, userId: req.user?.id });

    if (!id || !status) {
      return res.status(400).json({ message: "Donation ID and status are required" });
    }

    const validStatuses = ['Pending', 'Accepted', 'In Progress', 'Delivered', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    console.log('Found donation:', { donationId: donation._id, currentStatus: donation.status, assignedNgo: donation.assignedNgo });

    // Simplified authorization logic
    if (status === 'Accepted' && req.user.role === 'NGO') {
      // NGO can accept any pending donation
      if (donation.status !== 'Pending') {
        return res.status(400).json({ message: "Donation is not in pending status" });
      }
      donation.assignedNgo = req.user.id;
      console.log('NGO assigned to donation:', { ngoId: req.user.id });
    } else if (req.user.role !== 'Admin') {
      // For non-acceptance updates, check if user is assigned NGO
      if (!donation.assignedNgo || donation.assignedNgo.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this donation" });
      }
    }

    const previousStatus = donation.status;
    donation.status = status;
    
    // Award points when donation is accepted by NGO
    if (status === 'Accepted' && !donation._pointsAwarded) {
      const pointsEarned = calculatePoints(donation.quantity);
      donation.rewardPoints = pointsEarned;
      donation.rewardMessage = `🎉 You earned ${pointsEarned} points!`;
      donation._pointsAwarded = true;

      // Update user's total points
      const donor = await User.findById(donation.donor);
      if (donor) {
        donor.totalPoints = (donor.totalPoints || 0) + pointsEarned;
        await donor.save();
      }
    }

    await donation.save();
    await donation.populate('donor', 'name email phone');
    await donation.populate('assignedNgo', 'name organizationName');

    res.json({
      message: `Donation status updated to ${status}`,
      donation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get analytics
const getAnalytics = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'Pending' });
    const acceptedDonations = await Donation.countDocuments({ status: 'Accepted' });
    const completedDonations = await Donation.countDocuments({ status: 'Completed' });

    res.json({
      totalDonations,
      pendingDonations,
      acceptedDonations,
      completedDonations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get my donations
const getMyDonations = async (req, res) => {
  try {
    console.log('Get my donations request:', { userId: req.user.id, userRole: req.user?.role });
    
    const donations = await Donation.find({ donor: req.user.id })
      .populate('assignedNgo', 'name organizationName')
      .sort({ createdAt: -1 });

    console.log(`Found ${donations.length} donations for user ${req.user.id}`);
    donations.forEach(d => console.log(`- ${d._id}: ${d.foodType} (${d.status})`));

    res.json(donations);
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get NGO donations
const getNgoDonations = async (req, res) => {
  try {
    console.log('Get NGO donations request:', { userId: req.user.id, userRole: req.user?.role });
    
    const donations = await Donation.find({ assignedNgo: req.user.id })
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });

    console.log(`Found ${donations.length} donations for NGO ${req.user.id}`);
    donations.forEach(d => console.log(`- ${d._id}: ${d.foodType} (${d.status})`));

    res.json(donations);
  } catch (error) {
    console.error('Get NGO donations error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Calculate points based on quantity
const calculatePoints = (quantity) => {
  if (quantity >= 1 && quantity <= 5) return 25;
  if (quantity >= 6 && quantity <= 15) return 50;
  if (quantity >= 16 && quantity <= 30) return 75;
  if (quantity > 30) return 100;
  return 0;
};

module.exports = {
  createDonation,
  getDonations,
  updateDonationStatus,
  getAnalytics,
  getMyDonations,
  getNgoDonations,
  calculatePoints,
};
