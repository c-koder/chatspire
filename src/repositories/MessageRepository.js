import { auth, db } from "../firebase-config/config";
import {
  ref,
  get,
  set,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  startAt,
} from "firebase/database";
import CryptoAES from "crypto-js/aes";
import cryptoJs from "crypto-js";

const getTotalMessageCount = async () => {
  const fbQuery = query(ref(db, "message_index/"));

  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val().index);
        } else {
          setTotalMessageCount(0);
          resolve(0);
        }
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const setTotalMessageCount = async (index) => {
  return new Promise(async (resolve, reject) => {
    await set(ref(db, `message_index/`), {
      index: index,
    })
      .then(() => {
        resolve("index_updated");
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const sendMessage = async (message) => {
  const id = (await getTotalMessageCount()) + 1;
  return new Promise(async (resolve, reject) => {
    await set(ref(db, `messages/${id}`), {
      id: id,
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
      context: message.context,
      read: false,
      sent: false,
      timestamp: message.timestamp,
    })
      .then(async () => {
        await setTotalMessageCount(id);
        resolve("message_added");
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const getUserMessages = async () => {
  const fbQuery = query(ref(db, "messages/"), orderByChild("timestamp"));
  let messages = [];
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then(async (snapshot) => {
        snapshot.val().forEach((message) => {
          const decryptedMessage = CryptoAES.decrypt(
            message.context,
            "eripstahc"
          );
          message.context = decryptedMessage.toString(cryptoJs.enc.Utf8);
          if (
            message.sender_id === auth.currentUser.uid ||
            message.receiver_id === auth.currentUser.uid
          ) {
            messages.push(message);
          }
        });
        resolve(messages);
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

const getUserLastMessage = async (sender_id) => {
  const fbQuery = query(
    ref(db, "messages/"),
    orderByChild("receiver_id"),
    equalTo(sender_id),
    limitToLast(1)
  );
  return new Promise(async (resolve, reject) => {
    await get(fbQuery)
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const snapshotMsg = snapshot.val()[Object.keys(snapshot.val())[0]];
          const decryptedMessage = CryptoAES.decrypt(
            snapshotMsg.context,
            "eripstahc"
          );
          snapshotMsg.context = decryptedMessage.toString(cryptoJs.enc.Utf8);
          resolve(snapshotMsg);
        } else {
          const fbQuery = query(
            ref(db, "messages/"),
            orderByChild("sender_id"),
            equalTo(sender_id),
            limitToLast(1)
          );
          await get(fbQuery)
            .then(async (snapshot) => {
              if (snapshot.exists()) {
                const snapshotMsg =
                  snapshot.val()[Object.keys(snapshot.val())[0]];
                const decryptedMessage = CryptoAES.decrypt(
                  snapshotMsg.context,
                  "eripstahc"
                );
                snapshotMsg.context = decryptedMessage.toString(
                  cryptoJs.enc.Utf8
                );
                resolve(snapshotMsg);
              }
            })
            .catch((err) => {
              reject(err.code);
            });
        }
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

export { sendMessage, getUserMessages, getUserLastMessage };
