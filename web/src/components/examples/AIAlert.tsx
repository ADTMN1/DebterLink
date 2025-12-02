import { AIAlert } from "../AIAlert";

export default function AIAlertExample() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <AIAlert
        student={{ name: "Abebe Tadesse", id: "1" }}
        predictionType="academic-risk"
        confidence={87}
        suggestions={[
          "Schedule one-on-one tutoring session",
          "Notify parents about recent performance drop",
          "Consider additional practice materials",
        ]}
      />
      <AIAlert
        student={{ name: "Tigist Haile", id: "2" }}
        predictionType="attendance-drop"
        confidence={92}
        suggestions={[
          "Contact parents immediately",
          "Review recent attendance patterns",
          "Schedule meeting with counselor",
        ]}
      />
    </div>
  );
}
