// attendance/student.attendance.validator.js
import Joi from "joi";

 export const markAttendanceSchema = Joi.object({
  records: Joi.array()
    .items(
      Joi.object({
        student_id: Joi.string().uuid().required(),
        status: Joi.string().required(),
      })
    )
    .required(),
  classId: Joi.string().uuid().required(),
  date: Joi.date().required(),
  shift: Joi.string().required(),
  recordedByUserId: Joi.string().uuid().required(),
});


export const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent", "late", "excused"),
  shift: Joi.string().valid("morning", "afternoon", "evening"),
  date: Joi.date(),
  record_by: Joi.string().uuid(),
  class_id: Joi.string().uuid(),
}).min(1); // ensures at least 1 field updated

export const bulkSyncSchema = Joi.object({
  records: Joi.array()
    .items(
      Joi.object({
        student_id: Joi.string().uuid().required(),
        class_id: Joi.string().uuid().required(),
        date: Joi.date().required(),
        record_by: Joi.string().uuid().required(),
        shift: Joi.string().required(),
        status: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});

export const summarySchema = Joi.object({
  date: Joi.date().required(),
});
