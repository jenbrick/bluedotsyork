// app/home/page.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <div className="blue-dots-welcome flex-center">
        <h1>Welcome to Blue Dots of York County</h1>
        <br></br>
        <h2>Visit the <a href="/business-directory">Business/Organization Directory</a></h2>
        <br></br>
        <h2>More curated resources (books, podcasts, education, events, etc.) are coming soon...</h2>
      </div>
    </div>
  );
};

export default HomePage;
