# GIDYAI Audit Log Dashboard

A full-stack audit log management dashboard built with **React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB**. The application enables users to upload, search, filter, sort, and monitor audit logs through a clean and responsive interface.

## 🚀 Features

- Bulk audit log upload
- Advanced search functionality
- Filter logs by severity, status, role, and region
- Sort logs dynamically
- Pagination support
- Responsive UI with Tailwind CSS
- RESTful API integration
- MongoDB-based storage

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## 📁 Project Structure

```bash
GIDYAI/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── public/
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/iyalarasuofficial/gidyai-audit-log-dashboard.git
cd gidyai-audit-log-dashboard
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|----------|-----------|-------------|
| POST | `/api/logs/upload` | Upload audit logs |
| GET | `/api/logs` | Fetch logs with filters |
| GET | `/health` | Health check |

## 🚀 Deployment

| Service | URL |
|----------|-----|
| Frontend | https://gidyai-audit-log-dashboard.vercel.app/ |
| Backend API | https://gidyai-audit-log-dashboard-backend.onrender.com |

## 👨‍💻 Author

**Iyalarasu C**  
B.E Computer Science and Engineering  
Saveetha Engineering College

GitHub: https://github.com/iyalarasuofficial

---

### Resume Project Description

Developed a full-stack Audit Log Dashboard using React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB. Implemented log upload, filtering, searching, sorting, and pagination features with RESTful APIs for efficient audit monitoring and analysis.
