# SmartRoll

## Project Overview
SmartRoll is a web-based attendance management system for schools and universities. It works by automatically detecting students as they enter the room, and marking them down as present, late or absent. There are also features for editing classes and students, and viewing details.
The facial recognition feature will be added soon.

## Features
- Admin dashboard: Manage users and classes
- Teacher dashboard: View and manage their classes
- Student dashboard: View personal profile, grades and attendance details
- Secure login wth role-based access
- (Facial Recognition coming soon)

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, PostgreSQL
- **Authentication:** JWT

## Setup Instructions

### 1. Clone the repository


### 2. Set up Backend
#### 2.1 Navigate to 'backend/'

'cd backend'

#### 2.2 Install dependencies

'npm install'

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

'node server.js'

### 3. Set up Frontend

#### 3.1 Navigate to 'frontend/'

'cd frontend'

#### 3.2 Install dependencies

'npm install'

#### 3.3 Start frontend

'npm run dev'

## Notes
- Facial recognition feature is currently being created