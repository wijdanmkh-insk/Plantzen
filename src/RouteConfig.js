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
    path: "/verify",
    component: "Verify",
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
  path: "*",
  component: "NotFound",
}

];

export default RouteConfig;
