
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NotFoundPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="min-w-[150px]">
          <Link to={currentUser ? "/dashboard" : "/"}>
            Back to {currentUser ? "Dashboard" : "Home"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
