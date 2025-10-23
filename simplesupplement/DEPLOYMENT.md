# SimpleSupplement - Deployment Guide

## 🚀 Deploy to Vercel (Recommended - FREE!)

### Why Vercel?
- ✅ Free forever for personal projects
- ✅ Auto-deploys when you update code
- ✅ Fast global CDN
- ✅ Automatic HTTPS
- ✅ Perfect for React/Vite apps
- ✅ Takes 2 minutes to set up

---

## Step-by-Step Deployment Instructions

### **Step 1: Sign Up for Vercel**

1. Go to **https://vercel.com**
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You're now logged into Vercel!

---

### **Step 2: Import Your Project**

1. On Vercel dashboard, click **"Add New..."** (top right)
2. Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"ReeceTodd"** in the list
5. Click **"Import"** next to it

---

### **Step 3: Configure the Build Settings**

Vercel will show a configuration screen. Set these values:

**Important Settings:**
- **Project Name:** `simplesupplement` (or whatever you want)
- **Framework Preset:** `Vite` (should auto-detect)
- **Root Directory:** `simplesupplement` ⚠️ **IMPORTANT!** Click "Edit" and set this
- **Build Command:** `npm run build` (already filled)
- **Output Directory:** `dist` (already filled)
- **Install Command:** `npm install` (already filled)

**Screenshot of what to set:**
```
Root Directory: simplesupplement   ← CLICK EDIT AND SET THIS!
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

### **Step 4: Deploy!**

1. Click the big **"Deploy"** button
2. Wait 30-60 seconds while Vercel:
   - Installs your dependencies
   - Builds your app
   - Deploys to their CDN
3. You'll see a success screen with confetti! 🎉
4. Your live URL will be something like:
   ```
   https://simplesupplement.vercel.app
   ```
   or
   ```
   https://simplesupplement-yourname.vercel.app
   ```

---

### **Step 5: Share Your App!**

Copy the URL and share it! Anyone can now:
- Take the supplement quiz
- Get personalized recommendations
- Add items to cart
- See the full SimpleSupplement experience

---

## 🔄 Automatic Updates

**The best part:** Every time you push code to GitHub, Vercel automatically redeploys!

So if you update supplements, fix bugs, or add features:
1. Make changes to code
2. Commit and push to GitHub
3. Vercel automatically rebuilds and deploys
4. Your live site updates in ~30 seconds

---

## 🎯 Next Steps After Deployment

### 1. **Connect Your Custom Domain (Optional)**
   - In Vercel dashboard → Your project → Settings → Domains
   - Add your own domain like `simplesupplement.com`
   - Vercel provides SSL automatically

### 2. **Connect Supliful & Shopify**
   - See `SUPLIFUL_INTEGRATION.md` for detailed steps
   - Once connected, users can actually checkout and buy!

### 3. **Update Product IDs**
   - Replace `SUPLIFUL_XXX_ID` placeholders in `src/App.jsx`
   - With actual Supliful product IDs
   - Commit and push → Vercel auto-deploys

---

## 🐛 Troubleshooting

### **Issue: Build Fails**
- Check that Root Directory is set to `simplesupplement`
- Make sure Framework is set to "Vite"
- Check build logs for specific errors

### **Issue: 404 Not Found**
- Vercel might not have detected the right directory
- Go to Project Settings → General → Root Directory
- Set to `simplesupplement`
- Redeploy

### **Issue: Changes Not Showing Up**
- Make sure you pushed your changes to GitHub first
- Check Vercel dashboard → Deployments tab
- See if latest deployment succeeded

---

## 📊 Monitoring Your App

In Vercel dashboard you can see:
- **Analytics** - How many people visit
- **Deployments** - History of all deployments
- **Logs** - Runtime logs and errors
- **Settings** - Environment variables, domains, etc.

---

## 💰 Pricing

**Vercel Free Tier Includes:**
- Unlimited deployments
- Unlimited projects
- 100GB bandwidth per month
- Automatic HTTPS
- Global CDN

**This is MORE than enough for your supplement app!**

You only need to upgrade if you get massive traffic (100,000+ visitors/month).

---

## Alternative Deployment Options

### **Option B: Netlify** (Also free, similar to Vercel)
1. Go to https://netlify.com
2. Sign up with GitHub
3. "Add new site" → Import from GitHub
4. Select ReeceTodd repo
5. Base directory: `simplesupplement`
6. Build command: `npm run build`
7. Publish directory: `dist`
8. Deploy!

### **Option C: GitHub Pages** (Free, but more setup)
- Not ideal for React apps
- Requires additional configuration
- Not recommended for this project

---

## 🎉 You're Live!

Once deployed, your supplement recommendation app is live on the internet!

**Share your URL with:**
- Friends and family
- Potential customers
- Social media
- Your portfolio

**Next:** Connect Supliful to start actually selling supplements! 💊

---

## Questions?

If you run into any issues:
1. Check Vercel's build logs (they're very helpful)
2. Make sure all files are committed to GitHub
3. Verify Root Directory is set correctly
4. Google the specific error message

Good luck! 🚀
