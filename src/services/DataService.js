import { auth, db } from "../firebase-config/config";
import { child, ref, get, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const getAll = () => {
  get(child(ref(db), "users/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
    })
    .catch((err) => {
      return err;
    });
};

const registerUser = async (user) => {
  await set(ref(db, "users/" + user.id), {
    username: user.username,
    email: user.email,
    password: user.password,
  });
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {
      // Signed in
       return userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

const loginUser = async (user) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    // Signed in
    return userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

const updateUser = (key, value) => {};

const deleteUser = (key) => {};

export { getAll, registerUser, loginUser };
