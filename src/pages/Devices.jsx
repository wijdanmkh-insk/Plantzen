import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBatteryFull, faBatteryHalf, faBatteryEmpty, faWifi, faQrcode } from "@fortawesome/free-solid-svg-icons";

// Example data — later you can fetch this via n8n or Firebase
const devices = [
  {
    id: "ESP32-001",
    plantName: "Monstera",
    status: "Happy 😊",
    online: true,
    battery: 95
  },
  {
    id: "ESP32-002",
    plantName: "Aloe Vera",
    status: "Dry 😢",
    online: false,
    battery: 10
  },
  {
    id: "ESP32-003",
    plantName: "Snake Plant",
    status: "Stable 🌿",
    online: true,
    battery: 55
  }
];

export default function Devices() {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SIDE — Device List */}
        <div className="lg:col-span-2 space-y-6">

          {devices.map((device, idx) => {
            // Battery Icon Logic
            let batteryIcon = faBatteryHalf;
            if (device.battery > 70) batteryIcon = faBatteryFull;
            else if (device.battery < 25) batteryIcon = faBatteryEmpty;

            return (
              <div
                key={idx}
                className="
                  p-6 rounded-3xl 
                  backdrop-blur-xl bg-white/20 border border-white/30 
                  shadow-xl
                "
              >
                <div className="flex justify-between items-center">

                  {/* Left Info */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {device.plantName}
                    </h2>
                    <p className="text-sm text-gray-700">
                      Device ID: {device.id}
                    </p>

                    <p className="mt-2 text-gray-800 font-semibold flex items-center gap-2">
                      Status: 
                      <span className="text-green-700">{device.status}</span>
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
                  </div>

                  {/* Battery */}
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={batteryIcon}
                      className="text-3xl text-green-600"
                    />
                    <span className="text-gray-800 font-bold mt-1">
                      {device.battery}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* RIGHT SIDE — Add Device */}
        <div
          className="
            p-6 rounded-3xl 
            backdrop-blur-xl bg-white/20 border border-white/30 
            shadow-xl h-fit
          "
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Add New Device
          </h2>

          <p className="text-gray-700 mb-4">
            Enter the QR code from your ESP32 device to pair it.
          </p>

          <div className="relative mb-5">
            <FontAwesomeIcon
              icon={faQrcode}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
            />
            <input
              type="text"
              placeholder="ESP32-QR-CODE"
              className="
                w-full pl-12 p-3 rounded-xl 
                bg-white/50 border border-white/30 
                focus:outline-none focus:ring-2 focus:ring-green-300
              "
            />
          </div>

          <button
            className="
              w-full py-3 bg-green-600 hover:bg-green-700 
              text-white font-semibold rounded-xl 
              transition
            "
          >
            Add Device
          </button>

        </div>

      </div>

    </Layout>
  );
}
