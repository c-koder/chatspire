import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

/**
 * Configuring firebase with the provided api key and other required details.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAipqYICE4YRRJEN7aHMriKPBivBlCXeIo",
  authDomain: "chatspire-33b4c.firebaseapp.com",
  projectId: "chatspire-33b4c",
  databaseURL:
    "https://chatspire-33b4c-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "chatspire-33b4c.appspot.com",
  messagingSenderId: "788520788189",
  appId: "1:788520788189:web:e2353ec92082920749bb34",
};

/**
 * Creating and initializing a firebase instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Getting the database instance from the firebase realtime db.
 */
const db = getDatabase(app);

/**
 * Returns the Auth instance associated with the firebase app.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 */
const auth = getAuth(app);

const storage = getStorage();

export { auth, db, storage };
