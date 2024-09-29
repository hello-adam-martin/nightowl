import React from 'react';
import Image from 'next/image'; // Import the Image component

const MaintenanceMode: React.FC = () => {
  return (
    <html lang="en">
      <body className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center text-center"> {/* Added flex and items-center */}
          <Image 
            src="/NightOwl.png" // Update with the path to your logo
            alt="Night Owl Logo"
            width={150} // Set the desired width
            height={150} // Set the desired height
            className="mb-4" // Add margin below the logo
          />
          <h1 className="text-4xl font-bold mb-4">We&apos;ll Be Back Soon!</h1>
          <p className="text-lg text-gray-600">
            Our service is currently undergoing maintenance. Please check back later.
          </p>
        </div>
      </body>
    </html>
  );
};

export default MaintenanceMode;