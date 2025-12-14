import express from "express" 
import examControllers from "../controllers/examControllers.js"
const examROutes = express.Router();


examROutes.post('/submit-exam',  examControllers.submitExam)

examROutes.put('/update-exam',examControllers.updateExam)

examROutes.get('/exams/:teacher_id',examControllers.getAllExam)
examROutes.post('/total-exam-marks',examControllers.getSumExamMarks)

export default examROutes