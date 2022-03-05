import { auth, db } from "../firebase-config/config";
import {
  ref,
  get,
  set,
  query,
  orderByChild,
  equalTo,
  push,
  child,
  update,
} from "firebase/database";
import CryptoAES from "crypto-js/aes";
import cryptoJs from "crypto-js";
import moment from "moment";

const sendMessage = async (message) => {
  return new Promise(async (resolve, reject) => {
    const mKey = push(child(ref(db), "messages")).key;
    await set(ref(db, `messages/${mKey}`), {
      id: mKey,
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
      context: message.context,
      read: false,
      sent: false,
      timestamp: message.timestamp,
    })
      .then(() => {
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
        Object.keys(snapshot.val()).forEach((key) => {
          let message = snapshot.val()[key];
          if (
            message.sender_id === auth.currentUser.uid ||
            message.receiver_id === auth.currentUser.uid
          ) {
            const decryptedMessage = CryptoAES.decrypt(
              message.context,
              "eripstahc"
            );
            message.context = decryptedMessage.toString(cryptoJs.enc.Utf8);
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

const getLastMessageAs = async (key, value) => {
  const fbQuery = query(
    ref(db, "messages/"),
    orderByChild(key),
    equalTo(value)
  );
  return new Promise(async (resolve, reject) => {
    await get(fbQuery).then((snapshot) => {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        keys.sort(function (left, right) {
          return moment(snapshot.val()[left].timestamp).diff(
            moment(snapshot.val()[right].timestamp)
          );
        });
        resolve(snapshot.val()[keys[keys.length - 1]]);
      } else {
        resolve("");
      }
    });
  });
};

const getUserLastMessage = async (id) => {
  let receiverMsg = await getLastMessageAs("receiver_id", id);
  let senderMsg = await getLastMessageAs("sender_id", id);
  return new Promise((resolve, reject) => {
    let latestMessage = "";
    if (receiverMsg !== "" && senderMsg !== "") {
      const isReceiverMsgLatest = moment(
        moment(receiverMsg.timestamp).format("YYYY-MM-DD HH:mm:ss")
      ).isAfter(moment(senderMsg.timestamp).format("YYYY-MM-DD HH:mm:ss"));
      latestMessage = isReceiverMsgLatest ? receiverMsg : senderMsg;
    } else if (receiverMsg !== null) {
      latestMessage = receiverMsg;
    } else if (senderMsg !== null) {
      latestMessage = senderMsg;
    }

    if (
      latestMessage.receiver_id === auth.currentUser.uid ||
      latestMessage.sender_id === auth.currentUser.uid
    ) {
      const decryptedMessage = CryptoAES.decrypt(
        latestMessage.context,
        "eripstahc"
      );
      latestMessage.context = decryptedMessage.toString(cryptoJs.enc.Utf8);
    }
    resolve(latestMessage);
  });
};

const deleteMessage = async (msg_id) => {
  return new Promise(async (resolve, reject) => {
    const encryptedMessage = CryptoAES.encrypt("Message deleted", "eripstahc");
    await update(ref(db, `messages/${msg_id}`), {
      context: encryptedMessage.toString(),
    })
      .then(() => {
        resolve("message_deleted");
      })
      .catch((err) => {
        reject(err.code);
      });
  });
};

export { sendMessage, getUserMessages, getUserLastMessage, deleteMessage };
