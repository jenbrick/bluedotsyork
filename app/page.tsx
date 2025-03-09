// File: app/home/page.tsx
import React from "react";
import Image from "next/image"; // Import Next.js Image component
//import Breadcrumb from "./components/Breadcrumb"; // Adjust as needed
import "./home.css"; // Custom CSS file

// Clickable Card Component with Fixed Image Layout
const ClickableCard = ({ title, description, link, image }: { title: string; description: string; link: string; image: string }) => (
  <a href={link} className="card-link">
    <div className="hybrid-card">
      <h3>{title}</h3>
      <div className="card-image-container">
        <Image src={image} alt={title} width={300} height={200} layout="intrinsic" className="card-image" />
      </div>
      <p>{description}</p>
    </div>
  </a>
);

const HomePage: React.FC = () => {
  return (
    <div className="container">


      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome to Blue Dots of York County</h1>
        <p>
          Visit the <a href="/business-directory">Business/Organization Directory</a>
        </p>
        <p>More curated resources (books, podcasts, education, events, etc.) coming soon...</p>
      </div>

      {/* Card Section */}
      <div className="card-container">
        <ClickableCard title="Events" description="Stay informed about upcoming community events and gatherings." link="/events" image="/images/upcoming-events.jpg" />
        <ClickableCard title="School Board Information" description="Learn about school board members, policies, and upcoming meetings." link="/school-board" image="/images/school-board.jpg" />
        <ClickableCard title="Elections & Voting Info" description="Get the latest details on local elections, candidates, and voting procedures." link="/elections" image="/images/voting.jpg" />
        <ClickableCard title="Placeholder 1" description="More content coming soon." link="#" image="/images/placeholder1.jpg" />
        <ClickableCard title="Placeholder 2" description="More content coming soon." link="#" image="/images/placeholder2.jpg" />
        <ClickableCard title="Placeholder 3" description="More content coming soon." link="#" image="/images/placeholder3.jpg" />
      </div>
    </div>
  );
};

export default HomePage;
