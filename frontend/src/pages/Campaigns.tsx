import { useEffect, useState } from 'react';
import '../styles/Campaigns.css';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  sends_per_day: number;
  created_at: string;
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="campaigns-loading">Loading campaigns...</div>;
  }

  return (
    <div className="campaigns-container">
      <h1>Campaigns</h1>
      <button className="btn-primary">Create Campaign</button>
      <div className="campaigns-grid">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <h3>{campaign.name}</h3>
            <p>{campaign.description}</p>
            <div className="campaign-details">
              <span className={`status ${campaign.status}`}>{campaign.status}</span>
              <span className="sends-per-day">{campaign.sends_per_day} /day</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Campaigns;
