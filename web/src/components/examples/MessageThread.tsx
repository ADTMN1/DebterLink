import { MessageThread } from "../MessageThread";
import { addDays } from "date-fns";

export default function MessageThreadExample() {
  const mockMessages = [
    {
      id: "1",
      sender: { name: "Mrs. Almaz", avatar: "", role: "Mathematics Teacher" },
      content: "Hello! I wanted to discuss your child's recent progress in class.",
      timestamp: new Date(),
      isOwn: false,
    },
    {
      id: "2",
      sender: { name: "You", avatar: "", role: "Parent" },
      content: "Thank you for reaching out. I'd love to hear about the progress!",
      timestamp: addDays(new Date(), 0.01),
      isOwn: true,
    },
    {
      id: "3",
      sender: { name: "Mrs. Almaz", avatar: "", role: "Mathematics Teacher" },
      content: "Your child is doing well! They've shown significant improvement in algebra.",
      timestamp: addDays(new Date(), 0.02),
      isOwn: false,
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <MessageThread
        messages={mockMessages}
        recipient={{ name: "Mrs. Almaz", avatar: "", role: "Mathematics Teacher" }}
      />
    </div>
  );
}
