# Nexsoft Notes App

A full-stack Notes Management System built with HTML, CSS, JavaScript, Bootstrap, jQuery, Node.js, Express, MongoDB, and JWT authentication.

## Live Links

- GitHub Repository: https://github.com/fazal305/nexsoft-notes-app
- Backend API: https://nexsoft-notes-app.onrender.com
- Frontend Demo: https://fazal305.github.io/nexsoft-notes-app/

## Overview

Nexsoft Notes App is a full-stack notes management system created for the Nexsoft Solutions internship.

Users can register, log in, create notes, edit notes, delete notes, pin notes, search notes, and filter notes by category. The backend uses JWT authentication and MongoDB Atlas for persistent storage.

## Features

- User registration
- User login
- JWT-based authentication
- Protected notes dashboard
- Create notes
- Edit notes
- Delete notes with confirmation
- Pin and unpin notes
- Search notes by title or content
- Filter notes by category
- Grid and list view toggle
- Dashboard statistics
- Responsive sidebar layout
- MongoDB Atlas persistence
- Dark neon cyberpunk UI

## Tech Stack

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- Bootstrap Icons
- jQuery
- Vanilla JavaScript
- GitHub Pages

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- Render
  Folder Structure
  nexsoft-notes-app/
  backend/
  middleware/
  authMiddleware.js
  models/
  Note.js
  User.js
  routes/
  auth.js
  notes.js
  .env.example
  package.json
  server.js
  frontend/
  index.html
  dashboard.html
  styles.css
  app.js
  docs/
  index.html
  dashboard.html
  styles.css
  app.js
  .gitignore
  LICENSE
  README.md
  Getting Started

Clone the repository:

git clone https://github.com/fazal305/nexsoft-notes-app.git

Open the project:

cd nexsoft-notes-app

Install backend dependencies:

cd backend
npm install

Create a .env file inside backend/:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=\*

Start the backend:

npm start

Open the frontend:

frontend/index.html

or use VS Code Live Server.

API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
Notes
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id
PATCH /api/notes/:id/pin
Health
GET /api/health
Deployment Notes

The backend can be deployed on Render.

Important backend environment variables:

MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
CLIENT_ORIGIN

The static frontend can be deployed through GitHub Pages using the docs/ folder.

If you update frontend files, copy the updated frontend files into docs/ before pushing:

Copy-Item frontend\index.html docs\index.html -Force
Copy-Item frontend\dashboard.html docs\dashboard.html -Force
Copy-Item frontend\styles.css docs\styles.css -Force
Copy-Item frontend\app.js docs\app.js -Force
Architecture Notes

The app uses a separated frontend and backend structure.

The frontend handles authentication pages, dashboard UI, note modals, search, filters, view toggle, and API calls.
The backend handles authentication, JWT verification, note CRUD operations, MongoDB models, and protected API routes.
Notes are linked to users through userId, so each user only sees their own notes.
Accessibility

Accessibility support includes:

Semantic page structure
Responsive dashboard layout
Form labels and required fields
Keyboard-friendly buttons
Modal-based note form
Clear visual states for actions
Performance

Performance notes:

Static frontend files
Lightweight API responses
MongoDB sorting by pinned and updated notes
Simple dashboard rendering
No frontend build step required
Testing Checklist

Before final submission:

Register a new user
Login with existing user
Create a note
Edit a note
Delete a note
Pin and unpin a note
Search notes
Filter by category
Test grid/list view
Test mobile sidebar
Test logout
Test backend health route
Run syntax checks:
cd backend
npm run check
node --check models/Note.js
node --check routes/auth.js
node --check routes/notes.js
node --check middleware/authMiddleware.js
Lessons Learned
Building a full-stack CRUD application
Creating authentication with JWT
Hashing passwords with bcryptjs
Connecting Express with MongoDB Atlas
Protecting API routes with middleware
Building a responsive dashboard UI
Preparing a full-stack internship project for portfolio use
Future Improvements
Add note tags
Add rich text editing
Add archived notes
Add note sharing
Add password reset
Add frontend route protection improvements
Add refresh token flow
Add automated API tests
Add GitHub Actions workflow
Add custom domain under fazallabs.dev later
