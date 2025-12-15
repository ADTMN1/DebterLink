import e from "express";
import pool from "../../config/db.config.js"
import eventBus from "../../events/event.bus.js";
import { sendNotification } from "../controllers/notification.controller.js";

const submitExamService =async(payload)=>{
try {
    
  const exam_date= new  Date()
    const sql = `
  INSERT INTO exam (
    subject_id,
    class_id,
    teacher_id,
    student_id,
    quiz_marks,
    assignment_marks,
    final_test_marks,
    mid_test_marks,
    exam_date
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

`;
let {
    quiz_marks,
    assignment_marks,
    final_test_marks,
    mid_test_marks
} = payload;

quiz_marks = quiz_marks ?? null;
assignment_marks = assignment_marks ?? null;
final_test_marks = final_test_marks ?? null;
mid_test_marks = mid_test_marks ?? null;

// console.log(exam_date)
    const values = [
      payload.subject_id,
      payload.class_id,
      payload.teacher_id,
      payload.student_id,
      quiz_marks,
      assignment_marks,
      mid_test_marks,
      final_test_marks,
      exam_date,
    ]

const result = await pool.query(sql, values);

// console.log(result.rows[0])
if (result.rows[0]) {
  const sql = `
SELECT *
FROM exam
JOIN student ON exam.student_id = student.student_id
JOIN parent ON student.parent_id = parent.parent_id
WHERE exam.student_id =$1;
`;


    // 1. Find parent email based on student_id
    const parentQuery = await pool.query(
      sql,
      [student_id]
    );
    console.log("parentQuery",parentQuery.rows[0])
    if (parentQuery.rows.length === 0) return;

    // const parentEmail = parentQuery.rows[0].email;
    const studentName = parentQuery.rows[0].student_name;
const parent_id = parentQuery.rows[0].parent_id
const message = "Exam is submitted"
await sendNotification(parent_id,payload.teacher_id,"Exam",message )
}


return result.rows[0]

} catch (error) {
    console.log(error)
    throw error
}
}

const updateExamService =async(payload)=>{
    try {
const sql = `
  UPDATE exam
  SET 
    subject_id        = COALESCE($2, subject_id),
    class_id          = COALESCE($3, class_id),
    teacher_id        = COALESCE($4, teacher_id),
    quiz_marks        = COALESCE($5, quiz_marks),
    assignment_marks  = COALESCE($6, assignment_marks),
    final_test_marks  = COALESCE($7, final_test_marks),
    mid_test_marks    = COALESCE($8, mid_test_marks),
    exam_date         = COALESCE($9, exam_date)
  WHERE 
    student_id = $1
  RETURNING *;
`;


const exam_date = new Date
  
  const values = [
    payload.subject_id,
    payload.class_id,
    payload.teacher_id,
    payload.student_id,
    payload.quiz_marks,
    payload.assignment_marks,
    payload.mid_test_marks,
    payload.final_test_marks,
    exam_date
    
  ]

  const result = await pool.query(sql, values);
console.log(result.rows)
  // console.log(result.rows[0])
  return result.rows[0]
    } catch (error) {
          // console.error("Update Exam Error:", error);
        console.log(error)
        throw error
    }}

const getAllExamService =async(teacher_id)=>{
    try {
 
  
       const sql = `SELECT * FROM exam WHERE teacher_id=$1`;
       const values =[teacher_id]
       const result = await pool.query(sql,values);

      //  console.log(result)
       return result.rows
      

    } catch (error) {
       console.log(error) 
       throw error
    }
}


const totalExamService =async(student_id)=>{

try {
const sqlSum = `
SELECT
    student_id,
    SUM(
        COALESCE(quiz_marks, 0) +
        COALESCE(assignment_marks, 0) +
        COALESCE(mid_test_marks, 0) +
        COALESCE(final_test_marks, 0)
    ) AS total_marks_all_exams
FROM
    exam
WHERE
    student_id = $1
GROUP BY
    student_id;
`;

const totalResult = await pool.query(sqlSum, [student_id]);
console.log(totalResult.rows);
return totalResult.rows;
  
} catch (error) {
  console.log(error);
  throw error
}

}

const getSingleExamResultService = async (student_id) => {
  try {
    const sql = `SELECT * FROM exam WHERE student_id = $1`;
    const values = [student_id];

    const result = await pool.query(sql, values);

    if (!result.rows.length) {
      return null; // or handle "no exam found" case
    }

    const exam = result.rows[0];

    // Compute total marks, treating NULL as 0
    const total_marks =
      (exam.quiz_marks ?? 0) +
      (exam.assignment_marks ?? 0) +
      (exam.mid_test_marks ?? 0) +
      (exam.final_test_marks ?? 0);

    console.log("To calculate exam result", exam.student_id, total_marks);

    return {
      ...exam,
      total_marks, // include computed total
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
 
export default {submitExamService,updateExamService,getAllExamService, totalExamService , getSingleExamResultService}