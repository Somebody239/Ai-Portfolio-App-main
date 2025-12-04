# UniPlanner.ai - Portfolio Management App

AI-powered university application portfolio management system built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Prerequisites

- Node.js 18+ installed
- pnpm installed globally (`npm install -g pnpm`)
- Supabase account and project

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

**Important:** 
- Use `NEXT_PUBLIC_` prefix - Next.js requires this for client-side environment variables
- Use `.env.local` (not `.env`) for local development - it's gitignored
- Restart your dev server after creating/updating `.env.local`

**Note:** If you have a `.env` file with `SUPABASE_URL` (without `NEXT_PUBLIC_`), you'll need to convert it. See `docs/setup.md` for details.

### 3. Run Development Server

```bash
pnpm dev
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
├── app/                           # Next.js app router
│   ├── layout.tsx                 # Root HTML + global styles
│   ├── page.tsx                   # "/" (dashboard entry)
│   ├── dashboard/page.tsx         # "/dashboard" (re-uses home)
│   ├── login/page.tsx             # Public login/sign-up
│   ├── onboarding/page.tsx        # Guided onboarding flow
│   ├── portfolio/page.tsx         # Portfolio view
│   └── profile/page.tsx           # Profile view
├── components/                    # Reusable UI + layout pieces
│   ├── dashboard/                 # Dashboard-specific widgets
│   ├── layout/                    # AppShell, ProtectedRoute, etc.
│   ├── portfolio/                 # Portfolio sections
│   └── ui/                        # Atomic UI building blocks
├── hooks/                         # Supabase-powered data hooks
│   ├── usePortfolio.ts            # Portfolio data aggregation
│   ├── useUniversities.ts         # University directory
│   ├── useUser.ts                 # Authenticated user profile
│   └── useUserProfile.ts          # Sidebar profile/session helpers
├── lib/                           # Types, utils, Supabase client
│   ├── types.ts                   # TypeScript models
│   ├── utils.ts                   # Helper utilities (cn, etc.)
│   └── supabase/                  # Supabase setup + repositories
│       ├── client.ts
│       ├── database.types.ts
│       └── repositories/
│           ├── achievements.repository.ts
│           ├── courses.repository.ts
│           ├── extracurriculars.repository.ts
│           ├── recommendations.repository.ts
│           ├── scores.repository.ts
│           ├── universities.repository.ts
│           ├── users.repository.ts
│           └── userTargets.repository.ts
├── services/                      # Business logic
│   └── StatsService.ts            # GPA + admissions helpers
├── styles/                        # Global styles
│   └── global.css
├── views/                         # Client-side page views
│   ├── DashboardView.tsx
│   ├── OnboardingView.tsx
│   ├── PortfolioView.tsx
│   └── ProfileView.tsx
└── docs/                          # Reference documentation
    ├── database-schema.md
    ├── roadmap.md
    └── setup.md
```

## Documentation

- `docs/database-schema.md`: Supabase table + RLS reference
- `docs/roadmap.md`: High-level implementation plan
- `docs/setup.md`: Quick local setup instructions

## Database Integration

The app is fully connected to Supabase with the following tables:

- **users** - User profiles
- **courses** - Course grades for GPA calculation
- **standardized_scores** - SAT, ACT, AP, IB test scores
- **extracurriculars** - Extracurricular activities
- **achievements** - Awards and honors
- **personality_inputs** - Optional AI personalization
- **universities** - Preloaded university database
- **user_targets** - User's target universities
- **opportunities** - Scholarships and programs
- **recommendations_ai** - AI-generated recommendations

All tables use Row Level Security (RLS) for data protection.

## Features

- **Portfolio Management**: Track courses, grades, and GPA with real-time calculation
- **Standardized Testing**: Record and view SAT, ACT, AP, and IB scores
- **University Comparison**: Compare your stats with target universities
- **Risk Analysis**: Understand if universities are Safety, Target, Reach, or High Reach
- **AI Insights**: Get personalized recommendations for improvement

## Authentication

Currently, the app uses Supabase Auth. If no user is authenticated, it will use a mock user ID for demonstration. In production, you should implement proper authentication and redirect unauthenticated users to a login page.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (optional)

## Development Notes

- The app fetches data from Supabase on mount
- Auth + onboarding enforcement lives in `components/layout/ProtectedRoute`
- All database queries use the repository pattern for separation of concerns
- Business logic (GPA calculation, risk analysis) is separated in `StatsService`
- Loading states are handled automatically by hooks
- Error handling is implemented at the repository and hook levels

## Troubleshooting

**If you encounter issues:**

1. **Database connection errors**: Verify your `.env.local` file has correct Supabase credentials
2. **Empty data**: Make sure you have data in your Supabase tables
3. **RLS errors**: Check that Row Level Security policies are correctly configured
4. **Type errors**: Run `pnpm install` to ensure all dependencies are installed

**To reset:**
1. Delete `node_modules` and `pnpm-lock.yaml`
2. Run `pnpm install` again
3. Ensure Node.js version is 18 or higher
4. Check that port 3000 is available
