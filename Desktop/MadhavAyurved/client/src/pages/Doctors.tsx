import { motion } from 'framer-motion';
import doctorsData from '../doctors.json';
import { Link } from 'react-router-dom';

export default function Doctors() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Our Expert Practitioners</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctorsData.doctors.map((doctor) => (
          <motion.div 
            key={doctor.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative h-64">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-primary-600 font-medium">{doctor.specialization}</p>
              <p className="text-gray-600 mt-2">{doctor.experience} years experience</p>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">Expertise:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {doctor.expertise.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <Link 
                to="/book-consultation" 
                className="mt-6 block w-full bg-primary-500 text-white text-center py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Treatment Images Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Our Treatments & Facilities</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img 
              src="/treatment-1.jpg" 
              alt="Ayurvedic Massage Treatment" 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold">Traditional Ayurvedic Therapies</h4>
              <p className="text-gray-600">Expert therapeutic treatments for holistic healing</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img 
              src="/treatment-2.jpg" 
              alt="Herbal Medicine Preparation" 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold">Herbal Medicine Preparation</h4>
              <p className="text-gray-600">Traditional herbs and modern preparation techniques</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}