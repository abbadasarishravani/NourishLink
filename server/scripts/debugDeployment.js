const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const debugDeployment = async () => {
  try {
    console.log('=== DEPLOYMENT DEBUG ===');
    console.log('Environment Variables:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    console.log('- PORT:', process.env.PORT || 'DEFAULT (5000)');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

    // Test database connection
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connection: SUCCESS');
      
      // Test user creation/retrieval
      const userCount = await User.countDocuments();
      console.log(`✅ Database Users: ${userCount} found`);
      
      // Test NGO approval status
      const ngoCount = await User.countDocuments({ role: 'NGO' });
      const approvedNgoCount = await User.countDocuments({ role: 'NGO', ngoApproved: true });
      console.log(`✅ NGOs: ${ngoCount} total, ${approvedNgoCount} approved`);
      
    } catch (dbError) {
      console.log('❌ MongoDB Connection: FAILED');
      console.error(dbError.message);
    }

    // Test API endpoints (if server is running)
    console.log('\n=== API ENDPOINTS ===');
    console.log('Expected endpoints:');
    console.log('- POST /api/auth/register');
    console.log('- POST /api/auth/login');
    console.log('- GET /api/auth/profile');
    console.log('- POST /api/donations');
    console.log('- GET /api/donations');
    console.log('- PUT /api/donations/status/:id');
    console.log('- POST /api/upload/profile-pic');
    console.log('- GET /api/users/me');
    console.log('- GET /api/users/leaderboard');

    console.log('\n=== FRONTEND CONFIGURATION ===');
    console.log('Expected VITE_API_URL:', 'https://nourishlink.onrender.com/api');
    console.log('Frontend should call:', 'POST https://nourishlink.onrender.com/api/auth/login');

    console.log('\n=== COMMON ISSUES ===');
    console.log('1. CORS: Backend must allow https://nourishlink.vercel.app');
    console.log('2. Environment: VITE_API_URL must be set in Vercel');
    console.log('3. Network: Render backend must be deployed and accessible');
    console.log('4. Database: MongoDB must be accessible from Render');

    console.log('\n=== TROUBLESHOOTING STEPS ===');
    console.log('1. Check Vercel environment variables');
    console.log('2. Check Render deployment logs');
    console.log('3. Test API endpoints directly');
    console.log('4. Verify CORS configuration');
    console.log('5. Check network connectivity');

    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Debug error:', error);
    process.exit(1);
  }
};

// Run debug
if (require.main === module) {
  debugDeployment();
}

module.exports = { debugDeployment };
