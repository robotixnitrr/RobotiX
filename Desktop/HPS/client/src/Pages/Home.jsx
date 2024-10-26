// Home.js
import React from 'react';

export const Home = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Hospital</h1>
      <p className="text-lg text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
      </p>
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-lg font-bold mb-2">Our Mission</h2>
            <p className="text-lg text-gray-600">
              To provide high-quality patient care with compassion and excellence.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-lg font-bold mb-2">Our Values</h2>
            <ul className="list-disc pl-4 mb-4">
              <li className="text-lg text-gray-600">Patient-centered care</li>
              <li className="text-lg text-gray-600">Quality and safety</li>
              <li className="text-lg text-gray-600">Compassion and empathy</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}