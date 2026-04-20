import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { PlusCircle, Clock, CheckCircle } from 'lucide-react';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ foodType: '', quantity: '', unit: 'servings', condition: 'Fresh', address: '' });

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/donations', { ...formData, location: { lat: 40.7128, lng: -74.0060 } }); // Mock coordinates
      setShowForm(false);
      setFormData({ foodType: '', quantity: '', unit: 'servings', condition: 'Fresh', address: '' });
      fetchDonations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Donor Dashboard</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Donation
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white shadow sm:rounded-lg mb-8 p-6 border border-primary-100 animate-slide-up">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Submit Food Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Food Type / Name</label>
                  <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value})} placeholder="e.g. Pasta, Vegetables"/>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input required type="number" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md sm:text-sm border-gray-300 border focus:ring-primary-500 focus:border-primary-500" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                    <select className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                      <option value="servings">servings</option>
                      <option value="kg">kg</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
               </div>
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                  <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main St, City"/>
               </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Cancel</button>
              <button type="submit" className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none">Submit Donation</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
        <ul className="divide-y divide-gray-200">
          {donations.length === 0 ? (
             <li className="px-6 py-10 text-center text-gray-500">No donations made yet. Start by creating one!</li>
          ) : donations.map((donation) => (
            <li key={donation._id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="font-medium text-primary-600 truncate">{donation.foodType}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        {donation.quantity} {donation.unit}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          Posted on <time dateTime={donation.createdAt}>{new Date(donation.createdAt).toLocaleDateString()}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex -space-x-1 overflow-hidden">
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : donation.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {donation.status === 'Delivered' && <CheckCircle className="mr-1 w-4 h-4" />}
                        {donation.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonorDashboard;
