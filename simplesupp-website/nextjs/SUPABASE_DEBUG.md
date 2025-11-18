# Supabase Connection Debugging Guide

## 🔍 Current Issue

"TypeError: fetch failed" - Network-level connection failure to Supabase.

## ✅ Environment Variables Verified

- `NEXT_PUBLIC_SUPABASE_URL`: ✅ Present (39 chars)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: ✅ Present (208 chars)
- `SUPABASE_SERVICE_ROLE_KEY`: ✅ Present (219 chars)

## 🧪 Testing Steps

### Step 1: Test Supabase Connection Endpoint

Visit in browser:
```
http://localhost:3001/api/test-supabase
```

This will test:
1. Environment variables
2. Network connectivity to Supabase
3. Supabase client creation
4. Database query execution

### Step 2: Check Server Logs

When you visit `/api/test-supabase`, check your terminal for:
- `=== Starting Supabase Connection Test ===`
- Environment check results
- Network test results
- Client creation status
- Query test results

### Step 3: Check Browser Console

When visiting dashboard, check browser console for:
- `Starting user sync...`
- `GET /api/user/create - Checking user...`
- Any fetch errors with details

## 🐛 Common Causes of "TypeError: fetch failed"

### 1. Network/Firewall Issue
- **Symptom**: Cannot reach Supabase URL
- **Test**: Visit `https://ewmgyjsluooklflttea.supabase.co` in browser
- **Fix**: Check firewall, VPN, or network restrictions

### 2. SSL/TLS Certificate Issue
- **Symptom**: Certificate validation fails
- **Test**: Check if Supabase URL loads in browser
- **Fix**: Update Node.js or check certificate chain

### 3. Supabase Project Paused/Deleted
- **Symptom**: 404 or connection refused
- **Test**: Check Supabase dashboard - is project active?
- **Fix**: Reactivate project in Supabase dashboard

### 4. Environment Variables Not Loading
- **Symptom**: Variables are undefined
- **Test**: Check `/api/test-supabase` endpoint
- **Fix**: Restart dev server after adding env vars

### 5. Next.js Server-Side Fetch Issue
- **Symptom**: Fetch works in browser but not server
- **Test**: Check Node.js version (needs 18+ for native fetch)
- **Fix**: Update Node.js or use polyfill

## 🔧 Debugging Commands

### Check Node.js Version
```bash
node --version
```
Should be 18.0.0 or higher for native fetch support.

### Test Direct Fetch
```bash
# In Node.js REPL or test script
node -e "fetch('https://ewmgyjsluooklflttea.supabase.co/rest/v1/').then(r => console.log('Success:', r.status)).catch(e => console.error('Error:', e))"
```

### Check Environment Variables in Runtime
Visit: `http://localhost:3001/api/test-supabase`
Look at the `testResults.envCheck` in the response.

## 📋 What to Check

1. **Supabase Dashboard**
   - Is project active?
   - Are tables created?
   - Check project settings

2. **Network Connectivity**
   - Can you access Supabase URL in browser?
   - Any VPN/firewall blocking?
   - Check if port 443 (HTTPS) is accessible

3. **Server Logs**
   - Look for detailed error messages
   - Check which step fails (network, client, query)

4. **Node.js Version**
   - Run `node --version`
   - Should be 18+ for native fetch

## 🚨 If Still Failing

1. **Check Supabase Project Status**
   - Go to Supabase dashboard
   - Verify project is active
   - Check if URL is correct

2. **Test with curl**
   ```bash
   curl -H "apikey: YOUR_SERVICE_KEY" https://ewmgyjsluooklflttea.supabase.co/rest/v1/users?select=id&limit=1
   ```

3. **Check Next.js Version**
   - Next.js 16 should have native fetch
   - If not, may need polyfill

4. **Review Error Details**
   - Check `/api/test-supabase` response
   - Look at `testResults.errors` array
   - Each error has step, message, and type

## 📝 Next Steps

After running `/api/test-supabase`:
1. Share the full response JSON
2. Check which test step failed
3. Review server logs for detailed errors
4. Verify Supabase project is active

