import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, MapPin, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-white/20 dark:bg-black/10 pattern-grid opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Share Food, <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Deliver Hope.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                NourishLink connects food donors with NGOs and volunteers instantly. Help us build a hunger-free world by redistributing surplus food to those who need it most.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full text-lg shadow-lg shadow-primary-500/30 transition transform hover:-translate-y-1 flex items-center justify-center">
                  Start Donating <ArrowRight className="ml-2 w-5 h-5"/>
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-primary-500 hover:text-primary-600 text-slate-700 dark:text-slate-200 font-bold rounded-full text-lg shadow-sm transition flex items-center justify-center">
                  I'm an NGO
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-500 rounded-full blur-3xl opacity-20 transform scale-110"></div>
              {/* Using a placeholder for now - normally an illustration goes here */}
              <div className="glass ring-soft p-8 rounded-3xl relative flex items-center justify-center aspect-square">
                 <div className="space-y-6 text-center">
                    <HeartHandshake className="w-32 h-32 text-primary-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Together we can end hunger</h3>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How NourishLink Works</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">A seamless process to ensure surplus food reaches the right people.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass ring-soft p-8 rounded-3xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Utensils className="text-primary-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. List Surplus Food</h3>
              <p className="text-gray-600">Restaurants, events, or individuals list their surplus edible food details quickly through our portal.</p>
            </div>
            <div className="glass ring-soft p-8 rounded-3xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="text-primary-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Smart Matching</h3>
              <p className="text-gray-600">Our algorithm notifies nearby verified NGOs and volunteers about the available donation based on location.</p>
            </div>
            <div className="glass ring-soft p-8 rounded-3xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <HeartHandshake className="text-primary-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Pickup & Deliver</h3>
              <p className="text-gray-600">Volunteers accept the request, pick up the food, and deliver it directly to those in need. Real-time updates provided.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
