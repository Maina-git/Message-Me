import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

// Define the User type
interface User {
  id: string;
  name?: string; // Optional since some users might not have a name field
  email?: string; // Optional since email might not be available
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Users array with strong typing
  const [loading, setLoading] = useState<boolean>(true); // Boolean for loading state
  const [error, setError] = useState<string | null>(null); // Nullable string for errors
  const navigate = useNavigate();

  // Ensure only authenticated users can access this component
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (!user) navigate("/"); // Redirect if user is not logged in
    });
    return unsubscribe;
  }, [navigate]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]; // Cast to User[]
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

  // Render loading, error, or user list
  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Show Loading Indicator */}
      {loading && <p className="text-gray-500">Loading users...</p>}

      {/* Show Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Show Empty State */}
      {!loading && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}

      {/* Render User List */}
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-white shadow rounded mb-4 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/chat/${user.id}`)}
          >
            <div className="flex items-center gap-4">
              {/* Placeholder for User Avatar */}
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              {/* User Name */}
              <div>
                <p className="font-semibold">{user.name || "Unnamed User"}</p>
                {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
