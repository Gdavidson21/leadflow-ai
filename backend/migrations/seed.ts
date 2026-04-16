import { query, disconnect } from '../src/config/database';

async function seedDatabase(): Promise<void> {
  try {
    console.log('Seeding database...');

    // Insert sample leads
    const leads = [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        company: 'Tech Corp',
      },
      {
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        company: 'Innovation Inc',
      },
      {
        email: 'bob.wilson@example.com',
        first_name: 'Bob',
        last_name: 'Wilson',
        company: 'Future Systems',
      },
    ];

    for (const lead of leads) {
      await query(
        `INSERT INTO leads (email, first_name, last_name, company, status)
         VALUES ($1, $2, $3, $4, 'new')
         ON CONFLICT (email) DO NOTHING`,
        [lead.email, lead.first_name, lead.last_name, lead.company]
      );
    }
    console.log('✓ Sample leads inserted');

    // Insert sample campaigns
    const campaigns = [
      {
        name: 'Q1 Outreach',
        description: 'First quarter lead outreach campaign',
        message_template: 'Hi {{firstName}}, We have a solution tailored for {{company}}...',
        sends_per_day: 20,
      },
      {
        name: 'Product Launch',
        description: 'Campaign for new product launch',
        message_template: 'We are excited to introduce our new product...',
        sends_per_day: 50,
      },
    ];

    for (const campaign of campaigns) {
      await query(
        `INSERT INTO campaigns (name, description, message_template, sends_per_day, status)
         VALUES ($1, $2, $3, $4, 'draft')`,
        [campaign.name, campaign.description, campaign.message_template, campaign.sends_per_day]
      );
    }
    console.log('✓ Sample campaigns inserted');

    console.log('✓ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

seedDatabase();
