import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";

const Index = () => {
  const { currentUser } = useAuth();
  const { isConfigured } = useBusiness();
  
  // If user is logged in but business not configured, redirect to setup
  if (currentUser && !isConfigured) {
    return <Navigate to="/setup" />;
  }
  
  // If user is logged in and business is configured, redirect to dashboard
  if (currentUser && isConfigured) {
    return <Navigate to="/dashboard" />;
  }
  
  // Otherwise, redirect to login
  return <Navigate to="/login" />;
};

export default Index;
