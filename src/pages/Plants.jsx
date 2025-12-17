// src/pages/Plants.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db } from "../firebase/firebase";
import { ref, onValue, get, child } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faBatteryFull,
  faBatteryHalf,
  faBatteryEmpty
} from "@fortawesome/free-solid-svg-icons";

export default function Plants() {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Battery Icon Logic
  const getBatteryIcon = (battery) => {
    if (battery > 70) return faBatteryFull;
    if (battery < 25) return faBatteryEmpty;
    return faBatteryHalf;
  };

  // Mood Emojis
  const moodEmoji = {
    happy: "😊",
    tooHot: "🥵",
    tooCold: "🥶",
    thirsty: "💧",
    lowLight: "🌑",
    highLight: "☀️",
    stressed: "😟",
    unknown: "🌱"
  };

  // 🔥 FETCH DEVICES + REALTIME UPDATES
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    const dbRef = ref(db);

    const loadDevices = async () => {
      const devSnap = await get(child(dbRef, `users/${userId}/devices`));
      if (!devSnap.exists()) {
        setDevices([]);
        setLoading(false);
        return;
      }

      const deviceIds = Object.keys(devSnap.val());

      // realtime listener per device
      const unsubscribers = [];

      const devicesTemp = {};

      deviceIds.forEach((id) => {
        const deviceRef = ref(db, `devices_data/${id}`);

        const unsub = onValue(deviceRef, (snap) => {
          if (!snap.exists()) return;

          devicesTemp[id] = {
            deviceId: id,
            ...snap.val()
          };

          const list = Object.values(devicesTemp);
          setDevices(list);

          if (!selectedDeviceId && list.length > 0) {
            setSelectedDeviceId(list[0].deviceId);
            setSelectedDevice(list[0]);
          }

          if (selectedDeviceId === id) {
            setSelectedDevice(devicesTemp[id]);
          }
        });

        unsubscribers.push(unsub);
      });

      setLoading(false);

      return () => unsubscribers.forEach((u) => u());
    };

    loadDevices();
  }, [selectedDeviceId]);

  // Click handler
  const handleSelect = (id) => {
    setSelectedDeviceId(id);
    const found = devices.find((d) => d.deviceId === id);
    setSelectedDevice(found);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-800 text-lg">
          Loading plants...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">

        {/* 🌿 LEFT SIDE — Device List */}
        <div className="
          col-span-1 
          bg-white/40 backdrop-blur-xl border border-white/40 
          rounded-3xl p-5 shadow-xl overflow-y-auto
        ">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            Your Plants
          </h2>

          {devices.map((dev) => (
            <div
              key={dev.deviceId}
              onClick={() => handleSelect(dev.deviceId)}
              className={`
                p-4 mb-3 rounded-xl cursor-pointer border
                transition-all shadow-md
                ${
                  selectedDeviceId === dev.deviceId
                    ? "bg-green-200 border-green-500"
                    : "bg-white/70 hover:bg-green-100 border-white/40"
                }
              `}
            >
              <p className="font-bold text-green-900 text-lg flex items-center gap-2">
                {moodEmoji[dev.plantMood] || "🌱"}
                {dev.plantName}
              </p>
              <p className="text-sm text-gray-700">{dev.deviceName}</p>
            </div>
          ))}
        </div>

        {/* 📊 RIGHT SIDE — Device Details */}
        <div className="col-span-3 rounded-3xl bg-white/30 backdrop-blur-xl p-8 shadow-xl border border-white/40">

          {selectedDevice ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-extrabold text-green-900">
                    {selectedDevice.plantName}
                  </h1>
                  <p className="text-gray-700 text-lg">
                    {selectedDevice.deviceName}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="flex items-center gap-2 font-semibold text-gray-700">
                    <FontAwesomeIcon
                      icon={faWifi}
                      className={
                        selectedDevice.currentState.networkStrength > -70
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    />
                    Wifi
                  </p>

                  <p className="flex items-center gap-2 font-semibold text-gray-700">
                    <FontAwesomeIcon
                      icon={getBatteryIcon(
                        selectedDevice.currentState.battery
                      )}
                      className="text-green-600 text-xl"
                    />
                    {selectedDevice.currentState.battery}%
                  </p>
                </div>
              </div>

              {/* Image */}
              <div
                className="w-full h-64 rounded-2xl mt-6 mb-6 bg-cover bg-center border border-white/40 shadow-md"
                style={{
                  backgroundImage: `url(${selectedDevice.imageUrl || "/plants/default.jpg"})`
                }}
              />

              {/* Mood + Plant Say */}
              <div className="p-4 rounded-xl bg-green-100 border border-green-300 mb-6">
                <p className="text-xl font-bold text-green-900">
                  {moodEmoji[selectedDevice.plantMood] || "🌱"}{" "}
                  {selectedDevice.plantMood}
                </p>
                <p className="mt-2 text-gray-800 italic">
                  🌿 “{selectedDevice.plantSay || "Aku masih tumbuh..."}”
                </p>
              </div>

              {/* Sensors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SensorBox
                  label="Temperature"
                  value={`${selectedDevice.currentState.temperature}°C`}
                />
                <SensorBox
                  label="Humidity"
                  value={`${selectedDevice.currentState.humidity}%`}
                />
                <SensorBox
                  label="Soil Moisture"
                  value={selectedDevice.currentState.soilHumidity}
                />
                <SensorBox
                  label="Light Intensity"
                  value={selectedDevice.currentState.lightIntensity}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-lg">
              Select a plant to view details.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}

// 📦 Sensor Card
function SensorBox({ label, value }) {
  return (
    <div className="p-6 rounded-2xl bg-white/60 border border-white/40 shadow-md">
      <p className="text-gray-700 font-semibold">{label}</p>
      <p className="text-3xl font-extrabold text-green-800 mt-1">
        {value}
      </p>
    </div>
  );
}
