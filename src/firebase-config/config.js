import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAipqYICE4YRRJEN7aHMriKPBivBlCXeIo",
  authDomain: "chatspire-33b4c.firebaseapp.com",
  projectId: "chatspire-33b4c",
  storageBucket: "chatspire-33b4c.appspot.com",
  messagingSenderId: "788520788189",
  appId: "1:788520788189:web:e2353ec92082920749bb34",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(
  app,
  "https://chatspire-33b4c-default-rtdb.asia-southeast1.firebasedatabase.app/"
);

const auth = getAuth(app);

export { auth, db };
