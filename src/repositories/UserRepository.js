import { auth, db } from "../firebase-config/config";
import { ref, get, set, query, orderByChild, equalTo } from "firebase/database";

import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const getUser = async (by, value) => {
  const fbQuery = query(ref(db, "users/"), orderByChild(by), equalTo(value));

  return new Promise(async (resolve, reject) => {
    get(fbQuery)
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 2022-02-05 14:47:00
const getUserFriends = async () => {
  const fbQuery = query(
    ref(db, "user_friends/"),
    orderByChild("id"),
    equalTo(auth.currentUser.uid)
  );

  return new Promise(async (resolve, reject) => {
    get(fbQuery).then((snapshot) => {
      if (snapshot.exists()) {
        let friends = [];
        snapshot.val().map(async (data) => {
          const response = await getUser("id", data.friend_id);
          friends.push(response[data.friend_id]);
        });
        resolve(friends);
      }
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
        getUser("email", user.email).then((response) => {
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

const logoutUser = async () => {
  return new Promise(async (resolve, reject) => {
    signOut(auth);
    resolve("logged out");
  });
};

const resetUserPassword = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      await sendPasswordResetEmail(auth, email);
      resolve("Reset mail sent");
    } catch (err) {
      reject(err.code);
    }
  });
};

const confirmUserPasswordReset = async (oobCode, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      resolve("password change success");
    } catch (err) {
      reject(err.code);
    }
  });
};

export {
  getUser,
  getUserFriends,
  resetUserPassword,
  confirmUserPasswordReset,
  registerUser,
  loginUser,
  logoutUser,
};
