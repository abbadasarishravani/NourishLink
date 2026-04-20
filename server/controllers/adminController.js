const User = require('../models/User');
const Donation = require('../models/Donation');

const listPendingNgos = async (req, res) => {
  const items = await User.find({ role: 'NGO', ngoApproved: false }).select('-password').sort({ createdAt: -1 });
  res.json(items);
};

const approveNgo = async (req, res) => {
  const ngo = await User.findOne({ _id: req.params.id, role: 'NGO' });
  if (!ngo) return res.status(404).json({ message: 'NGO not found' });
  ngo.ngoApproved = true;
  await ngo.save();
  res.json({ message: 'NGO approved', id: ngo._id });
};

const rejectNgo = async (req, res) => {
  const ngo = await User.findOne({ _id: req.params.id, role: 'NGO' });
  if (!ngo) return res.status(404).json({ message: 'NGO not found' });
  await ngo.deleteOne();
  res.json({ message: 'NGO rejected (deleted)', id: req.params.id });
};

const listUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(200);
  res.json(users);
};

const listDonations = async (req, res) => {
  const q = {};
  if (req.query.status) q.status = req.query.status;
  const donations = await Donation.find(q)
    .populate('donor', 'name email phone')
    .populate('assignedNgo', 'name email organizationName')
    .sort({ createdAt: -1 })
    .limit(400);
  res.json(donations);
};

module.exports = { listPendingNgos, approveNgo, rejectNgo, listUsers, listDonations };

