import React from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../config/Firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

interface Props {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<Props> = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);

      // Get user data
      const user = result.user;
      const usersCollectionRef = collection(db, "users");

      // Check if user already exists in Firestore
      const q = query(usersCollectionRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add new user to Firestore using addDoc
        await addDoc(usersCollectionRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }

      // Update local auth state
      setIsAuth(true);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-10">
      <h1 className="text-3xl text-pink-800">Message Me</h1>
      <h2 className="text-xl text-blue-400">Sign in With Google To Continue</h2>
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-5 text-xl bg-pink-800 text-white px-5 py-2 rounded-[20px]">
        <FcGoogle />
        Sign In with Google
      </button>
    </div>
  );
};
export default SignIn;
