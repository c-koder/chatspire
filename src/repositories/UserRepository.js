import { auth, db } from "../firebase-config/config";
import { ref, get, set, query, orderByChild, equalTo } from "firebase/database";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const getUserByUsername = async (username) => {
  const userQuery = query(
    ref(db, "users/"),
    orderByChild("username"),
    equalTo(username)
  );

  return new Promise(async (resolve, reject) => {
    get(userQuery)
      .then((snapshot) => {
        resolve(snapshot.exists());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getUserByEmail = async (email) => {
  const userQuery = query(
    ref(db, "users/"),
    orderByChild("email"),
    equalTo(email)
  );

  return new Promise(async (resolve, reject) => {
    get(userQuery)
      .then((snapshot) => {
        snapshot.exists() && resolve(snapshot.val());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const registerUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        set(ref(db, `users/${auth.currentUser.uid}`), {
          id: auth.currentUser.uid,
          username: user.username,
          email: user.email,
        }).then(() => {
          resolve(userCredential.user);
        });
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const loginUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        getUserByEmail(user.email).then((response) => {
          resolve({
            user: response[auth.currentUser.uid],
            credential: userCredential.user,
          });
        });
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const logoutUser = () => {
  signOut(auth);
};

const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    // alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
  }
};

export {
  getUserByUsername,
  getUserByEmail,
  registerUser,
  loginUser,
  logoutUser,
};
