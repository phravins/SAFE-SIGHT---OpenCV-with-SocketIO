import cv2
import numpy as np
from PIL import Image
import os

# Path to the dataset folder containing subfolders for each user
dataset_path = os.path.join(os.path.dirname(__file__), "../dataset")

# Create an LBPH Face Recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create()  # type: ignore

# Load the Haar Cascade classifier for face detection
cascade_path = os.path.join(os.path.dirname(__file__), "..", "FaceDetection", "Cascades", "haarcascade_frontalface_default.xml")
faceCascade = cv2.CascadeClassifier(cascade_path)

# Function to get images and labels for training from all subfolders
def get_images_and_labels(path):
    face_samples = []
    ids = []
    name_to_id = {}
    current_id = 1

    # Iterate through all subfolders in the dataset directory
    for user_folder in os.listdir(path):
        user_path = os.path.join(path, user_folder)
        if not os.path.isdir(user_path):
            continue  # Skip if not a directory

        print(f"[DEBUG] Processing folder: {user_folder}")

        # Extract the user name from the folder name (e.g., User_ARUN S -> ARUN S)
        user_name = user_folder.replace("User_", "").replace("User.", "").strip()
        print(f"[DEBUG] Extracted user name: '{user_name}'")
        if user_name not in name_to_id:
            name_to_id[user_name] = current_id
            current_id += 1
        face_id = name_to_id[user_name]
        print(f"[DEBUG] Assigned ID {face_id} to {user_name}")

        # Iterate through all images in the user's subfolder
        image_count = 0
        face_count = 0
        for image_file in os.listdir(user_path):
            image_path = os.path.join(user_path, image_file)
            image_count += 1

            try:
                # Open the image and convert to grayscale
                img = Image.open(image_path).convert('L')
                img_np = np.array(img, 'uint8')

                # Detect faces in the image
                faces = faceCascade.detectMultiScale(
                    img_np,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(30, 30)
                )

                # Add each detected face and its corresponding ID to the lists
                for (x, y, w, h) in faces:
                    face_samples.append(img_np[y:y + h, x:x + w])
                    ids.append(face_id)
                    face_count += 1
            except Exception as e:
                print(f"[ERROR] Skipping {image_path}: {str(e)}")
        print(f"[DEBUG] {user_name}: {image_count} images, {face_count} faces detected")

    return face_samples, ids, name_to_id

print("[INFO] Training faces. It will take a few seconds. Please wait...")

# Get the face samples and their corresponding IDs
faces, ids, name_to_id = get_images_and_labels(dataset_path)

if len(faces) == 0:
    print("[ERROR] No faces detected in the dataset. Make sure the images are correct and try again.")
    exit()

# Train the recognizer with the collected face samples and IDs
recognizer.train(faces, np.array(ids))

# Save the trained model
model_path = r"../trainer/trainer.yml"
if not os.path.exists(os.path.dirname(model_path)):
    os.makedirs(os.path.dirname(model_path))

recognizer.write(model_path)
print(f"[INFO] Model trained and saved at {model_path}")

# Save the name to ID mapping
import json
mapping_path = os.path.join(os.path.dirname(__file__), "..", "trainer", "names.json")
with open(mapping_path, 'w') as f:
    json.dump(name_to_id, f)
print(f"[INFO] Name to ID mapping saved at {mapping_path}")
