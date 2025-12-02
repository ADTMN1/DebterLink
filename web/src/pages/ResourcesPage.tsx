import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/ResourceCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  FileText,
  Video,
  Image,
  File,
  FolderOpen
} from "lucide-react";
import { useState } from "react";

export default function ResourcesPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mockResources = [
    {
      id: "1",
      title: "Mathematics Chapter 5 Notes",
      type: "document" as const,
      subject: "Mathematics",
      size: "2.4 MB",
      uploadDate: new Date(),
      downloads: 145,
      author: "Yonas Tadesse",
    },
    {
      id: "2",
      title: "Science Lab Video Tutorial",
      type: "video" as const,
      subject: "Science",
      size: "45.2 MB",
      uploadDate: new Date(Date.now() - 86400000),
      downloads: 89,
      author: "Marta Alemu",
    },
    {
      id: "3",
      title: "History Exam 2023",
      type: "document" as const,
      subject: "History",
      size: "1.8 MB",
      uploadDate: new Date(Date.now() - 172800000),
      downloads: 203,
      author: "Dawit Bekele",
    },
    {
      id: "4",
      title: "English Grammar Guide",
      type: "document" as const,
      subject: "English",
      size: "3.1 MB",
      uploadDate: new Date(Date.now() - 259200000),
      downloads: 167,
      author: "Tigist Haile",
    },
    {
      id: "5",
      title: "Physics Formula Sheet",
      type: "image" as const,
      subject: "Physics",
      size: "856 KB",
      uploadDate: new Date(Date.now() - 345600000),
      downloads: 234,
      author: "Yonas Tadesse",
    },
    {
      id: "6",
      title: "Chemistry Lab Safety Video",
      type: "video" as const,
      subject: "Science",
      size: "38.7 MB",
      uploadDate: new Date(Date.now() - 432000000),
      downloads: 112,
      author: "Marta Alemu",
    },
  ];

  const stats = {
    total: mockResources.length,
    documents: mockResources.filter(r => r.type === "document").length,
    videos: mockResources.filter(r => r.type === "video").length,
    images: mockResources.filter(r => r.type === "image").length,
    totalDownloads: mockResources.reduce((acc, r) => acc + r.downloads, 0),
  };

  const filteredResources = mockResources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || r.subject.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="teacher" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">Resource Library</h1>
                <p className="text-muted-foreground">Access and share educational materials</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Resource</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Resource title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Subject</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Upload File</label>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Upload</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Documents</p>
                      <p className="text-3xl font-bold">{stats.documents}</p>
                    </div>
                    <FileText className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Videos</p>
                      <p className="text-3xl font-bold">{stats.videos}</p>
                    </div>
                    <Video className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Downloads</p>
                      <p className="text-3xl font-bold">{stats.totalDownloads}</p>
                    </div>
                    <Download className="h-8 w-8 text-chart-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resources Grid */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources
                    .filter(r => r.type === "document")
                    .map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources
                    .filter(r => r.type === "video")
                    .map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="images">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources
                    .filter(r => r.type === "image")
                    .map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





