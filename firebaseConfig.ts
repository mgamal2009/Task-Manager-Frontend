// firebaseConfig.ts
import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';

// Add your Firebase project configuration here
const firebaseConfig = {
  apiKey: "AIzaSyDZY1KVqkv_0WOdXJU7d22r9KJ-bz1hwKY",
  authDomain: "task-manager-5562e.firebaseapp.com",
  projectId: "task-manager-5562e",
  storageBucket: "task-manager-5562e.appspot.com",
  messagingSenderId: "583018422954",
  appId: "1:583018422954:web:4ff529871c97e3d034e6d3",
  measurementId: "G-6FSJKZEJ0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage};
