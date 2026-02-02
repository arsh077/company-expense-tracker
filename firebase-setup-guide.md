# Firebase Setup Guide

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: "company-expense-tracker"
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Required Services
### Authentication:
- Go to Authentication > Sign-in method
- Enable Email/Password
- Enable Google (optional)

### Firestore Database:
- Go to Firestore Database
- Create database in production mode
- Choose location (asia-south1 for India)

### Storage (optional for receipts):
- Go to Storage
- Get started with default rules

## 3. Get Configuration
- Go to Project Settings > General
- Scroll to "Your apps" section
- Click "Web" icon to add web app
- Register app name: "expense-tracker-web"
- Copy the config object

## 4. Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Expenses - authenticated users only
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```