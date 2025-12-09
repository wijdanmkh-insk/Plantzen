// src/pages/SignUp.jsx
import { useState } from "react";
import Logo from "../components/Logo";
import { db } from "../firebase/firebase";
import { ref, set, get, update } from "firebase/database";
import signImg from "../assets/img/signup-in/sign-in.webp";
import LogoWhite from "/public/LogoWhite.png"

export default function SignUp() {
  const [step, setStep] = useState(1);

  const [ownerName, setOwnerName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [deviceCode, setDeviceCode] = useState("");
  const [plantName, setPlantName] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const [errors, setErrors] = useState({});
  const [deviceError, setDeviceError] = useState("");

  // Regex for: ESP32-XXXX-XXXX-XXXX
  const isValidFormat = /^ESP32-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(
    deviceCode.trim()
  );

  //
  // STEP 1 — VALIDATE AND MOVE TO STEP 2
  //
  function handleSignup(e) {
    e.preventDefault();
    const newErrors = {};

    if (!ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  }

  //
  // STEP 2 — SAVE USER AND CLAIM DEVICE
  //
  async function handleFinalSubmit() {
    const cleaned = deviceCode.trim();

    // User skips device
    if (!isValidFormat) {
      finalizeWithoutDevice();
      return;
    }

    // Check available_devices
    const deviceRef = ref(db, "available_devices/" + cleaned);
    const snapshot = await get(deviceRef);

    if (!snapshot.exists()) {
      setDeviceError("This device code does not exist.");
      return;
    }

    const deviceInfo = snapshot.val();
    if (deviceInfo.isClaimed) {
      setDeviceError("This device is already claimed by another account.");
      return;
    }

    setDeviceError("");

    const userId = "user_" + Date.now();

    //
    // SAVE USER
    //
    await set(ref(db, "users/" + userId), {
      owner: ownerName,
      username,
      password,
      devices: {
        [cleaned]: {
          deviceId: cleaned,
          deviceName: deviceName || cleaned,
          plantName: plantName || "Unknown"
        }
      }
    });

    //
    // MARK DEVICE AS CLAIMED
    //
    await update(ref(db, "available_devices/" + cleaned), {
      isClaimed: true,
      claimedBy: userId
    });

    //
    // INITIALIZE DEVICE DATA
    //

    await set(ref(db, `users/${userId}/devices/${cleaned}`), {
      deviceId: cleaned,
      deviceName: deviceName,
      plantName: plantName,
      status: "Waiting for new data...",
      online: false,
      battery: 0
    });

    await set(ref(db, "devices_data/" + cleaned), {
      deviceName: deviceName || cleaned,
      plantName: plantName || "Unknown",
      currentState: {
        temperature: 0,
        humidity: 0,
        soilHumidity: 0,
        lightIntensity: 0,
        deviceState: "OFF",
        battery: 100,
        networkStrength: -100
      }
    });

    alert("Device verified & account created!");
    window.location.href = "/sign-in";
  }

  //
  // USER CHOSE NO DEVICE
  //
  async function finalizeWithoutDevice() {
    const userId = "user_" + Date.now();

    await set(ref(db, "users/" + userId), {
      owner: ownerName,
      username,
      password,
      devices: {
        no_device: {
          deviceId: "None",
          deviceName: "None",
          plantName: "None"
        }
      }
    });

    alert("Account created without device.");
    window.location.href = "/sign-in";
  }

  return (
    <div className="min-h-screen flex bg-linear-to-b from-green-600 to-green-900 text-white">
      
      {/* LEFT IMAGE */}
      <div className="relative w-1/2 flex items-center justify-center">
        <div className="relative w-full h-full">

          <img
            src={signImg}
            className="w-full h-full object-cover grayscale-[0.6] contrast-50"
          />

          <div 
            className="
              absolute top-1/2 left-6 
              text-6xl font-extrabold uppercase
              bg-white
              bg-clip-text text-transparent
            "
          >
            Sign Up
          </div>

          <div className="absolute top-4 left-4">
            <Logo src={LogoWhite}/>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">

          {/* STEP 1 — ACCOUNT INFO */}
          {step === 1 && (
            <>
              <h1 className="text-4xl font-extrabold text-center mb-6">
                Create Your Account
              </h1>

              <p className="text-center text-white/80 mb-8">
                Join Plantzen today and start your journey to smarter plant care!
              </p>

              <form className="flex flex-col gap-5" onSubmit={handleSignup}>

                {/* Owner Name */}
                <div>
                  <label className="text-sm font-medium">Owner Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                      setErrors((prev) => ({ ...prev, ownerName: null }));
                    }}
                    placeholder="John Doe"
                    className={`
                      mt-1 w-full p-3 rounded-md bg-white/20 text-white border
                      focus:outline-none focus:ring-2
                      ${errors.ownerName ? "border-red-500 focus:ring-red-400" : "border-white/30 focus:ring-green-300"}
                    `}
                  />
                  {errors.ownerName && (
                    <p className="text-red-400 text-sm mt-1">{errors.ownerName}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors((prev) => ({ ...prev, username: null }));
                    }}
                    placeholder="plantmaster123"
                    className={`
                      mt-1 w-full p-3 rounded-md bg-white/20 text-white border
                      focus:outline-none focus:ring-2
                      ${errors.username ? "border-red-500 focus:ring-red-400" : "border-white/30 focus:ring-green-300"}
                    `}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Password */}
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
                      ${errors.password ? "border-red-500 focus:ring-red-400" : "border-white/30 focus:ring-green-300"}
                    `}
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
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
                <a href="/sign-in" className="text-green-300 hover:underline">Log in</a>
              </p>
            </>
          )}

          {/* STEP 2 — DEVICE PAIRING */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-extrabold text-center mb-6">
                Pair Your ESP32 Device
              </h2>

              <p className="text-white/80 text-center mb-4">
                Enter your device details and pairing code:
              </p>

              {/* Device Name */}
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Example: My Basil Pot"
                className="mt-1 w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              {/* Plant Name */}
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Example: Basil"
                className="mt-1 w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              {/* Device Code */}
              <input
                type="text"
                value={deviceCode}
                onChange={(e) => {
                  setDeviceCode(e.target.value);
                  setDeviceError("");
                }}
                placeholder="ESP32-XXXX-XXXX-XXXX"
                className="mt-1 w-full p-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              {deviceError && (
                <p className="text-red-400 text-sm mt-1">{deviceError}</p>
              )}

              <button
                onClick={handleFinalSubmit}
                className={`
                  mt-4 w-full p-3 font-semibold rounded-md transition
                  ${
                    isValidFormat
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }
                `}
              >
                {isValidFormat ? "Verify Device" : "Skip Device"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
