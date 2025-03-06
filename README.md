# POS Inventory Billing System

A web-based POS inventory and billing system for businesses to manage sales, track inventory, and streamline invoicing efficiently.

## Features

- User Authentication
- Dashboard with Analytics
- Inventory Management
- Sales Management
- Transaction Tracking
- Billing System
- User Management
- Settings Configuration

## Deployment to GitHub Pages

1. Fork this repository
2. Go to your repository settings
3. Navigate to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Add the following secrets to your repository:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your GitHub Pages URL)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="your_database_url"
   JWT_SECRET="your_jwt_secret"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

The static files will be generated in the `out` directory.

## License

MIT
