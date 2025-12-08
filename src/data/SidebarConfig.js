import { 
  faChartLine, 
  faMicrochip, 
  faSeedling, 
  faCog,
  faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";

const SidebarConfig = [
  {
    label: "Dashboard",
    icon: faChartLine,
    path: "/dashboard"
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
