import { MapPin, Phone, Mail, Facebook, X, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
const footerLinks = {
  quickLinks: [
    { name: 'Find a Doctor', path: '/doctors' },
    { name: 'Book Appointment', path: '/appointments' },
    { name: 'Health Events', path: '/events' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ],
  services: [
    { name: 'Panchakarma', path: '/services/panchakarma' },
    { name: 'Consultation', path: '/services/consultation' }, 
    { name: 'Ayurvedic Medicine', path: '/services/medicine' },
    { name: 'Yoga & Meditation', path: '/services/yoga' }
  ],
  contact: {
    address: '123 Ayurveda Street, Wellness City, WC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@madhavayurved.com'
  },
  socials: [
    { icon: Facebook, link: 'https://facebook.com' },
    { icon: X, link: 'https://twitter.com' }, 
    { icon: Instagram, link: 'https://instagram.com' },
    { icon: Linkedin, link: 'https://linkedin.com' }
  ]
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const renderFooterSection = (title: string, items: any[]) => (
    <div className="relative">
      <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white after:content-[''] after:block after:w-12 after:h-1 after:bg-accent-100 after:mt-2">
        {title}
      </h3>
      <ul className="flex flex-col space-y-2 md:space-y-3">
        {items.map((item, index) => (
          <li key={index}>
            <Link 
              to={item.path} 
              className="py-1 text-sm md:text-base text-gray-300 hover:text-accent-100 transition-colors duration-300 flex items-center group"
            >
              <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderContactInfo = () => (
    <div>
      <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white after:content-[''] after:block after:w-12 after:h-1 after:bg-accent-100 after:mt-2">
        Contact Us
      </h3>
      <ul className="space-y-3 md:space-y-4">
        <li className="flex items-start space-x-3 md:space-x-4 group">
          <div className="p-2 md:p-3 rounded-full bg-primary-400 group-hover:bg-accent-100 transition-colors duration-300 mt-1">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-sm md:text-base text-gray-300 flex-1">{footerLinks.contact.address}</span>
        </li>
        <li className="flex items-center space-x-3 md:space-x-4 group">
          <div className="p-2 md:p-3 rounded-full bg-primary-400 group-hover:bg-accent-100 transition-colors duration-300">
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-sm md:text-base text-gray-300">{footerLinks.contact.phone}</span>
        </li>
        <li className="flex items-center space-x-3 md:space-x-4 group">
          <div className="p-2 md:p-3 rounded-full bg-primary-400 group-hover:bg-accent-100 transition-colors duration-300">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-sm md:text-base text-gray-300">{footerLinks.contact.email}</span>
        </li>
      </ul>
    </div>
  );

  return (
    <footer className="bg-gradient-to-br from-primary-600 to-primary-700 text-white relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3">
              <img src="/Madhav-Ayurveda-Logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
              <span className="text-xl md:text-2xl font-bold text-white">Madhav Ayurved</span>
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Bringing ancient healing wisdom to modern healthcare through holistic Ayurvedic treatments.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              {footerLinks.socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="p-2 md:p-3 rounded-full bg-primary-400 hover:bg-accent-100 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {renderFooterSection('Quick Links', footerLinks.quickLinks)}
          {renderFooterSection('Our Services', footerLinks.services)}
          {renderContactInfo()}
        </div>

        <div className="border-t border-gray-200/10 mt-8 md:mt-16 pt-6 md:pt-8 text-center">
          <p className="text-sm md:text-base text-gray-400">
            &copy; {currentYear} Madhav Ayurved. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 