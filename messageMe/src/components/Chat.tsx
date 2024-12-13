import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, auth } from "../config/Firebase";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
}

interface ChatProps {
  userId: string; // The ID of the user you're chatting with
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]); // Strongly typed message array
  const [newMessage, setNewMessage] = useState<string>(""); // New message state
  const messagesRef = collection(db, `chats/${userId}/messages`);

  useEffect(() => {
    // Listen for updates to the messages collection
    const unsubscribe = onSnapshot(
      query(messagesRef, orderBy("timestamp", "asc")),
      (snapshot) => {
        const fetchedMessages: Message[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...(doc.data() as Omit<Message, "id">), // Type assertion to ensure the correct structure
          })
        );
        setMessages(fetchedMessages);
      }
    );
    return unsubscribe;
  }, [messagesRef]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await addDoc(messagesRef, {
          text: newMessage,
          timestamp: new Date(),
          senderId: auth.currentUser?.uid,
        });
        setNewMessage(""); // Clear input after sending the message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="h-[70vh] overflow-y-scroll mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 mb-2 ${
              message.senderId === auth.currentUser?.uid
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300"
            } rounded w-fit max-w-xs`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow p-2 border rounded mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
