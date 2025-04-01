import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import Dashboard from "./layouts/dashboard";
import Guest from "./layouts/guest";
import Auth from "./layouts/auth";
import routes from "./routes";
import ErrorPage from "./pages/error-page";
import ProtectedRoute from "./components/Elements/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          {routes
            .find((config) => config.layout === "dashboard")
            ?.pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
        </Route>
      </Route>

      <Route path="/auth">
        <Route element={<Auth />}>
          {routes
            .find((config) => config.layout === "auth")
            ?.pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
        </Route>
      </Route>

      <Route path="/">
        <Route element={<Guest />}>
          {routes
            .find((config) => config.layout === "guest")
            ?.pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
        </Route>
      </Route>

      <Route path="/error" element={<ErrorPage />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
