import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { SanitizedTextarea } from '@/components/ui/sanitized-input';
import { useSanitizedForm } from '@/hooks/use-sanitized-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { resourceUploadSchema, ResourceUploadFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileIcon, Download, Search, Upload, X } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
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
  const isTeacher = user?.role === 'teacher' || user?.role === 'director';
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useSanitizedForm<ResourceUploadFormData>({
    resolver: zodResolver(resourceUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Textbook',
      grade: '11',
      subject: '',
      file: null as any,
    },
    sanitizationMap: {
      title: 'text',
      description: 'description',
      subject: 'text',
    },
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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('file', file);
    }
  }, [form]);

  const resourceId = useMemo(() => `resource-${Date.now()}`, []);

  const handleUploadResource = form.handleSanitizedSubmit((data: ResourceUploadFormData) => {
    const newResource: Resource = {
      id: `${resourceId}-${resources.length}`,
      title: data.title,
      description: data.description || undefined,
      category: data.category,
      fileType: getFileType(data.file.name),
      fileSize: formatFileSize(data.file.size),
      uploadedBy: user?.name || 'Unknown',
      uploadedDate: new Date().toISOString().split('T')[0],
      file: data.file,
    };

    setResources([newResource, ...resources]);
    setIsDialogOpen(false);
    form.reset();

    toast.success(`Successfully uploaded "${newResource.title}"`);
  });

  const handleDownload = useCallback((resource: Resource) => {
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
      toast.info(`Downloading ${resource.title}...`);
    }
  }, []);

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
                <SanitizedInput sanitizer="text" placeholder="Search resources..." className="pl-8" />
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
                   <Form {...form}>
                     <form onSubmit={handleUploadResource} className="space-y-4 mt-2">
                       <FormField
                         control={form.control}
                         name="title"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Resource Title</FormLabel>
                             <FormControl>
                               <SanitizedInput sanitizer="text" placeholder="e.g. Physics Grade 11 Textbook" {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="description"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Description (Optional)</FormLabel>
                             <FormControl>
                               <SanitizedTextarea sanitizer="description" placeholder="Brief description..." rows={3} {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <div className="grid grid-cols-3 gap-4">
                         <FormField
                           control={form.control}
                           name="category"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Category</FormLabel>
                               <Select onValueChange={field.onChange} value={field.value}>
                                 <FormControl>
                                   <SelectTrigger>
                                     <SelectValue />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                   <SelectItem value="Textbook">Textbook</SelectItem>
                                   <SelectItem value="Reference">Reference</SelectItem>
                                   <SelectItem value="Manual">Manual</SelectItem>
                                   <SelectItem value="Worksheet">Worksheet</SelectItem>
                                   <SelectItem value="Video">Video</SelectItem>
                                 </SelectContent>
                               </Select>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                         <FormField
                           control={form.control}
                           name="grade"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Grade</FormLabel>
                               <Select onValueChange={field.onChange} value={field.value}>
                                 <FormControl>
                                   <SelectTrigger>
                                     <SelectValue />
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                   <SelectItem value="9">Grade 9</SelectItem>
                                   <SelectItem value="10">Grade 10</SelectItem>
                                   <SelectItem value="11">Grade 11</SelectItem>
                                   <SelectItem value="12">Grade 12</SelectItem>
                                 </SelectContent>
                               </Select>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                         <FormField
                           control={form.control}
                           name="subject"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Subject</FormLabel>
                               <FormControl>
                                 <SanitizedInput sanitizer="text" placeholder="e.g. Physics" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                       </div>
                       <FormField
                         control={form.control}
                         name="file"
                         render={() => (
                           <FormItem>
                             <FormLabel htmlFor="resource-file">File</FormLabel>
                             <FormControl>
                               <SanitizedInput
                                 sanitizer="text"
                                 id="resource-file"
                                 type="file"
                                 onChange={handleFileChange}
                                 accept=".pdf,.doc,.docx,.txt,.mp4,.mp3,.ppt,.pptx"
                               />
                             </FormControl>
                             {form.watch('file') && (
                               <div className="flex items-center gap-2 p-3 bg-muted rounded-md mt-2">
                                 <FileIcon className="h-5 w-5 text-primary" />
                                 <div className="flex-1">
                                   <p className="text-sm font-medium">{form.watch('file')?.name}</p>
                                   <p className="text-xs text-muted-foreground">{form.watch('file') ? formatFileSize(form.watch('file').size) : ''}</p>
                                 </div>
                               </div>
                             )}
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <DialogFooter className="mt-6">
                         <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                         <Button type="submit" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                           Upload Resource
                         </Button>
                       </DialogFooter>
                     </form>
                   </Form>
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
