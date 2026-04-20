# 404 Error Fix Guide

## **Problem**
Getting 404 errors on deployed backend (Render)

## **Root Causes**
1. **Render deployment not updated** - Latest code not deployed
2. **Route mounting issues** - API endpoints not accessible
3. **Build process failure** - Server not starting properly
4. **Environment variables missing** - Required config not set

## **Immediate Fixes**

### **1. Check Render Deployment Status**
- Go to Render dashboard
- Check your service status
- View recent deployment logs
- Look for any build errors

### **2. Manual Redeploy**
```bash
# Force redeploy by pushing a small change
git add .
git commit -m "trigger redeploy"
git push
```

### **3. Check Environment Variables on Render**
Make sure these are set in Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (should be 5000 or leave default)

### **4. Test API Endpoints Directly**
```bash
# Test if backend is accessible
curl https://nourishlink.onrender.com/

# Test auth endpoint
curl https://nourishlink.onrender.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## **Common 404 Issues & Solutions**

### **Issue: Routes not found**
**Solution**: Ensure `server.js` has all routes mounted:
```javascript
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
```

### **Issue: Server not starting**
**Solution**: Check Render logs for startup errors
- Database connection issues
- Missing dependencies
- Port binding problems

### **Issue: CORS blocking requests**
**Solution**: Ensure CORS is properly configured:
```javascript
app.use(cors({
  origin: ['https://nourish-link.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

## **Debugging Steps**

### **Step 1: Check Server Health**
```bash
curl -I https://nourishlink.onrender.com/
# Should return 200 OK
```

### **Step 2: Check Specific Endpoints**
```bash
# Test each endpoint
curl https://nourishlink.onrender.com/api/auth/login
curl https://nourishlink.onrender.com/api/donations
curl https://nourishlink.onrender.com/api/users/me
```

### **Step 3: Check Frontend Configuration**
Ensure Vercel has correct environment variable:
```
VITE_API_URL=https://nourishlink.onrender.com/api
```

### **Step 4: Browser Console Debugging**
1. Open browser dev tools (F12)
2. Check Network tab
3. Look for failing requests
4. Check exact URLs being called

## **Quick Fix Checklist**

- [ ] Render service is running
- [ ] Latest code is deployed
- [ ] Environment variables set
- [ ] Database connection working
- [ ] CORS configured correctly
- [ ] Frontend API URL correct
- [ ] No build errors in logs

## **If Still Failing**

### **Option 1: Restart Render Service**
- Go to Render dashboard
- Click "Manual Deploy"
- Choose "Deploy latest commit"

### **Option 2: Check Package.json**
Ensure `start` script is correct:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### **Option 3: Verify File Structure**
Make sure all required files exist:
- `server.js` (main server file)
- `routes/authRoutes.js`
- `routes/donationRoutes.js`
- `routes/userRoutes.js`
- `controllers/authController.js`
- `controllers/donationController.js`
- `models/User.js`
- `models/Donation.js`

## **Expected Results**

After fixes:
- `curl https://nourishlink.onrender.com/` returns `{"message": "Welcome to Nourish Link API"}`
- All API endpoints return proper responses
- Frontend can successfully authenticate
- Donations load correctly

## **Contact Support**

If issues persist:
1. Check Render status page
2. Review deployment logs thoroughly
3. Verify all files are committed and pushed
4. Consider creating a new Render service
