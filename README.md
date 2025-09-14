# SmartRoll

## Project Overview
SmartRoll is a web-based attendance management system for schools and universities. It works by automatically detecting students as they enter the room, and marking them down as present, late or absent. There are also features for editing classes and students, and viewing details.

## Features
- Admin dashboard: Manage users and classes
- Teacher dashboard: View and manage their classes
- Student dashboard: View personal profile, grades and attendance details
- Secure login wth role-based access
- Facial Recognition: Automatically detect and log student attendance

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, PostgreSQL
- **Authentication:** JWT
- **Facial Recognition:** Python, OpenCV, NumPy, LBPH Face Recogniser, Haar Cascades

## Setup Instructions

### 1. Clone the repository

> `git clone https://github.com/RushilYadav/Smart-Roll`

---

### 2. Set up Backend
#### 2.1 Navigate to 'backend/'

> `cd backend`

#### 2.2 Install dependencies

> `npm install`

#### 2.3 Create a '.env' file and edit values:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=name_of_db
JWT_SECRET=your_jwt_password
```

#### 2.4 Set up Database

- Make sure PostgreSQL is installed and running
- Create database manually

#### 2.5 Start Backend

> `node server.js`

---

### 3. Set up Frontend

#### 3.1 Navigate to 'frontend/'

> `cd frontend`

#### 3.2 Install dependencies

> `npm install`

#### 3.3 Start frontend

> `npm run dev`

---

### 4. Set up Facial Recognition

#### 4.1 Navigate to 'facial_recognition/'

> `cd facial_recognition`

#### 4.2 Install dependencies

> `pip install -r requirements.txt`

#### 4.3 Run Facial Recognition Manually (Optional)

> `python facial_recognition.py`

- This will open webcam, detect faces, and display names for recognised students.
- Press **'q'** to exit the webcam view.

#### 4.4 Integration with frontend

- Teachers and Admins can click the **"Start Facial Recognition"** button on the Attendance page to start the python script via the backend.

---

## Notes
- For the facial recognition to detect students/users, they must first be created by the admin, so their images are stored appropriately.
- Ensure you have a functioning webcam.
- Feature for automatically marking students as present is soon to be developed.

## Future Updates
- Better, user-friendly design for the frontend.
- Feature for automatically marking students as present.