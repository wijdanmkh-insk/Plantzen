import Sidebar from "./Sidebar";
import Logo from "/public/logo.png";
import { useLocation } from "react-router-dom";
import SidebarConfig from "../data/SidebarConfig";

export default function Layout({ children }) {
  const location = useLocation();

  // Find matching page label
  const currentPage = SidebarConfig.find(
    (item) => item.path === location.pathname
  );

  return (
    <div
      className="flex min-h-screen overflow-y-hidden"
      style={{
        background: "linear-gradient(45deg, rgba(200,255,200,0.4), rgba(0,150,0,0.4))",
      }}
    >

      {/* SIDEBAR + CONTENT COLUMN */}
      <div className="flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* CONTENT AREA */}
        <div className="flex-1 ml-32 px-10 pt-20 pb-10">

          {/* PAGE LABEL */}
          {currentPage && (
                <div
                className="
                    inline-block
                    px-6 py-4
                    mb-4
                    rounded-2xl
                    bg-white/20
                    backdrop-blur-xl
                    border border-white/20
                    shadow-lg
                    w-full
                "
                >
                <p className="text-4xl font-extrabold text-gray-900 tracking-wide">
                    {currentPage.label}
                </p>
                </div>
          )}

          {/* Actual page content */}
          {children}

        </div>
      </div>

    </div>
  );
}
