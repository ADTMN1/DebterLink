import express from "express" 
import examControllers from "../controllers/examControllers.js"
const examROutes = express.Router();


examROutes.post('/submit-exam',  examControllers.submitExam)

examROutes.put('/update-exam/:student_id',examControllers.updateExam)

examROutes.get('/exams/:teacher_id',examControllers.getAllExam)
examROutes.post('/total-exam-marks',examControllers.getSumExamMarks)
examROutes.get('/exam-result/:student_id',examControllers.getSingleExamResult)
export default examROutes