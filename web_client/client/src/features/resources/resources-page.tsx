import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileIcon, Download, Search, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type Resource = {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  file?: File;
};

const initialResources: Resource[] = [
  {
    id: '1',
    title: 'Physics Grade 11 Textbook',
    category: 'Textbook',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    uploadedBy: 'System',
    uploadedDate: '2025-11-01',
  },
  {
    id: '2',
    title: 'Math Formula Sheet',
    category: 'Reference',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadedBy: 'System',
    uploadedDate: '2025-11-01',
  },
  {
    id: '3',
    title: 'History of Ethiopia Vol 1',
    category: 'Textbook',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    uploadedBy: 'System',
    uploadedDate: '2025-11-01',
  },
  {
    id: '4',
    title: 'Chemistry Lab Manual',
    category: 'Manual',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    uploadedBy: 'System',
    uploadedDate: '2025-11-01',
  },
];

export default function ResourcesPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const isTeacher = user?.role === 'teacher' || user?.role === 'director';
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Textbook',
    file: null as File | null,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toUpperCase();
    return ext || 'FILE';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: 'File too large',
          description: 'File size must be less than 50MB',
          variant: 'destructive',
        });
        return;
      }
      setForm((f) => ({ ...f, file }));
    }
  };

  const handleUploadResource = () => {
    if (!form.title.trim() || !form.file) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a title and select a file.',
        variant: 'destructive',
      });
      return;
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      fileType: getFileType(form.file.name),
      fileSize: formatFileSize(form.file.size),
      uploadedBy: user?.name || 'Unknown',
      uploadedDate: new Date().toISOString().split('T')[0],
      file: form.file,
    };

    setResources([newResource, ...resources]);
    setIsDialogOpen(false);
    setForm({ title: '', description: '', category: 'Textbook', file: null });

    toast({
      title: 'Resource uploaded',
      description: `Successfully uploaded "${newResource.title}"`,
    });
  };

  const handleDownload = (resource: Resource) => {
    if (resource.file) {
      const url = URL.createObjectURL(resource.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: 'Download',
        description: `Downloading ${resource.title}...`,
      });
    }
  };

  const categoryColors: Record<string, string> = {
    'Textbook': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Reference': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Manual': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Worksheet': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Video': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-3xl font-bold tracking-tight">Resource Library</h2>
           <div className="flex items-center gap-4">
             <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-8" />
             </div>
             {isTeacher && (
               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                 <DialogTrigger asChild>
                   <Button>
                     <Upload className="mr-2 h-4 w-4" /> Upload Resource
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="max-w-2xl">
                   <DialogHeader>
                     <DialogTitle>Upload New Resource</DialogTitle>
                   </DialogHeader>
                   <form
                     onSubmit={(e) => {
                       e.preventDefault();
                       handleUploadResource();
                     }}
                   >
                     <div className="space-y-4 mt-2">
                       <div className="space-y-2">
                         <Label htmlFor="title">Resource Title</Label>
                         <Input
                           id="title"
                           value={form.title}
                           onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                           placeholder="e.g. Physics Grade 11 Textbook"
                           required
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="description">Description (Optional)</Label>
                         <Textarea
                           id="description"
                           value={form.description}
                           onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                           placeholder="Brief description of the resource..."
                           rows={3}
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label htmlFor="category">Category</Label>
                           <Select value={form.category} onValueChange={(value) => setForm((f) => ({ ...f, category: value }))}>
                             <SelectTrigger id="category">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="Textbook">Textbook</SelectItem>
                               <SelectItem value="Reference">Reference</SelectItem>
                               <SelectItem value="Manual">Manual</SelectItem>
                               <SelectItem value="Worksheet">Worksheet</SelectItem>
                               <SelectItem value="Video">Video</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="file">File</Label>
                           <Input
                             id="file"
                             type="file"
                             onChange={handleFileChange}
                             accept=".pdf,.doc,.docx,.txt,.mp4,.mp3,.ppt,.pptx"
                             required
                           />
                         </div>
                       </div>
                       {form.file && (
                         <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                           <FileIcon className="h-5 w-5 text-primary" />
                           <div className="flex-1">
                             <p className="text-sm font-medium">{form.file.name}</p>
                             <p className="text-xs text-muted-foreground">{formatFileSize(form.file.size)}</p>
                           </div>
                           <Button
                             type="button"
                             variant="ghost"
                             size="sm"
                             onClick={() => setForm((f) => ({ ...f, file: null }))}
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       )}
                       <p className="text-xs text-muted-foreground">
                         Supported formats: PDF, DOC, DOCX, TXT, MP4, MP3, PPT, PPTX (Max 50MB)
                       </p>
                     </div>
                     <DialogFooter className="mt-6">
                       <Button
                         type="button"
                         variant="outline"
                         onClick={() => {
                           setIsDialogOpen(false);
                           setForm({ title: '', description: '', category: 'Textbook', file: null });
                         }}
                       >
                         Cancel
                       </Button>
                       <Button
                         type="submit"
                         disabled={!form.title.trim() || !form.file}
                       >
                         Upload Resource
                       </Button>
                     </DialogFooter>
                   </form>
                 </DialogContent>
               </Dialog>
             )}
           </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
           {resources.map((resource) => (
              <Card key={resource.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                 <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                       <FileIcon className="h-8 w-8" />
                    </div>
                    <div className="w-full">
                       <h3 className="font-medium">{resource.title}</h3>
                       <div className="flex items-center justify-center gap-2 mt-2">
                         <Badge variant="outline" className={categoryColors[resource.category] || ''}>
                           {resource.category}
                         </Badge>
                       </div>
                       <p className="text-xs text-muted-foreground mt-2">
                         {resource.fileType} • {resource.fileSize}
                       </p>
                       {resource.description && (
                         <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                           {resource.description}
                         </p>
                       )}
                       <p className="text-xs text-muted-foreground mt-1">
                         By {resource.uploadedBy}
                       </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownload(resource)}
                    >
                       <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                 </CardContent>
              </Card>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
