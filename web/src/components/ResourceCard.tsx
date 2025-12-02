import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, FileImage, Download, Eye } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "image" | "document";
  subject: string;
  uploadedBy?: string;
  author?: string;
  size: string;
  uploadDate?: Date;
  downloads?: number;
}

interface ResourceCardProps {
  resource: Resource;
  onDownload?: () => void;
  onView?: () => void;
}

const typeConfig = {
  pdf: { icon: FileText, color: "text-destructive", bgColor: "bg-destructive/10" },
  video: { icon: Video, color: "text-chart-3", bgColor: "bg-chart-3/10" },
  image: { icon: FileImage, color: "text-chart-2", bgColor: "bg-chart-2/10" },
  document: { icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
};

export function ResourceCard({ resource, onDownload, onView }: ResourceCardProps) {
  const config = typeConfig[resource.type];
  const Icon = config.icon;

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-resource-${resource.id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className={`rounded-lg ${config.bgColor} p-3 h-fit`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-medium line-clamp-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">{resource.subject}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{resource.uploadedBy || resource.author}</span>
              <span>•</span>
              <span>{resource.size}</span>
              {resource.downloads !== undefined && (
                <>
                  <span>•</span>
                  <span>{resource.downloads} downloads</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onView?.();
                  console.log("View resource:", resource.id);
                }}
                data-testid={`button-view-${resource.id}`}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDownload?.();
                  console.log("Download resource:", resource.id);
                }}
                data-testid={`button-download-${resource.id}`}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
