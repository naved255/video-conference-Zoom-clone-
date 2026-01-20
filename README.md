# Video Conference Zoom Clone

[Live Demo](https://video-conference-zoom-clone-psi.vercel.app/)

---

## Overview

This is a **full-stack Video Conferencing application** built with **React, Node.js, Express, MongoDB, Passport.js, and Socket.io**.  
It is inspired by **Zoom** and allows real-time video/audio communication with multiple participants.  

This project helped me **learn and implement modern web development concepts**, including authentication, session management, real-time communication, and deployment on cloud platforms.

---

## Features

### User Authentication
- **Sign Up / Login** with secure password handling using `passport-local`
- **Session management** using `express-session` and `connect-mongo`
- **Persistent login**: Users remain logged in across sessions
- **Secure cookies**: httpOnly, SameSite, and Secure flags

### Video Conferencing
- **Real-time video/audio calls** using WebRTC and Socket.io
- **Multiple participants support** in a single meeting room
- **Mute / Unmute microphone**
- **Turn on/off camera**
- **Screen sharing**
- **Leave / End call functionality**

### Chat & Collaboration
- **Real-time chat** alongside the video call
- **Meeting history** saved per user using MongoDB

### UI / UX
- **Responsive interface** with React and Tailwind CSS v4
- **Interactive controls** for microphone, camera, screen sharing
- **Dynamic user interface** reflecting participants joining/leaving

### Deployment
- **Backend deployed on Render**
- **Frontend deployed on Vercel**
- Cross-domain session management and CORS handling
- Real-time communication works seamlessly in production

---

## Tech Stack

- **Frontend:** React, Tailwind CSS v4, Axios  
- **Backend:** Node.js, Express, Socket.io  
- **Authentication:** Passport.js, express-session, connect-mongo  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel (frontend), Render (backend)  
- **Others:** WebRTC for video/audio streaming

---

## What I Learned

- Building a **full-stack real-time web app** from scratch
- Implementing **WebRTC video/audio streaming**
- Handling **authentication, sessions, and cookies securely**
- Using **Socket.io** for real-time communication
- Deploying **frontend and backend separately** with proper CORS and session handling
- Writing **responsive and interactive UI** using Tailwind CSS
- Debugging deployment issues on **Vercel and Render**

--

## Getting Started

### Clone the repository
```bash
git clone https://github.com/your-username/video-conference-zoom-clone.git
cd video-conference-zoom-clone
