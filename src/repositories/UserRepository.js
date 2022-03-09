import { auth, db, storage } from "../firebase-config/config";
import {
  ref,
  get,
  set,
  query,
  orderByChild,
  equalTo,
  update,
  limitToLast,
  push,
  child,
} from "firebase/database";

import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import moment from "moment";

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
            email_visibility: true,
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/chatspire-33b4c.appspot.com/o/profile.png?alt=media&token=bb1e4187-c421-4310-867c-562655425bc3",
            onlineOrLastSeen: "online",
            score: 0,
            bio: `Hey, I'm ${user.username}`,
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            joined_date: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
            lastMessage: "",
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
        for (let data in snapshot.val()) {
          const response = await getUser("id", snapshot.val()[data].friend_id);
          friends.push(response[snapshot.val()[data].friend_id]);
        }
        resolve(friends);
      } else {
        resolve(null);
      }
    });
  });
};

const updateUserAvatar = async (imageFile) => {
  return new Promise(async (resolve, reject) => {
    if (imageFile !== null && imageFile !== undefined && imageFile !== "") {
      uploadBytes(
        storageRef(storage, `avatars/${Date.now()}.png`),
        imageFile
      ).then((snapshot) => {
        getDownloadURL(storageRef(storage, snapshot.metadata.fullPath)).then(
          (url) => {
            update(ref(db, `users/${auth.currentUser.uid}`), {
              avatar: url,
            }).then(() => {
              resolve("success");
            });
          }
        );
      });
    } else {
      resolve("image_not_valid");
    }
  });
};

const getUsersToSendRequests = async () => {
  const fbQuery = query(ref(db, "users/"), limitToLast(50));

  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => {
        getUserFriends().then(async (friends) => {
          let users = [];
          let friendRequests = await fetchFriendRequests();
          if (friends !== null) {
            Object.keys(snapshot.val()).forEach((key) => {
              if (friendRequests !== null) {
                !friendRequests.some((request) => request.id === key) &&
                  !friends.some((friend) => friend.id === key) &&
                  key !== auth.currentUser.uid &&
                  users.push(snapshot.val()[key]);
              } else {
                !friends.some((friend) => friend.id === key) &&
                  key !== auth.currentUser.uid &&
                  users.push(snapshot.val()[key]);
              }
            });
          } else {
            Object.keys(snapshot.val()).forEach(async (key, index) => {
              if (friendRequests !== null) {
                !friendRequests.some((request) => request.id === key) &&
                  key !== auth.currentUser.uid &&
                  users.push(snapshot.val()[key]);
              } else {
                key !== auth.currentUser.uid && users.push(snapshot.val()[key]);
              }
            });
          }
          resolve(users);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const friendRequestExists = async (id) => {
  const fbQuery = query(
    ref(db, "friend_requests/"),
    orderByChild("from_id"),
    equalTo(auth.currentUser.uid)
  );

  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (let data in snapshot.val()) {
            let item = snapshot.val()[data];
            if (item.to_id === id) {
              if (!item.approved) {
                if (
                  moment(moment()).diff(
                    moment(item.date, "YYYY-MM-DD HH:mm:ss"),
                    "days"
                  ) >= 3
                ) {
                  resolve(false);
                } else {
                  resolve(true);
                }
              }
              break;
            }
          }
          resolve(false);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const sendFriendRequest = async (id) => {
  return new Promise(async (resolve, reject) => {
    friendRequestExists(id).then((response) => {
      if (!response) {
        const fKey = push(child(ref(db), "friend_requests")).key;
        set(ref(db, `friend_requests/${fKey}`), {
          id: fKey,
          from_id: auth.currentUser.uid,
          to_id: id,
          date: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
          approved: false,
          approved_or_declined_date: "",
        })
          .then(() => {
            resolve("success");
          })
          .catch((err) => {
            reject(err.code);
          });
      } else {
        resolve("already_sent");
      }
    });
  });
};

const fetchFriendRequests = async () => {
  const fbQuery = query(
    ref(db, "friend_requests/"),
    orderByChild("to_id"),
    equalTo(auth.currentUser.uid)
  );

  return new Promise(async (resolve, reject) => {
    await get(fbQuery).then(async (snapshot) => {
      if (snapshot.exists()) {
        let requests = [];
        for (let key in snapshot.val()) {
          if (
            !snapshot.val()[key].approved &&
            snapshot.val()[key].approved_or_declined_date === ""
          ) {
            const response = await getUser("id", snapshot.val()[key].from_id);
            const request = {
              request_id: key,
              id: response[snapshot.val()[key].from_id].id,
              username: response[snapshot.val()[key].from_id].username,
              avatar: response[snapshot.val()[key].from_id].avatar,
            };
            requests.push(request);
          }
        }
        resolve(requests);
      } else {
        resolve(null);
      }
    });
  });
};

const acceptFriendRequest = async (id, friend_id) => {
  return new Promise(async (resolve, reject) => {
    const uKey = push(child(ref(db), "user_friends")).key;
    set(ref(db, `user_friends/${uKey}`), {
      id: uKey,
      user_id: auth.currentUser.uid,
      friend_id: friend_id,
    }).then(() => {
      const uKey2 = push(child(ref(db), "user_friends")).key;
      set(ref(db, `user_friends/${uKey2}`), {
        id: uKey,
        friend_id: auth.currentUser.uid,
        user_id: friend_id,
      }).then(() => {
        update(ref(db, `friend_requests/${id}`), {
          approved: true,
          approved_or_declined_date: moment()
            .format("YYYY-MM-DD HH:mm:ss")
            .toString(),
        })
          .then(() => {
            resolve("success");
          })
          .catch((err) => {
            reject(err.code);
          });
      });
    });
  });
};

const declineFriendRequest = async (id) => {
  return new Promise(async (resolve, reject) => {
    update(ref(db, `friend_requests/${id}`), {
      approved: false,
      approved_or_declined_date: moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .toString(),
    })
      .then(() => {
        resolve("success");
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const updateUser = async (
  avatar,
  username,
  bio,
  email_visibility,
  twitter,
  facebook,
  instagram,
  linkedin
) => {
  return new Promise(async (resolve, reject) => {
    await updateUserAvatar(avatar);
    await update(ref(db, `users/${auth.currentUser.uid}`), {
      username: username,
      bio: bio === "" ? `Hey, I'm ${username}` : bio,
      email_visibility: email_visibility,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      linkedin: linkedin,
    }).then(() => {
      resolve("Success");
    });
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
  updateUserAvatar,
  getUsersToSendRequests,
  sendFriendRequest,
  fetchFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  updateUser,
};
