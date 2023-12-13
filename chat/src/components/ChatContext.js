import React, { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./Context"; // Import your AuthContext

// Create a chat context
export const ChatContext = createContext();

// Create a chat context provider
export const ChatContextProvider = ({ children }) => {
  // Get the current user from the AuthContext
  const { currentUser } = useContext(AuthContext);

  // Define the initial state for chat context
  const INITIAL_STATE = {
    chatId: "null", // Initial chat ID
    user: {}, // Initial user data
  };

  // Define the chat reducer function
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload, // Set the user data based on action
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid, // Generate a unique chat ID
        };

      default:
        return state; // Default to the current state if no action matches
    }
  };

  // Use useReducer to manage state with the chatReducer
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  // Provide the chat context value to its children
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
