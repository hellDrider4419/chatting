import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { serverUrl } from "../../config";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const DELETE_MESSAGE_REQUEST = "deleteMessage";
const CryptoJS = require("crypto-js");

const useChat = (roomId) => {
  const [message, setMessage] = useState([]); // Sent and received message
  const [deleteMessage, setDeleteMessage] = useState([]); // Sent and received message

  const socketRef = useRef();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(serverUrl, {
      query: { roomId },
    });

    // Listens for incoming message
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      console.log(message);
      var bytes = CryptoJS.AES.decrypt(message.message, "mynameisire");
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      const incomingMessage = {
        ...message,
        message: decryptedData,
      };
      setMessage(incomingMessage);
    });
    socketRef.current.on(DELETE_MESSAGE_REQUEST, (message) => {
      const incomingMessage = {
        ...message,
      };
      setDeleteMessage(incomingMessage);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    console.log("msgbody", messageBody);
    var ciphertext = CryptoJS.AES.encrypt(
      messageBody.msg,
      "mynameisire"
    ).toString();

    messageBody = { ...messageBody, msg: ciphertext };

    // console.log(ciphertext, decryptedData);
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
    });
  };
  const sendDeleteRequest = (messageDetails) => {
    socketRef.current.emit(DELETE_MESSAGE_REQUEST, {
      body: messageDetails,
    });
  };

  return { message, deleteMessage, sendDeleteRequest, sendMessage };
};

export default useChat;
