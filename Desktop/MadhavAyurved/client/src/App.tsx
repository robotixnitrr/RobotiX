import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import About from './pages/About';
import ScrollToTop from './components/ScrollToTop';
import BookConsultation from './pages/BookConsultation';
import ScrollToTopButton from './components/ScrollToTopButton';
import FloatingConsultButton from './components/FloatingConsultButton';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-surface-50">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/about" element={<About />} />
                <Route path="/book-consultation" element={<BookConsultation />} />
              </Routes>
            </AnimatePresence>
          </main>
          <FloatingConsultButton />
          <ScrollToTopButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;