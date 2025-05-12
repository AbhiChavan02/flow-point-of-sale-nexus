
import React, { useState } from "react";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddUserForm from "@/components/users/AddUserForm";
import { useIsMobile } from "@/hooks/use-mobile";

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const isMobile = useIsMobile();

  return (
    <Layout>
      <Header title="User Management">
        {activeTab === "list" && (
          <Button 
            variant="outline" 
            className="ml-auto" 
            onClick={() => setActiveTab("add")}
          >
            <UserPlus size={16} className="mr-2" />
            {isMobile ? "Add" : "Add User"}
          </Button>
        )}
      </Header>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="list">Users List</TabsTrigger>
            <TabsTrigger value="add">Add User</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow p-6">
              <h2 className="text-xl font-semibold mb-4">All Users</h2>
              <p className="text-gray-500 dark:text-gray-400">
                No users found. Add your first user by clicking the "Add User" button.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <AddUserForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UsersPage;
