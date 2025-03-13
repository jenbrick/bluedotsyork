import Link from "next/link";
import Breadcrumb from '../components/Breadcrumb'; 
import "./alerts.css"; // External CSS for styling

export default function AlertsPage() {
  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      <Breadcrumb />
      <br />
      <h1>Alerts on Authoritarianism</h1>
      <p>Stay informed about threats to democracy, authoritarian movements, and policies that undermine democratic institutions.</p>

      {/* Authoritarian Policy Trackers */}
      <section>
        <h2>🛑 Authoritarian Policy Trackers</h2>
        <ul>
          <li>
            <Link href="https://www.project2025.org/" target="_blank" rel="noopener noreferrer">
              Project 2025 Tracker
            </Link> – Monitors efforts to reshape federal government with authoritarian-leaning policies.
          </li>
          <li>
            <Link href="https://www.brennancenter.org/our-work/research-reports/democracy-agenda" target="_blank" rel="noopener noreferrer">
              Rights & Democracy Tracker
            </Link> – Tracks voting rights restrictions and democratic backsliding.
          </li>
          <li>
            <Link href="https://www.v-dem.net/" target="_blank" rel="noopener noreferrer">
              Authoritarianism Index
            </Link> – Global ranking of democracy declines and authoritarian trends.
          </li>
        </ul>
      </section>

      {/* Legal & Voting Rights Organizations */}
      <section>
        <h2>⚖️ Legal & Voting Rights Organizations</h2>
        <ul>
          <li>
            <Link href="https://www.aclu.org/issues/voting-rights/democracy" target="_blank" rel="noopener noreferrer">
              ACLU - Democracy Watch
            </Link> – Covers voting rights, election integrity, and civil liberties threats.
          </li>
          <li>
            <Link href="https://www.commoncause.org/" target="_blank" rel="noopener noreferrer">
              Common Cause
            </Link> – Advocates for open democracy and fights political corruption.
          </li>
          <li>
            <Link href="https://www.lwv.org/" target="_blank" rel="noopener noreferrer">
              League of Women Voters
            </Link> – Provides resources on fair elections and government transparency.
          </li>
        </ul>
      </section>

      {/* Misinformation & Media Freedom */}
      <section>
        <h2>📡 Misinformation & Media Freedom</h2>
        <ul>
          <li>
            <Link href="https://www.mediamatters.org/" target="_blank" rel="noopener noreferrer">
              Media Matters
            </Link> – Tracks disinformation campaigns threatening democracy.
          </li>
          <li>
            <Link href="https://freedomhouse.org/" target="_blank" rel="noopener noreferrer">
              Freedom House
            </Link> – Reports on democratic backsliding and press freedom threats worldwide.
          </li>
          <li>
            <Link href="https://pen.org/report/authoritarian-playbook/" target="_blank" rel="noopener noreferrer">
              PEN America - Authoritarian Playbook
            </Link> – Analyzes how authoritarian movements suppress free speech.
          </li>
        </ul>
      </section>

      {/* Election & Government Watchdogs */}
      <section>
        <h2>🗳️ Election & Government Watchdogs</h2>
        <ul>
          <li>
            <Link href="https://protectdemocracy.org/" target="_blank" rel="noopener noreferrer">
              Protect Democracy
            </Link> – A nonpartisan group working to stop democratic erosion in the U.S.
          </li>
          <li>
            <Link href="https://ballotpedia.org/Election_legislation_tracking" target="_blank" rel="noopener noreferrer">
              Ballotpedia - Election Integrity
            </Link> – Tracks state and federal election laws.
          </li>
          <li>
            <Link href="https://statesuniteddemocracy.org/" target="_blank" rel="noopener noreferrer">
              States United Democracy Center
            </Link> – Focuses on legal efforts to counter election interference.
          </li>
        </ul>
      </section>
    </div>
  );
}
