import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const testResults = {
    step: 'initializing',
    envCheck: {},
    networkTest: {},
    clientCreation: {},
    queryTest: {},
    errors: [],
  };

  try {
    console.log('=== Starting Supabase Connection Test ===');
    
    // Step 1: Check environment variables
    testResults.step = 'env_check';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    testResults.envCheck = {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      urlValue: supabaseUrl || 'MISSING',
      urlLength: supabaseUrl?.length || 0,
      serviceKeyLength: supabaseServiceKey?.length || 0,
      anonKeyLength: supabaseAnonKey?.length || 0,
    };

    console.log('Environment check:', testResults.envCheck);

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: 'Missing environment variables',
          testResults,
        },
        { status: 500 }
      );
    }

    // Step 2: Test network connectivity to Supabase
    testResults.step = 'network_test';
    try {
      console.log('Testing network connectivity to:', supabaseUrl);
      const healthCheckUrl = `${supabaseUrl}/rest/v1/`;
      
      // Create abort controller for timeout (compatible with all Node versions)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const networkResponse = await fetch(healthCheckUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      testResults.networkTest = {
        success: networkResponse.ok,
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: Object.fromEntries(networkResponse.headers.entries()),
      };

      console.log('Network test result:', testResults.networkTest);
    } catch (networkError) {
      testResults.networkTest = {
        success: false,
        error: networkError.message,
        errorType: networkError.constructor.name,
        errorName: networkError.name,
      };
      testResults.errors.push({
        step: 'network_test',
        error: networkError.message,
        type: networkError.constructor.name,
      });
      console.error('Network test failed:', networkError);
    }

    // Step 3: Try to create Supabase client
    testResults.step = 'client_creation';
    let supabase;
    try {
      console.log('Creating Supabase admin client...');
      supabase = createSupabaseAdmin();
      testResults.clientCreation = {
        success: true,
        message: 'Client created successfully',
      };
      console.log('Client creation: SUCCESS');
    } catch (clientError) {
      testResults.clientCreation = {
        success: false,
        error: clientError.message,
        errorType: clientError.constructor.name,
        stack: clientError.stack,
      };
      testResults.errors.push({
        step: 'client_creation',
        error: clientError.message,
        type: clientError.constructor.name,
      });
      console.error('Client creation failed:', clientError);
      return NextResponse.json(
        { 
          error: 'Failed to create Supabase client',
          testResults,
        },
        { status: 500 }
      );
    }
    
    // Step 4: Try a simple query to test connection
    testResults.step = 'query_test';
    try {
      console.log('Testing database query...');
      const { data, error, status, statusText } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (error) {
        testResults.queryTest = {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        };
        testResults.errors.push({
          step: 'query_test',
          error: error.message,
          code: error.code,
        });
        console.error('Query test failed:', error);
      } else {
        testResults.queryTest = {
          success: true,
          message: 'Query executed successfully',
          dataCount: Array.isArray(data) ? data.length : 0,
        };
        console.log('Query test: SUCCESS');
      }
    } catch (queryError) {
      testResults.queryTest = {
        success: false,
        error: queryError.message,
        errorType: queryError.constructor.name,
        stack: queryError.stack,
      };
      testResults.errors.push({
        step: 'query_test',
        error: queryError.message,
        type: queryError.constructor.name,
      });
      console.error('Query test exception:', queryError);
    }

    // Return comprehensive test results
    const allTestsPassed = 
      testResults.networkTest.success !== false &&
      testResults.clientCreation.success &&
      testResults.queryTest.success !== false;

    return NextResponse.json(
      { 
        success: allTestsPassed,
        message: allTestsPassed 
          ? 'All Supabase connection tests passed' 
          : 'Some tests failed - see testResults for details',
        testResults,
      },
      { status: allTestsPassed ? 200 : 500 }
    );
  } catch (error) {
    console.error('Test Supabase error:', error);
    testResults.errors.push({
      step: 'unexpected_error',
      error: error.message,
      type: error.constructor.name,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to test Supabase',
        details: error.message,
        testResults,
      },
      { status: 500 }
    );
  }
}

