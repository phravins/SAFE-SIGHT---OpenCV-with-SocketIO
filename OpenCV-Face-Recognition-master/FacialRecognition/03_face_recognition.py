
import cv2
import numpy as np
import os

# Load the trained model
recognizer = cv2.face.LBPHFaceRecognizer_create()  # type: ignore
model_path = os.path.join(os.path.dirname(__file__), "..", "trainer", "trainer.yml")
recognizer.read(model_path)

# Load Haar Cascade for face detection
cascadePath = os.path.join(os.path.dirname(__file__), "..", "FaceDetection", "Cascades", "haarcascade_frontalface_default.xml")

# Check if the cascade file exists
if not os.path.isfile(cascadePath):
    print(f"Error: The cascade file at {cascadePath} does not exist.")
    exit()

faceCascade = cv2.CascadeClassifier(cascadePath)

font = cv2.FONT_HERSHEY_SIMPLEX

# Initialize ID counter
id = 0

# Load names from JSON mapping
names = ['Unknown']  # Index 0 is Unknown
names_path = os.path.join(os.path.dirname(__file__), "..", "trainer", "names.json")
if os.path.isfile(names_path):
    import json
    with open(names_path, 'r') as f:
        name_to_id = json.load(f)
        # Create a list where index corresponds to ID
        max_id = max(name_to_id.values()) if name_to_id else 0
        names = ['Unknown'] * (max_id + 1)
        for name, id_val in name_to_id.items():
            names[id_val] = name
    print(f"Loaded names: {names}")
else:
    print("Warning: Names mapping not found. Using default names.")
    names = ['Unknown', 'PHRAVIN S','SIVA GURUNATHAN']  # Fallback

# Initialize and start real-time video capture
cam = cv2.VideoCapture(1, cv2.CAP_DSHOW)  # Use DSHOW backend for Windows compatibility
if not cam.isOpened():
    print("Error: Could not open camera.")
    exit()
cam.set(3, 640)  # Set video width
cam.set(4, 480)  # Set video height

# Define min window size to be recognized as a face
minW = 0.1 * cam.get(3)
minH = 0.1 * cam.get(4)

# Store the last recognized id and confidence for display
last_id = "unknown"
last_confidence = "60%"
display_duration = 30  # Duration to display ID and confidence in frames
frame_count = 0  # Frame counter for displaying ID and confidence
displayed = False  # Track whether the ID is displayed

while True:
    ret, img = cam.read()
    
    if not ret:
        print("Failed to capture image")
        break

    # Remove the flipping to fix upside-down image
    # img = cv2.flip(img, 0)  # Flip vertically
    img = cv2.flip(img, 1)  # Uncomment this line if you want to flip horizontally for mirror effect

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(int(minW), int(minH)),
    )

    detected_face = False  # Track if any face is detected

    for (x, y, w, h) in faces:
        detected_face = True  # A face has been detected
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Predict the ID of the detected face
        id, confidence = recognizer.predict(gray[y:y + h, x:x + w])

        # Check if confidence is less than 100 ==> "0" is a perfect match
        if confidence < 100:
            last_id = names[id] if id < len(names) else "unknown"  # Get the name corresponding to the ID
            last_confidence = "  {0}%".format(round(100 - confidence))
        else:
            last_id = "unknown"
            last_confidence = "  {0}%".format(round(100 - confidence))

        # Display the ID and confidence on the video frame
        cv2.putText(img, str(last_id), (x + 5, y - 5), font, 1, (255, 255, 255), 2)
        cv2.putText(img, str(last_confidence), (x + 5, y + h - 5), font, 1, (255, 255, 0), 1)

    # If no face is detected, maintain the last displayed ID and confidence
    if not detected_face:
        frame_count = 0  # Reset frame count when no face is detected
        displayed = True  # Mark that we are displaying the last recognized ID

    # Check if we should continue displaying the last recognized ID and confidence
    if displayed:
        if frame_count < display_duration:
            cv2.putText(img, str(last_id), (10, 30), font, 1, (255, 255, 255), 2)
            cv2.putText(img, str(last_confidence), (10, 60), font, 1, (255, 255, 0), 1)
            frame_count += 1  # Increment

    cv2.imshow('camera', img)
    k = cv2.waitKey(10) & 0xff  # Press 'ESC' for exiting video
    if k == 27:
        break

# Do a bit of cleanup
print("\n [INFO] Exiting Program and cleanup stuff")
cam.release()
cv2.destroyAllWindows()
