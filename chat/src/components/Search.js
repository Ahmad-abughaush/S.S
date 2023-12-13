import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "./Context";

const Search = () => {
  // State for user search
  const [username, setUsername] = useState(""); // Input field for username
  const [user, setUser] = useState(null); // User data found in the search
  const [err, setErr] = useState(false); // Error state if user not found

  // Get current user from AuthContext
  const { currentUser } = useContext(AuthContext);

  // Handle search for user by username
  const handleSearch = async () => {
    // Create a Firestore query to find users by displayName
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      // Retrieve user data matching the query
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data()); // Set found user data
      });
    } catch (error) {
      setErr(true); // Set error state if user not found
    }
  };

  // Handle Enter key press for search
  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

  // Handle user selection and chat creation
  const handleSelect = async () => {
    // Combine user IDs to create a unique chat ID
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create a chat in the "chats" collection if it doesn't exist
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Update user chats with chat information
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}

    // Clear the user selection and input field
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
