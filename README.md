# Micro-POS SaaS

## 🎯 Overview

Micro-POS is a web-based SaaS application designed for small businesses to manage inventory, track sales, and receive real-time low-stock alerts via WhatsApp. Built with simplicity and affordability in mind, it replaces manual notebook tracking with a modern digital solution.

## ✨ Features

- **📦 Product & Inventory Management**
  - Add, edit, and delete products
  - Track buying and selling prices
  - Monitor stock levels in real-time
  - Set custom low-stock thresholds

- **💰 Sales Tracking**
  - Quick sale recording
  - Automatic stock updates
  - Profit calculations
  - Complete sales history

- **📊 Dashboard & Reports**
  - Daily sales summaries
  - Profit tracking
  - Low-stock alerts
  - Date-range filtering

- **📱 WhatsApp Notifications**
  - Low-stock alerts
  - Out-of-stock warnings
  - Automatic notifications

- **🔒 Security**
  - Multi-tenant architecture
  - Row Level Security (RLS)
  - Complete data isolation
  - Secure authentication

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Notifications**: Twilio WhatsApp Business API
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Supabase Account** - [Sign up at supabase.com](https://supabase.com)
2. **Twilio Account** (for WhatsApp) - [Sign up at twilio.com](https://twilio.com)
3. **Node.js** (v18 or higher)
4. **Vercel Account** (for deployment) - [Sign up at vercel.com](https://vercel.com)

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd "SAAS MVP"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `schema.sql`
3. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public Key

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Twilio/WhatsApp (Required for notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
BUSINESS_WHATSAPP_NUMBER=whatsapp:+254700000000

# Application
APP_URL=http://localhost:3000
```

### Step 5: Update Supabase Client Configuration

Edit `public/js/supabase-client.js` and replace placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Step 6: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📦 Deployment to Vercel

### Option 1: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env`
6. Deploy!

### Important: Configure Environment Variables in Vercel

After deployment, go to your project settings in Vercel and add all environment variables from your `.env` file.

## 🧪 Testing

### Test User Flow

1. **Sign Up**
   - Go to `/auth/signup.html`
   - Create a test account

2. **Add Products**
   - Navigate to Products page
   - Add 3-5 test products with different prices

3. **Record Sales**
   - Go to Record Sale page
   - Create several sales
   - Watch stock decrease automatically

4. **Check Dashboard**
   - View daily sales summary
   - Check low-stock alerts
   - Review recent sales

5. **Test Reports**
   - Filter by date ranges
   - Verify calculations

### Test WhatsApp Notifications

To test WhatsApp alerts:

1. Add a product with low-stock threshold of 5
2. Record sales until stock reaches threshold
3. Check your WhatsApp for alert message

## 📱 WhatsApp Setup (Twilio)

### Twilio Sandbox Setup

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Messaging > Try it out > Send a WhatsApp message**
3. Follow instructions to join your sandbox
4. Send the join code from your WhatsApp to the Twilio number
5. Update `BUSINESS_WHATSAPP_NUMBER` in your `.env` with your phone number

**Note:** Twilio sandbox is free but has limitations. For production, apply for a WhatsApp Business API account.

## 🔧 Troubleshooting

### Common Issues

**Issue: Can't login after signup**
- Check Supabase email settings
- Verify RLS policies are enabled
- Check browser console for errors

**Issue: Products not showing**
- Verify user is authenticated
- Check Supabase table data
- Ensure RLS policies match user_id

**Issue: WhatsApp not sending**
- Verify Twilio credentials
- Check sandbox activation
- Confirm phone number format (+254...)

## 📖 API Endpoints

- `POST /api/send-whatsapp` - Send WhatsApp notification

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use environment variables** - All secrets in Vercel dashboard
3. **Enable Supabase RLS** - Done via schema.sql
4. **Verify webhook signatures** - Implemented in webhook handlers
5. **Use HTTPS in production** - Vercel provides this automatically

## 🎯 Roadmap

Future enhancements:
- [ ] Multiple staff accounts per business
- [ ] Barcode scanning
- [ ] Offline mode
- [ ] Expense tracking
- [ ] AI sales predictions
- [ ] Mobile apps (iOS/Android)
- [ ] Multi-currency support
- [ ] SMS notifications backup

## 🤝 Support

For support:
- Check documentation above
- Review Supabase logs
- Check Vercel function logs
- Contact support@micro-pos.com (replace with your email)

## 📄 License

MIT License - feel free to use this for your own projects!

---

**Built with ❤️ for small businesses**
