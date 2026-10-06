import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AuthAPI from "@/api/AuthAPI";
import { getAccessToken } from "@/api/axiosClient";
import CoffeeLoader from "@/widgets/loaders/CoffeeLoader";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await AuthAPI.refresh();
      } catch {
        // Chưa đăng nhập
      } finally {
        setIsReady(true);
      }
    };
    bootstrap();
  }, []);

  if (!isReady) return <CoffeeLoader />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;