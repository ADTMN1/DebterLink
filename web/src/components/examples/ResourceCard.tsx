import { ResourceCard } from "../ResourceCard";

export default function ResourceCardExample() {
  const mockResources = [
    {
      id: "1",
      title: "Chapter 5 Study Guide",
      type: "pdf" as const,
      subject: "Mathematics",
      uploadedBy: "Mrs. Almaz",
      size: "2.4 MB",
    },
    {
      id: "2",
      title: "Science Lab Demonstration",
      type: "video" as const,
      subject: "Science",
      uploadedBy: "Mr. Bekele",
      size: "45.2 MB",
    },
    {
      id: "3",
      title: "Historical Timeline",
      type: "image" as const,
      subject: "History",
      uploadedBy: "Mrs. Tigist",
      size: "1.8 MB",
    },
  ];

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 max-w-4xl">
      {mockResources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
