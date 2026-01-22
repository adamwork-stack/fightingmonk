# Fighting Monk - Next.js Serverless Application

A modern rebuild of fightingmonk.com using Next.js 14 with serverless architecture for AWS Lambda deployment.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Serverless-ready for AWS Lambda
- ✅ AI-powered search functionality
- ✅ Responsive design
- ✅ Optimized images with Next.js Image component

## Project Structure

```
fightingmonk/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── public/                # Static assets
│   └── images/           # Downloaded images from original site
├── scripts/              # Utility scripts
│   └── scrape-site.ts    # Web scraper for original site
├── serverless.yml        # Serverless Framework config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Scraping Original Site

To scrape content and images from the original fightingmonk.com:

```bash
npm run scrape
```

This will:
- Download all images to `scraped-content/images/`
- Extract page content to `scraped-content/pages/`
- Create a summary in `scraped-content/summary.json`

## Deployment to AWS Lambda

### Option 1: Using Serverless Framework

1. Install AWS CLI and configure credentials:
```bash
aws configure
```

2. Deploy:
```bash
npx serverless deploy
```

### Option 2: Using AWS CDK

See `infrastructure/` directory for CDK setup.

### Option 3: Using AWS Amplify

AWS Amplify provides native Next.js support and is the easiest option:

1. Connect your repository to AWS Amplify
2. Amplify will automatically detect Next.js and deploy

## AI-Powered Search

The application includes a basic AI-powered search feature that uses semantic matching to find relevant content. The search API is located at `/api/search` and can be enhanced with:

- AWS Kendra for enterprise search
- OpenAI embeddings for semantic search
- Algolia for advanced search capabilities

## Environment Variables

Create a `.env.local` file for local development:

```env
NODE_ENV=development
```

For production, configure these in your AWS Lambda environment variables.

## Cost Optimization

This serverless architecture reduces hosting costs by:

- Paying only for actual usage (Lambda invocations)
- Automatic scaling without server management
- No idle server costs
- Efficient image optimization with Next.js

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Serverless Framework** - AWS Lambda deployment
- **Cheerio** - Web scraping
- **Axios** - HTTP requests

## License

Copyright © Fighting Monk. All rights reserved.
