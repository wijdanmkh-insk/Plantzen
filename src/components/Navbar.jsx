import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import logo from "../../public/logo.png";
import GoTo from "./GoTo";

export default function Navbar() {
  const [blur, setBlur] = useState(false);

  // MOVE THIS TO THE TOP
  const location = useLocation();

  // NOW location can be used safely
  const isLanding = location.pathname === "/";
  const isAuth = ["/sign-in", "/sign-up", "/verify"].includes(location.pathname);
  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      const screenHeight = window.innerHeight;
      setBlur(window.scrollY > screenHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // MUST come after variable definitions
  if (isDashboard) {
    return <Sidebar />;
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full px-10 py-4 z-50 transition-all duration-300
        ${
          blur
            ? "backdrop-blur-lg bg-white/20 shadow-md"
            : "bg-transparent"
        }
      `}
    >
      <div className="flex w-full items-center justify-between px-10">
        <img src={logo} alt="Plantzen Logo" className="w-32 h-auto" />

        {!isAuth && !isDashboard && (
          <ul className="hidden md:flex gap-8 font-medium">
            <li className="hover:text-green-600 cursor-pointer">Home</li>
            <li className="hover:text-green-600 cursor-pointer">Products</li>
            <li className="hover:text-green-600 cursor-pointer">About</li>
            <li className="hover:text-green-600 cursor-pointer">Contact</li>
          </ul>
        )}

        <div className="flex gap-4">
          {isLanding && (
            <>
              <GoTo
                page="SignIn"
                className="px-3 py-2 bg-white text-green-600 rounded-xl hover:bg-gray-100 transition inline-block font-semibold"
              >
                Sign In
              </GoTo>

              <GoTo
                page="SignUp"
                className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition inline-block font-semibold"
              >
                Sign Up
              </GoTo>
            </>
          )}

          {isAuth && (
            <GoTo
              page="Landing"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition inline-block"
            >
              Back
            </GoTo>
          )}

          {isDashboard && (
            <button className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition inline-block">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
