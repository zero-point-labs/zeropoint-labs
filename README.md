# Zero Point Labs Website

A modern Next.js website for Zero Point Labs, built with React, TypeScript, and Tailwind CSS.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js** for 3D graphics
- **Appwrite** for backend services
- **Radix UI** components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zeropoint-labs-hostinger
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect to Vercel:**
   - Push your code to GitHub
   - Import the project in Vercel
   - Vercel will automatically detect the Next.js framework

2. **Environment Variables:**
   Add these environment variables in your Vercel dashboard:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `APPWRITE_API_KEY`

3. **Deploy:**
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-project.vercel.app`

### Manual Build

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup-analytics` - Setup Appwrite analytics
- `npm run validate-analytics` - Validate analytics setup

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── login/          # Authentication pages
│   └── ...
├── components/         # Reusable UI components
├── blocks/            # Page blocks/sections
└── lib/               # Utility functions and configurations
```

## Technologies Used

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **3D Graphics:** Three.js, React Three Fiber
- **Backend:** Appwrite
- **UI Components:** Radix UI, Lucide React
- **Development:** ESLint, TypeScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary to Zero Point Labs. 