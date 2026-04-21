import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, MapPin, HeartHandshake, CheckCircle, Users, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    { icon: Zap, title: "Real-Time Notifications", desc: "Get matched with nearby donors or volunteers instantly, no waiting around." },
    { icon: MapPin, title: "Location-Based Matching", desc: "We connect you with people close by to make pickups and deliveries practical." },
    { icon: CheckCircle, title: "Verified Network", desc: "All NGOs and volunteers are verified to ensure food safety and trust." },
    { icon: Users, title: "Easy Coordination", desc: "Track donations, confirm pickups, and update status in one place." }
  ];

  const useCases = [
    { role: "Restaurant Owners", desc: "Reduce waste at the end of each day and build goodwill with your community." },
    { role: "Event Organizers", desc: "Instead of discarding leftover catering, donate it and help people in need." },
    { role: "Individuals", desc: "Have extra groceries? Cooked too much? Share it with someone nearby." },
    { role: "NGOs", desc: "Access reliable food sources quickly to support your beneficiaries." },
    { role: "Volunteers", desc: "Help directly by picking up and delivering food where it's needed most." },
  ];

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
                Share Food,<br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Deliver Hope.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                NourishLink connects food donors with nearby NGOs. By redistributing surplus food, we can get meals to the people who need them.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full text-lg shadow-lg shadow-primary-500/30 transition transform hover:-translate-y-1 flex items-center justify-center">
                  I Have Food to Share <ArrowRight className="ml-2 w-5 h-5"/>
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
              <div className="glass ring-soft p-8 rounded-3xl relative flex items-center justify-center aspect-square">
                <div className="space-y-6 text-center">
                  <HeartHandshake className="w-32 h-32 text-primary-500 mx-auto" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Food shared is lives improved</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why This Matters</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-transparent dark:border-slate-700">
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">1 in 3</p>
                <p className="text-slate-600 dark:text-slate-300">People lack adequate food security</p>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-transparent dark:border-slate-700">
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">30%</p>
                <p className="text-slate-600 dark:text-slate-300">Of food produced globally is wasted</p>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-transparent dark:border-slate-700">
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">Minutes</p>
                <p className="text-slate-600 dark:text-slate-300">Not hours, to get surplus food delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How NourishLink Works</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">How surplus food reaches the right people.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-3xl hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-900/50 transition"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Utensils className="text-primary-600 dark:text-primary-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">List Your Food</h3>
              <p className="text-slate-600 dark:text-slate-400">Tell us what you have: type of food, quantity, pickup location, and when it's ready. Takes about 2 minutes.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-3xl hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-900/50 transition"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="text-primary-600 dark:text-primary-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">We Find the Right People</h3>
              <p className="text-slate-600 dark:text-slate-400">Our system matches your donation with nearby NGOs or volunteers. They get notified right away and can accept within minutes.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-3xl hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-900/50 transition"
            >
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6">
                <HeartHandshake className="text-primary-600 dark:text-primary-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Pickup & Delivery</h3>
              <p className="text-slate-600 dark:text-slate-400">Volunteers collect the food and get it to people in need the same day. You track everything in real time.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Choose NourishLink</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Built for real people solving a real problem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-6 bg-white dark:bg-slate-800 p-8 rounded-2xl"
              >
                <div className="flex-shrink-0">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Who Uses NourishLink</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Whether you have food to share or people to help, there's a place for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-slate-800/40 dark:to-slate-700/20 p-8 rounded-2xl border border-primary-200 dark:border-slate-700/50"
              >
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{useCase.role}</h3>
                <p className="text-slate-600 dark:text-slate-400">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">What Happens When You Join</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">0%</div>
              <p className="text-slate-600 dark:text-slate-300">Cost to list food or volunteer</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <p className="text-slate-600 dark:text-slate-300">Platform available anytime</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">Direct</div>
              <p className="text-slate-600 dark:text-slate-300">Food goes straight to those in need</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Smart Matching</h3>
              <p className="text-gray-600">Nearby verified NGOs and volunteers get an alert about the available food.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of donors, NGOs, and volunteers already using NourishLink. Sign up today and start reducing food waste in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-primary-600 font-bold rounded-full text-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center justify-center"
            >
              Start as a Donor <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/10 transition inline-flex items-center justify-center"
            >
              Join as NGO or Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white dark:bg-slate-800 p-8 rounded-2xl">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Have Questions?</h3>
              <p className="text-slate-600 dark:text-slate-300">Check out our help center or contact our team. We're here to help you get started.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/help-center" className="px-6 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition">
                Help Center
              </Link>
              <Link to="/register" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
