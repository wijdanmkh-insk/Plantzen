import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faBatteryHalf,
  faBatteryEmpty,
  faWifi,
  faQrcode
} from "@fortawesome/free-solid-svg-icons";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../firebase/firebase";
import { ref, child, get, set, update } from "firebase/database";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deviceName, setDeviceName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [esp32Code, setEsp32Code] = useState("");

  const [adding, setAdding] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // 🔥 FETCH DEVICES (FILTER no_device)
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }

        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${userId}/devices`));

        if (snapshot.exists()) {
          const devicesData = snapshot.val();

          const devicesArray = Object.keys(devicesData)
            .map((key) => ({
              id: key,
              ...devicesData[key]
            }))
            .filter((d) => d.deviceId && d.deviceId !== "None");

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

  // 📷 QR SCAN → ISI esp32Code
  useEffect(() => {
    if (!showQr) return;

    let qr;

    const startScan = async () => {
      await new Promise((r) => setTimeout(r, 100));
      qr = new Html5Qrcode("qr-reader");

      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setEsp32Code(decodedText.trim());
          setShowQr(false);
        },
        () => {}
      );
    };

    startScan();

    return () => {
      if (qr?.isScanning) {
        qr.stop().catch(() => {});
      }
    };
  }, [showQr]);

  // DELETE DEVICE
  const handleDeleteDevice = async (deviceId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Not logged in.");

    if (!window.confirm("Are you sure you want to delete this device?")) return;

    try {
      await set(ref(db, `users/${userId}/devices/${deviceId}`), null);
      await set(ref(db, `devices_data/${deviceId}`), null);
      await set(ref(db, `available_devices/${deviceId}`), {
        code: deviceId,
        isClaimed: false,
        claimedBy: null
      });

      setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
      alert("Device deleted successfully!");
    } catch (error) {
      alert("Failed to delete device.");
    }
  };

  // ADD DEVICE
  const handleAddDevice = async (e) => {
    e.preventDefault();

    const cleaned = esp32Code.trim().toUpperCase();
    const isValidFormat =
      /^ESP32-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleaned);

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

      const deviceRef = ref(db, "available_devices/" + cleaned);
      const snap = await get(deviceRef);

      if (!snap.exists()) {
        alert("This device code does not exist.");
        return;
      }

      if (snap.val().isClaimed) {
        alert("This device is already claimed.");
        return;
      }

      await update(deviceRef, {
        isClaimed: true,
        claimedBy: userId
      });

      await set(ref(db, `users/${userId}/devices/${cleaned}`), {
        deviceId: cleaned,
        deviceName,
        plantName,
        status: "Waiting for new data...",
        online: false,
        battery: 0
      });

      if (!(await get(ref(db, `devices_data/${cleaned}`))).exists()) {
        await set(ref(db, `devices_data/${cleaned}`), {
          deviceName,
          plantName,
          plantMood: "unknown",
          plantSay: "Awaiting sensor data...",
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
      }

      setDevices((prev) => [
        ...prev,
        {
          deviceId: cleaned,
          deviceName,
          plantName,
          status: "Waiting for new data...",
          online: false,
          battery: 0
        }
      ]);

      setDeviceName("");
      setPlantName("");
      setEsp32Code("");

      alert("Device added successfully!");
    } catch (error) {
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

        {/* LEFT — DEVICE LIST */}
        <div className="lg:col-span-2 space-y-6">
          {devices.length === 0 ? (
            <div className="p-6 rounded-3xl bg-white/20 text-center">
              <p className="text-gray-700 text-lg">
                No devices yet. Add your first device on the right! 👉
              </p>
            </div>
          ) : (
            devices.map((device, idx) => {
              const batteryIcon = getBatteryIcon(device.battery);

              return (
                <div key={idx} className="p-6 rounded-3xl bg-white/20">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-bold text-lg">{device.plantName}</h2>
                      <p className="text-sm">Device: {device.deviceName}</p>
                      <button
                        onClick={() => handleDeleteDevice(device.deviceId)}
                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-center">
                      <FontAwesomeIcon icon={batteryIcon} className="text-3xl text-green-600" />
                      <p>{device.battery}%</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT — ADD DEVICE */}
        <div className="p-6 rounded-3xl bg-white/20">
          <h2 className="text-2xl font-bold mb-2">Add New Device</h2>
          <p className="text-sm mb-4">
            You can add devices by submitting QR code or scanning the QR code.
          </p>

          <form onSubmit={handleAddDevice} className="space-y-3">
            <input
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/50"
            />

            <input
              placeholder="Plant Name"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/50"
            />

            <div className="flex gap-2">
              <input
                placeholder="ESP32-XXXX-XXXX-XXXX"
                value={esp32Code}
                onChange={(e) => setEsp32Code(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-white/50"
              />

              <button
                type="button"
                onClick={() => setShowQr(true)}
                className="px-4 rounded-xl bg-green-600 text-white"
              >
                <FontAwesomeIcon icon={faQrcode} />
              </button>
            </div>

            {showQr && (
              <div className="mt-4 bg-black/40 p-4 rounded-xl">
                <div id="qr-reader" />
                <button
                  type="button"
                  onClick={() => setShowQr(false)}
                  className="mt-2 w-full bg-red-500 text-white py-2 rounded-xl"
                >
                  Cancel Scan
                </button>
              </div>
            )}

            <button
              disabled={adding}
              className="w-full py-3 bg-green-600 text-white rounded-xl"
            >
              {adding ? "Adding..." : "Add Device"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
