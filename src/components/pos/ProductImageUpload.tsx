
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { toast } from "sonner";

interface ProductImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ 
  currentImage, 
  onImageChange 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Selected file must be an image");
      return;
    }
    
    setIsUploading(true);
    
    // Create a URL for the image (in a real app, this would upload to a server)
    const imageUrl = URL.createObjectURL(file);
    
    // In a real scenario this would be where you upload the image to a cloud storage
    // Simulate a slight delay to show upload process
    setTimeout(() => {
      onImageChange(imageUrl);
      setIsUploading(false);
      toast.success("Product image uploaded");
    }, 500);
  };
  
  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative rounded-md overflow-hidden w-full aspect-square bg-gray-100 group border">
          <img 
            src={currentImage} 
            alt="Product preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <label htmlFor="product-image" className="cursor-pointer">
              <Button variant="secondary" size="sm" disabled={isUploading}>
                Change Image
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <label 
          htmlFor="product-image" 
          className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Image size={32} className="mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isUploading ? "Uploading..." : "Click to upload product image"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            PNG, JPG, GIF up to 2MB
          </p>
        </label>
      )}
      
      <input
        id="product-image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="sr-only"
        disabled={isUploading}
      />
    </div>
  );
};

export default ProductImageUpload;
