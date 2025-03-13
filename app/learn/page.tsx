import React from "react";
import Link from "next/link";
import Breadcrumb from '../components/Breadcrumb'; // Adjust path as necessary
import "./learn.css"; // Import the CSS file

const topics = [
  {
    title: "Power, Strategy & Influence",
    description:
      "Explore books and case studies on power dynamics, political strategy, and historical authoritarian movements.",
    image: "/images/power-strategy.jpg",
    link: "/resources/power-strategy",
  },
  {
    title: "The Psychology of Authoritarianism",
    description:
      "Learn about cognitive biases, propaganda, and the psychology of authoritarian followers and leaders.",
    image: "/images/psychology.jpg",
    link: "/resources/psychology-authoritarianism",
  },
  {
    title: "How to Talk to the Opposition",
    description:
      "Techniques to de-escalate conflict, bridge divides, and counter misinformation effectively.",
    image: "/images/conversation.jpg",
    link: "/resources/talking-to-opposition",
  },
  {
    title: "Media Literacy & Disinformation",
    description:
      "Learn how to spot fake news, understand propaganda tactics, and verify sources.",
    image: "/images/media-literacy.jpg",
    link: "/resources/media-literacy",
  },
  {
    title: "Activism & Community Organizing",
    description:
      "Strategies for grassroots movements, defending democracy, and effective advocacy.",
    image: "/images/activism.jpg",
    link: "/resources/activism",
  },
];

const Page = () => {
  return (
    <div className="container">
              {/* Breadcrumb Navigation */}
      <Breadcrumb />
      <br />
      <h1 className="title">Power, Strategy & Influence</h1>
      <p className="subtitle">
        Learn about rising authoritarianism, political strategy, and effective
        resistance.
      </p>
      <div className="grid">
        {topics.map((topic, index) => (
          <Link key={index} href={topic.link} className="card">
            <img src={topic.image} alt={topic.title} className="image" />
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
