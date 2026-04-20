import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { BarChart3, Users, Package, FileText } from 'lucide-react';

const AdminDashboard = () => {
   const [analytics, setAnalytics] = useState(null);

   const fetchAnalytics = async () => {
      try {
        const res = await api.get('/donations/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
   };

   useEffect(() => {
      fetchAnalytics();
   }, []);

   return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">System Administrator</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4">
               <Package className="w-8 h-8" />
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Total Donations</p>
               <p className="text-3xl font-bold text-gray-900">{analytics ? analytics.totalDonations : '...'}</p>
            </div>
         </div>
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600 mr-4">
               <FileText className="w-8 h-8" />
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Pending Requests</p>
               <p className="text-3xl font-bold text-gray-900">{analytics ? analytics.pendingDonations : '...'}</p>
            </div>
         </div>
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 rounded-xl bg-green-100 text-green-600 mr-4">
               <BarChart3 className="w-8 h-8" />
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Successful Deliveries</p>
               <p className="text-3xl font-bold text-gray-900">{analytics ? analytics.completedDonations : '...'}</p>
            </div>
         </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
         <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
             <Users className="mr-2 w-5 h-5 text-gray-500" /> Administrative Actions 
         </h3>
         <p className="text-gray-500 text-sm">
             User management and NGO verifications can be configured here. For this demo, only high-level analytics are displayed. 
             In a full production environment, standard CRUD tables for Users and Reports would be mounted below.
         </p>
      </div>

    </div>
   );
};

export default AdminDashboard;
