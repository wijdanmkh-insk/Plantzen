// src/pages/SignUp.jsx
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import { db } from "../firebase/firebase";
import { ref, set, get, update } from "firebase/database";
import signImg from "../assets/img/signup-in/sign-in.webp";
import LogoWhite from "/public/LogoWhite.png";
import { Html5Qrcode } from "html5-qrcode";

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

  const [showQr, setShowQr] = useState(false);

  // Regex ESP32
  const isValidFormat = /^ESP32-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(
    deviceCode.trim()
  );

  //
  // STEP 1
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
  // QR BUTTON
  //
  function handleQrClick() {
    setShowQr(true);
  }

  //
  // QR SCAN EFFECT
  //
  useEffect(() => {
    if (!showQr) return;

    const qr = new Html5Qrcode("qr-reader");

    qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        setDeviceCode(decodedText.trim());
        setShowQr(false);
        qr.stop();
      },
      () => {}
    );

    return () => {
      qr.stop().catch(() => {});
    };
  }, [showQr]);

  //
  // STEP 2 — FINAL SUBMIT
  //
  async function handleFinalSubmit() {
    const cleaned = deviceCode.trim();

    if (!isValidFormat) {
      finalizeWithoutDevice();
      return;
    }

    const deviceRef = ref(db, "available_devices/" + cleaned);
    const snapshot = await get(deviceRef);

    if (!snapshot.exists()) {
      setDeviceError("This device code does not exist.");
      return;
    }

    if (snapshot.val().isClaimed) {
      setDeviceError("This device is already claimed.");
      return;
    }

    const userId = "user_" + Date.now();

    await set(ref(db, "users/" + userId), {
      owner: ownerName,
      username,
      password,
      devices: {
        [cleaned]: {
          deviceId: cleaned,
          deviceName: deviceName || cleaned,
          plantName: plantName || "Unknown",
          status: "Waiting for new data...",
          online: false,
          battery: 0
        }
      }
    });

    await update(ref(db, "available_devices/" + cleaned), {
      isClaimed: true,
      claimedBy: userId
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
  // NO DEVICE
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
      {/* LEFT */}
      <div className="relative w-1/2">
        <img
          src={signImg}
          className="w-full h-full object-cover grayscale-[0.6] contrast-50"
        />
        <div className="absolute top-4 left-4">
          <Logo src={LogoWhite} />
        </div>
        <div className="absolute top-1/2 left-6 text-6xl font-extrabold bg-white bg-clip-text text-transparent">
          Sign Up
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">

          {step === 1 && (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-center">Create Account</h1>

              <input
                placeholder="Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="p-3 rounded-md bg-white/20"
              />

              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 rounded-md bg-white/20"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-md bg-white/20"
              />

              <button className="bg-green-500 p-3 rounded-md font-semibold">
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                Pair ESP32 Device
              </h2>

              <input
                placeholder="Device Name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full p-3 mb-2 rounded-md bg-white/20"
              />

              <input
                placeholder="Plant Name"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full p-3 mb-2 rounded-md bg-white/20"
              />

              <input
                placeholder="ESP32-XXXX-XXXX-XXXX"
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value)}
                className="w-full p-3 rounded-md bg-white/20"
              />

              {deviceError && (
                <p className="text-red-400 text-sm mt-1">{deviceError}</p>
              )}

              {showQr && (
                <div className="mt-4 bg-black/40 p-4 rounded-md">
                  <div id="qr-reader" className="w-full" />
                  <button
                    onClick={() => setShowQr(false)}
                    className="mt-2 w-full bg-red-500 p-2 rounded-md"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleFinalSubmit}
                  className={`flex-1 p-3 rounded-md font-semibold ${
                    isValidFormat
                      ? "bg-green-500"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {isValidFormat
                    ? "Verify Device"
                    : "Bro, get a job to get a new device"}
                </button>

                <button
                  onClick={handleQrClick}
                  className="p-3 bg-blue-500 rounded-md font-semibold"
                >
                  QR
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
