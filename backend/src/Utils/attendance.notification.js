
export const notifyParent = async (student_id, attendanceRecord) => {
  console.log(
    `Notify parent for student ${student_id}: ${attendanceRecord.status} on ${attendanceRecord.date}`
  );
};
