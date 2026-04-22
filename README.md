# Golf Club Inc.

A **Golf · Charity · Monthly Draws** platform that combines golf scoring with charitable giving and prize draws.

![Logo](public/Logo.png)

## Overview

Golf Club Inc. is a subscription-based platform where golf enthusiasts can:

- Subscribe monthly or yearly to participate in monthly prize draws
- Enter their Stableford golf scores (up to 5 most recent scores)
- Be automatically entered into monthly prize draws based on their scores
- Automatically donate a percentage of their subscription to a charity of their choice
- Win cash prizes from tiered jackpot pools

**Live Demo**: [https://golf-club-inc.vercel.app](https://golf-club-inc.vercel.app)

## Core Concept

Users subscribe, enter golf scores, and their last 5 scores become their "draw entry numbers" (1-45). When winning numbers are drawn monthly, users win prizes based on how many of their scores match the drawn numbers.

## Features

### User Features

- **Authentication**: Email/password registration, login, password reset
- **Score Entry**: Enter and manage Stableford scores (1-45 points)
- **Monthly Draws**: Automatic entry based on 5 most recent scores
- **Charity Selection**: Choose from featured charities and set contribution percentage
- **Winning History**: View past wins and claim prizes
- **Subscription Management**: Manage monthly/yearly plans via Stripe

### Admin Features

- **Analytics Dashboard**: View user growth, draw statistics, charity contributions
- **Draw Management**: Initialize, simulate, and publish monthly draws
- **User Management**: Search and manage user accounts
- **Charity Management**: Add, edit, and feature charities
- **Winner Management**: View winners and manage prize distribution
- **Reports & Export**: Export data for analysis

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Payments** | Stripe |
| **Email** | Gmail SMTP |

## Project Structure

```
golf/
├── app/
│   ├── (auth)/           # Auth pages (login, register, reset-password)
│   ├── (dashboard)/      # Protected user dashboard
│   │   ├── dashboard/    # Main overview
│   │   ├── draws/        # Monthly draws
│   │   ├── scores/       # Score entry & history
│   │   ├── charity/      # Charity selection
│   │   ├── winnings/     # Prize history
│   │   ├── profile/      # User profile
│   │   └── settings/     # Settings & subscription
│   ├── (admin)/          # Admin dashboard
│   │   └── admin/
│   │       ├── draws/    # Draw management
│   │       ├── users/    # User management
│   │       ├── winners/  # Winner management
│   │       ├── charities/# Charity management
│   │       └── reports/  # Analytics & reports
│   ├── (public)/         # Public landing page
│   ├── api/              # API routes
│   │   ├── webhooks/stripe/
│   │   ├── admin/
│   │   ├── draws/
│   │   └── email/
│   └── actions/          # Server Actions
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Dashboard widgets
│   ├── draws/            # Draw components
│   ├── charity/          # Charity components
│   └── admin/            # Admin components
├── lib/
│   ├── types/            # TypeScript types
│   ├── supabase/         # Supabase clients
│   ├── stripe/           # Stripe helpers
│   ├── draw/             # Draw logic & engine
│   ├── scores/           # Score validation
│   ├── charity/          # Contribution calculations
│   ├── email/            # Email client & templates
│   └── metadata.ts       # SEO metadata
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Stripe account
- Gmail account (for email notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pranavmkale/Golf_Club_Inc.git
cd golf
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL                =       https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY           =       your-anon-key
SUPABASE_SERVICE_ROLE_KEY               =       your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY      =       pk_test_...
STRIPE_SECRET_KEY                       =       sk_test_...
STRIPE_WEBHOOK_SECRET                   =       whsec_...
STRIPE_MONTHLY_PRICE_ID                 =       price_...
STRIPE_YEARLY_PRICE_ID                  =       price_...

# App URL
NEXT_PUBLIC_APP_URL                     =       http://localhost:3000

# Email (Gmail SMTP)
GMAIL_USER                              =       your-email@gmail.com
GMAIL_APP_PASSWORD                      =       your-app-password
```

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Run the database migrations from `/supabase/migrations/`
3. Enable Email Auth provider
4. Configure Gmail SMTP in Auth settings for transactional emails
5. Set Row Level Security (RLS) policies for tables

### Stripe Setup

1. Create a [Stripe](https://stripe.com) account
2. Create two products: Monthly and Yearly subscriptions
3. Get the Price IDs and add to `.env`
4. Configure webhook endpoint: `/api/webhooks/stripe`
5. Add webhook events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| **profiles** | User profiles, subscription status, stripe customer IDs |
| **scores** | User golf scores (Stableford points, 1-45) |
| **draws** | Monthly draws (status, winning numbers, prize amounts) |
| **draw_entries** | User entries per draw (entry numbers, matches) |
| **winners** | Prize winners (tier, amount, verification status) |
| **charities** | Charity information (name, logo, description) |
| **charity_contributions** | Donation records (user, charity, amount) |

## How It Works

### Draw System

1. **Entry Numbers**: User's 5 most recent scores become their entry numbers (1-45 range)
2. **Draw Generation**: Admin initializes a draw which generates 5 random winning numbers
3. **Matching**: User entries are matched against winning numbers
4. **Prize Tiers**:
   - **Jackpot (5 matches)**: 40% of prize pool
   - **Tier 4 (4 matches)**: 35% of prize pool
   - **Tier 3 (3 matches)**: 25% of prize pool
5. **Unclaimed Jackpots**: Roll over to next month's pool

### Subscription Flow

1. User subscribes via Stripe Checkout
2. Webhook updates user profile with subscription status
3. Active subscribers can enter scores and participate in draws
4. Monthly billing handled by Stripe

### Charity Contributions

- Default 10% of subscription goes to user's selected charity
- Percentage is adjustable by the user
- Contributions tracked per billing period
- Charities receive aggregated donations

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/webhooks/stripe` | Stripe webhook handler |
| `POST /api/admin/draws` | Initialize new draw |
| `POST /api/admin/draws/[id]/publish` | Publish draw and notify winners |
| `POST /api/email/winner-notification` | Send winner emails |
| `GET /api/draws/jackpot` | Public jackpot amount |

## Server Actions

| Action | Purpose |
|--------|---------|
| `signIn/signUp` | Authentication |
| `updateUserAdminAction` | Admin user management |
| `approveWinnerAction` | Approve winner verification |
| `markAsPaidAction` | Mark prize as paid |
| `createDrawAction` | Create new draw |
| `submitProofAction` | Submit winner score proof |
| `cancelSubscriptionAction` | Cancel Stripe subscription |

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update `NEXT_PUBLIC_APP_URL` to your production domain:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Key Features Explained

### Score Entry System
- Users can enter up to 5 recent Stableford scores
- Each score becomes an "entry number" (1-45 range)
- More scores = more chances to win (higher tiers)

### Prize Pool Calculation
- Prize pool is 40% of monthly subscription revenue
- Rolled-over jackpots add to the pool
- Distributed across 3 winning tiers

### Winner Verification
- Winners must upload scorecard proof
- Admin verifies proof before payout
- Prevents fraud and ensures fair play

## Troubleshooting

### Common Issues

1. **Stripe webhooks not working**: Ensure webhook secret is correct and endpoint is accessible
2. **Email not sending**: Check Gmail App Password is correct and 2FA is enabled
3. **Database errors**: Verify Supabase RLS policies are configured
4. **Type errors**: Ensure `as any` type assertions are in place for Supabase queries

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For support, email pranavmkale99@gmail.com or open an issue on GitHub.

---

Built with Next.js, Supabase, Stripe, and Tailwind CSS.
