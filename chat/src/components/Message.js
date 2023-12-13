import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "./Context";
import { ChatContext } from "./ChatContext";
import { formatDistanceToNow } from 'date-fns';

const Message = ({ message }) => {
  // Get current user and chat data from contexts
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const timeAgo = formatDistanceToNow(message.date.toDate(), { addSuffix: true });


  // Create a ref for scrolling to the message
  const ref = useRef();

  // Use useEffect to scroll into view when the message changes
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{timeAgo}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
