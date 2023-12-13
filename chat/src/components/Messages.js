import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "./ChatContext";
import { db } from "../Firebase";

const Messages = () => {
  // State for storing messages
  const [messages, setMessages] = useState([]);

  // Get chat data from the ChatContext
  const { data } = useContext(ChatContext);

  // Use useEffect to listen for changes in messages
  useEffect(() => {
    // Create a subscription to the chat document in Firestore
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        // Update the messages state with the messages from Firestore
        setMessages(doc.data().messages);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  );
};

export default Messages;
