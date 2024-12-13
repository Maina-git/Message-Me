import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import UsersList from "./components/UserList"; // Adjust naming for consistency
import Chat from "./components/Chat"; // Import Chat component

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false); // Authentication state

  // If the user is not authenticated, render the SignIn component
  if (!isAuth) return <SignIn setIsAuth={setIsAuth} />;

  return (
    <Router>
      <Routes>
        {/* Default route redirects to UsersList */}
        <Route path="/" element={<Navigate to="/users" />} />

        {/* Route for UsersList */}
        <Route path="/users" element={<UsersList />} />

        {/* Route for Chat with dynamic userId */}
        <Route path="/chat/:userId" element={<Chat/>} />
      </Routes>
    </Router>
  );
};

// Wrapper component for Chat to extract userId from URL params
const ChatWrapper: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  if (!userId) {
    return <div>Please select a user to start a chat.</div>;
  }

  return <Chat userId={userId} />;
};

export default App;
