
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Simply redirect to the login page
  return <Navigate to="/login" />;
};

export default Index;
