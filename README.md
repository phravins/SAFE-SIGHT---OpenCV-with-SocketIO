# 🔐 SafeSight - AI-Powered Facial Recognition Security System

<div align="center">

![SafeSight Banner](assets/safesight-banner.jpg)

</div>

![SafeSight Logo](https://img.shields.io/badge/SafeSight-Security%20System-blue?style=for-the-badge)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg?style=flat&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.12+-5C3EE8.svg?style=flat&logo=opencv)](https://opencv.org/)

**A real-time facial recognition security system with web-based monitoring and intelligent alerts**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Documentation](#-documentation)

## 🔍 Overview

SafeSight is an advanced security system that combines **OpenCV facial recognition** with a modern **React web interface** to provide real-time monitoring and intelligent alerts. The system can detect and recognize authorized individuals while flagging unknown persons with instant notifications.

### Key Capabilities

- **Real-time Face Recognition**: LBPH algorithm with Haar Cascade detection
- **Live Video Streaming**: MJPEG stream with face detection overlays
- **Intelligent Alerts**: WebSocket-based real-time notifications
- **Voice Announcements**: Text-to-speech for recognition events
- **Multi-User Management**: Admin dashboard for user control
- **Role-Based Access**: Separate admin and user interfaces

---

## ✨ Features

### 🎥 Facial Recognition
- ✅ **LBPH (Local Binary Patterns Histograms)** face recognition
- ✅ **Haar Cascade** classifier for face detection
- ✅ **Confidence scoring** with adjustable thresholds
- ✅ **Multi-person training** with individual datasets
- ✅ **Real-time detection** at 10-15 FPS

### 🌐 Web Interface
- ✅ **Live camera feed** with detection overlays
- ✅ **Unified login system** for admin and users
- ✅ **Admin dashboard** with user management
- ✅ **Real-time alerts** with visual and audio notifications
- ✅ **Responsive design** with Tailwind CSS
- ✅ **Dark mode** interface

### 🔔 Alerts & Notifications
- ✅ **Unknown person detection** with instant alerts
- ✅ **Voice-over announcements** for known/unknown persons
- ✅ **Alert history** with timestamps
- ✅ **SMS & Email ready** (integration templates included)

### 👥 User Management
- ✅ **User registration** with admin approval
- ✅ **User deletion** with safeguards
- ✅ **Role-based permissions** (admin/user)
- ✅ **Session management** with secure logout

---

## 🎬 Demo

### Monitor Screen
- Live video feed with real-time face detection
- System status indicators (Camera, Face Recognition, Voice)
- Recent alerts list with timestamps

### Admin Dashboard
- User management table
- Registration approval system
- Manual user addition
- Delete user functionality

---

## 📦 Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Webcam**: Built-in or external USB camera
- **Python**: 3.10 or higher
- **Node.js**: 18 or higher
- **npm**: 9 or higher

### Hardware Recommendations
- **RAM**: 4GB minimum, 8GB recommended
- **Processor**: Dual-core 2.0 GHz or higher
- **Storage**: 500MB free space

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/safesight.git
cd safesight
```

### 2. Set Up Python Backend

```bash
# Install Python dependencies
pip install -r requirements.txt
```

**Dependencies installed:**
- flask
- flask-cors
- flask-socketio
- opencv-python
- numpy
- pillow
- python-socketio

### 3. Set Up React Frontend

```bash
cd safe-sight-web
npm install
```

**Key dependencies:**
- react
- react-router-dom
- typescript
- tailwindcss
- socket.io-client
- lucide-react

### 4. Train the Facial Recognition Model

```bash
cd OpenCV-Face-Recognition-master/FacialRecognition

# Capture face images (30 per person)
python 01_face_dataset.py
# Enter user ID when prompted (e.g., "John Doe")

# Train the model
python 02_face_training.py
```

**Training Output:**
```
[INFO] Training faces...
[DEBUG] Processing folder: User_John Doe
[DEBUG] John Doe: 30 images, 28 faces detected
[INFO] Model trained and saved at ../trainer/trainer.yml
```

---

## 🎯 Usage

### Starting the Application

#### 1. Start the Flask Backend (Terminal 1)

```bash
cd "d:/SAFE SIGHT"
python face_recognition_server.py
```

**Expected Output:**
```
==================================================
SafeSight Face Recognition Server
==================================================
Video feed: http://localhost:5000/video_feed
Status API: http://localhost:5000/api/status
WebSocket: ws://localhost:5000
==================================================
 * Running on http://127.0.0.1:5000
```

#### 2. Start the React Frontend (Terminal 2)

```bash
cd safe-sight-web
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 3. Access the Application

Open your browser and navigate to: **http://localhost:5173/login**

### User Accounts

#### Default Admin Account
- **Username**: `phravin`
- **Password**: `2005`

#### User Login
- Users must register and wait for admin approval
- Login via the "User Login" tab

### Adding New Users

**Method 1: User Registration**
1. Go to Login page
2. Click "User Login" tab
3. Click "Register now"
4. Fill in details and submit
5. Admin approves from dashboard

**Method 2: Admin Addition**
1. Login as admin
2. Go to "All Users" tab
3. Click "Add User" button
4. Fill in user details

### Training for New Users

```bash
# Stop the Flask server (Ctrl+C)

cd OpenCV-Face-Recognition-master/FacialRecognition

# Capture images
python 01_face_dataset.py
# Enter user's full name

# Retrain model
python 02_face_training.py

# Restart Flask server
cd ../..
python face_recognition_server.py
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SafeSight System                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐         ┌─────────────────────┐  │
│  │  Python Backend     │         │  React Frontend     │  │
│  │  (Flask + OpenCV)   │         │  (TypeScript)       │  │
│  ├─────────────────────┤         ├─────────────────────┤  │
│  │                     │         │                     │  │
│  │ • Face Detection    │◄──HTTP──│ • Monitor Page      │  │
│  │ • LBPH Recognition  │         │ • Admin Dashboard   │  │
│  │ • MJPEG Streaming   │         │ • User Management   │  │
│  │ • SocketIO Events   │◄──WS────│ • Login System      │  │
│  │                     │         │                     │  │
│  └─────────────────────┘         └─────────────────────┘  │
│           │                               │                │
│           │                               │                │
│           ▼                               ▼                │
│  ┌─────────────────────┐         ┌─────────────────────┐  │
│  │  trainer.yml        │         │  LocalStorage       │  │
│  │  names.json         │         │  (Users, Alerts)    │  │
│  │  dataset/           │         │                     │  │
│  └─────────────────────┘         └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend
- **Flask**: Web framework
- **OpenCV**: Computer vision & face recognition
- **SocketIO**: Real-time WebSocket communication
- **NumPy**: Array processing

#### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Socket.io-client**: WebSocket client
- **React Router**: Navigation

#### Algorithms
- **LBPH**: Face recognition algorithm
- **Haar Cascade**: Face detection classifier

---

## 📁 Project Structure

```
SAFE SIGHT/
├── face_recognition_server.py      # Flask backend server
├── requirements.txt                 # Python dependencies
├── README.md                        # This file
├── walkthrough.md                   # Detailed integration guide
│
├── OpenCV-Face-Recognition-master/
│   ├── dataset/                     # Training images
│   │   ├── User_PHRAVIN S/
│   │   └── User_SIVA GURUNATHAN/
│   ├── trainer/                     # Trained models
│   │   ├── trainer.yml
│   │   └── names.json
│   └── FacialRecognition/
│       ├── 01_face_dataset.py       # Image capture script
│       ├── 02_face_training.py      # Model training script
│       └── 03_face_recognition.py   # Standalone recognition
│
└── safe-sight-web/                  # React frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   │   ├── AuthContext.tsx      # Authentication
    │   │   └── DataContext.tsx      # Data management
    │   ├── pages/
    │   │   ├── Login.tsx            # Unified login
    │   │   ├── Monitor.tsx          # Live monitoring
    │   │   └── AdminDashboard.tsx   # Admin panel
    │   ├── types.ts                 # TypeScript types
    │   └── App.tsx                  # Main app
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Configuration

### Adjusting Recognition Threshold

Edit `face_recognition_server.py` line 115:

```python
# Lower value = stricter matching
# Higher value = more lenient matching
if confidence < 55:  # Change this value
    detection_type = 'known'
else:
    detection_type = 'unknown'
```

**Recommended Values:**
- **Single Person**: `70` (lenient)
- **2-3 People**: `55` (balanced)
- **4+ People**: `45` (strict)

### Changing Camera Source

Edit `face_recognition_server.py` line 59:

```python
camera = cv2.VideoCapture(1, cv2.CAP_DSHOW)
# 0 = Built-in camera
# 1 = External USB webcam
```

### Event Cooldown

Edit `face_recognition_server.py` line 77:

```python
EVENT_COOLDOWN = 3  # Seconds between events
```

---

## 📡 API Documentation

### HTTP Endpoints

#### GET /video_feed
- **Description**: MJPEG video stream with face detection
- **Response**: Continuous MJPEG stream
- **Headers**: `multipart/x-mixed-replace; boundary=frame`

#### GET /api/status
- **Description**: Server health check
- **Response**:
```json
{
  "status": "online",
  "camera": true,
  "model_loaded": true,
  "names_count": 2
}
```

### WebSocket Events

#### face_detected
- **Direction**: Server → Client
- **Payload**:
```typescript
{
  name: string,           // "PHRAVIN S" or "Unknown"
  confidence: number,     // 0-100
  timestamp: string,      // ISO 8601
  type: 'known' | 'unknown'
}
```

#### connection_status
- **Direction**: Server → Client
- **Payload**:
```typescript
{
  status: 'connected'
}
```

---

## 🔧 Troubleshooting

### Camera Not Opening

**Problem**: `[ERROR] Could not open camera`

**Solutions:**
1. Check if another application is using the camera
2. Try different camera index (0, 1, 2)
3. Verify camera permissions
4. Restart computer

### Low Face Detection Rate

**Problem**: Only 10-15 faces detected from 30 images

**Solutions:**
1. **Improve Lighting**: Use bright, even lighting
2. **Face Camera Directly**: Look at camera while capturing
3. **Slow Movements**: Move head slowly between captures
4. **Clean Background**: Remove clutter behind you
5. **Ideal Distance**: Stay 2-3 feet from camera

### Wrong Person Recognized

**Problem**: Person A shows as Person B

**Solutions:**
1. **Retrain with better data**: Recapture images in good lighting
2. **Adjust threshold**: Lower confidence threshold
3. **More training samples**: Capture 50+ images per person
4. **Check dataset**: Ensure folders are correctly named

### Video Feed Black Screen

**Problem**: Monitor shows black screen

**Solutions:**
1. Verify Flask server is running
2. Check browser console for errors
3. Hard refresh (Ctrl+Shift+R)
4. Test direct stream: `http://localhost:5000/video_feed`

### Flask Server Restarts Repeatedly

**Problem**: Camera error after restart

**Solution:** Disable auto-reloader (already implemented)
```python
socketio.run(app, debug=True, use_reloader=False)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript/Python best practices
- Add comments for complex logic
- Update README for new features
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **PHRAVIN S** - *Computer programmer* - [GitHub Profile](https://github.com/phravins)

---

## 🙏 Acknowledgments

- OpenCV community for face recognition algorithms
- React team for the excellent framework
- Flask team for the lightweight web framework
- Contributors and testers

---

## 📞 Support

For issues and questions:
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/safesight/issues)
- **Documentation**: See [walkthrough.md](walkthrough.md) for detailed setup

**Made with ❤️ for enhanced security**

⭐ Star this repo if you find it helpful!

</div>
