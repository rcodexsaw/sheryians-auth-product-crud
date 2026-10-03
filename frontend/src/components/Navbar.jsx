import React from "react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="nav">
      <div className="brand">ShopFlow</div>
      <div className="nav-right">
        {user && (
          <>
            <span>Hi, {user.name}</span>
            <button className="ghost" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
