# Udyam Registration Form Replication

A full-stack application that replicates the Udyam registration process with web scraping, responsive UI, and robust backend validation.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Web Scraping**: Playwright
- **Testing**: Jest + React Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone and setup**
   \`\`\`bash
   git clone <repository-url>
   cd udyam-registration-app
   npm run setup
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   
   # Frontend
   cp frontend/.env.example frontend/.env
   \`\`\`

3. **Database Setup**
   \`\`\`bash
   cd backend
   npm run db:push
   npm run db:seed
   \`\`\`

4. **Run Web Scraper** (Optional - form schema included)
   \`\`\`bash
   npm run scrape
   \`\`\`

5. **Start Development**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📁 Project Structure

\`\`\`
udyam-registration-app/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── prisma/            # Database schema & migrations
│   └── tests/             # Backend tests
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API calls
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   └── tests/             # Frontend tests
├── scraper/               # Web scraping module
│   ├── src/
│   │   ├── scraper.ts     # Main scraper
│   │   └── types.ts       # Scraper types
│   └── output/            # Scraped data
└── docker-compose.yml     # Development environment
\`\`\`

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both applications for production
- `npm run test` - Run all tests
- `npm run scrape` - Run web scraper
- `npm run setup` - Install all dependencies

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
\`\`\`

## 🐳 Docker Deployment

\`\`\`bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
\`\`\`

## 📋 Features

- ✅ Web scraping of Udyam registration form
- ✅ Responsive React UI with mobile-first design
- ✅ Real-time form validation (PAN, Aadhaar formats)
- ✅ REST API with comprehensive validation
- ✅ PostgreSQL database with Prisma ORM
- ✅ TypeScript throughout for type safety
- ✅ Comprehensive test coverage
- ✅ Docker containerization
- ✅ Auto-fill PIN code to city/state mapping

## 🔐 Environment Variables

### Backend (.env)
\`\`\`
DATABASE_URL=postgresql://username:password@localhost:5432/udyam_db
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Udyam Registration
\`\`\`

## 📚 API Documentation

### Endpoints

- `GET /api/form/fields` - Get form field configuration
- `POST /api/registration/step1` - Submit Aadhaar details
- `POST /api/registration/step2` - Submit PAN details
- `POST /api/validation/aadhaar` - Validate Aadhaar format
- `POST /api/validation/pan` - Validate PAN format
- `GET /api/validation/pincode/:code` - Get city/state by PIN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
