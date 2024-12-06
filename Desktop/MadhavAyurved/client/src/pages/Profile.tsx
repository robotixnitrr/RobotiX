import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Please login to view your profile</h2>
          <p className="mt-2 text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-full">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(!isEditing);
                  toast.success('Edit functionality coming soon!');
                }}
              >
                Edit Profile
              </Button>
            </div>

            <div className="grid gap-6">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>

              {/* Age */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-gray-900">{user.age} years</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>

              {/* ID */}
              <div className="flex items-center gap-3">
                <IdCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-900 font-mono text-sm">{user._id}</p>
                </div>
              </div>
            </div>

            {/* Additional Information Notice */}
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                To update your profile information, please contact support. We ensure your data is kept secure and private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}