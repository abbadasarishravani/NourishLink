import React from 'react';
import { HelpCircle, HeartHandshake, Clock, Shield, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I donate food?",
      answer: "Simply register as a donor, click 'Donate Food' in your dashboard, provide details about the food (type, quantity, pickup location), and submit. Nearby NGOs or volunteers will be notified and can arrange pickup."
    },
    {
      question: "Is there any cost to use the platform?",
      answer: "No, NourishLink is completely free for donors, NGOs, and volunteers. Our mission is to reduce food waste and help those in need."
    },
    {
      question: "How are NGOs and volunteers verified?",
      answer: "All NGOs and volunteers go through a verification process including identity verification and background checks to ensure safety and trust in the network."
    },
    {
      question: "What types of food can I donate?",
      answer: "You can donate any surplus food that is safe for consumption, including prepared meals, raw ingredients, packaged goods, and beverages. Please ensure food is not spoiled."
    },
    {
      question: "How quickly will my food be picked up?",
      answer: "Our system matches your donation with nearby NGOs or volunteers instantly. Most pickups happen within hours of listing your donation."
    },
    {
      question: "Can I volunteer to deliver food?",
      answer: "Yes! Register as a volunteer and you'll receive notifications about food donations in your area that need delivery. You can accept deliveries that fit your schedule."
    },
    {
      question: "What if I need to cancel a donation?",
      answer: "You can cancel a donation from your dashboard as long as it hasn't been accepted yet. If it's already been accepted, please contact the NGO or volunteer directly."
    },
    {
      question: "How do I track my donations?",
      answer: "Your donor dashboard shows all your donations with real-time status updates - from listing to pickup to delivery completion."
    }
  ];

  const topics = [
    {
      icon: HeartHandshake,
      title: "Getting Started",
      description: "Learn how to register and start using the platform",
      items: ["Registering as a donor", "Registering as an NGO", "Becoming a volunteer"]
    },
    {
      icon: Clock,
      title: "Donation Process",
      description: "Step-by-step guide to donating food",
      items: ["Listing your donation", "Scheduling pickup", "Tracking delivery"]
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      description: "How we ensure safe food distribution",
      items: ["Verification process", "Food safety guidelines", "Privacy protection"]
    },
    {
      icon: Users,
      title: "For NGOs",
      description: "Resources for NGO partners",
      items: ["Accepting donations", "Managing requests", "Volunteer coordination"]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Help Center</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of NourishLink
          </p>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">Browse by Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition cursor-pointer"
            >
              <topic.icon className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{topic.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{topic.description}</p>
              <ul className="space-y-2">
                {topic.items.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 pt-2">
                  <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-center">
          <MessageSquare className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-4">Still Need Help?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team is here to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-600 font-bold rounded-full text-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center justify-center"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link
              to="/"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white/10 transition inline-flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
