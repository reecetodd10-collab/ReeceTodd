/**
 * Simple Newsletter Checker
 * Run with: node scripts/check-newsletters.js
 */

const { createClient } = require('@supabase/supabase-js');

// INSTRUCTIONS: Replace these with your actual values from .env.local
const SUPABASE_URL = 'https://ewmgyjsluooktlftttea.supabase.co';
const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // Get from .env.local

async function checkNewsletters() {
  console.log('\n📧 Checking Newsletters in Supabase...\n');

  if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.log('⚠️  Please edit scripts/check-newsletters.js and add your SUPABASE_SERVICE_ROLE_KEY');
    console.log('   Find it in: nextjs/.env.local');
    console.log('   Look for: SUPABASE_SERVICE_ROLE_KEY=...\n');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const { data, error, count } = await supabase
      .from('newsletters')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false });

    if (error) {
      console.error('❌ Error:', error.message);
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('\n⚠️  The newsletters table doesn\'t exist yet!');
        console.log('   Run the SQL migration from: nextjs/supabase/migrations/create_newsletters_table.sql\n');
      }
      return;
    }

    console.log(`✅ Found ${count} newsletter(s) in database\n`);

    if (data && data.length > 0) {
      data.forEach((newsletter, i) => {
        console.log(`Newsletter #${i + 1}:`);
        console.log(`  ID: ${newsletter.id}`);
        console.log(`  Title: ${newsletter.title}`);
        console.log(`  Date: ${new Date(newsletter.published_date).toLocaleString()}`);
        console.log(`  Excerpt: ${newsletter.excerpt?.substring(0, 80)}...`);
        console.log('');
      });

      // Now test creating one
      console.log('💾 Creating test newsletter...\n');

      const testNewsletter = {
        title: `Test Newsletter - ${new Date().toLocaleString()}`,
        content: '<h1>Test Newsletter</h1><p>This is a test to verify the integration!</p><p>If you can see this on /news, everything is working!</p>',
        excerpt: 'This is a test newsletter created to verify the integration works correctly.',
        published_date: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await supabase
        .from('newsletters')
        .insert(testNewsletter)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Failed to create test newsletter:', insertError.message);
      } else {
        console.log('✅ Test newsletter created!');
        console.log(`   ID: ${insertData.id}`);
        console.log(`   Title: ${insertData.title}\n`);
        console.log('🎉 Now visit http://localhost:3000/news to see it!\n');
      }
    } else {
      console.log('⚠️  No newsletters found.');
      console.log('   Modal script may not have saved to database.');
      console.log('   Creating a test newsletter...\n');

      const testNewsletter = {
        title: `Test Newsletter - ${new Date().toLocaleString()}`,
        content: '<h1>Welcome to Aviera News!</h1><p>This is a test newsletter.</p><h2>What to Expect</h2><p>Weekly AI-curated fitness and supplement insights delivered straight to your inbox.</p>',
        excerpt: 'Welcome to the first edition of Aviera News! Get ready for weekly AI-curated fitness and supplement insights.',
        published_date: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await supabase
        .from('newsletters')
        .insert(testNewsletter)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Failed to create test newsletter:', insertError.message);
      } else {
        console.log('✅ Test newsletter created!');
        console.log(`   ID: ${insertData.id}`);
        console.log(`   Title: ${insertData.title}\n`);
        console.log('🎉 Visit http://localhost:3000/news to see it!\n');
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

checkNewsletters().catch(console.error);
