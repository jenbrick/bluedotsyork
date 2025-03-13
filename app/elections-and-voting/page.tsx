import Link from "next/link";
import Breadcrumb from '../components/Breadcrumb'; // Adjust the path as necessary
import "./electionsvoting.css"; // Importing an external CSS file for styling

export default function ElectionsPage() {
  return (
    <div className="container">
      {/* Add Breadcrumb */}
      <Breadcrumb />
      <br />
      <h1>Elections & Voting Information</h1>

      {/* Voting Resources Section */}
      <section>
        <h2>Elections, Elected Officials, and Voting Resources</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                name: "York County Directory of Public Officials (2025)",
                url: "https://yorkcountypa.gov/503/Elections-Voter-Registration",
                description: "A comprehensive resource detailing contact information for elected and appointed officials across the county. This directory encompasses officials from various levels of government, including federal, state, county, and municipal positions.",
                },
                {
                  name: "Elections & Voter Registration (York County, PA)",
                  url: "https://yorkcountypa.gov/503/Elections-Voter-Registration",
                  description: "Information on voter registration, polling places, and election procedures in York County, PA.",
                },
                {
                    name: "Candidates running in Upcoming Elections",
                    url: "https://www.pavoterservices.pa.gov/electioninfo/ElectionInfo.aspx",
                    description: "For a broader view of candidates running in upcoming elections, the Pennsylvania Department of State's Voter Services offers updated candidate lists and election information.",
                },
                {
                    name: "Elected Officials (State & Federal)",
                    url: "https://www.yceapa.org/advocacy/elected-officials/",
                    description: "Find contact details for your elected representatives at the state and federal levels.",
                },
                {
                  name: "Check Your Voter Registration",
                  url: "https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx",
                  description: "Verify if you are registered to vote and check the accuracy of your voter details.",
                },
                {
                  name: "Vote by Mail Info",
                  url: "https://www.pa.gov/agencies/vote/voter-support/mail-in-and-absentee-ballot.html",
                  description: "Learn how to request and submit mail-in and absentee ballots in Pennsylvania.",
                },
              ].map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </Link>
                  </td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming Elections Section */}
      <section>
        <h2>Upcoming Elections</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Election</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Coming Soon",
                  url: "",
                  description: "Find details on state and local elections, including candidates and voting locations.",
                },
              ].map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </Link>
                  </td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
