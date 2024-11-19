// File: app/home/page.tsx
import React from 'react';
import Breadcrumb from './components/Breadcrumb'; // Adjust the path as necessary

const HomePage: React.FC = () => {
  return (
    <div className="container">
      {/* Add Breadcrumb */}
      <Breadcrumb />
      
      <div className="blue-dots-welcome flex-center">
        <h1>Welcome to Blue Dots of York County</h1>
        <br />
        <h2>
          Visit the <a href="/business-directory">Business/Organization Directory</a>
        </h2>
        <br />
        <h2>
          More curated resources (books, podcasts, education, events, etc.) are coming soon...
        </h2>
      </div>
    </div>
  );
};

export default HomePage;
