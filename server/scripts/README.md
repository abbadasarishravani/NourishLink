# Feed the Needy - Scripts and Testing Guide

This directory contains scripts to maintain and test the Feed the Needy application.

## Available Scripts

### 1. recalculatePoints.js
Recalculates and fixes points for all existing donations based on the correct points system:
- 1-5 servings: 25 points
- 6-15 servings: 50 points  
- 16-30 servings: 75 points
- >30 servings: 100 points

**Usage:**
```bash
cd server
node scripts/recalculatePoints.js
```

### 2. testCompleteFlow.js
Tests the complete application flow:
- Creates test users (donor and NGO)
- Creates donations
- Tests NGO acceptance
- Verifies points calculation
- Checks leaderboard functionality

**Usage:**
```bash
cd server
node scripts/testCompleteFlow.js
```

## Environment Setup

Make sure your `.env` file contains:
```
MONGODB_URI=mongodb://localhost:27017/feed-the-needy
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_FOLDER=feed-the-needy/profile-images
```

## Testing the Complete Flow

### Step 1: Start the Backend Server
```bash
cd server
npm start
```

### Step 2: Start the Frontend
```bash
cd client
npm run dev
```

### Step 3: Test the Flow Manually

1. **Register/Login as Donor**
   - Create a donor account
   - Login to the system

2. **Submit a Donation**
   - Go to Donate page
   - Fill in donation details (food type, quantity, address)
   - Submit the donation

3. **Register/Login as NGO**
   - Create an NGO account
   - Login to the system

4. **Accept Donation**
   - Go to NGO Dashboard
   - Find pending donations
   - Click "Accept Request"
   - Verify points are awarded to donor

5. **Check Profile**
   - Upload profile picture
   - Verify it displays correctly

6. **Check Leaderboard**
   - Go to Rewards page
   - Verify donor appears on leaderboard with correct points

## Expected Behavior

### NGO Acceptance Flow
- NGO clicks "Accept Request" on a pending donation
- Donation status changes from "Pending" to "Accepted"
- NGO is assigned to the donation
- Donor receives points based on quantity
- Success notification appears
- Donation moves to NGO's "My Accepted Pickups" tab

### Points System
- Points are awarded when NGO accepts donation (not when completed)
- Points are calculated based on quantity:
  - 1-5 servings = 25 points
  - 6-15 servings = 50 points
  - 16-30 servings = 75 points
  - >30 servings = 100 points
- Points are added to donor's total (not overwritten)
- No user gets 0 points if they have valid donations

### Profile Image Upload
- Backend handles both Cloudinary and local storage
- Frontend sends FormData with correct field name
- Image URL is saved in database
- Image displays immediately after upload

### Notifications
- Success message: "Request accepted" for NGO
- Points notification: "You earned X points!" for donor
- Profile upload: "Profile image uploaded successfully"

## Troubleshooting

### NGO Acceptance Failing
- Check if NGO is approved (ngoApproved: true)
- Verify donation exists and is in "Pending" status
- Check authentication token is valid

### Profile Upload Not Working
- Verify Cloudinary credentials in .env
- Check if uploads directory exists
- Verify FormData is being sent correctly
- Check file size limits (5MB max)

### Points Not Calculating
- Run recalculatePoints.js script
- Verify donation status is "Accepted"
- Check _pointsAwarded flag is set correctly

### Leaderboard Not Updating
- Refresh the page after points changes
- Check if user role is "Donor"
- Verify totalPoints field is populated

## API Endpoints Tested

### Donation Endpoints
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get donations (with filters)
- `PUT /api/donations/status/:id` - Update donation status
- `GET /api/donations/my` - Get user's donations
- `GET /api/donations/ngo` - Get NGO's assigned donations

### Upload Endpoints
- `POST /api/upload/profile-pic` - Upload profile image
- `POST /api/upload/profile-image` - Upload profile image (alternative)

### User Endpoints
- `GET /api/users/me` - Get current user
- `PUT /api/users/update` - Update user profile
- `GET /api/users/leaderboard` - Get leaderboard

## Database Schema

### Donation Model
```javascript
{
  donor: ObjectId,
  foodType: String,
  quantity: Number,
  unit: String,
  condition: String,
  address: String,
  location: { lat: Number, lng: Number },
  status: String, // Pending, Accepted, In Progress, Delivered, Completed, Cancelled
  assignedNgo: ObjectId,
  rewardPoints: Number,
  rewardMessage: String,
  _pointsAwarded: Boolean
}
```

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // Donor, NGO, Admin
  profilePic: String,
  totalPoints: Number,
  redeemedPoints: Number,
  badges: [String],
  vouchers: [Object],
  ngoApproved: Boolean
}
```

## Production Considerations

1. **Security**: Ensure all endpoints are properly authenticated
2. **Validation**: Add input validation for all API endpoints
3. **Rate Limiting**: Implement rate limiting for upload endpoints
4. **Error Handling**: Improve error messages and logging
5. **Performance**: Add database indexes for frequently queried fields
6. **Testing**: Add unit tests for all critical functions
