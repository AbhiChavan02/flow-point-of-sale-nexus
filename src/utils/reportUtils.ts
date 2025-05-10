
import { format } from "date-fns";
import { toast } from "sonner";
import { Product } from "@/types";

// Mock data for sales report
export const salesData = [
  { date: "2025-05-01", total: 1250.75, orders: 15, avgOrderValue: 83.38 },
  { date: "2025-05-02", total: 986.25, orders: 12, avgOrderValue: 82.19 },
  { date: "2025-05-03", total: 1567.50, orders: 18, avgOrderValue: 87.08 },
  { date: "2025-05-04", total: 892.30, orders: 10, avgOrderValue: 89.23 },
  { date: "2025-05-05", total: 1350.90, orders: 16, avgOrderValue: 84.43 },
  { date: "2025-05-06", total: 1128.45, orders: 14, avgOrderValue: 80.60 },
  { date: "2025-05-07", total: 1476.20, orders: 17, avgOrderValue: 86.84 },
];

// Function for exporting report to Excel/CSV
export const exportToExcel = (
  reportType: string,
  products: Product[],
  startDate: Date,
  endDate: Date,
  callback: () => void
) => {
  // Simulate export delay
  setTimeout(() => {
    // Format the data for export
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
    
    // Show success toast and execute callback
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
    callback();
  }, 1500);
};
