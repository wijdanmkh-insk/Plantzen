import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import RouteConfig from "./RouteConfig.js"
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {RouteConfig.map(({ path, component }, idx) => {
          const Page = lazy(() => import(`./pages/${component}.jsx`));

          return <Route key={idx} path={path} element={<Page />} />;
        })}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
