import { useState, useEffect } from 'react';
import '../styles/LeadDiscovery.css';

interface DiscoveryCriteria {
  industry?: string;
  keywords?: string[];
  location?: string;
  companySize?: 'small' | 'medium' | 'large';
  limit?: number;
}

interface DiscoveryConfig {
  id: string;
  name: string;
  criteria: DiscoveryCriteria;
  is_active: boolean;
  run_frequency?: number;
  created_at: string;
}

interface DiscoveryResult {
  created: number;
  skipped: number;
  leads: any[];
  message: string;
}

function LeadDiscovery() {
  const [configs, setConfigs] = useState<DiscoveryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<DiscoveryResult | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    keywords: '',
    location: '',
    companySize: '' as '' | 'small' | 'medium' | 'large',
    limit: 10,
    is_active: true,
    run_frequency: 24,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/discovery/configs');
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error('Error fetching discovery configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required field
    if (!formData.name.trim()) {
      alert('Configuration name is required');
      return;
    }

    const keywords = formData.keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const criteria: DiscoveryCriteria = {
      industry: formData.industry || undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      location: formData.location || undefined,
      companySize: formData.companySize === '' ? undefined : formData.companySize,
      limit: formData.limit,
    };

    try {
      console.log('Creating discovery config:', { name: formData.name, criteria });
      const response = await fetch('/api/discovery/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          criteria,
          is_active: formData.is_active,
          run_frequency: formData.run_frequency,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Configuration created successfully');
        await fetchConfigs();
        setShowForm(false);
        setFormData({
          name: '',
          industry: '',
          keywords: '',
          location: '',
          companySize: '',
          limit: 10,
          is_active: true,
          run_frequency: 24,
        });
        alert('Configuration created successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to create configuration'}`);
      }
    } catch (error) {
      console.error('Error creating discovery config:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create configuration'}`);
    }
  };

  const handleDiscoverNow = async (config: DiscoveryConfig) => {
    try {
      setDiscovering(true);
      const response = await fetch('/api/discovery/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.criteria),
      });

      if (response.ok) {
        const data: DiscoveryResult = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Error discovering leads:', error);
    } finally {
      setDiscovering(false);
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        const response = await fetch(`/api/discovery/configs/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchConfigs();
        }
      } catch (error) {
        console.error('Error deleting discovery config:', error);
      }
    }
  };

  const handleToggleActive = async (config: DiscoveryConfig) => {
    try {
      const response = await fetch(`/api/discovery/configs/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: !config.is_active,
        }),
      });

      if (response.ok) {
        await fetchConfigs();
      }
    } catch (error) {
      console.error('Error updating discovery config:', error);
    }
  };

  if (loading) {
    return <div className="discovery-loading">Loading discovery configs...</div>;
  }

  return (
    <div className="discovery-container">
      <div className="discovery-header">
        <h1>Lead Discovery</h1>
        <p className="discovery-subtitle">Automatically find and add new leads to your database</p>
      </div>

      {/* Discovery Result */}
      {result && (
        <div className="discovery-result">
          <div className="result-header">
            <h2>Discovery Result</h2>
            <button
              className="close-btn"
              onClick={() => setResult(null)}
            >
              ✕
            </button>
          </div>
          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-label">Created</span>
              <span className="stat-value created">{result.created}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Skipped</span>
              <span className="stat-value skipped">{result.skipped}</span>
            </div>
          </div>
          {result.leads.length > 0 && (
            <div className="created-leads">
              <h3>Newly Created Leads</h3>
              <ul className="leads-list">
                {result.leads.slice(0, 5).map((lead) => (
                  <li key={lead.id}>
                    <strong>{lead.first_name} {lead.last_name}</strong>
                    <span>{lead.email}</span>
                    {lead.company && <span className="company">{lead.company}</span>}
                  </li>
                ))}
              </ul>
              {result.leads.length > 5 && (
                <p className="more-leads">+ {result.leads.length - 5} more leads</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Config Form */}
      {showForm && (
        <div className="discovery-form-wrapper">
          <form className="discovery-form" onSubmit={handleCreateConfig}>
            <div className="form-header">
              <h2>Create Discovery Configuration</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Configuration Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Tech Companies in California"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., Technology, Finance"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., United States, California"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company Size</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                >
                  <option value="">Any</option>
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (50-500)</option>
                  <option value="large">Large (500+)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Leads per Discovery</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Keywords (comma-separated)</label>
              <textarea
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="e.g., AI, Machine Learning, Data Science"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_active">Automatically run this discovery</label>
              </div>

              <div className="form-group">
                <label>Run Frequency (hours)</label>
                <input
                  type="number"
                  name="run_frequency"
                  value={formData.run_frequency}
                  onChange={handleInputChange}
                  min="1"
                  max="720"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Configuration
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      <div className="discovery-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={discovering}
        >
          + New Discovery Configuration
        </button>
      </div>

      {/* Configurations List */}
      <div className="configs-section">
        <h2>Active Discoveries</h2>
        {configs.length === 0 ? (
          <div className="empty-state">
            <p>No discovery configurations yet.</p>
            <p>Create one to start finding leads automatically!</p>
          </div>
        ) : (
          <div className="configs-grid">
            {configs.map((config) => (
              <div key={config.id} className={`config-card ${!config.is_active ? 'inactive' : ''}`}>
                <div className="card-header">
                  <h3>{config.name}</h3>
                  <div className="card-actions">
                    <button
                      className={`toggle-btn ${config.is_active ? 'active' : ''}`}
                      onClick={() => handleToggleActive(config)}
                      title={config.is_active ? 'Disable' : 'Enable'}
                    >
                      {config.is_active ? '●' : '○'}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteConfig(config.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="card-details">
                  {config.criteria.industry && (
                    <p><strong>Industry:</strong> {config.criteria.industry}</p>
                  )}
                  {config.criteria.keywords && config.criteria.keywords.length > 0 && (
                    <p><strong>Keywords:</strong> {config.criteria.keywords.join(', ')}</p>
                  )}
                  {config.criteria.location && (
                    <p><strong>Location:</strong> {config.criteria.location}</p>
                  )}
                  {config.criteria.companySize && (
                    <p><strong>Company Size:</strong> {config.criteria.companySize}</p>
                  )}
                  <p><strong>Leads per run:</strong> {config.criteria.limit || 10}</p>
                </div>

                <button
                  className="btn btn-secondary discover-now"
                  onClick={() => handleDiscoverNow(config)}
                  disabled={discovering}
                >
                  {discovering ? 'Discovering...' : 'Discover Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadDiscovery;
