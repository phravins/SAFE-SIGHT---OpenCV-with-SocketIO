import cv2
import os

# Open a connection to the external webcam (index 1)
cam = cv2.VideoCapture(1)
cam.set(3, 640)  # Set video width
cam.set(4, 480)  # Set video height

# Load the Haar Cascade classifier for face detection
cascade_path = r'D:\SAFE SIGHT\OpenCV-Face-Recognition-master\FacialRecognition\haarcascade_frontalface_default.xml'
face_detector = cv2.CascadeClassifier(cascade_path)

# Check if the Haar Cascade file exists
if not os.path.isfile(cascade_path):
    print(f"[ERROR] The cascade file at {cascade_path} does not exist.")
    exit()

# Prompt for the user's ID
face_id = input('\nEnter user ID and press <Enter>: ')

# Confirming the initialization
print("\n[INFO] Initializing face capture. Look at the camera and wait...")

# Initialize the count of collected face samples
count = 0

# Create the 'dataset' directory if it doesn't exist
dataset_path = r'D:\SAFE SIGHT\OpenCV-Face-Recognition-master\dataset'
if not os.path.exists(dataset_path):
    os.makedirs(dataset_path)

# Create a subfolder for the current user's images
user_folder = os.path.join(dataset_path, f"User_{face_id}")
if not os.path.exists(user_folder):
    os.makedirs(user_folder)

while True:
    # Read a frame from the camera
    ret, img = cam.read()
    if not ret:
        print("[ERROR] Failed to grab frame from the camera.")
        break

    img = cv2.flip(img, 1)  # Flip video image horizontally for a mirror effect
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert to grayscale

    # Detect faces in the frame
    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    for (x, y, w, h) in faces:
        # Draw a rectangle around the detected face
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
        count += 1

        # Save the captured face image in the user's subfolder
        face_image_path = os.path.join(user_folder, f"User.{face_id}.{count}.jpg")
        cv2.imwrite(face_image_path, gray[y:y + h, x:x + w])

        # Display the image with the rectangle
        cv2.imshow('Face Capture', img)

    # Check for the 'ESC' key to exit
    k = cv2.waitKey(100) & 0xff
    if k == 27:  # Exit if 'ESC' is pressed
        break
    elif count >= 30:  # Stop after capturing 30 images
        break

# Cleanup and release resources
print("\n[INFO] Exiting the program and cleaning up...")
cam.release()
cv2.destroyAllWindows()
