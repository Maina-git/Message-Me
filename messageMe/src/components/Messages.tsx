import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting userId from the route
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/Firebase";

const Messages: React.FC = () => {
  const { userId } = useParams(); // Get the selected user's ID from the URL
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // Fetch messages for the selected user
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userId]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        userId,
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage(""); // Clear the input field
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="w-3/4 absolute right-0 min-h-screen bg-gray-100 flex flex-col p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Messaging User {userId}
      </h1>
      <div className="flex-grow overflow-y-auto bg-white p-4 shadow rounded mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="p-2 bg-gray-200 rounded mb-2 shadow">
              <p className="text-gray-700">{message.text}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."/>
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
