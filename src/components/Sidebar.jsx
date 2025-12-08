import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarConfig, { LogoutItem } from "../data/SidebarConfig";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.action === "logout") {
      console.log("user logged out");
      return;
    }
    navigate(item.path);
  };

  return (
    <div
      className="
        fixed
        left-6 
        top-1/2 -translate-y-1/2
        h-[80%]
        w-20
        rounded-full
        bg-white/5
        backdrop-blur-xl
        shadow-2xl
        text-white
        flex flex-col
        items-center
        py-8
        gap-8
      "
    >
      {/* Icon Navigation */}
      <nav className="flex flex-col items-center gap-6 mt-4 text-2xl">
        {SidebarConfig.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleItemClick(item)}
            className="
              cursor-pointer
              text-green-500/80
              hover:text-green-800/30
              transition
            "
          >
            <FontAwesomeIcon icon={item.icon} />
          </div>
        ))}
      </nav>

      {/* Logout Icon */}
      <div className="mt-auto pb-4 text-xl">
        <button
          onClick={() => handleItemClick(LogoutItem)}
          className="
            text-red-400 
            hover:text-red-600 
            transition
          "
        >
          <FontAwesomeIcon icon={LogoutItem.icon} />
        </button>
      </div>

    </div>
  );
}
