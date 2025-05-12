
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Document {
  id: string;
  demandId: string;
  filePath: string;
  fileUrl: string | null;
  uploadedBy: string;
  uploadDate: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
}

export const useDocuments = (demandId?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents for a specific demand
  const fetchDocuments = async (id?: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('demand_documents')
        .select('*')
        .eq('demand_id', id);
        
      if (error) throw error;
      
      if (data) {
        const docs: Document[] = data.map(doc => ({
          id: doc.id,
          demandId: doc.demand_id,
          filePath: doc.file_path,
          fileUrl: doc.file_url,
          uploadedBy: doc.uploaded_by,
          uploadDate: doc.upload_date,
          fileName: doc.file_path.split('/').pop() || 'Unknown',
          fileType: doc.file_path.split('.').pop()?.toUpperCase() || 'Unknown',
          fileSize: doc.file_size
        }));
        
        setDocuments(docs);
      }
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error(`Failed to load documents: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Download a document
  const downloadDocument = async (document: Document) => {
    try {
      if (!document.filePath) {
        throw new Error("Invalid file path");
      }
      
      // Extract bucket name from file path if needed
      const bucketName = 'demand-documents'; // Hardcoded for now
      
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .download(document.filePath);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("File download started");
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast.error(`Download failed: ${error.message}`);
    }
  };

  // Load documents when the demand ID changes
  useEffect(() => {
    if (demandId) {
      fetchDocuments(demandId);
    }
  }, [demandId]);
  
  return {
    documents,
    loading,
    fetchDocuments,
    downloadDocument
  };
};

export default useDocuments;
