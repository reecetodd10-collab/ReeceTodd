import { NextResponse } from 'next/server';

/**
 * Waitlist API Endpoint
 * 
 * GOOGLE SHEETS SETUP INSTRUCTIONS:
 * 
 * 1. Create a Google Cloud Project:
 *    - Go to https://console.cloud.google.com
 *    - Create a new project or select existing
 * 
 * 2. Enable Google Sheets API:
 *    - Navigate to "APIs & Services" > "Library"
 *    - Search for "Google Sheets API" and enable it
 * 
 * 3. Create Service Account:
 *    - Go to "APIs & Services" > "Credentials"
 *    - Click "Create Credentials" > "Service Account"
 *    - Name it (e.g., "aviera-waitlist")
 *    - Click "Create and Continue"
 *    - Skip role assignment, click "Done"
 * 
 * 4. Generate Key:
 *    - Click on the service account you just created
 *    - Go to "Keys" tab
 *    - Click "Add Key" > "Create new key"
 *    - Choose "JSON" format
 *    - Download the key file
 * 
 * 5. Create Google Sheet:
 *    - Create a new Google Sheet
 *    - Add headers in row 1: Timestamp, Profile Type, Goal, Challenge, Past Attempts, Budget, Email, Marketing Consent
 *    - Copy the Sheet ID from the URL (between /d/ and /edit)
 * 
 * 6. Share Sheet with Service Account:
 *    - Open the downloaded JSON key file
 *    - Copy the "client_email" value
 *    - In your Google Sheet, click "Share"
 *    - Paste the service account email and give it "Editor" access
 * 
 * 7. Install Dependencies:
 *    npm install googleapis
 * 
 * 8. Update This File:
 *    - Add the service account key file to your project (keep it secure, add to .gitignore)
 *    - Replace YOUR_SHEET_ID with your actual sheet ID
 *    - Uncomment and update the Google Sheets code below
 * 
 * ALTERNATIVE: Use a service like Zapier, Make.com, or Airtable webhook
 */

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.profile_type || !data.goal || !data.challenge || !data.budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Implement Google Sheets integration
    // Example code structure:
    /*
    const { google } = require('googleapis');
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: 'YOUR_SHEET_ID',
      range: 'Sheet1!A:H',
      valueInputOption: 'RAW',
      resource: {
        values: [[
          data.timestamp,
          data.profile_type,
          data.goal,
          data.challenge,
          data.past_attempts,
          data.budget,
          data.email,
          data.marketing_consent ? 'Yes' : 'No'
        ]],
      },
    });
    */

    // For now, log the data (remove in production)
    console.log('Waitlist submission:', data);

    // TODO: Send confirmation email (optional)
    // You can use services like SendGrid, Resend, or AWS SES

    return NextResponse.json(
      { success: true, message: 'Successfully added to waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

