
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();
  
  // Redirect to dashboard if user is logged in, otherwise to login page
  return <Navigate to={currentUser ? "/dashboard" : "/login"} />;
};

export default Index;

