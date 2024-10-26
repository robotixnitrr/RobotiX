// Doctor.js
import React from 'react';

export const Doctors = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold mb-4">Meet Our Doctors</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white rounded shadow-md p-4">
            <img src="https://via.placeholder.com/150" alt="Doctor 1" className="w-full h-48 object-cover mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dr. John Doe</h2>
            <p className="text-lg mb-4">Cardiologist</p>
            <p className="text-lg mb-4">Dr. Doe is a board-certified cardiologist with over 10 years of experience.</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white rounded shadow-md p-4">
            <img src="https://via.placeholder.com/150" alt="Doctor 2" className="w-full h-48 object-cover mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dr. Jane Smith</h2>
            <p className="text-lg mb-4">Oncologist</p>
            <p className="text-lg mb-4">Dr. Smith is a board-certified oncologist with over 15 years of experience.</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white rounded shadow-md p-4">
            <img src="https://via.placeholder.com/150" alt="Doctor 3" className="w-full h-48 object-cover mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dr. Bob Johnson</h2>
            <p className="text-lg mb-4">Neurologist</p>
            <p className="text-lg mb-4">Dr. Johnson is a board-certified neurologist with over 20 years of experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
