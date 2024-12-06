import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
        const { user } = await authService.login(email, password);
        if (!user) {
            throw new Error('Login failed: No user data received');
        }
        setUser(user);
        navigate('/');
    } catch (err) {
        setError(typeof err === 'string' ? err : 'Login failed. Please check your credentials.');
        setPassword('');
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
            Welcome to Madhav Ayurved
          </h1>
          <p className="text-primary-50 text-center text-lg max-w-md">
            Experience the perfect blend of ancient Ayurvedic wisdom and modern healthcare practices.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium
                  transition-all duration-200 
                  hover:bg-primary-600 hover:shadow-lg
                  active:transform active:scale-[0.98]"
              >
                Sign in
              </button>
            </div>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}