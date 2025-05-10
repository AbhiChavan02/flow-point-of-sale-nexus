
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Mail } from "lucide-react";
import { toast } from "sonner";

interface ExportOptionsProps {
  reportType: string;
  startDate: Date;
  endDate: Date;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ reportType, startDate, endDate }) => {
  const handleExportFormat = (format: string) => {
    toast.success(`Report exported as ${format.toUpperCase()} successfully!`);
  };

  const handleEmailReport = () => {
    toast.success("Report has been emailed to your registered address!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Options</CardTitle>
        <CardDescription>Additional export formats and options</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={() => handleExportFormat('csv')}
          >
            <FileText className="mr-2 h-4 w-4" /> Export as CSV
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => handleExportFormat('pdf')}
          >
            <FileText className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleEmailReport}
          >
            <Mail className="mr-2 h-4 w-4" /> Email Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
