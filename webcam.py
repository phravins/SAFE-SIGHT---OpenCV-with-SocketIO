import cv2

# Open the webcam (change 0 to 1, 2, etc., for USB if not default)
cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)  # Use DSHOW for Windows compatibility

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Press 'q' or 'ESC' to quit the live feed.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break
    
    # Display the frame
    cv2.imshow('Live Webcam Feed', frame)
    
    # Press 'q' or ESC to exit
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q') or key == 27:
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
