const RouteConfig = [
  {
    path: "/",
    component: "Landing",
    protected: false
  },
  {
    path: "/sign-in",
    component: "SignIn",
    protected: false
  },
  {
    path: "/sign-up",
    component: "SignUp",
    protected: false
  },
  {
    path: "/dashboard",
    component: "Dashboard",
    protected: true
  },
  {
    path: "/devices",
    component: "Devices",
    protected: true
  },
  {
    path: "/seedling",
    component: "Plants",
    protected: true
  }
];

export default RouteConfig;
