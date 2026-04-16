import { Link } from 'react-router-dom';
import { FiHome, FiUsers, FiTarget, FiBarChart2, FiSearch } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Leadflow AI</h1>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/" className="nav-link">
            <FiHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/discovery" className="nav-link">
            <FiSearch /> Discovery
          </Link>
        </li>
        <li>
          <Link to="/leads" className="nav-link">
            <FiUsers /> Leads
          </Link>
        </li>
        <li>
          <Link to="/campaigns" className="nav-link">
            <FiTarget /> Campaigns
          </Link>
        </li>
        <li>
          <Link to="/analytics" className="nav-link">
            <FiBarChart2 /> Analytics
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
