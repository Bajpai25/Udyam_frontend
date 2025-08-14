# Udyam Registration Frontend

A modern, responsive React application that replicates the Udyam registration form with real-time validation and step-by-step workflow.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **React Query** for API state management
- **Zustand** for global state management
- **React Router** for navigation

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Bajpai25/Udyam_frontend
   cd udyam-registration-app/frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update `.env` with your configuration:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=Udyam Registration
   \`\`\`

## 🚀 Development

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linting
npm run lint
\`\`\`

## 📱 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Step-by-Step Registration**: Guided Aadhaar and PAN verification process
- **Real-time Validation**: Immediate feedback with proper error handling
- **Progress Tracking**: Visual progress indicator for registration steps
- **Status Checking**: Check registration status with Aadhaar number
- **Auto-fill**: PIN code to city/state mapping
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🏗️ Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components (Step1Form, Step2Form)
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Page footer
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── RegistrationPage.tsx  # Registration flow
│   └── StatusPage.tsx  # Status checking
├── services/           # API service layer
├── store/             # Zustand state management
├── utils/             # Utility functions
└── __tests__/         # Test files
\`\`\`

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Udyam Registration` |

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker
\`\`\`bash
docker build -t udyam-frontend .
docker run -p 3000:3000 udyam-frontend
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
\`\`\`

## 📚 API Integration

The frontend communicates with the backend API for:
- Form field configuration
- Registration submission (Step 1 & 2)
- Status checking
- Validation rules

## 🎨 Design System

- **Colors**: Professional government portal theme
- **Typography**: Space Grotesk (headings) + DM Sans (body)
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable UI components with proper states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
