import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { consultationService } from '../services/consultationService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { ConsultationDetails } from "../components/ConsultationDetails";

interface Appointment {
  _id: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  consultationType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;
  amount: number;
}

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Appointment | null>(null);

  useEffect(() => {
    if (user?._id) {
      fetchAppointments(user._id);
    }
  }, [user?._id]);

  const fetchAppointments = async (userId: string) => {
    try {
      const response = await consultationService.getMyConsultations(userId);
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getFilteredAppointments = (status?: string) => {
    if (!status || status === 'all') return appointments;
    return appointments.filter(appointment => appointment.status === status);
  };

  const getStats = () => {
    return {
      upcoming: appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length,
      completed: appointments.filter(a => a.status === 'completed').length,
      totalAmount: appointments.reduce((sum, a) => sum + a.amount, 0)
    };
  };

  const stats = getStats();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="mt-2 text-gray-600">Manage and track your consultations</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-semibold text-gray-900">₹{stats.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="p-6">
                <div className="space-y-4">
                  {getFilteredAppointments(activeTab).map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.doctorName || `Doctor ID: ${appointment.doctorId}`}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.consultationType}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(appointment.date), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {appointment.timeSlot}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={`${getStatusColor(appointment.status)} capitalize`}>
                          {appointment.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedConsultation(appointment)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}

                  {getFilteredAppointments(activeTab).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No appointments found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Important Notice</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Please arrive 15 minutes before your scheduled appointment time. If you need to cancel or reschedule, 
                  please do so at least 24 hours in advance.
                </p>
              </div>
            </div>
          </div>

          {selectedConsultation && (
            <ConsultationDetails
              isOpen={!!selectedConsultation}
              onClose={() => setSelectedConsultation(null)}
              consultation={selectedConsultation}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}