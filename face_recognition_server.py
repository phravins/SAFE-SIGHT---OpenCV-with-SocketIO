"""
SafeSight Face Recognition Server
Flask backend for streaming OpenCV facial recognition to web frontend
"""

from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import os
import json
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
socketio = SocketIO(app, cors_allowed_origins="*")

# Load the trained face recognition model
recognizer = cv2.face.LBPHFaceRecognizer_create()
model_path = os.path.join(os.path.dirname(__file__), "OpenCV-Face-Recognition-master", "trainer", "trainer.yml")

# Check if model exists
if not os.path.isfile(model_path):
    print(f"[ERROR] Trained model not found at {model_path}")
    print("[INFO] Please run 02_face_training.py first to train the model")
    exit()

recognizer.read(model_path)
print(f"[INFO] Loaded trained model from {model_path}")

# Load Haar Cascade for face detection
cascade_path = os.path.join(os.path.dirname(__file__), "OpenCV-Face-Recognition-master", "FacialRecognition", "haarcascade_frontalface_default.xml")
if not os.path.isfile(cascade_path):
    print(f"[ERROR] Haar Cascade file not found at {cascade_path}")
    exit()

face_cascade = cv2.CascadeClassifier(cascade_path)
print(f"[INFO] Loaded Haar Cascade from {cascade_path}")

# Load names from JSON mapping
names = ['Unknown']  # Index 0 is Unknown
names_path = os.path.join(os.path.dirname(__file__), "OpenCV-Face-Recognition-master", "trainer", "names.json")
if os.path.isfile(names_path):
    with open(names_path, 'r') as f:
        name_to_id = json.load(f)
        # Create a list where index corresponds to ID
        max_id = max(name_to_id.values()) if name_to_id else 0
        names = ['Unknown'] * (max_id + 1)
        for name, id_val in name_to_id.items():
            names[id_val] = name
    print(f"[INFO] Loaded names: {names}")
else:
    print("[WARNING] Names mapping not found. Using default names.")
    names = ['Unknown', 'Default User']

# Initialize webcam
camera = cv2.VideoCapture(1, cv2.CAP_DSHOW)  # Use camera 1 (external webcam)
if not camera.isOpened():
    print("[ERROR] Could not open camera")
    exit()

camera.set(3, 640)  # Set width
camera.set(4, 480)  # Set height
print("[INFO] Camera initialized successfully")

# State management
last_detection = {
    'name': None,
    'confidence': 0,
    'timestamp': None,
    'type': None  # 'known' or 'unknown'
}

# Cooldown to prevent spamming events (in seconds)
EVENT_COOLDOWN = 3
last_event_time = 0

def generate_frames():
    """Generate video frames with face recognition"""
    global last_detection, last_event_time
    
    font = cv2.FONT_HERSHEY_SIMPLEX
    minW = 0.1 * camera.get(3)
    minH = 0.1 * camera.get(4)
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        
        # Flip horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(int(minW), int(minH))
        )
        
        current_time = time.time()
        
        for (x, y, w, h) in faces:
            # Draw rectangle around face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Predict the ID of the detected face
            id, confidence = recognizer.predict(gray[y:y + h, x:x + w])
            
            # Determine name and confidence
            # Lower confidence = better match. Use stricter threshold for multiple people (< 55)
            if confidence < 55:
                name = names[id] if id < len(names) else "Unknown"
                confidence_text = f"{round(100 - confidence)}%"
                detection_type = 'known'
            else:
                name = "Unknown"
                confidence_text = f"{round(100 - confidence)}%"
                detection_type = 'unknown'
            
            # Display name and confidence on frame
            cv2.putText(frame, str(name), (x + 5, y - 5), font, 1, (255, 255, 255), 2)
            cv2.putText(frame, str(confidence_text), (x + 5, y + h - 5), font, 1, (255, 255, 0), 1)
            
            # Emit WebSocket event if detection changed or cooldown passed
            if (current_time - last_event_time > EVENT_COOLDOWN):
                if name != last_detection['name'] or detection_type != last_detection['type']:
                    event_data = {
                        'name': name,
                        'confidence': round(100 - confidence) if confidence < 100 else 0,
                        'timestamp': datetime.now().isoformat(),
                        'type': detection_type
                    }
                    
                    # Emit event to all connected clients
                    socketio.emit('face_detected', event_data)
                    
                    # Update last detection
                    last_detection = event_data
                    last_event_time = current_time
                    
                    print(f"[EVENT] {detection_type.upper()}: {name} ({confidence_text})")
        
        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        
        # Yield frame in byte format for MJPEG streaming
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame',
        headers={
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Access-Control-Allow-Origin': '*'
        }
    )

@app.route('/api/status')
def status():
    """Get server status"""
    return jsonify({
        'status': 'online',
        'camera': camera.isOpened(),
        'model_loaded': True,
        'names_count': len(names) - 1  # Exclude 'Unknown'
    })

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('[WEBSOCKET] Client connected')
    emit('connection_status', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('[WEBSOCKET] Client disconnected')

if __name__ == '__main__':
    print("\n" + "="*50)
    print("SafeSight Face Recognition Server")
    print("="*50)
    print(f"Video feed: http://localhost:5000/video_feed")
    print(f"Status API: http://localhost:5000/api/status")
    print(f"WebSocket: ws://localhost:5000")
    print("="*50 + "\n")
    
    # Run the Flask app with SocketIO
    # use_reloader=False prevents camera conflicts on restart
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False)

