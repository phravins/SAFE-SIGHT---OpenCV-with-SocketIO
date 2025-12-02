import cv2
import os

# Load the Haar Cascade classifiers for face and smile detection
face_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_frontalface_default.xml")
smile_cascade_path = os.path.join(os.path.dirname(__file__), "Cascades", "haarcascade_smile.xml")
faceCascade = cv2.CascadeClassifier(face_cascade_path)
smileCascade = cv2.CascadeClassifier(smile_cascade_path)

# Open a connection to the default camera (index 0)
cap = cv2.VideoCapture(0)
cap.set(3, 640)  # Set width of the camera frame
cap.set(4, 480)  # Set height of the camera frame

while True:
    # Capture frame-by-frame
    ret, img = cap.read()

    # Convert the frame to grayscale for face and smile detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the grayscale frame
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=7,
        minSize=(30, 30)
    )

    # Draw rectangles around detected faces and detect smiles within each face
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Blue box for face
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]

        # Detect smiles within the region of interest (the detected face)
        smiles = smileCascade.detectMultiScale(
            roi_gray,
            scaleFactor=1.8,  # Adjust scaleFactor for smile detection precision
            minNeighbors=20,  # Increase for fewer false positives
            minSize=(25, 25)
        )

        # Draw rectangles around detected smiles
        for (sx, sy, sw, sh) in smiles:
            cv2.rectangle(roi_color, (sx, sy), (sx + sw, sy + sh), (0, 255, 0), 2)  # Green box for smile

    # Display the frame with rectangles drawn around faces and smiles
    cv2.imshow('Face and Smile Detection', img)

    # Press 'ESC' to exit the loop
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
