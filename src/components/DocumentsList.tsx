
import { Download, FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Document, useDocuments } from "@/hooks/useDocuments";
import { formatDistanceToNow } from "date-fns";

interface DocumentsListProps {
  demandId: string;
}

const DocumentsList = ({ demandId }: DocumentsListProps) => {
  const { documents, loading, downloadDocument } = useDocuments(demandId);
  
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No supporting documents available for this demand.
      </p>
    );
  }
  
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'file-text';
      case 'doc':
      case 'docx':
        return 'file-text';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'file';
    }
  };
  
  const handleDownload = (document: Document) => {
    downloadDocument(document);
  };
  
  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const fileExtension = doc.fileType.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
        
        return (
          <Card key={doc.id} className="overflow-hidden">
            <div className="flex items-start">
              {isImage && doc.fileUrl ? (
                <div className="w-16 h-16 bg-muted flex-shrink-0">
                  <img 
                    src={doc.fileUrl}
                    alt={doc.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-muted flex items-center justify-center flex-shrink-0">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(doc.uploadDate), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDownload(doc)} 
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
                
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 text-xs bg-muted rounded-md">
                    {doc.fileType}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DocumentsList;
