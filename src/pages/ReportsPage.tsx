
import React from "react";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import { useInventory } from "@/contexts/InventoryContext";
import ReportSettings from "@/components/reports/ReportSettings";
import ReportVisualization from "@/components/reports/ReportVisualization";
import ExportOptions from "@/components/reports/ExportOptions";
import { useReportState } from "@/hooks/useReportState";
import { exportToExcel, salesData } from "@/utils/reportUtils";

const ReportsPage: React.FC = () => {
  const { products } = useInventory();
  const {
    reportType,
    setReportType,
    dateRange,
    setDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isGenerating,
    setIsGenerating,
    handleDateRangeChange
  } = useReportState();

  // Handle Excel export
  const handleExportToExcel = () => {
    setIsGenerating(true);
    exportToExcel(reportType, products, startDate, endDate, () => {
      setIsGenerating(false);
    });
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
            setDateRange={handleDateRangeChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onExport={handleExportToExcel}
            isGenerating={isGenerating}
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
