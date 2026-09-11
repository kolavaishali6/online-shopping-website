# Full-Stack Online Shopping Website

A modern e-commerce web application built from scratch with React, Vite, Node.js, Express, and MongoDB.

## Tech Stack
- **Frontend**: React, Vite, React Router, Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

## Project Architecture
```
online-shopping-website/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controller logic
│   ├── middleware/      # Auth, error handling, etc.
│   ├── models/          # Mongoose data schemas
│   ├── routes/          # Express API route handlers
│   ├── utils/           # Helper functions & utilities
│   ├── .env.example     # Backend environment template
│   ├── package.json     # Backend dependencies and scripts
│   └── server.js        # Express server entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Media and icons
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state providers (Auth, Cart)
│   │   ├── pages/       # Application views/routes
│   │   ├── services/    # API client functions
│   │   ├── App.jsx      # Main application component
│   │   ├── index.css    # Global stylesheet and theme
│   │   └── main.jsx     # Frontend entry point
│   ├── index.html       # Vite HTML template
│   ├── package.json     # Frontend dependencies and scripts
│   └── vite.config.js   # Vite configuration with API proxy
└── README.md
```

## Getting Started

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and adjust settings as needed.
4. `npm run dev` (Starts backend server on port 5000)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts Vite development server on port 5173)
