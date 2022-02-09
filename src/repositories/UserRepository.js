import { auth, db } from "../firebase-config/config";
import { ref, get, set, query, orderByChild, equalTo } from "firebase/database";

import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

/**
 * Used to fetch a user's info.
 * @param {*} by
 * Child key that is either id,username or email.
 * @param {*} value
 * Child value that needs to be compared with.
 * @returns
 * Returns a snapshot value that contains a user object.
 */
const getUser = async (by, value) => {
  const fbQuery = query(ref(db, "users/"), orderByChild(by), equalTo(value));

  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Used to fetch currently logged in user's friends.
 * @returns
 * Based on the current user uid, an array of user objects are returned.
 */
const getUserFriends = async () => {
  const fbQuery = query(
    ref(db, "user_friends/"),
    orderByChild("user_id"),
    equalTo(auth.currentUser.uid)
  );

  return new Promise(async (resolve, reject) => {
    await get(fbQuery).then(async (snapshot) => {
      if (snapshot.exists()) {
        let friends = [];
        if (snapshot.val().length > 1) {
          snapshot.val().map(async (data) => {
            const response = await getUser("id", data.friend_id);
            friends.push(response[data.friend_id]);
          });
        } else {
          const response = await getUser(
            "id",
            snapshot.val()[Object.keys(snapshot.val())[0]].friend_id
          );
          friends.push(
            response[snapshot.val()[Object.keys(snapshot.val())[0]].friend_id]
          );
        }
        resolve(friends);
      }
    });
  });
};

/**
 * Registering a user in the database under users child.
 * Firebase's createUserWithEmailAndPassword() authentication method,
 * is used to further ensure a secure registration process.
 * @param {*} user
 * An object that contains a username, email and a password provided by the user via the frontend.
 * @returns
 * Returns a string if succeeded, or the error code if the process failed.
 * It'd likely fail if a user with the given email already exists;
 * Or if na unlikely database error occurs when the function is called.
 */
const registerUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    await createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        if (userCredential !== null || userCredential !== undefined)
          set(ref(db, `users/${auth.currentUser.uid}`), {
            id: auth.currentUser.uid,
            username: user.username,
            email: user.email,
          }).then(() => {
            resolve("Success");
          });
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

/**
 * Handles the user login using Firebase's signInWithEmailAndPassword() authentication method.
 * @param {*} user
 * An object that contains the user's email and password provided via the frontend.
 * @returns
 * Returns a promise that resolves a user object if and only if the sign in process is verified
 * and completed, or rejects the error code.
 */
const loginUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    await signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async (userCredential) => {
        if (userCredential !== null || userCredential !== undefined) {
          getUser("email", user.email).then((response) => {
            resolve(response[auth.currentUser.uid]);
          });
        }
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

/**
 * Handles the user's logout process through Firebase's signOut() method.
 * @returns
 * Returns a promise that resolves a string if and only if the logout process was a success.
 */
const logoutUser = async () => {
  return new Promise(async (resolve, reject) => {
    await signOut(auth);
    resolve("logged out");
  });
};

/**
 * Sends a reset password link to the provided email,
 * using the Firebase's sendPasswordResetEmail() function.
 * @param {*} email
 * User's email is required to proceed with the password reset process.
 * @returns
 * Returns a promise that resolves a string if and only if the email was successfully sent,
 * or rejects the error code.
 */
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

/**
 * Confirms the URL parameters that was sent to the user's email through their reset password mail.
 * If the oobCode and the auth instance is valid, the user's password can be reset.
 * @param {*} oobCode
 * A confirmation code sent to the user.
 * @param {*} newPassword
 * The new password.
 * @returns
 * Returns a promise that resolves a string if the password reset process is confirmed,
 * or rejects the error code.
 */
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
