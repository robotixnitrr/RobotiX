import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import {Home} from './pages/Home';
import {About} from './pages/About';
import {Doctors} from './pages/Doctors';
import {Appointments} from './pages/Appointments';
import {Contact} from './pages/Contact';
import {Navbar} from './Components/Navbar';
// import Departments from './pages/Departments';
// import Services from './pages/Services';
// import PatientsAndVisitors from './pages/PatientsAndVisitors';
// import NewsAndEvents from './pages/NewsAndEvents';
// import Careers from './pages/Careers';

function App() {

  return (
    <>
      <Router >
        <Navbar />
        <main className="pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Doctors" element={<Doctors />} />
            <Route path="/book-appointment" element={<Appointments />} />
            {/* <Route path="/sign-up" element={<Signup />} />
          <Route path="/log-in" element={<Login />} /> */}
          </Routes>
        </main>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;