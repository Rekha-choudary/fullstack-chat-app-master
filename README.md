


# Fullstack-chat-app-master
Real-time chat app with authentication, online status, image sharing, typing indicators, profile management, and multi-theme UI. Built using MERN + Socket.io with a clean, responsive design.
# Chatty – Real-Time Chat Application

Chatty is a full-stack real-time chat app built using the **MERN** stack and **Socket.io**.  
It supports text messaging, image sharing, live online status, themes, and profile management.

---

## Tech Stack

- **Frontend:** React, Zustand, React Router, TailwindCSS, DaisyUI, Axios, Lucide Icons
- **Backend:** Node.js, Express.js, Socket.io, MongoDB, Mongoose, JWT, Cloudinary
- **Real-Time:** Socket.io (WebSocket)

---

## Installation

### Backend

```bash
cd backend
npm install
npm start
```
---

### Create .env file inside /backend
``` bash
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5173
```
---

###Project Structure
```bash
fullstack-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── index.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── pages/
│   │   └── main.jsx
│   └── .env
│
└── README.md

