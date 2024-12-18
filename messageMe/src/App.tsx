import React, { useState } from "react";
import SignIn from "./pages/SignIn";
import Messages from "./components/Messages";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import UsersList from "./components/UserList";


const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false); 

  if (!isAuth) return <SignIn setIsAuth={setIsAuth} />;

  return (
    <Router>
      <UsersList/>
    <Routes>
      <Route path="/messages/:userId" element={<Messages />} />
    </Routes>
  </Router>
  );
};
export default App;



