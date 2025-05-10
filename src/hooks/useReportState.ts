
import { useState } from "react";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export function useReportState() {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("current_month");
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [isGenerating, setIsGenerating] = useState(false);

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

  return {
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
  };
}
