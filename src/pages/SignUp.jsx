// src/pages/SignUp.jsx
import { useState } from "react";
import { db } from "../firebase/firebase";
import { ref, set } from "firebase/database";

export default function SignUp() {
  const [ownerName, setOwnerName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [deviceCode, setDeviceCode] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    if (!ownerName || !username || !password) {
      alert("Please fill all fields.");
      return;
    }

    const userId = Date.now().toString(); // simple unique user ID

    await set(ref(db, "users/" + userId), {
      owner_name: ownerName,
      username,
      password,
      devices: {
        [deviceCode || "NO_DEVICE"]: true
      }
    });

    alert("Account created successfully!");
  }

  return (
    <div
      className="
        min-h-screen flex flex-col md:flex-row
        items-center justify-center 
        bg-linear-to-b from-green-600 to-green-900
        px-6 relative
      "
    >
      <div className="flex flex-row gap-10 bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl items-start justify-center w-full max-w-5xl">

        {/* LEFT — Signup Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-center text-white mb-6">
              Create Your Account
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleSignup}>
              {/* Owner Name */}
              <div>
                <label className="text-white text-sm font-medium">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-white text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="plantmaster123"
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

              <button
                type="submit"
                className="mt-2 w-full p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition"
              >
                Continue
              </button>
            </form>

            <p className="text-center text-white/70 text-sm mt-4">
              Already have an account?{" "}
              <a href="/sign-in" className="text-green-300 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT — ESP32 Code Panel */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-extrabold text-center text-white mb-6">
              Pair Your ESP32 Device
            </h2>

            <p className="text-white/80 text-center mb-4">
              Enter the device code shown on your ESP32 screen or given with your kit.
            </p>

            <input
              type="text"
              value={deviceCode}
              onChange={(e) => setDeviceCode(e.target.value)}
              placeholder="ESP32-XXXX-CODE"
              className="
                mt-1 w-full p-3 rounded-md bg-white/20 text-white 
                border border-white/30 focus:outline-none focus:ring-2 
                focus:ring-green-300
              "
            />

            <button
              className="
                mt-4 w-full p-3 bg-green-500 hover:bg-green-600 text-white 
                font-semibold rounded-md transition
              "
            >
              Verify Device
            </button>

            <p className="text-center text-white/70 text-sm mt-4 underline cursor-pointer hover:text-white transition">
              I don't have the device right now
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
