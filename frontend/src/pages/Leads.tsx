import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Leads.css';

interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  status: string;
  created_at: string;
}

function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads');
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return <div className="leads-loading">Loading leads...</div>;
  }

  return (
    <div className="leads-container">
      <div className="leads-header">
        <h1>Leads</h1>
        <button 
          className="btn btn-discover"
          onClick={() => navigate('/discovery')}
        >
          🔍 Discover Leads Automatically
        </button>
      </div>
      
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.first_name} {lead.last_name}</td>
              <td>{lead.email}</td>
              <td>{lead.company || '-'}</td>
              <td><span className={`status ${lead.status}`}>{lead.status}</span></td>
              <td>{new Date(lead.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leads;
