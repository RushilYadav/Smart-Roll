import cv2

#Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

while True:
    #Read frame from webcam
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        break

    #Display the frame
    cv2.imshow('Webcam', frame)

    #break loop by clicking 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

#Release the webcam and close window
cap.release()
cv2.destroyAllWindows()