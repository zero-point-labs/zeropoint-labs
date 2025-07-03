# 🚀 ZeroPoint Labs - Next.js Analytics Platform

A modern, privacy-first analytics platform built with Next.js 15, React 19, and Appwrite. Features real-time tracking, comprehensive dashboard, and complete data ownership.

## ✨ Features

### 🔒 Privacy-First Analytics
- **GDPR Compliant** - No cookies, respects Do Not Track
- **Self-Hosted** - Complete data ownership and control
- **Real-time Tracking** - Instant analytics without external dependencies

### 📊 Comprehensive Dashboard
- **Live Metrics** - Real-time visitor and engagement data
- **Traffic Analysis** - Sources, geography, devices, and behavior
- **Form Analytics** - Lead tracking and conversion optimization
- **Export Capabilities** - CSV reports and raw data access

### 🎨 Modern Interface
- **Light/Dark Mode** - Seamless theme switching
- **Mobile Responsive** - Optimized for all devices
- **Smooth Animations** - Framer Motion powered interactions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Add your Appwrite credentials
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Setup Analytics
Visit [http://localhost:3000/dashboard/setup](http://localhost:3000/dashboard/setup) to configure the analytics database.

## 📚 Documentation

**Complete documentation is available in the [`/docs`](./docs/) directory:**

### Quick Links
- **[📖 Complete Documentation](./docs/README.md)** - Full documentation index
- **[🔧 Setup Guide](./docs/setup/appwrite.md)** - Appwrite configuration
- **[📊 Analytics Features](./docs/features/analytics-capabilities.md)** - Tracking capabilities
- **[🚀 Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)** - Production deployment
- **[🔌 Integration Guide](./docs/guides/integration.md)** - Add tracking to websites

### Documentation Structure
```
docs/
├── setup/           # Configuration and setup guides
├── deployment/      # Production deployment guides  
├── features/        # Feature documentation and capabilities
├── guides/          # Integration and usage guides
├── api/             # API reference and endpoints
└── README.md        # Documentation index
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TypeScript** - Type safety and development experience

### Backend
- **Appwrite** - Backend-as-a-Service platform
- **Node.js APIs** - Custom analytics endpoints
- **Real-time Database** - Live data synchronization

### Deployment
- **Docker** - Containerized deployment
- **Nginx** - Reverse proxy and static file serving
- **SSL/TLS** - Secure HTTPS connections
- **VPS Compatible** - Optimized for VPS hosting

## 📊 Analytics Capabilities

### What You Can Track
- **Traffic Analytics** - Page views, sessions, bounce rates
- **User Behavior** - Clicks, scrolling, time on page
- **Geographic Data** - Country and city-level insights
- **Device Analytics** - Browsers, OS, device types
- **Form Tracking** - Submissions, conversions, lead quality
- **Custom Events** - Track any user interaction

### Business Intelligence
- **Real-time Metrics** - Live visitor and engagement data
- **Historical Trends** - Growth patterns and analysis
- **Traffic Sources** - Referrers, campaigns, social media
- **Conversion Funnels** - User journey and optimization
- **Performance Reports** - Comprehensive data exports

## 🚀 Deployment

### Development
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Production
For production deployment on VPS with Docker, SSL, and custom domains:
```bash
# See complete deployment guide
cat docs/deployment/DEPLOYMENT_GUIDE.md
```

### Analytics Setup
```bash
npm run setup-analytics    # Interactive setup guide
npm run test-setup         # Validate configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [Complete Docs](./docs/README.md)
- **Setup Issues**: [Setup Guides](./docs/setup/)
- **Deployment Help**: [Deployment Guides](./docs/deployment/)
- **Feature Requests**: [GitHub Issues](../../issues)

---

**Built with ❤️ by ZeroPoint Labs**
