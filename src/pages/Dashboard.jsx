import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi, faWifiStrong, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <Layout>

      {/* PLANT OWNER */}
      {/* MAIN PANEL */}
      <div
        className="
          w-full
          grid grid-cols-1 lg:grid-cols-3 gap-10
          bg-white/10 backdrop-blur-xl
          border border-white/10
          rounded-3xl
          px-10 py-8
          bottom-0
          shadow-xl
        "
      >

        {/* LEFT PANEL */}
        <div className="lg:col-span-1 space-y-6">

          {/* GLASS DEVICE PANEL */}
          <div
            className="
              p-6 rounded-3xl shadow-xl
              backdrop-blur-xl bg-white/20 border border-white/30
            "
          >
            {/* Plant Image */}
            <div
              className="
                relative
                w-full h-60 mb-4 rounded-xl overflow-hidden
                bg-cover bg-center
                border border-white/30
              "
              style={{
                backgroundImage: `url(src/assets/img/plants/Monstera.jpeg)`,
              }}
            >
              {/* Gradient overlay */}
              <div
                className="
                  absolute inset-0 
                  bg-linear-to-b from-black/40 via-black/10 to-transparent
                "
              ></div>

              {/* Plant name text */}
              <span
                className="
                  absolute top-3 left-3
                  text-white font-bold text-xl
                  drop-shadow-xl
                "
              >
                Monstera
              </span>
            </div>

            {/* Device Name */}
            <p className="text-gray-800 font-semibold">
              Name:
              <span className="text-gray-900 font-bold ml-2">My Plant ESP32</span>
            </p>

            {/* Network Strength */}
            <p className="text-gray-800 font-semibold mt-3 flex items-center gap-2">
              Network:
              <FontAwesomeIcon className="text-green-600" icon={faWifiStrong} />
              <span className="font-bold text-green-700">Strong</span>
            </p>

            {/* Plant Type */}
            <p className="text-gray-800 font-semibold mt-3">
              Plant Type:
              <span className="text-gray-900 font-bold ml-2">Monstera</span>
            </p>

            {/* Plant Mood */}
            <p className="text-gray-800 font-semibold mt-3">
              Mood:
              <span className="text-blue-600 font-bold ml-2">Happy 😊</span>
            </p>

            {/* Plant says */}
            <div
              className="
                mt-4 p-4 rounded-xl text-green-900 font-medium
                bg-green-100 border border-green-300
              "
            >
              🌿 "I'm feeling great today! Thanks for watering me 😄"
            </div>

            {/* Switch Plants */}
            <div className="flex justify-between items-center mt-6">
              <button
                className="
                  p-3 rounded-xl bg-white/30 backdrop-blur-xl 
                  hover:bg-white/40 transition border border-white/20
                "
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <span className="font-semibold text-gray-900">1 / 3</span>

              <button
                className="
                  p-3 rounded-xl bg-white/30 backdrop-blur-xl 
                  hover:bg-white/40 transition border border-white/20
                "
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>

          {/* Toggle Power */}
          <div
            className="
              p-6 rounded-3xl shadow-xl
              backdrop-blur-xl bg-white/20 border border-white/30
              flex items-center justify-between
            "
          >
            <span className="text-xl font-bold text-gray-900">Device Power</span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition"></div>
              <div
                className="
                  absolute left-1 top-2 bg-white w-6 h-6 rounded-full 
                  transition-transform peer-checked:translate-x-7 shadow-md
                "
              ></div>
            </label>
          </div>

        </div>

        {/* RIGHT SENSOR PANEL */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ESP32 Device */}
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">ESP32 Device</h3>
            <p className="mt-2 text-gray-700 font-semibold">
              Device ID: <span className="text-gray-900">ESP32-ABEF921</span>
            </p>
          </div>

          {/* Temperature */}
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Temperature</h3>
            <p className="mt-2 text-green-700 text-3xl font-extrabold">25°C</p>
          </div>

          {/* Humidity */}
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Humidity</h3>
            <p className="mt-2 text-blue-600 text-3xl font-extrabold">61%</p>
          </div>

          {/* Soil Moisture */}
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Soil Moisture</h3>
            <p className="mt-2 text-amber-600 text-3xl font-extrabold">43%</p>
          </div>

          {/* Light Intensity */}
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Light Intensity</h3>
            <p className="mt-2 text-yellow-500 text-3xl font-extrabold">712 lx</p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
