# WatchOut Developer Guide

## Project Overview

WatchOut is a government transparency portal designed to manage tenders, bids, and complaints. It connects citizens, companies, and government auditors.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth, JWT
- **Storage:** Cloudinary

## Getting Started

### Prerequisites

- Node.js (v16+)
- Firebase Project
- Cloudinary Account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repo-url>
   cd watchOut
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd Backend
   npm install
   cp .env.example .env

   # Fill in .env details

   npm run dev
   \`\`\`

3. **Frontend Setup**
   \`\`\`bash
   cd Frontend
   npm install
   cp .env.example .env
   # Fill in .env details
   npm run dev
   \`\`\`

## Environment Variables

### Backend

- \`PORT\`: Server port (default 5000)
- \`FIREBASE\_\*\`: Firebase Admin SDK credentials
- \`CLOUDINARY\_\*\`: Cloudinary API credentials
- \`JWT_SECRET\`: Secret for signing tokens
- \`EMAIL\_\*\`: Nodemailer credentials

### Frontend

- \`VITE_API_URL\`: Backend API URL
- \`VITE*FIREBASE*\*\`: Firebase Web SDK config

## API Documentation

Swagger documentation is available at \`http://localhost:5000/api-docs\` when the server is running.

## Testing

Run backend tests using Jest:
\`\`\`bash
cd Backend
npm test
\`\`\`

## Deployment

- **Frontend:** Deploy to Vercel/Netlify. Ensure build command is \`npm run build\`.
- **Backend:** Deploy to Railway/Render. Ensure start command is \`npm start\`.

## Project Structure

- \`Backend/src/controllers\`: Business logic
- \`Backend/src/routes\`: API routes
- \`Backend/src/models\`: Data schemas (Zod)
- \`Frontend/src/pages\`: Main application pages
- \`Frontend/src/components\`: Reusable UI components
