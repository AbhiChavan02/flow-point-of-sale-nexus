
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { USER_ROLES, DEMO_USERS } from "@/config/constants";
import { Users } from "lucide-react";

const UsersPage: React.FC = () => {
  return (
    <Layout>
      <Header title="User Management" />
      
      <div className="p-6">
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              <span>Users & Permissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Manage your staff and their access permissions. In this demo, user management functionality is limited.
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">System Users</h2>
            <Button>Add New User</Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_USERS.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        {getRoleName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Deactivate</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Role Permissions</h2>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Dashboard</TableHead>
                    <TableHead>POS / Billing</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Payments</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Settings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USER_ROLES.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className={getRoleBadgeColor(role.id)}>
                          {role.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPermissionIcon(role.id, "dashboard")}</TableCell>
                      <TableCell>{getPermissionIcon(role.id, "pos")}</TableCell>
                      <TableCell>{getPermissionIcon(role.id, "inventory")}</TableCell>
                      <TableCell>{getPermissionIcon(role.id, "payments")}</TableCell>
                      <TableCell>{getPermissionIcon(role.id, "users")}</TableCell>
                      <TableCell>{getPermissionIcon(role.id, "settings")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper functions
const getRoleName = (roleId: string): string => {
  const role = USER_ROLES.find(r => r.id === roleId);
  return role ? role.name : roleId.charAt(0).toUpperCase() + roleId.slice(1);
};

const getRoleBadgeColor = (roleId: string): string => {
  switch(roleId) {
    case "admin":
      return "bg-purple-100 text-purple-800";
    case "manager":
      return "bg-blue-100 text-blue-800";
    case "cashier":
      return "bg-green-100 text-green-800";
    case "waiter":
      return "bg-yellow-100 text-yellow-800";
    case "inventory":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPermissionIcon = (roleId: string, module: string): JSX.Element => {
  // Define access rules
  const accessRules = {
    admin: ["dashboard", "pos", "inventory", "payments", "users", "settings"],
    manager: ["dashboard", "pos", "inventory", "payments", "users"],
    cashier: ["dashboard", "pos", "payments"],
    waiter: ["dashboard", "pos"],
    inventory: ["dashboard", "inventory"]
  };
  
  // @ts-ignore
  const hasAccess = accessRules[roleId]?.includes(module);
  
  return hasAccess ? (
    <span className="text-green-500">✓</span>
  ) : (
    <span className="text-red-500">✗</span>
  );
};

export default UsersPage;
