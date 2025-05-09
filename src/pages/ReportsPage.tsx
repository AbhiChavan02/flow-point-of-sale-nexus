
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Download, FileExcel, ChartBar, ChartLine } from "lucide-react";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import { useInventory } from "@/contexts/InventoryContext";
import { toast } from "sonner";

const ReportsPage: React.FC = () => {
  const { products } = useInventory();
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("current_month");
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  // Mock data for sales report
  const salesData = [
    { date: "2025-05-01", total: 1250.75, orders: 15, avgOrderValue: 83.38 },
    { date: "2025-05-02", total: 986.25, orders: 12, avgOrderValue: 82.19 },
    { date: "2025-05-03", total: 1567.50, orders: 18, avgOrderValue: 87.08 },
    { date: "2025-05-04", total: 892.30, orders: 10, avgOrderValue: 89.23 },
    { date: "2025-05-05", total: 1350.90, orders: 16, avgOrderValue: 84.43 },
    { date: "2025-05-06", total: 1128.45, orders: 14, avgOrderValue: 80.60 },
    { date: "2025-05-07", total: 1476.20, orders: 17, avgOrderValue: 86.84 },
  ];

  // Function to handle date range selection
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const now = new Date();
    
    switch (value) {
      case "current_month":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "last_month":
        const lastMonth = subMonths(now, 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case "last_3_months":
        setStartDate(startOfMonth(subMonths(now, 3)));
        setEndDate(endOfMonth(now));
        break;
      case "custom":
        // Leave dates as they are for custom selection
        break;
      default:
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
    }
  };

  // Handle Excel export
  const exportToExcel = () => {
    // In a real implementation, this would generate and download an Excel file
    // For now, we'll just show a toast notification
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
    
    // Here's how you would implement actual Excel export in a production environment:
    // 1. Format the data for Excel
    // 2. Use a library like ExcelJS or xlsx to create the Excel file
    // 3. Generate a download link for the user
    
    // For this demo, we'll just create a mock CSV content and trigger a download
    let csvContent = "";
    
    if (reportType === "sales") {
      csvContent = "Date,Total Sales,Orders,Average Order Value\n";
      salesData.forEach(row => {
        csvContent += `${row.date},${row.total},${row.orders},${row.avgOrderValue}\n`;
      });
    } else if (reportType === "inventory") {
      csvContent = "Product Name,SKU,Current Stock,Reorder Level,Price\n";
      products.forEach(product => {
        csvContent += `${product.name},${product.sku || "N/A"},${product.stock},${product.reorderLevel},${product.price}\n`;
      });
    }
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a download link and trigger it
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Header title="Reports" />
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <Card className="w-full lg:w-1/3">
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure your report parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="transactions">Transactions Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Select value={dateRange} onValueChange={handleDateRangeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_month">Current Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {dateRange === "custom" && (
                <div className="flex flex-col space-y-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">From</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {format(startDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">To</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {format(endDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
              
              <Button onClick={exportToExcel} className="w-full">
                <FileExcel className="mr-2 h-4 w-4" /> Export to Excel
              </Button>
            </CardContent>
          </Card>
          
          <Card className="w-full lg:w-2/3">
            <CardHeader>
              <CardTitle>{reportType === "sales" ? "Sales Overview" : reportType === "inventory" ? "Inventory Status" : "Transactions Summary"}</CardTitle>
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
                  
                  {reportType === "transactions" && (
                    <div className="flex items-center justify-center p-8 text-center text-gray-500">
                      <div>
                        <ChartLine className="mx-auto h-10 w-10 mb-2 opacity-50" />
                        <p>Select a date range and export to see transaction data</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="chart">
                  <div className="h-80 flex items-center justify-center border rounded-md p-4">
                    <div className="text-center text-gray-500">
                      <ChartBar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                      <p>Chart visualization available in full implementation</p>
                      <p className="text-sm">Export data to Excel for detailed analysis</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Additional export formats and options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center">
                <FileExcel className="mr-2 h-4 w-4" /> Export as CSV
              </Button>
              <Button variant="outline" className="flex items-center">
                <FileExcel className="mr-2 h-4 w-4" /> Export as PDF
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Email Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportsPage;
