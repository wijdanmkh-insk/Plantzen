// src/pages/SignIn.jsx
import { useState } from "react";
import Logo from "../components/Logo";
import { db } from "../firebase/firebase";
import { ref, get } from "firebase/database";
import signImg from "../assets/img/signup-in/sign-in.webp";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSignIn(e) {
    e.preventDefault();

    // Validate fields
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Get all users
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      setErrors({ username: "No users exist in the system." });
      return;
    }

    const users = snapshot.val();
    let matchedUser = null;

    // Find user with matching username + password
    for (const uid in users) {
      const user = users[uid];
      
      if (user.username === username && user.password === password) {
        matchedUser = { ...user, uid }; // keep UID!
        break;
      }
    }

    // Invalid credentials
    if (!matchedUser) {
      setErrors({
        username: "Incorrect username or password",
        password: " ",
      });
      return;
    }

    //
    // ✔ Store the user object
    //
    localStorage.setItem("user", JSON.stringify(matchedUser));
    console.log("Logged in user:", matchedUser);

    //
    // ✔ ALSO store UID separately (IMPORTANT!)
    //
    localStorage.setItem("userId", matchedUser.uid);

    alert("Login successful!");
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex bg-linear-to-b from-green-600 to-green-900 text-white">
      
      {/* LEFT IMAGE SIDE */}
      <div className="relative w-1/2 flex items-center justify-center">
        <div className="relative w-full h-full">

          <img
            src={signImg}
            className="w-full h-full object-cover grayscale-[0.6] contrast-50"
            alt="Sign In Background"
          />

          <div 
            className="
              absolute top-1/2 left-6 
              text-6xl font-extrabold uppercase
              bg-white
              bg-clip-text text-transparent
            "
          >
            Sign In
          </div>

          <div className="absolute top-4 left-4">
            <Logo />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-extrabold text-center mb-6">
            Welcome Back
          </h1>

          <p className="text-center text-white/80 mb-8">
            Log in to continue caring for your plants.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
            
            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: null }));
                }}
                placeholder="yourusername"
                className={`
                  mt-1 w-full p-3 rounded-md bg-white/20 text-white border 
                  focus:outline-none focus:ring-2
                  ${errors.username 
                    ? "border-red-500 focus:ring-red-400" 
                    : "border-white/30 focus:ring-green-300"}
                `}
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="••••••••"
                className={`
                  mt-1 w-full p-3 rounded-md bg-white/20 text-white border
                  focus:outline-none focus:ring-2
                  ${errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-white/30 focus:ring-green-300"}
                `}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              className="mt-2 w-full p-3 bg-green-500 hover:bg-green-600 
              text-white font-semibold rounded-md transition"
            >
              Sign In
            </button>

          </form>

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
