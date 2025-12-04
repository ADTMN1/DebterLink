// src/Utils/student.attendance.validator.js
import Joi from "joi";

// Global Joi options — this is the KEY FIX
const joiOptions = {
  convert: true, // Crucial: convert "2025-04-01" → Date, "123" → number
  abortEarly: false, // Return all errors
  stripUnknown: false, // Keep unknown keys (safe)
  errors: {
    // Better error messages
    wrap: { label: false },
  },
};

// Helper to apply options consistently
const schemaWithOptions = (schema) => (schema.options ? schema : schema);

export const markAttendanceSchema = Joi.object({
  records: Joi.array()
    .items(
      Joi.object({
        student_id: Joi.string()
          .trim()
          .guid({ version: ["uuidv4"] })
          .required()
          .messages({ "string.guid": "Invalid student_id format" }),
        status: Joi.string()
          .valid("present", "absent", "late", "excused")
          .required(),
      }).unknown(false) // reject extra fields
    )
    .min(1)
    .required(),

  classId: Joi.string()
    .trim()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({ "string.guid": "Invalid classId format" }),

  date: Joi.date()
    .iso()
    .required()
    .messages({ "date.format": "Date must be in ISO format (YYYY-MM-DD)" }),

  shift: Joi.string().valid("morning", "afternoon", "evening").required(),

  recordedByUserId: Joi.string()
    .trim()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({ "string.guid": "Invalid recordedByUserId format" }),
}).options(joiOptions);

export const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent", "late", "excused"),
  shift: Joi.string().valid("morning", "afternoon", "evening"),
  date: Joi.date().iso(),
  record_by: Joi.string()
    .trim()
    .guid({ version: ["uuidv4"] }),
  class_id: Joi.string()
    .trim()
    .guid({ version: ["uuidv4"] }),
})
  .min(1)
  .options(joiOptions);

export const bulkSyncSchema = Joi.object({
  records: Joi.array()
    .items(
      Joi.object({
        student_id: Joi.string()
          .trim()
          .guid({ version: ["uuidv4"] })
          .required(),
        class_id: Joi.string()
          .trim()
          .guid({ version: ["uuidv4"] })
          .required(),
        date: Joi.date().iso().required(),
        record_by: Joi.string()
          .trim()
          .guid({ version: ["uuidv4"] })
          .required(),
        shift: Joi.string().valid("morning", "afternoon", "evening").required(),
        status: Joi.string()
          .valid("present", "absent", "late", "excused")
          .required(),
      }).unknown(false)
    )
    .min(1)
    .required(),
}).options(joiOptions);

export const summarySchema = Joi.object({
  classId: Joi.string()
    .trim()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({ "string.guid": "Invalid classId" }),

  date: Joi.date()
    .iso()
    .required()
    .messages({ "date.format": "Date must be in YYYY-MM-DD format" }),
}).options(joiOptions);

export const listAttendanceSchema = Joi.object({
  classId: Joi.string()
    .trim()
    .guid({ version: ["uuidv4"] })
    .required(),

  date: Joi.date().iso().optional(),

  shift: Joi.string().valid("morning", "afternoon", "evening").optional(),

  status: Joi.string().valid("present", "absent", "late", "excused").optional(),
}).options(joiOptions);
