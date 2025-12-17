const RouteConfig = [
  {
    path: "/",
    component: "Landing",
  },
  {
    path: "/sign-in",
    component: "SignIn",
  },
  {
    path: "/sign-up",
    component: "SignUp",
  },
  {
    path: "/dashboard",
    component: "Dashboard",
  },
  {
    path: "/devices",
    component: "Devices",
  },
  {
    path: "/seedling",
    component: "Plants",
  },
  {
  path: "*",
  component: "NotFound",
}

];

export default RouteConfig;
