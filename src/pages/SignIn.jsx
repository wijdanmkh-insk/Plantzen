// src/pages/SignIn.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../firebase/firebase";
import { ref, get } from "firebase/database";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      alert("No users found in database.");
      return;
    }

    const users = snapshot.val();
    let matchedUser = null;

    // Search for a user with matching username/password
    for (const uid in users) {
      const user = users[uid];
      if (user.username === username && user.password === password) {
        matchedUser = { ...user, uid };
        break;
      }
    }

    if (!matchedUser) {
      alert("Invalid username or password.");
      return;
    }

    // Store user session locally
    localStorage.setItem("user", JSON.stringify(matchedUser));

    alert("Login successful!");
    window.location.href = "/dashboard"; // redirect to dashboard
  }

  return (
    <div
      className="
        min-h-screen 
        flex flex-col md:flex-row
        items-center justify-center 
        bg-linear-to-b from-green-600 to-green-900
        px-6
      "
    >
      {/* LEFT — Sign In Form */}
      <div className="flex-1 flex items-center justify-center">
        <Navbar />
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-white/20">

          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Welcome Back
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleSignIn}>

            {/* Username */}
            <div>
              <label className="text-white text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourusername"
                className="mt-1 w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-white text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="
                mt-2
                w-full p-3
                bg-green-500 hover:bg-green-600 
                text-white font-semibold 
                rounded-md transition
              "
            >
              Sign In
            </button>
          </form>

          {/* Redirect */}
          <p className="text-center text-white/70 text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/sign-up" className="text-green-300 hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
