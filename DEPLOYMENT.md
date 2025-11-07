# Deployment Guide for Learning Journal

This guide explains how to deploy the Learning Journal app from GitHub to various platforms.

## Prerequisites

1. **Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **PostgreSQL Database**: You'll need a PostgreSQL database (see options below)
3. **GitHub Repository**: Your code pushed to GitHub

## Step 1: Set Up Clerk Authentication

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Enable auth providers: Google, GitHub, X (Twitter), Apple
4. Copy your API keys:
   - `CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)

## Step 2: Set Up PostgreSQL Database

Choose one of these options:

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a free project
3. Copy the connection string (starts with `postgresql://`)

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the `DATABASE_URL`

## Step 3: Deploy to Platform

### Deploying to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables:

```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
DATABASE_URL=postgresql://...
```

5. Deploy!

### Deploying to Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub
3. Add environment variables (same as above)
4. Railway will automatically detect and build your app

### Deploying to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy!

## Step 4: Configure Clerk URLs

After deployment:

1. Go to Clerk Dashboard → Redirects
2. Add your deployment URL to:
   - Authorized redirect URLs
   - Authorized origins
3. Example: `https://your-app.vercel.app`

## Step 5: Initialize Database

The database tables will be created automatically on first run using Drizzle ORM.

Tables created:
- `users` - User accounts from Clerk
- `sessions` - User sessions (optional with Clerk)
- `journal_entries` - User journal entries
- `projects` - User projects
- `user_profiles` - User profiles

## Environment Variables Reference

```env
# Clerk Auth (Required)
CLERK_PUBLISHABLE_KEY=pk_test_...      # From Clerk Dashboard
CLERK_SECRET_KEY=sk_test_...            # From Clerk Dashboard
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... # Same as CLERK_PUBLISHABLE_KEY

# Database (Required)
DATABASE_URL=postgresql://...           # PostgreSQL connection string

# Server (Optional)
PORT=5000                               # Default: 5000
NODE_ENV=production                     # Set to 'production' for prod
```

## Features After Deployment

✅ **Multi-User Auth** - Google, GitHub, X, Apple login
✅ **No Replit Branding** - Clean, custom UI
✅ **Offline-First** - Works without internet
✅ **Data Isolation** - Each user has private data
✅ **Auto-Sync** - Syncs when online
✅ **Export** - JSON, Markdown, PDF exports

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Check that `VITE_CLERK_PUBLISHABLE_KEY` is set

### Auth Not Working
- Verify Clerk environment variables are correct
- Check authorized redirect URLs in Clerk Dashboard
- Make sure your app URL matches the redirect URL

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check database is accessible from deployment platform
- Some platforms require SSL: add `?sslmode=require` to connection string

## Support

For issues or questions:
- Check Clerk documentation: [clerk.com/docs](https://clerk.com/docs)
- PostgreSQL issues: Check your database provider's docs
- App issues: Review the GitHub repository README

## Local Development

To run locally:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

Visit `http://localhost:5000`

## Next Steps

After deployment:
1. Test authentication with all providers
2. Create a journal entry
3. Add a project
4. Test offline functionality
5. Share your app URL!

---

**Congratulations! Your Learning Journal is now deployed and accessible from anywhere!** 🎉
