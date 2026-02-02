# 🔥 Firebase Backend Integration - Complete Setup Guide

## 📋 Prerequisites
- Node.js installed
- Firebase account (free tier available)
- Basic understanding of React/TypeScript

## 🚀 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install firebase
```

### 2. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `company-expense-tracker`
4. Enable Google Analytics (optional)
5. Create project

### 3. Enable Firebase Services

#### Authentication:
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** for social login

#### Firestore Database:
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode**
4. Select location (e.g., `asia-south1` for India)

#### Storage (Optional for receipts):
1. Go to **Storage**
2. Click **Get started**
3. Use default security rules

### 4. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register app name: `expense-tracker-web`
5. Copy the configuration object

### 5. Configure Environment Variables
Update your `.env.local` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 6. Set Firestore Security Rules
Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Expenses - authenticated users can only access their own data
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 7. Run the Application
```bash
npm run dev
```

## 🎯 How to Use

### Demo Mode (Default)
- Username: `admin`
- Password: `admin123`
- Data stored in memory (lost on refresh)

### Firebase Mode
1. Click **"Configure Backend Connection"**
2. Select **"Firebase Mode (Cloud Database)"**
3. Save settings
4. Create account with email/password
5. Start adding expenses!

## ✨ Features Enabled

### 🔐 Authentication
- Email/password registration
- Secure login/logout
- User session management

### 💾 Real-time Database
- Firestore integration
- User-specific data isolation
- Real-time sync across devices

### 🔒 Security
- Firebase security rules
- User-based data access
- Secure authentication tokens

### 📱 Cross-Device Sync
- Login from any device
- Data syncs automatically
- Consistent experience

## 🛠️ Troubleshooting

### Common Issues:

1. **"Firebase not configured"**
   - Check `.env.local` file exists
   - Verify all environment variables are set
   - Restart development server

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated
   - Verify user owns the data

3. **"Network error"**
   - Check internet connection
   - Verify Firebase project is active
   - Check browser console for errors

### Debug Steps:
1. Open browser developer tools
2. Check Console tab for errors
3. Verify Network tab shows Firebase requests
4. Check Application tab for stored tokens

## 📊 Data Structure

### Users Collection (`/users/{userId}`)
```javascript
{
  displayName: "John Doe",
  email: "john@company.com",
  isAdmin: false,
  createdAt: Timestamp
}
```

### Expenses Collection (`/expenses/{expenseId}`)
```javascript
{
  userId: "user_firebase_uid",
  date: "2024-01-15",
  time: "14:30",
  amount: 1500.00,
  description: "Client lunch",
  category: "Food",
  addedBy: "John Doe",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🎉 Success!
Your expense tracker now has a complete Firebase backend with:
- ✅ User authentication
- ✅ Real-time database
- ✅ Cross-device sync
- ✅ Secure data access
- ✅ Professional-grade infrastructure

Happy expense tracking! 🚀