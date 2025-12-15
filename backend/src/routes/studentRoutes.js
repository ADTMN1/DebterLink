
import studentControllers from '../controllers/studentControllers/examControllers.js'
import express from 'express'

const studentRoutes = express.Router();
// Define student routes here
studentRoutes.get('/exam-result/:student_id',  studentControllers.studentResult)



export default studentRoutes