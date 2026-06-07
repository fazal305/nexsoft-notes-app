# Nexsoft Notes App

A full-stack Notes Management System built for the Nexsoft Solutions internship.

This project includes user authentication, MongoDB note storage, full CRUD operations, search functionality, pinned notes, category filtering, and a responsive dashboard UI.

---

## Features

- User registration and login
- JWT-based authentication
- Add notes
- Edit notes
- Delete notes with inline confirmation
- Pin and unpin notes
- Search notes by title or content
- Filter notes by category
- Responsive dashboard layout
- MongoDB Atlas database storage
- Dark neon cyberpunk interface

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- Bootstrap Icons
- jQuery
- Vanilla JavaScript

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

---

## Project Structure

```text
nexsoft-notes-app/
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── styles.css
│   └── app.js
├── .gitignore
└── README.md