// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import SidebarConfig from "../data/SidebarConfig";

export default function Layout({ children }) {
  const location = useLocation();

  const currentPage = SidebarConfig.find(
    (item) => item.path === location.pathname
  );

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(45deg, rgba(200,255,200,0.4), rgba(0,150,0,0.4))",
      }}
    >

      {/* SIDEBAR (fixed left) */}
      <Sidebar />

      {/* MAIN CONTENT — shift by sidebar width */}
      <div className="flex-1 ml-64 px-10 pt-10 pb-10 flex flex-col overflow-hidden">
        {/* SCROLLABLE MAIN AREA */}
        <div className="flex-1 overflow-y-auto pr-3">
          {children}
        </div>

      </div>
    </div>
  );
}
