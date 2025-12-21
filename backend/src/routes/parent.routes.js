import express from 'express'
import { authMiddleware, verifyRole } from '../middleware/auth.middleware.js'
import { ROLES } from '../../constants/roles.js'
import { sanitizeInput } from '../middleware/sanitize.js'
import { checkParentStudentAccess } from '../middleware/parentAccess.js'

const parentRoutes = express.Router();
import parentControllers from '../controllers/parentControllers/parent.controllers.js'

// Apply authentication and sanitization to all routes
parentRoutes.use(authMiddleware);
parentRoutes.use(sanitizeInput);

// Define parent routes here
parentRoutes.get('/get-results/:student_id', 
  verifyRole(ROLES.PARENT), 
  checkParentStudentAccess, 
  parentControllers.studentResult
);

//APPEAL ROUTE
parentRoutes.get('/student-info/:student_id', 
  verifyRole(ROLES.PARENT), 
  checkParentStudentAccess, 
  parentControllers.getStudentInfo
);


export default parentRoutes