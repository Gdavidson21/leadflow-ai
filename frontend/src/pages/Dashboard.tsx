import { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

interface DashboardStats {
  total_leads: number;
  total_campaigns: number;
  messages_sent: number;
  conversion_rate: number;
  response_rate: number;
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics/overview');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <p className="stat-value">{stats?.total_leads || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Campaigns</h3>
          <p className="stat-value">{stats?.total_campaigns || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Messages Sent</h3>
          <p className="stat-value">{stats?.messages_sent || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <p className="stat-value">{(stats?.conversion_rate || 0) * 100}%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
