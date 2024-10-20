# WhatsApp Web Clone (MERN Stack)

A full-stack WhatsApp Web clone built with the MERN stack (MongoDB, Express, React, Node.js), Redux, Socket.io for real-time communication, and WebRTC for video/audio calls. This project aims to replicate the key features of WhatsApp Web, including real-time messaging, group chats, and voice/video calling.

## Features

- **Authentication**:
  - Google Sign-In using Firebase Authentication.
  - User session management.
- **Real-time Messaging**:
  - One-on-one chats with real-time updates.
  - Group chat functionality.
  - Message history persistence using MongoDB.
  - Read receipts and message status (delivered, seen).
  - Emojis, media file sharing (images, videos, documents).
- **Voice/Video Calls**:
  - One-on-one voice and video calls using WebRTC and Socket.io.
  - Call status (ringing, connected, disconnected).
  - Mute/unmute audio, enable/disable video.
- **Typing Indicators**:
  - See when another user is typing in a chat.
- **Online/Offline Status**:
  - Real-time status updates for users (online, offline, last seen).
- **Notifications**:
  - In-app notifications for new messages and missed calls.
- **Profile and Settings**:
  - Update profile information (name, status, profile picture).
  - Configure notifications and privacy settings.

## Tech Stack

### Backend:

- **Node.js** and **Express.js**: Server-side framework for API and WebSocket connections.
- **MongoDB**: NoSQL database for storing users, messages, and call data.
- **Socket.io**: For real-time, bi-directional communication between client and server (messaging, calls).
- **WebRTC**: Peer-to-peer protocol for video/audio calls.
- **Firebase Authentication**: Google Sign-In for user authentication.

### Frontend:

- **React.js**: Frontend library for building the user interface.
- **Redux**: State management for handling authentication, messages, and real-time data.
- **Socket.io-client**: Real-time communication with the backend.
- **React-Redux**: Connects React components to the Redux store.

### Tools:

- **Vite**: Build tool for faster development.
- **Postman**: API testing tool.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14+)
- MongoDB (running locally or on cloud services like MongoDB Atlas)
- Firebase Project (for Google Authentication)
- Web browser (for frontend)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/whatsapp-web-clone.git
   cd whatsapp-web-clone
   ```
