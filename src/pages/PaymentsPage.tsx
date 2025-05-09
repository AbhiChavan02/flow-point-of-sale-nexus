
import React, { useState, useEffect } from "react";
import { useBusiness } from "@/contexts/BusinessContext";
import { Order } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { format } from "date-fns";

// Payment methods with icons
const PAYMENT_METHOD_DETAILS = {
  cash: { name: "Cash", color: "bg-green-100 text-green-800" },
  card: { name: "Card", color: "bg-blue-100 text-blue-800" },
  upi: { name: "UPI", color: "bg-purple-100 text-purple-800" },
  wallet: { name: "Digital Wallet", color: "bg-orange-100 text-orange-800" },
  split: { name: "Split Payment", color: "bg-gray-100 text-gray-800" },
};

const PaymentsPage: React.FC = () => {
  const { business } = useBusiness();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("pos_orders");
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders) as Order[];
        // Convert string dates to Date objects
        const ordersWithDates = parsedOrders.map(order => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
        setOrders(ordersWithDates);
      } catch (error) {
        console.error("Error parsing orders:", error);
      }
    }
  }, []);
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.paymentMethod === activeTab;
  });
  
  // Calculate totals
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  
  // Group by payment method
  const paymentMethodCounts = filteredOrders.reduce((acc, order) => {
    const method = order.paymentMethod || "unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const paymentMethodTotals = filteredOrders.reduce((acc, order) => {
    const method = order.paymentMethod || "unknown";
    acc[method] = (acc[method] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <Header title="Payments & Transactions" />
      
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="text-2xl">{business.currency} {totalSales.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Across {totalOrders} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Order Value</CardDescription>
              <CardTitle className="text-2xl">
                {business.currency} {totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Across all sales</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Most Popular Payment</CardDescription>
              <CardTitle className="text-2xl">
                {Object.entries(paymentMethodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] === "cash" 
                  ? "Cash"
                  : Object.entries(paymentMethodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] === "card"
                    ? "Card" 
                    : "N/A"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {Object.entries(paymentMethodCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} transactions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.slice(-8)}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-medium">
                          {business.currency} {order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {order.paymentMethod ? (
                            <Badge 
                              variant="outline" 
                              className={PAYMENT_METHOD_DETAILS[order.paymentMethod].color}
                            >
                              {PAYMENT_METHOD_DETAILS[order.paymentMethod].name}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Unknown</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
