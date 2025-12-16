// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import RouteConfig from "./RouteConfig";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {RouteConfig.map(({ path, component, protected: isProtected }, idx) => {
          const Page = lazy(() => import(`./pages/${component}.jsx`));

          return (
            <Route
              key={idx}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute>
                    <Page />
                  </ProtectedRoute>
                ) : (
                  <Page />
                )
              }
            />
          );
        })}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
