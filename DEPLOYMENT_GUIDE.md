# Vercel Deployment Fix Guide

## 🚨 **Current Issue**
Login/Registration failing on Vercel deployment

## 🔧 **Fixes Applied**

### 1. **CORS Configuration** ✅
Updated `server.js` to allow Vercel frontend:
```javascript
app.use(corsApp({
  origin: ['https://nourishlink.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### 2. **API Base URL** ✅
Fixed `client/src/utils/api.js`:
```javascript
baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`
```

### 3. **Environment Variables** ✅
Created `vercel.json` for proper deployment config:
```json
{
  "env": {
    "VITE_API_URL": "https://nourishlink.onrender.com/api"
  }
}
```

### 4. **Enhanced Logging** ✅
Added detailed logging to auth endpoints for debugging.

## 🚀 **Deployment Checklist**

### **Vercel (Frontend)**
- [ ] Environment variables set in Vercel dashboard
- [ ] `VITE_API_URL=https://nourishlink.onrender.com/api`
- [ ] Build successful
- [ ] Domain accessible: `https://nourishlink.vercel.app`

### **Render (Backend)**
- [ ] Environment variables set in Render dashboard
- [ ] `MONGODB_URI` configured
- [ ] `JWT_SECRET` configured
- [ ] Service running and accessible
- [ ] API endpoint accessible: `https://nourishlink.onrender.com/api`

### **Testing Steps**
1. **Check API Health**
   ```bash
   curl https://nourishlink.onrender.com/
   # Should return: {"message": "Welcome to Nourish Link API"}
   ```

2. **Test Registration**
   ```bash
   curl -X POST https://nourishlink.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"password123","role":"Donor"}'
   ```

3. **Test Login**
   ```bash
   curl -X POST https://nourishlink.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## 🔍 **Debugging Steps**

### **If Still Failing:**

1. **Check Vercel Logs**
   - Go to Vercel dashboard
   - Select your project
   - View Functions tab for errors

2. **Check Render Logs**
   - Go to Render dashboard
   - Select your service
   - View Logs tab

3. **Network Issues**
   ```bash
   # Test connectivity
   ping nourishlink.onrender.com
   traceroute nourishlink.onrender.com
   ```

4. **Browser Console**
   - Open Developer Tools (F12)
   - Check Network tab
   - Look for failed requests
   - Check CORS errors

5. **Environment Variables**
   ```javascript
   // Add to frontend for debugging
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

## 🛠 **Common Solutions**

### **CORS Issues**
- Backend must allow Vercel domain
- Credentials must be enabled
- Preflight requests handled

### **Environment Variables**
- Vercel: Set in dashboard → Settings → Environment Variables
- Render: Set in dashboard → Environment
- Must redeploy after changes

### **Database Connection**
- MongoDB Atlas accessible from Render
- Connection string includes correct database name
- IP whitelist allows Render servers

### **API Endpoints**
- All routes properly mounted
- Correct HTTP methods allowed
- Proper error handling

## 📞 **Support Commands**

### **Redeploy Backend**
```bash
git add .
git commit -m "Fix deployment issues"
git push
```

### **Check Deployment Status**
```bash
# Backend
curl https://nourishlink.onrender.com/

# Frontend  
curl https://nourishlink.vercel.app/
```

## ✅ **Expected Result**

After fixes:
1. ✅ Registration works on Vercel
2. ✅ Login works on Vercel
3. ✅ CORS errors resolved
4. ✅ API calls successful
5. ✅ Users can authenticate and use app

## 🔄 **Next Steps**

1. Deploy backend changes to Render
2. Set environment variables in Vercel
3. Test authentication flow
4. Monitor logs for any remaining issues
