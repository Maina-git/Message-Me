import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/Firebase";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UserInfo from "./UserInfo";

// Define the User type
interface User {
  id: string;
  name?: string;
  email?: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize navigation

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    navigate(`/messages/${user.id}`)
  };

  return (
    <div className="w-1/4 fixed h-screen bg-gray-200 p-4">
      <UserInfo/>
      <h1 className="text-2xl font-bold mb-4 text-pink-900">Users</h1>

      {loading && <p className="text-pink-900">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && (
        <p className="text-pink-900">No users found.</p>
      )}
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 w-full bg-white shadow rounded mb-4 cursor-pointer hover:bg-gray-100"
            onClick={() => handleUserClick(user)}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-900 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold">{user.name || "Unnamed User"}</p>
                {user.email && (
                  <p className="text-sm text-pink-900">{user.email}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
