import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../hooks/useDialog';
import Dialog from '../components/Dialog';
import { authService } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    phone: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const dialog = useDialog(false, 5000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(value === formData.password);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      setError('Passwords do not match');
      return;
    }

    try {
      const { user } = await authService.register(
        formData.email,
        formData.password,
        formData.name,
        parseInt(formData.age),
        formData.phone
      );

      console.log(user);
      
      if (!user) {
        throw new Error('Registration failed: No user data received');
      }
      
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed. Please try again.');
      // Clear password fields on error
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-500">
        <div className="flex flex-col justify-center items-center w-full p-12">
          <img
            src="/Madhav-Ayurveda-Logo.png"
            alt="Madhav Ayurved"
            className="h-24 w-24 mb-8"
          />
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Join Madhav Ayurved
          </h1>
          <p className="text-primary-50 text-center text-lg max-w-md">
            Begin your journey towards holistic wellness with traditional Ayurvedic healing.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>

          <Dialog
            isOpen={dialog.isOpen}
            onClose={dialog.closeDialog}
            title={dialog.title}
            message={dialog.message}
            type={dialog.type}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your age"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none
                    ${formData.confirmPassword && !passwordMatch ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'}`}
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none
                    ${formData.confirmPassword && !passwordMatch ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'}`}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <p className="text-red-500 text-sm mt-1 h-4">
                {formData.confirmPassword && !passwordMatch && (
                  "Passwords do not match"
                )}
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium
                  hover:bg-primary-600 hover:shadow-lg
                  active:transform active:scale-[0.98]
                  transition-all duration-200"
              >
                Sign Up
              </button>
            </div>

            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}