# ATS-Powered Resume Analyzer

An intelligent Application Tracking System (ATS) that leverages AI to analyze resumes, providing comprehensive feedback and optimization suggestions to help job seekers improve their application materials.

## Overview

This project combines modern web technologies with advanced AI capabilities to create a sophisticated resume analysis platform. The system evaluates resumes against industry standards, identifies areas for improvement, and provides actionable insights to increase ATS compatibility and hiring success rates.

## Tech Stack

### Frontend
- **React 19.1.1** - Modern UI development with the latest React features
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **React Dropzone** - Intuitive drag-and-drop file upload interface
- **React Hot Toast** - Clean, customizable notification system
- **Lucide React** - Modern icon library for consistent UI elements
- **Firebase** - Authentication and cloud services integration

### Backend
- **Node.js with Express 5.1.0** - High-performance server framework
- **Firebase Admin SDK** - Server-side Firebase integration and user management
- **AI Integration**:
  - Google Generative AI (Gemini)

- **Document Processing**:
  - Mammoth - DOCX file parsing
  - PDF Parse & PDF.js - Comprehensive PDF extraction
- **Security & Middleware**:
  - Helmet - Security headers and protection
  - CORS - Cross-origin resource sharing
  - Morgan - HTTP request logging
  - Bcrypt.js - Password hashing and authentication
- **Multer** - Multipart/form-data handling for file uploads

## Features

- **Multi-format Support** - Accepts PDF and DOCX resume formats
- **AI-Powered Analysis** - Leverages cutting-edge language models for intelligent feedback
- **Real-time Processing** - Fast document parsing and analysis
- **User Authentication** - Secure Firebase-based authentication system
- **Responsive Design** - Seamless experience across all devices
- **Comprehensive Feedback** - Detailed insights on resume optimization

## Project Structure

```
├── frontend/              # React application
│   ├── src/
│   └── package.json
├── backend/              # Express server
│   ├── server.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup
- API keys for:
  - Google Generative AI
  - OpenAI (optional)

## Installation

### Backend Setup

```bash
cd backend
npm install

# Create .env file with required credentials
cp .env.example .env
# Add your API keys and configuration
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
FIREBASE_API_KEY=your_firebase_api_key
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
```

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Deployment

> **Note:** This project is currently under development and not yet deployed to production.

Deployment guides for popular platforms will be added upon completion:
- Frontend: Vercel, Netlify, Firebase Hosting
- Backend: Heroku, Railway, AWS, Google Cloud Platform

## Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (to be implemented)
cd backend
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- Google Generative AI for powering intelligent resume analysis
- Firebase for authentication and cloud infrastructure
- The open-source community for the excellent libraries and tools

## Roadmap

- [ ] Production deployment
- [ ] Enhanced AI model integration
- [ ] Resume template library
- [ ] Job description matching
- [ ] ATS compatibility scoring
- [ ] Export optimized resumes
- [ ] User dashboard and analytics

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Status:** 🚧 In Development
