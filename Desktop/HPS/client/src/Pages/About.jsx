// About.js
import React from 'react';

export const About = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-lg mb-4">
        Our hospital is a leading healthcare provider in the region, dedicated to delivering high-quality patient care and exceptional service.
      </p>
      <p className="text-lg mb-4">
        We have a team of experienced and skilled doctors, nurses, and support staff who are committed to providing the best possible care for our patients.
      </p>
      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
      <p className="text-lg mb-4">
        Our mission is to provide compassionate and innovative healthcare that exceeds our patients' expectations.
      </p>
      <h2 className="text-2xl font-bold mb-4">Our Values</h2>
      <ul className="list-disc pl-4 mb-4">
        <li className="text-lg mb-2">Patient-centered care</li>
        <li className="text-lg mb-2">Quality and safety</li>
        <li className="text-lg mb-2">Compassion and empathy</li>
        <li className="text-lg mb-2">Innovation and excellence</li>
      </ul>
    </div>
  );
}
