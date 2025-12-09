import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBatteryFull, faBatteryHalf, faBatteryEmpty, faWifi, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase/firebase";
import { ref, child, get, set, update } from "firebase/database";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceName, setDeviceName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [esp32Code, setEsp32Code] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch devices from Firebase
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.log("No user logged in");
          setLoading(false);
          return;
        }

        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${userId}/devices`));
        
        if (snapshot.exists()) {
          const devicesData = snapshot.val();
          const devicesArray = Object.keys(devicesData).map((key) => ({
            id: key,
            ...devicesData[key]
          }));
          setDevices(devicesArray);
        } else {
          setDevices([]);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // DELETE DEVICE
  const handleDeleteDevice = async (deviceId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Not logged in.");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this device?"
    );
    if (!confirmDelete) return;

    try {
      // Remove from user's devices
      await set(ref(db, `users/${userId}/devices/${deviceId}`), null);

      // Remove device data
      await set(ref(db, `devices_data/${deviceId}`), null);

      // Mark device as unclaimed
      await set(ref(db, `available_devices/${deviceId}`), {
        code: deviceId,
        isClaimed: false,
        claimedBy: null
      });

      // Update UI
      setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));

      alert("Device deleted successfully!");
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Failed to delete device.");
    }
  };

  // Handle add device
  const handleAddDevice = async (e) => {
  e.preventDefault();

  const cleaned = esp32Code.trim().toUpperCase();
  const isValidFormat = /^ESP32-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleaned);

  if (!deviceName || !plantName || !esp32Code) {
    alert("Please fill all fields");
    return;
  }

  if (!isValidFormat) {
    alert("Invalid device code format!");
    return;
  }

  setAdding(true);

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }

    //
    // 1️⃣ CHECK IF DEVICE EXISTS IN available_devices
    //
    const deviceRef = ref(db, "available_devices/" + cleaned);
    const snap = await get(deviceRef);

    if (!snap.exists()) {
      alert("This device code does not exist in available devices.");
      return;
    }

    const deviceInfo = snap.val();
    if (deviceInfo.isClaimed) {
      alert("This device is already claimed by another user.");
      return;
    }

    //
    // 2️⃣ MARK DEVICE AS CLAIMED
    //
    await update(ref(db, "available_devices/" + cleaned), {
      isClaimed: true,
      claimedBy: userId
    });

    //
    // 3️⃣ ADD DEVICE UNDER USER ACCOUNT
    //
    await set(ref(db, `users/${userId}/devices/${cleaned}`), {
      deviceId: cleaned,
      deviceName: deviceName,
      plantName: plantName,
      status: "Waiting for new data...",
      online: false,
      battery: 0
    });

    //
    // 4️⃣ INITIALIZE devices_data IF MISSING
    //
    const deviceDataRef = ref(db, "devices_data/" + cleaned);
    const dataSnap = await get(deviceDataRef);

    if (!dataSnap.exists()) {
      await set(deviceDataRef, {
        deviceName: deviceName,
        plantName: plantName,
        currentState: {
          temperature: 0,
          humidity: 0,
          soilHumidity: 0,
          lightIntensity: 0,
          deviceState: "OFF",
          battery: 100,
          networkStrength: -100,
          plantMood: "unknown",
          plantSay: "Awaiting sensor data..."
        }
      });
    }

    //
    // 5️⃣ UPDATE LOCAL UI
    //
    setDevices(prev => [
      ...prev,
      {
        id: cleaned,
        deviceId: cleaned,
        deviceName,
        plantName,
        status: "Waiting for new data...",
        online: false,
        battery: 0
      }
    ]);

    // Reset input fields
    setDeviceName("");
    setPlantName("");
    setEsp32Code("");

    alert("Device added & claimed successfully!");

  } catch (error) {
    console.error("Error claiming device:", error);
    alert("Failed to add device.");
  } finally {
    setAdding(false);
  }
};


  const getBatteryIcon = (battery) => {
    if (battery > 70) return faBatteryFull;
    if (battery < 25) return faBatteryEmpty;
    return faBatteryHalf;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-700 text-lg">Loading devices...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SIDE — Device List */}
        <div className="lg:col-span-2 space-y-6">
          {devices.length === 0 ? (
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl text-center">
              <p className="text-gray-700 text-lg">No devices yet. Add your first device on the right! 👉</p>
            </div>
          ) : (
            devices.map((device, idx) => {
              const batteryIcon = getBatteryIcon(device.battery);

              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl"
                >
                  <div className="flex justify-between items-center">

                    {/* LEFT: Device info */}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {device.plantName}
                      </h2>
                      <p className="text-sm text-gray-700">
                        Device: {device.deviceName}
                      </p>
                      <p className="text-xs text-gray-600">
                        ID: {device.deviceId}
                      </p>

                      <p className="mt-2 text-gray-800 font-semibold flex items-center gap-2">
                        Status: 
                        <span className={device.online ? "text-green-700" : "text-red-700"}>
                          {device.status}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-gray-800 font-semibold mt-2">
                        Connectivity:
                        {device.online ? (
                          <FontAwesomeIcon className="text-green-500" icon={faWifi} />
                        ) : (
                          <FontAwesomeIcon className="text-red-500" icon={faWifi} />
                        )}
                        <span className={device.online ? "text-green-600" : "text-red-500"}>
                          {device.online ? "Online" : "Offline"}
                        </span>
                      </p>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDeleteDevice(device.deviceId)}
                        className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white 
                        hover:bg-red-600 transition font-semibold"
                      >
                        Delete Device
                      </button>
                    </div>

                    {/* Battery */}
                    <div className="flex flex-col items-center">
                      <FontAwesomeIcon
                        icon={batteryIcon}
                        className={`text-3xl ${
                          device.battery > 70 ? "text-green-600" :
                          device.battery > 25 ? "text-yellow-600" :
                          "text-red-600"
                        }`}
                      />
                      <span className="text-gray-800 font-bold mt-1">
                        {device.battery}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT SIDE — Add Device */}
        <div className="flex flex-col justify-between">
          <div>
          </div>
          
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Device</h2>
            <p className="mb-4 text-sm text-gray-800">To add a new device, assign the device code into this form. The device code itself were provided inside the box, so make sure you've input it correctly</p>

            <form onSubmit={handleAddDevice} className="space-y-3">
              <input
                type="text"
                placeholder="Device Name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <input
                type="text"
                placeholder="Plant Name"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <div className="relative">
                <FontAwesomeIcon
                  icon={faQrcode}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
                />
                <input
                  type="text"
                  placeholder="ESP32-QR-CODE"
                  value={esp32Code}
                  onChange={(e) => setEsp32Code(e.target.value)}
                  className="w-full pl-12 p-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? "Adding..." : "Add Device"}
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </Layout>
  );
}
