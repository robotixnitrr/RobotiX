// Contact.js
import React from 'react';

export const Contact = () => {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
      <p className="text-lg text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
      </p>
      <ul className="list-none mb-4">
        <li className="mb-2">
          <i className="fas fa-map-marker-alt mr-2" />
          123 Main St, Anytown, USA
        </li>
        <li className="mb-2">
          <i className="fas fa-phone mr-2" />
          555-555-5555
        </li>
        <li className="mb-2">
          <i className="fas fa-envelope mr-2" />
          <a href="mailto:info@example.com">info@example.com</a>
        </li>
      </ul>
    </div>
  );
}
