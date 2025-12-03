// src/utils/attendance.validation.js
const ALLOWED_SHIFTS = ["morning", "afternoon", "evening"];
const ALLOWED_STATUS = ["present", "absent", "late", "excused"];

const isUUID = (str) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const validateAttendanceInput = (data) => {
  const { student_id, class_id, date, record_by, shift, status } = data;

  if (!student_id || !class_id || !date || !record_by || !shift || !status) {
    return "All fields (student_id, class_id, date, record_by, shift, status) are required.";
  }

  if (!isUUID(student_id)) return "Invalid student_id.";
  if (!isUUID(class_id)) return "Invalid class_id.";
  if (!isUUID(record_by)) return "Invalid record_by.";

  if (!ALLOWED_SHIFTS.includes(shift.toLowerCase()))
    return `Invalid shift. Allowed values: ${ALLOWED_SHIFTS.join(", ")}`;
  if (!ALLOWED_STATUS.includes(status.toLowerCase()))
    return `Invalid status. Allowed values: ${ALLOWED_STATUS.join(", ")}`;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Invalid date format.";

  return null;
};
