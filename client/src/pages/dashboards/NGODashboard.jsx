import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { MapPin, Navigation, PackageCheck } from 'lucide-react';
import { useToast } from '../../components/ui/ToastProvider';

const NGODashboard = () => {
  const toast = useToast();
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('available');

  const fetchDonations = async () => {
    try {
      const endpoint = activeTab === 'available' ? '/donations?status=Pending' : '/donations/ngo';
      const res = await api.get(endpoint);
      setDonations(res.data);
    } catch (err) {
      setDonations([]);
      toast.push({
        type: 'error',
        title: 'Could not load requests',
        message: err.response?.data?.message || 'Unable to fetch NGO pickup requests.',
      });
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [activeTab]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/donations/status/${id}`, { status });

      if (status === 'Accepted') {
        setActiveTab('my_requests');
        toast.push({
          type: 'success',
          title: 'Request accepted',
          message: 'The donation has been moved to your accepted pickups.',
        });
        return;
      }

      toast.push({
        type: 'success',
        title: 'Status updated',
        message: status === 'Delivered' ? 'Donation marked as delivered.' : `Donation marked as ${status}.`,
      });
      fetchDonations();
    } catch (err) {
      toast.push({
        type: 'error',
        title: 'Update failed',
        message: err.response?.data?.message || 'Could not update donation status.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">NGO Volunteer Dashboard</h2>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('available')}
            className={`${activeTab === 'available' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Available Requests
          </button>
          <button
            onClick={() => setActiveTab('my_requests')}
            className={`${activeTab === 'my_requests' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Accepted Pickups
          </button>
        </nav>
      </div>

      {activeTab === 'available' && (
         <div className="bg-primary-50 rounded-xl p-4 mb-6 border border-primary-100 flex items-start">
             <MapPin className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
             <p className="text-sm text-primary-800">
               Integrating Google Maps will allow seeing these requests dynamically on a map. For now, requests are listed chronologically.
             </p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
             No {activeTab === 'available' ? 'pending requests currently.' : 'accepted pickups yet.'}
          </div>
        ) : (
          donations.map((d) => (
            <div key={d._id} className="bg-white overflow-hidden shadow rounded-2xl border border-gray-100 hover:shadow-lg transition">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{d.foodType}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {d.quantity} {d.unit}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-2 mb-6">
                  <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {d.address}</p>
                  {d.donor && <p className="flex items-center"><PackageCheck className="w-4 h-4 mr-2" /> Donor: {d.donor.name}</p>}
                </div>
                
                {activeTab === 'available' ? (
                  <button onClick={() => updateStatus(d._id, 'Accepted')} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                    Accept Request
                  </button>
                ) : (
                  <div className="space-y-2">
                     <span className={`block text-center text-xs font-bold mb-2 uppercase ${d.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>Status: {d.status}</span>
                     {d.status === 'Accepted' && (
                       <button onClick={() => updateStatus(d._id, 'In Progress')} className="w-full inline-flex justify-center items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                         Mark as In Transit
                       </button>
                     )}
                     {d.status === 'In Progress' && (
                       <button onClick={() => updateStatus(d._id, 'Delivered')} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                         Mark as Delivered
                       </button>
                     )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
