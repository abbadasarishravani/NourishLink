const https = require('https');
const http = require('http');

const checkDeployment = async () => {
  const baseUrl = 'https://nourishlink.onrender.com';
  
  console.log('=== DEPLOYMENT HEALTH CHECK ===');
  console.log(`Testing: ${baseUrl}`);
  
  // Test 1: Root endpoint
  console.log('\n1. Testing root endpoint...');
  try {
    const response = await fetch(`${baseUrl}/`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Auth endpoints
  console.log('\n2. Testing auth endpoints...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'test123' })
    });
    console.log(`   Login endpoint: ${loginResponse.status}`);
  } catch (error) {
    console.log(`   Login error: ${error.message}`);
  }

  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test', 
        email: 'test@example.com', 
        password: 'test123', 
        role: 'Donor' 
      })
    });
    console.log(`   Register endpoint: ${registerResponse.status}`);
  } catch (error) {
    console.log(`   Register error: ${error.message}`);
  }

  // Test 3: Donation endpoints
  console.log('\n3. Testing donation endpoints...');
  try {
    const donationsResponse = await fetch(`${baseUrl}/api/donations`);
    console.log(`   Donations endpoint: ${donationsResponse.status}`);
  } catch (error) {
    console.log(`   Donations error: ${error.message}`);
  }

  try {
    const myDonationsResponse = await fetch(`${baseUrl}/api/donations/my`);
    console.log(`   My donations endpoint: ${myDonationsResponse.status}`);
  } catch (error) {
    console.log(`   My donations error: ${error.message}`);
  }

  // Test 4: User endpoints
  console.log('\n4. Testing user endpoints...');
  try {
    const usersResponse = await fetch(`${baseUrl}/api/users/me`);
    console.log(`   Users endpoint: ${usersResponse.status}`);
  } catch (error) {
    console.log(`   Users error: ${error.message}`);
  }

  console.log('\n=== DIAGNOSIS ===');
  console.log('If you see 404 errors, the backend deployment may not have the latest code.');
  console.log('Check Render dashboard for deployment status and logs.');
  console.log('Make sure the server.js file includes all the routes properly mounted.');
};

checkDeployment();
