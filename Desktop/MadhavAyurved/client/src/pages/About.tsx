import { motion } from 'framer-motion';
import { Heart, Clock, Users, Shield, MapPin, Phone, Mail } from 'lucide-react';
import Meteors from '../components/ui/meteors';
export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 py-12 space-y-16"
    >
      {/* Hero Section */}
      <motion.section
        variants={itemVariants}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          About <span className="text-primary-600">Madhav Ayurved</span>
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Madhav Ayurved is dedicated to providing authentic Ayurvedic healthcare services
          by combining ancient wisdom with modern medical practices. Our mission is to
          promote holistic wellness and help our patients achieve optimal health through
          natural healing methods.
        </p>
      </motion.section>

      {/* Values Section */}
      <motion.section
        variants={containerVariants}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-8"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-8 rounded-xl shadow-md text-center space-y-4 hover:shadow-lg transition-shadow"
        >
          <Heart className="w-12 h-12 text-primary-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">Quality Care</h3>
          <p className="text-gray-600">Committed to providing authentic and effective Ayurvedic treatments</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-8 rounded-xl shadow-md text-center space-y-4 hover:shadow-lg transition-shadow"
        >
          <Clock className="w-12 h-12 text-primary-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">24/7 Availability</h3>
          <p className="text-gray-600">Round-the-clock support for your health and wellness needs</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-8 rounded-xl shadow-md text-center space-y-4 hover:shadow-lg transition-shadow"
        >
          <Users className="w-12 h-12 text-primary-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">Expert Team</h3>
          <p className="text-gray-600">Experienced Vaidyas and healthcare professionals at your service</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-8 rounded-xl shadow-md text-center space-y-4 hover:shadow-lg transition-shadow"
        >
          <Shield className="w-12 h-12 text-primary-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">Patient Privacy</h3>
          <p className="text-gray-600">Your health information is safe and secure with us</p>
        </motion.div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-12 rounded-2xl"
      >
        <div className="relative bg-primary-500 text-white overflow-hidden">
          <div className="relative flex h-[200px] w-full flex-col items-center justify-center">
            <Meteors number={20} />

            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              <p className="text-lg leading-relaxed opacity-90 text-white">
                To revolutionize healthcare by making authentic Ayurvedic treatments accessible
                to everyone. We strive to bridge the gap between ancient wisdom and modern
                healthcare needs, providing a holistic approach to wellness that treats not
                just the symptoms, but the root cause of health issues.
              </p>
            </div>

          </div>
        </div>
      </motion.section>
      {/* Contact Section */}
      <motion.section
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        <motion.div
          variants={itemVariants}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
          <p className="text-gray-600 text-lg">
            Have questions about our services? Our team is here to help you on your
            journey to wellness.
          </p>
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-4"
            >
              <div className="bg-primary-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">123 Ayurveda Street, Wellness District, 12345</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-4"
            >
              <div className="bg-primary-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">(+91) 123-4567-89</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-4"
            >
              <div className="bg-primary-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">info@madhavayurved.com</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14875.552164028377!2d81.5852127!3d21.2362878!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28df003d3afdb7%3A0x62e404df900def55!2sShree%20Madhavansh%20Ayurved%20Chikitshayala%20Evam%20Punchkarm%20Kendra!5e0!3m2!1sen!2sin!4v1733484152697!5m2!1sen!2sin"
            className="w-full h-[400px] rounded-lg"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}