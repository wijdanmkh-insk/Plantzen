// src/pages/SignUp.jsx
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import { db } from "../firebase/firebase";
import { ref, set, get, update } from "firebase/database";
import signImg from "../assets/img/signup-in/sign-in.webp";
import { Html5Qrcode } from "html5-qrcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faQrcode } from "@fortawesome/free-solid-svg-icons";


export default function SignUp() {
  const [step, setStep] = useState(1);

  const [ownerName, setOwnerName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [deviceCode, setDeviceCode] = useState("");
  const [plantName, setPlantName] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const [errors, setErrors] = useState({});
  const [deviceError, setDeviceError] = useState("");

  const [showQr, setShowQr] = useState(false);

  const isValidFormat = /^ESP32-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(
    deviceCode.trim()
  );

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

  function handleQrClick() {
    setDeviceError("");
    setShowQr(true);
  }

  // 📷 QR SCAN → LANGSUNG ISI FORM
  useEffect(() => {
    if (!showQr) return;

    let qr;

    const startScan = async () => {
      await new Promise((r) => setTimeout(r, 100)); // tunggu DOM
      qr = new Html5Qrcode("qr-reader");

      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          // ⬇️ INI YANG LU MINTA
          setDeviceCode(decodedText.trim());
          setShowQr(false);
        }
      );
    };

    startScan();

    return () => {
      if (qr?.isScanning) {
        qr.stop().catch(() => {});
      }
    };
  }, [showQr]);

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
      <div className="relative w-1/2">
        <img
          src={signImg}
          className="w-full h-full object-cover grayscale-[0.6] contrast-50"
        />
        <div className="absolute top-4 left-4">
          <Logo/>
        </div>
        <div className="absolute top-1/2 left-6 text-6xl font-extrabold bg-white bg-clip-text text-transparent">
          Sign Up
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-center">
                Create Account
              </h1>

              {/* ✅ TEXT YANG LU MINTA */}
              <p className="text-center text-white/80 text-sm">
                To use the features, please log in
              </p>

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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-md bg-white/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                            text-white/70 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>


              <button className="bg-green-500 p-3 rounded-md font-semibold">
                Continue
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-2">
                Pair ESP32 Device
              </h2>

              {/* ✅ TEXT YANG LU MINTA */}
              <p className="text-center text-white/80 text-sm mb-4">
                If you have the device, add it by using the QR code reader or
                input the code directly to the form
              </p>

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
                onChange={(e) => {
                  setDeviceCode(e.target.value);
                  setDeviceError("");
                }}
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

              <div className="mt-4 flex gap-1">
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className={`flex-1 p-3 rounded-md font-semibold ${
                    isValidFormat
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
                >
                  {isValidFormat ? "Verify Device" : "Bro, get a job!"}
                </button>

                <button
                  type="button"
                  onClick={handleQrClick}
                  className="flex-1 p-3 rounded-md font-semibold 
                            bg-green-500 hover:bg-green-600 text-white
                            flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faQrcode} />
                  Add Device By QR
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
