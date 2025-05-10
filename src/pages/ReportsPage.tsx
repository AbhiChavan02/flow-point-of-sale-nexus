
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import { useInventory } from "@/contexts/InventoryContext";
import ReportSettings from "@/components/reports/ReportSettings";
import ReportVisualization from "@/components/reports/ReportVisualization";
import ExportOptions from "@/components/reports/ExportOptions";

const ReportsPage: React.FC = () => {
  const { products } = useInventory();
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("current_month");
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Handle Excel export
  const exportToExcel = () => {
    setIsGenerating(true);
    
    // Simulate export delay
    setTimeout(() => {
      // In a real implementation, this would generate and download an Excel file
      toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
      setIsGenerating(false);
      
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
    }, 1500);
  };

  return (
    <Layout>
      <Header title="Advanced Reports" />
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          {/* Report Settings Component */}
          <ReportSettings 
            reportType={reportType}
            setReportType={setReportType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onExport={exportToExcel}
          />
          
          {/* Report Visualization Component */}
          <ReportVisualization 
            reportType={reportType}
            startDate={startDate}
            endDate={endDate}
            salesData={salesData}
            products={products}
          />
        </div>
        
        {/* Export Options Component */}
        <ExportOptions 
          reportType={reportType}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </Layout>
  );
};

export default ReportsPage;
