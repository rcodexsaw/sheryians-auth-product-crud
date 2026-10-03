import React from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  return (
    <>
      {user && <Navbar />}
      {user ? <Dashboard /> : <AuthPage />}
    </>
  );
}
