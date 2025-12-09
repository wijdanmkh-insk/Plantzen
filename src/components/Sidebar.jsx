// src/components/Sidebar.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarConfig, { LogoutItem } from "../data/SidebarConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import LogoWhite from '../../public/LogoWhite.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Load user info on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleItemClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      window.location.href = "/sign-in";
      return;
    }

    navigate(item.path);
  };

  return (
    <div
      className="
        fixed
        left-0
        top-0
        h-full
        w-60
        bg-emerald-600
        shadow-2xl
        border-r border-white/10
        text-white
        flex flex-col
        py-8
      "
    >
      {/* LOGO */}
      <div className="px-6 mb-6">
        <Logo src="../../public/LogoWhite.png"/>
      </div>

      {/* USER PROFILE (Avatar on top, name below) */}
      <div
        className="
          px-6 mb-8
          flex flex-col items-center
          rounded-xl py-5
        "
      >
        {/* Avatar */}
        <div
          className="
            w-20 h-20 rounded-full
            bg-white/20 border border-white/30
            flex items-center justify-center
            text-3xl font-bold
            backdrop-blur-xl
          "
        >
          {user?.owner?.charAt(0)?.toUpperCase() || "?"}
        </div>

        {/* Name */}
        <p className="mt-4 text-lg font-semibold text-white text-center">
          {user?.owner || "Unknown User"}
        </p>

        {/* Username */}
        <p className="text-sm text-white/70 text-center">
          @{user?.username || "unknown"}
        </p>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex flex-col gap-6 px-6">
        {SidebarConfig.map((item, idx) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={idx}
              onClick={() => handleItemClick(item)}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl cursor-pointer transition-all
                ${isActive 
                  ? "bg-green-100 text-green-600 shadow-lg scale-[1.02]"
                  : "text-green-50 hover:bg-green-300 hover:text-green-900"}
              `}
            >
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
              <span className="text-lg font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto px-6 pb-8">
        <button
          onClick={() => handleItemClick(LogoutItem)}
          className="
            flex items-center gap-3
            w-full px-4 py-3
            rounded-xl
            bg-red-500/20 text-red-300
            hover:bg-red-600/30 hover:text-red-100
            transition
          "
        >
          <FontAwesomeIcon icon={LogoutItem.icon} className="text-xl" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
