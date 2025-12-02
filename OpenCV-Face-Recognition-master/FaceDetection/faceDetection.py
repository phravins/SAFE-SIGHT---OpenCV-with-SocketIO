import numpy as np
import cv2
import os

# Load the pre-trained Haar Cascade classifier for face detection
cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_frontalface_default.xml")
faceCascade = cv2.CascadeClassifier(cascade_path)

# Open a connection to the default camera (index 0)
cap = cv2.VideoCapture(0)
cap.set(3, 640)  # Set width of the camera frame
cap.set(4, 480)  # Set height of the camera frame

while True:
    # Capture frame-by-frame
    ret, img = cap.read()
    
    # Convert the frame to grayscale for the face detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the grayscale frame
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,       # Slightly lower for more accuracy
        minNeighbors=6,        # Increased to reduce false positives
        minSize=(30, 30)       # Minimum size for detection box
    )

    # Draw rectangles around detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]

    # Display the frame with rectangles drawn
    cv2.imshow('video', img)

    # Press 'ESC' to exit the loop
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
