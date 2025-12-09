import express from 'express'

const parentRoutes = express.Router();
import parentControllers from '../controllers/parentControllers/parent.controllers.js'
// Define parent routes here
parentRoutes.get('/get-results/:parent_id/:student_id', parentControllers.studentResult)
//APPEAL ROUETE
parentRoutes.get('/student-info/:parent_id/:student_id', parentControllers.getStudentInfo)


export default parentRoutes