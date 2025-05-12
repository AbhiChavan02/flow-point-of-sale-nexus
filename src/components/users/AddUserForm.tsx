
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const AddUserForm: React.FC = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserFormData>();
  const isMobile = useIsMobile();
  const password = watch('password');
  
  const onSubmit = (data: UserFormData) => {
    // In a real app, this would send the data to the server
    console.log("User form data:", data);
    
    // Show success toast
    toast.success("User added successfully!");
    
    // Reset form
    reset();
  };
  
  return (
    <Card className={`mx-auto max-w-2xl ${isMobile ? 'mt-6' : 'mt-8'}`}>
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>Create a new user account with specific permissions.</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base">Full Name</Label>
            <Input 
              id="name"
              className="mt-1"
              placeholder="Enter user's full name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email" className="text-base">Email Address</Label>
            <Input 
              id="email"
              type="email"
              className="mt-1"
              placeholder="user@example.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="role" className="text-base">Role</Label>
            <Select {...register("role", { required: "Role is required" })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="inventory">Inventory Manager</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input 
              id="password"
              type="password"
              className="mt-1"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              type="password"
              className="mt-1"
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full md:w-auto">
              Add User
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUserForm;
