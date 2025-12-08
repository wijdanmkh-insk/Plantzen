# 🌱 Plantzen

A full-stack IoT plant monitoring platform built using **React**, **Firebase Realtime Database**, **Docker**, and **n8n** for workflow automation.  
This system allows real-time data monitoring from ESP32 devices, including soil moisture, temperature, humidity, light intensity, battery level, and network strength.

---

## 🚀 Features

### 🖥️ Frontend (React + Vite)
- Modern UI for Sign Up, Sign In, and Dashboard
- TailwindCSS styling with responsive design
- Real-time sensor data updates via Firebase listeners
- Device pairing through unique ESP32 codes
- Protected routes (Dashboard only accessible when logged in)
- LocalStorage-based session authentication

### 🔥 Backend (Firebase Realtime Database)
- Stores user accounts and paired devices
- Stores sensor readings and device metadata
- Uses environment variables (`.env`) for secure config
- Real-time synchronization across devices & frontend
- Simple to upgrade to Firebase Auth in the future

### 🐳 Docker Deployment
- Custom Docker image for running the frontend
- Supports Vite development server
- Hot reload compatible
- Multi-stage build option ready
- Composable with n8n and additional services

### 🔄 Automation via n8n
- Workflow triggers when:
  - Device sends new sensor values
  - Critical thresholds are crossed
  - Device goes offline
- Can send notifications via:
  - Telegram
  - Email
  - Discord
  - Webhooks

---

## 📁 Project Structureproject/
│── src/
│ ├── pages/
│ ├── components/
│ ├── firebase/
│ │ └── firebase.js
│ └── App.jsx
│
│── public/
│── .env
│── Dockerfile
│── docker-compose.yml
│── package.json
└── README.md


---

## 🔧 Installation

### 1️ Clone the Repository
```bash
git clone https://github.com/wijdanmkh-insk/Plantzen.git
cd Plantzen

### 2 Install Client Dependencies
```bash
npm install

### 3 Create Environment File 
Create .env in the root directory:
VITE_API_KEY=yourApiKey
VITE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_DB_URL=https://yourproject-default-rtdb.firebaseio.com
VITE_PROJECT_ID=yourproject
VITE_STORAGE_BUCKET=yourproject.appspot.com
VITE_SENDER_ID=123456789
VITE_APP_ID=1:123456789:web:abcdef123456

### Run With Docker 🐳
#### Build and Run
```bash
docker compose up --build
#### Stop Containers
```bash
docker compose down

### Access the app
After the services are running, open:
```bash
http://localhost:5173