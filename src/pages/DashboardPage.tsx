
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for dashboard
const salesData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 1900 },
  { name: 'Wed', sales: 2400 },
  { name: 'Thu', sales: 1600 },
  { name: 'Fri', sales: 3200 },
  { name: 'Sat', sales: 3800 },
  { name: 'Sun', sales: 2800 },
];

const categoryData = [
  { name: 'Food', value: 4500 },
  { name: 'Beverages', value: 3200 },
  { name: 'Services', value: 2100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { business } = useBusiness();
  
  return (
    <Layout>
      <Header title="Dashboard" />
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}</h2>
          <p className="text-gray-600">Here's an overview of your business performance</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's Sales</CardDescription>
              <CardTitle className="text-2xl">{business.currency} 3,540.00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-500">+15% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Orders Today</CardDescription>
              <CardTitle className="text-2xl">48</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-500">+8% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Order Value</CardDescription>
              <CardTitle className="text-2xl">{business.currency} 73.75</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">+2% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Low Stock Items</CardDescription>
              <CardTitle className="text-2xl">6</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-500">Needs attention</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${business.currency} ${value}`, 'Sales']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${business.currency} ${value}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Order</CardTitle>
              <CardDescription>Create a new customer order</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/pos">
                  Go to POS <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage your inventory and stock</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/inventory">
                  View Inventory <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View detailed sales reports</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/reports">
                  View Reports <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
