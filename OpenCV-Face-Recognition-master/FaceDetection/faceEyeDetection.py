import numpy as np
import cv2
import os

# Load the pre-trained Haar Cascade classifiers for face and eye detection
face_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_frontalface_default.xml")
eye_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_eye.xml")
faceCascade = cv2.CascadeClassifier(face_cascade_path)
eyeCascade = cv2.CascadeClassifier(eye_cascade_path)

# Open a connection to the default camera (index 0)
cap = cv2.VideoCapture(0)
cap.set(3, 640)  # Set width of the camera frame
cap.set(4, 480)  # Set height of the camera frame

while True:
    # Capture frame-by-frame
    ret, img = cap.read()
    
    # Flip the image horizontally to correct the orientation
    img = cv2.flip(img, 1)

    # Convert the frame to grayscale for face and eye detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the grayscale frame
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,      # Lower scaleFactor for more precision
        minNeighbors=7,       # Increased to reduce false positives
        minSize=(30, 30)
    )

    # Draw rectangles around detected faces and look for eyes within each face
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Blue box for face
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]

        # Detect eyes within the region of interest (the detected face)
        eyes = eyeCascade.detectMultiScale(
            roi_gray,
            scaleFactor=1.1,    # Lower scaleFactor for eye detection precision
            minNeighbors=10,    # Increased for more accuracy
            minSize=(10, 10)
        )
        
        # Draw rectangles around detected eyes
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 0, 255), 2)  # Red box for eyes
               
    # Display the frame with rectangles drawn around faces and eyes
    cv2.imshow('video', img)

    # Press 'ESC' to exit the loop
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()

