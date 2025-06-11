import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Phone, Clock, Star, Shield, Heart, Award } from 'lucide-react';
import AnimatedStat from '../components/AnimatedStat';
import { WhatweCard } from '../components/WhatweCard';
import ShimmerButton from '../components/ui/shimmer-button';


export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        className=""
      >
        {/* Hero Section */}
        <motion.section
          className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12 md:py-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              className="space-y-4 md:space-y-6 text-center md:text-left"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Your Journey to Wellness Begins Here
              </h1>
              <p className="text-lg md:text-xl text-primary-50 max-w-xl mx-auto md:mx-0">
                Experience the perfect blend of ancient Ayurvedic wisdom and modern healthcare practices and improve health outcomes for your life and family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/book-consultation">
                  <ShimmerButton
                    className="text-black font-semibold text-center hover:scale-105 transition-all"
                  >
                    Book Consultation
                  </ShimmerButton>
                </a>
                <Link
                  to="/about"
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Hide image on mobile, show on md and up */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/about-us.jpg"
                alt="Ayurvedic Treatment"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="max-w-7xl mx-auto px-4 my-16"
          variants={staggerChildren}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value={1000} label="Happy Patients" />
            <AnimatedStat value={20} label="Expert Doctors" />
            <AnimatedStat value={15} label="Years Experience" />
            <AnimatedStat value={50} label="Treatments" />
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          className="max-w-7xl mx-auto px-4 my-16"
          variants={staggerChildren}
        >
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book appointments online anytime</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Vaidyas</h3>
              <p className="text-gray-600">Experienced Ayurvedic practitioners</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <Phone className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here when you need us</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <Clock className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Holistic Care</h3>
              <p className="text-gray-600">Complete wellness solutions</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Rest of the components remain the same */}
        {/* Testimonials */}
        <motion.section
          className="bg-gray-50 py-16"
          variants={fadeIn}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The Ayurvedic treatment I received here was transformative. The doctors are knowledgeable and caring."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">Patient Name</p>
                      <p className="text-sm text-gray-500">Treated for: Stress Management</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>


        {/* CTA Section */}
        <motion.section
          className="bg-primary-500 text-white py-16 mt-16"
          variants={fadeIn}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Start Your Wellness Journey Today</h2>
            <p className="text-xl mb-8">Book your consultation and experience the power of Ayurveda</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              Schedule Appointment
            </motion.button>
          </div>
        </motion.section>

        <div className="bg-[#eef7f7] mt-0 py-16">
          <WhatweCard />
        </div>

      </motion.div>
    </>
  );
}