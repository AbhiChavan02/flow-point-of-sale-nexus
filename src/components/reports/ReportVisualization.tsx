
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartBar, ChartLine } from "lucide-react";
import { format } from "date-fns";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";

interface SalesData {
  date: string;
  total: number;
  orders: number;
  avgOrderValue: number;
}

interface Product {
  id: string;
  name: string;
  sku?: string;
  stock: number;
  reorderLevel: number;
  price: number;
}

interface ReportVisualizationProps {
  reportType: string;
  startDate: Date;
  endDate: Date;
  salesData: SalesData[];
  products: Product[];
}

const ReportVisualization: React.FC<ReportVisualizationProps> = ({
  reportType,
  startDate,
  endDate,
  salesData,
  products,
}) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#e2e8f0" : "#334155";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";

  const getReportTitle = () => {
    switch(reportType) {
      case "sales": return "Sales Overview";
      case "inventory": return "Inventory Status";
      case "transactions": return "Transactions Summary";
      case "customers": return "Customer Analytics";
      case "products": return "Product Performance";
      default: return "Report";
    }
  };

  // Generate chart data based on the report type
  const getChartData = () => {
    if (reportType === "sales") {
      return salesData.map(item => ({
        name: format(new Date(item.date), "MMM dd"),
        Sales: item.total,
        Orders: item.orders,
        Average: item.avgOrderValue,
      }));
    } else if (reportType === "inventory") {
      return products.slice(0, 8).map(product => ({
        name: product.name.length > 10 ? product.name.substring(0, 10) + "..." : product.name,
        Stock: product.stock,
        "Reorder Level": product.reorderLevel,
      }));
    } else {
      return [];
    }
  };

  const chartData = getChartData();

  return (
    <Card className="w-full lg:w-2/3">
      <CardHeader>
        <CardTitle>{getReportTitle()}</CardTitle>
        <CardDescription>
          {format(startDate, "MMMM d, yyyy")} - {format(endDate, "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            {reportType === "sales" && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Avg. Order Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(row.date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>${row.total.toFixed(2)}</TableCell>
                        <TableCell>{row.orders}</TableCell>
                        <TableCell>${row.avgOrderValue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {reportType === "inventory" && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 10).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.sku || "N/A"}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.reorderLevel}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {(reportType === "transactions" || reportType === "customers" || reportType === "products") && (
              <div className="flex items-center justify-center p-8 text-center text-gray-500">
                <div>
                  <ChartLine className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>Select a date range and export to see {reportType} data</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chart">
            {chartData.length > 0 ? (
              <div className="h-80 border rounded-md p-4">
                {reportType === "sales" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="name" stroke={textColor} />
                      <YAxis stroke={textColor} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Orders" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                
                {reportType === "inventory" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="name" stroke={textColor} />
                      <YAxis stroke={textColor} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Stock" fill="#8884d8" />
                      <Bar dataKey="Reorder Level" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center border rounded-md p-4">
                <div className="text-center text-gray-500">
                  <ChartBar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No data available for visualization</p>
                  <p className="text-sm">Select different parameters or export data for detailed analysis</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportVisualization;
