// client/src/pages/BookConsultation.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Calendar } from '../components/ui/calendar';
import { Clock, User, CalendarDays, Stethoscope, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import doctorsData from '../doctors.json';
import { consultationService } from '../services/consultationService';
import { toast } from 'react-hot-toast';
import { ConsultationData } from '../api/consultationApi';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/apiErrorHandler';

export default function BookConsultation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (!date) {
            toast.error('Please select a date');
            return;
        }

        await consultationService.createConsultation({
            doctorId: selectedDoctor,
            consultationType: consultationType as ConsultationData['consultationType'],
            date: date,
            timeSlot,
            symptoms
        });
        
        toast.success('Consultation booked successfully!');
        navigate('/appointments');  // Redirect to appointments page
    } catch (error) {
        toast.error(getErrorMessage(error));
        console.error('Booking error:', error);
    }
  };

  const timeSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    ];

  const consultationTypes = [
    'General Consultation',
    'Follow-up',
    'Specific Treatment',
    'Emergency'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <div className="bg-primary-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white">Book Your Consultation</h1>
          <p className="text-center mt-2 text-primary-100 max-w-2xl mx-auto">
            Schedule your appointment with our experienced Ayurvedic practitioners
          </p>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold">Patient Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input value={user?.name || ''} disabled className="bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <Input value={user?._id || ''} disabled className="bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Consultation Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold">Consultation Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <Select onValueChange={setConsultationType} value={consultationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorsData.doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold">Schedule</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="border rounded-lg p-3">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md"
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <Select onValueChange={setTimeSlot} value={timeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-sm text-gray-500">
                    Available slots are shown based on doctor's schedule
                  </p>
                </div>
              </div>
            </div>

            {/* Symptoms Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold">Symptoms</h2>
              </div>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe your symptoms or reason for consultation..."
                className="h-32"
              />
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Important Notes:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Your preferred doctor may not be available in the selected time slot.</li>
                <li>We will confirm the appointment and send details to your email.</li>
                <li>Please arrive 15 minutes before your scheduled appointment time.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={!date || !timeSlot || !consultationType || !symptoms || !selectedDoctor}
            >
              Confirm Booking
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}