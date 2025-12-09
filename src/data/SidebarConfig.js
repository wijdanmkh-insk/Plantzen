import { 
  faChartLine, 
  faMicrochip, 
  faSeedling, 
  faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";

const SidebarConfig = [
  {
    label: "Dashboard",
    icon: faChartLine,
    path: "/dashboard"
  },
  {
    label: "Plants",
    icon: faSeedling,
    path: "/seedling"
  },
  {
    label: "Devices",
    icon: faMicrochip,
    path: "/devices"
  }
  
];

export const LogoutItem = {
  label: "Logout",
  icon: faSignOutAlt,
  action: "logout"
};

export default SidebarConfig;
