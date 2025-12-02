import numpy as np
import cv2
import os

# Load the pre-trained Haar Cascade classifiers for face, eye, and smile detection
face_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_frontalface_default.xml")
eye_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_eye.xml")
smile_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_smile.xml")
faceCascade = cv2.CascadeClassifier(face_cascade_path)
eyeCascade = cv2.CascadeClassifier(eye_cascade_path)
smileCascade = cv2.CascadeClassifier(smile_cascade_path)

# Open a connection to the default camera (index 0)
cap = cv2.VideoCapture(1)
cap.set(3, 640)  # Set width of the camera frame
cap.set(4, 480)  # Set height of the camera frame

while True:
    # Capture frame-by-frame
    ret, img = cap.read()
    
    # Flip the image horizontally to correct the view
    img = cv2.flip(img, 1)  # Use 1 for horizontal flipping
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert to grayscale for detection

    # Detect faces in the grayscale frame
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,  # Reduced scale factor for better accuracy
        minNeighbors=8,    # Increased to reduce false positives
        minSize=(30, 30)
    )

    # Draw rectangles around detected faces and look for eyes and smiles within each face
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Blue box for face
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]

        # Detect eyes within the region of interest (the detected face)
        eyes = eyeCascade.detectMultiScale(
            roi_gray,
            scaleFactor=1.1,  # Adjusted scale factor for better accuracy
            minNeighbors=10,   # Increased to reduce false positives
            minSize=(25, 25)
        )
        
        # Draw rectangles around detected eyes
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 0, 255), 2)  # Red box for eyes
        
        # Detect smiles within the region of interest (the detected face)
        smile = smileCascade.detectMultiScale(
            roi_gray,
            scaleFactor=1.1,  # Adjusted scale factor for better accuracy
            minNeighbors=15,
            minSize=(25, 25),
        )
        
        # Draw rectangles around detected smiles
        for (xx, yy, ww, hh) in smile:
            cv2.rectangle(roi_color, (xx, yy), (xx + ww, yy + hh), (0, 255, 0), 2)  # Green box for smiles

    # Display the frame with rectangles drawn around faces, eyes, and smiles
    cv2.imshow('video', img)

    # Press 'ESC' to exit the loop
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
