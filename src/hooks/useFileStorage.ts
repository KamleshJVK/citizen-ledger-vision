
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploadOptions {
  bucketName: string;
  folderPath?: string;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
}

interface UploadResult {
  path: string;
  url: string | null;
}

export const useFileStorage = () => {
  const [uploading, setUploading] = useState(false);

  /**
   * Upload a file to Supabase Storage
   * @param file The file to upload
   * @param options Upload options
   * @returns Object containing the file path and public URL (if successful)
   */
  const uploadFile = async (file: File, options: FileUploadOptions): Promise<UploadResult | null> => {
    const { bucketName, folderPath = "", maxSizeMB = 5, allowedFileTypes } = options;
    const fileSizeMB = file.size / (1024 * 1024);
    
    try {
      setUploading(true);
      
      // Validate file size
      if (fileSizeMB > maxSizeMB) {
        toast.error(`File size exceeds the ${maxSizeMB}MB limit`);
        return null;
      }
      
      // Validate file type if specified
      if (allowedFileTypes && allowedFileTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        if (!allowedFileTypes.includes(fileExtension)) {
          toast.error(`File type .${fileExtension} is not allowed`);
          return null;
        }
      }
      
      // Generate a unique filename to avoid collisions
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
      
      // Create the full file path
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Upload the file
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      toast.success('File uploaded successfully');
      
      return {
        path: data.path,
        url: urlData.publicUrl
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Upload multiple files to Supabase Storage
   * @param files The files to upload
   * @param options Upload options
   * @returns Array of upload results for successful uploads
   */
  const uploadMultipleFiles = async (files: File[], options: FileUploadOptions): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file, options);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };
  
  /**
   * Delete a file from Supabase Storage
   * @param path The path of the file to delete
   * @param bucketName The storage bucket name
   * @returns True if deletion was successful
   */
  const deleteFile = async (path: string, bucketName: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .storage
        .from(bucketName)
        .remove([path]);
      
      if (error) {
        throw error;
      }
      
      toast.success('File deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(`Delete failed: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    uploading,
    uploadFile,
    uploadMultipleFiles,
    deleteFile
  };
};

export default useFileStorage;
