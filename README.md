# TradeSim

TradeSim is a simulated stock trading platform built with Next.js, Server Actions, Tanstack Query, and Neon Serverless Database.

## Overview
This application is strictly for **educational purposes** and simulation only. All money shown is simulated, and no real financial transactions take place. We do not sell any user data.

## Features
- **$10,000 Starting Balance:** Start risk-free and practice your trading strategies.
- **Real-Time Quotes:** Uses the Alpaca Markets API to fetch stock quotes.
- **Modern UI:** Built with Shadcn UI, Recharts, and Tailwind v4.
- **Serverless Postgres:** Database powered by Neon.
- **Clerk Authentication:** Secure user sign-ins and session management.

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   npm install @neondatabase/serverless @clerk/nextjs recharts @tanstack/react-query @tanstack/react-query-devtools lucide-react
   npx shadcn@latest init
   npx shadcn@latest add button input tabs card sheet dialog sonner
   ```
3. Copy `.env.example` to `.env.local` and fill in your variables:
   - `DATABASE_URL` (From Neon)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` (From Clerk)
   - `ALPACA_API_KEY` & `ALPACA_API_SECRET` (From Alpaca)
4. Initialize your database by running the `schema.sql` script on your Neon dashboard or via your preferred Postgres client.
5. Run the dev server:
   ```bash
   npm run dev
   ```

## License and Attribution
This project is open-source and intended to be publicly hosted for educational purposes. Attribution is required if you reuse the underlying architecture or code.
