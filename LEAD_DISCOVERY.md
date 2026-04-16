# Lead Discovery Feature Documentation

## Overview

The Lead Discovery feature enables automatic finding and creation of new leads from external data sources. This feature helps you grow your lead database efficiently without manual data entry.

## Features

- **Automatic Lead Finding**: Search for leads based on criteria like industry, keywords, location, and company size
- **Scheduled Discovery**: Set up automated discovery jobs to run on a schedule
- **Batch Processing**: Process multiple leads at once with deduplication
- **Configuration Management**: Create and manage multiple discovery configurations
- **Real-time Results**: See immediate feedback on discovered and created leads

## How to Use

### 1. Access the Discovery Page

Navigate to the **Discovery** section from the main navigation menu, or click "🔍 Discover Leads Automatically" from the Leads page.

### 2. Create a Discovery Configuration

1. Click **"+ New Discovery Configuration"** button
2. Fill in the configuration details:
   - **Configuration Name**: Give your discovery configuration a meaningful name
   - **Industry**: Filter by industry (optional)
   - **Keywords**: Enter keywords separated by commas to search for leads
   - **Location**: Specify geographic location (optional)
   - **Company Size**: Select target company size
   - **Leads per Discovery**: How many leads to find per discovery run (1-100)
   - **Automatically run this discovery**: Enable for scheduled runs
   - **Run Frequency**: How often to run this discovery (in hours, 1-720)
3. Click **"Create Configuration"**

### 3. Run Lead Discovery

**Option A: Immediate Discovery**
1. Find the configuration card for your discovery
2. Click **"Discover Now"** button
3. Wait for the results to appear

**Option B: Scheduled Discovery**
1. Enable the "Automatically run this discovery" checkbox when creating the configuration
2. The system will run the discovery automatically at the specified frequency
3. Check results periodically

### 4. View Results

After discovery completes, you'll see:
- **Created**: Number of new leads successfully created
- **Skipped**: Number of leads that already existed in your database
- **Newly Created Leads**: List of the discovered leads with their details

These new leads immediately appear in your **Leads** section with "new" status.

## Configuration Examples

### Tech Startups Example
- **Name**: Tech Startups in California
- **Industry**: Technology
- **Keywords**: AI, Machine Learning, SaaS
- **Location**: California, United States
- **Company Size**: Small (1-50)
- **Leads per Discovery**: 20
- **Run Frequency**: 24 hours (daily)

### Enterprise Clients Example
- **Name**: Large Enterprises
- **Industry**: Finance, Healthcare
- **Keywords**: Enterprise, Fortune 500
- **Location**: United States
- **Company Size**: Large (500+)
- **Leads per Discovery**: 10
- **Run Frequency**: 168 hours (weekly)

## API Integration

The discovery system is built on extensible APIs:

### Endpoints

#### Discover Leads
```http
POST /api/discovery/discover
Content-Type: application/json

{
  "industry": "Technology",
  "keywords": ["AI", "Machine Learning"],
  "location": "California",
  "companySize": "medium",
  "limit": 10
}
```

Response:
```json
{
  "created": 8,
  "skipped": 2,
  "leads": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Smith",
      "company": "Tech Corp",
      "status": "new",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Configurations
```http
GET /api/discovery/configs
```

#### Create Configuration
```http
POST /api/discovery/configs
Content-Type: application/json

{
  "name": "My Discovery",
  "criteria": {
    "industry": "Tech",
    "keywords": ["AI"],
    "limit": 10
  },
  "is_active": true,
  "run_frequency": 24
}
```

#### Update Configuration
```http
PUT /api/discovery/configs/{id}
Content-Type: application/json

{
  "is_active": false,
  "run_frequency": 48
}
```

#### Delete Configuration
```http
DELETE /api/discovery/configs/{id}
```

## Data Sources

### Current Implementation
The current implementation uses a mock lead database with 8 sample leads for demonstration purposes.

### Future Integration Options

The service is designed to be extended with real lead sources:

1. **Hunter.io** - Email finder for companies
   - API: https://hunter.io/api
   - Great for finding business emails

2. **Apollo.io** - B2B database
   - API: https://www.apollo.io/developers
   - Large database of business contacts

3. **LinkedIn Sales Navigator** - LinkedIn integration
   - Official API for sales prospecting
   - Find decision-makers and contacts

4. **ZoomInfo** - Business intelligence
   - Comprehensive B2B database
   - High data accuracy

5. **Clearbit** - Company and person data
   - API for company enrichment
   - Accurate contact information

6. **Custom Data Sources** - SQL databases, CSV imports, etc.

### Integrating a Real Data Source

To integrate a real lead source, modify the `searchLeads()` function in `backend/src/services/leadDiscoveryService.ts`:

```typescript
export async function searchLeads(criteria: LeadDiscoveryCriteria): Promise<DiscoveredLead[]> {
  try {
    // Replace mock data with your API call
    const response = await axios.post('https://api.your-lead-source.com/search', {
      industry: criteria.industry,
      keywords: criteria.keywords,
      location: criteria.location,
      limit: criteria.limit,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.LEAD_SOURCE_API_KEY}`
      }
    });

    // Transform the response to match DiscoveredLead interface
    return response.data.leads.map((lead: any) => ({
      email: lead.contact_email,
      first_name: lead.first,
      last_name: lead.last,
      company: lead.company_name,
      phone: lead.phone,
    }));
  } catch (error) {
    console.error('Error searching for leads:', error);
    throw error;
  }
}
```

## Deduplication

The system automatically prevents duplicate leads:
- Checks email addresses (case-insensitive) before creating new leads
- Skipped duplicates are counted and reported in results
- No duplicate leads will be created

## Best Practices

1. **Start Small**: Create focused configurations with specific criteria
2. **Monitor Quality**: Check the newly created leads for quality
3. **Adjust Criteria**: Refine your discovery criteria based on results
4. **Use Run Frequency**: Set appropriate intervals to avoid high API costs
5. **Regular Cleanup**: Delete inactive configurations to keep your system clean
6. **Implement Validation**: Add additional validation rules before creating leads

## Troubleshooting

### No leads are being discovered
- Check your criteria are not too restrictive
- Verify the data source is properly configured
- Check the backend logs for errors

### Getting duplicates from scheduled runs
- The system has built-in deduplication, but check your criteria
- Consider reducing the run frequency

### Configuration not saving
- Ensure all required fields are filled
- Check browser console for validation errors
- Verify backend is running

## System Architecture

```
Frontend (Leads/Discovery UI)
    ↓
Backend API (/api/discovery/*)
    ↓
Lead Discovery Service
    ├── Data Sources
    ├── Deduplication
    └── Lead Creation
    ↓
Database (PostgreSQL)
    ↓
Background Jobs (Bull Queue)
    └── Scheduled Discovery Runs
```

## Database Schema

The `lead_discovery_configs` table stores configuration data:

```sql
CREATE TABLE lead_discovery_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  run_frequency INTEGER DEFAULT 24,
  last_run_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Considerations

- **API Rate Limiting**: Implement rate limiting for external APIs
- **Batch Processing**: Process discovered leads in batches
- **Indexing**: Ensure email column is indexed for fast duplicate checking
- **Queue System**: Uses Bull + Redis for reliable background jobs
- **Database Connection Pooling**: Configured for concurrent discoveries

## Security Considerations

- **API Keys**: Store lead source API keys in environment variables
- **Data Privacy**: Ensure compliance with GDPR, CCPA, and other regulations
- **Input Validation**: All criteria are validated before processing
- **Error Handling**: Sensitive errors are logged but not exposed to frontend

## Future Enhancements

- [ ] Lead enrichment (add company details, website, industry)
- [ ] AI-based lead scoring
- [ ] Lead verification services integration
- [ ] Bulk upload from CSV/Excel
- [ ] Custom field mapping
- [ ] Lead source analytics
- [ ] Cost tracking for API integrations
- [ ] Duplicate entity detection (company level)
