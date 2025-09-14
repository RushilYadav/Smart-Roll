import cv2
import os
import numpy as np

#Load pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

#Create face recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create()

images_folder = "../backend/images"

#Lists to store faces and their labels
faces_data = []
names = []
labels = []

#Check if images folder exists
if not os.path.exists(images_folder):
    print(f"Error: Images folder '{images_folder}' does not exist.")
    exit()

#Load all images and extract faces
label_id = 0
label_dict = {}

for filename in os.listdir(images_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        #Get student's name from filename
        student_name = filename.split('.')[0].replace('_', ' ').replace('-', ' ')
        
        #Read image
        image_path = os.path.join(images_folder, filename)
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        #Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.2, 5, minSize=(50, 50))
        
        if len(faces) > 0:
            #Find the largest face
            x, y, w, h = faces[0]
            face_region = gray[y:y+h, x:x+w]
            
            #Store the face and label
            faces_data.append(face_region)
            labels.append(label_id)
            names.append(student_name)
            label_dict[label_id] = student_name
            label_id += 1
        else:
            print(f"No face found in: {filename}")

if len(faces_data) == 0:
    print("No faces found in images folder")
    exit()

#Train
recognizer.train(faces_data, np.array(labels))

#Start webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Cannot open camera")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    #Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray, 1.2, 5, minSize=(50, 50))
    
    for (x, y, w, h) in faces:
        face_region = gray[y:y+h, x:x+w]

        label, confidence = recognizer.predict(face_region)
        
        #Get the name
        if confidence < 70: #Confidence threshold
            name = label_dict.get(label, "Unknown")
            color = (0, 255, 0)
        else:
            name = "Unknown"
            color = (0, 0, 255)

        #Draw rectangle and write name
        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    
    cv2.imshow('Face Recognition', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()