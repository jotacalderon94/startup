import React from "react";
import { Navigate } from "react-router-dom";
import { AuthState } from "./authState.js";

export default function ProtectedRoute({ authState, children }) {
  if (authState === AuthState.Authenticated) {
    return children; //  Allow access
  }
  if (authState === AuthState.Unknown) {
    return <p>Loading...</p>; // Optional: while checking session
  }
  //  Not logged in
  return <Navigate to="/login" replace />;
}
