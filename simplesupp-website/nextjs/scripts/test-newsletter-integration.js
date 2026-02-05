/**
 * Test Newsletter Integration
 *
 * This script checks:
 * 1. Supabase connection
 * 2. Newsletter table exists and has data
 * 3. API endpoint works
 * 4. Can insert test newsletter
 */

const { createClient } = require('@supabase/supabase-js');

async function testIntegration() {
  console.log('\n' + '='.repeat(70));
  console.log('  NEWSLETTER INTEGRATION TEST');
  console.log('='.repeat(70) + '\n');

  // Step 1: Check environment variables
  console.log('Step 1: Checking environment variables...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
    process.exit(1);
  }
  console.log('✅ Environment variables found\n');

  // Step 2: Connect to Supabase
  console.log('Step 2: Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  console.log('✅ Connected to Supabase\n');

  // Step 3: Check if newsletters table exists
  console.log('Step 3: Checking newsletters table...');
  try {
    const { data, error, count } = await supabase
      .from('newsletters')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false });

    if (error) {
      console.error('❌ Error querying newsletters table:', error.message);
      console.log('\n⚠️  Did you run the SQL migration? Check NEWSLETTER_SETUP.md\n');
      process.exit(1);
    }

    console.log(`✅ Table exists with ${count} newsletter(s)\n`);

    if (data && data.length > 0) {
      console.log('Latest newsletters:');
      data.slice(0, 3).forEach((newsletter, i) => {
        console.log(`  ${i + 1}. ${newsletter.title}`);
        console.log(`     ID: ${newsletter.id}`);
        console.log(`     Date: ${newsletter.published_date}`);
        console.log(`     Excerpt: ${newsletter.excerpt?.substring(0, 60)}...`);
        console.log('');
      });
    } else {
      console.log('⚠️  No newsletters found in database\n');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }

  // Step 4: Test API endpoint
  console.log('Step 4: Testing API endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/newsletters?latest=true');

    if (!response.ok) {
      console.error(`❌ API returned status ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
    } else {
      const apiData = await response.json();
      console.log('✅ API endpoint working!');
      console.log('Response:', JSON.stringify(apiData, null, 2));
    }
  } catch (err) {
    console.error('❌ API test failed:', err.message);
    console.log('⚠️  Make sure Next.js dev server is running: npm run dev');
  }
  console.log('');

  // Step 5: Insert test newsletter
  console.log('Step 5: Inserting test newsletter...');
  try {
    const testNewsletter = {
      title: `Test Newsletter - ${new Date().toLocaleString()}`,
      content: '<h1>Test Newsletter</h1><p>This is a test newsletter to verify the integration works!</p>',
      excerpt: 'This is a test newsletter created by the integration test script.',
      published_date: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('newsletters')
      .insert(testNewsletter)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to insert test newsletter:', insertError.message);
    } else {
      console.log('✅ Test newsletter inserted successfully!');
      console.log(`   ID: ${insertData.id}`);
      console.log(`   Title: ${insertData.title}`);
      console.log('\n🎉 Now visit http://localhost:3000/news to see it!\n');
    }
  } catch (err) {
    console.error('❌ Insert failed:', err.message);
  }

  console.log('='.repeat(70));
  console.log('  TEST COMPLETE');
  console.log('='.repeat(70) + '\n');
}

// Load environment variables from .env.local manually
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
} catch (err) {
  console.log('Warning: Could not load .env.local file:', err.message);
}

testIntegration().catch(console.error);
