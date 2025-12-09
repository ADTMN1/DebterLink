import express from 'express'

import appealControllers from '../controllers/appealControllers.js'
const appealRoutes = express.Router()




appealRoutes.post('/appeal-submit', appealControllers.createAppeal);
appealRoutes.get('/get-appeals', appealControllers.getAllAppeal)
appealRoutes.put('/edit-appeal/:appeal_id', appealControllers.editAppeal)
appealRoutes.delete('/delete-appeal/:appeal_id', appealControllers.deleteAppeal)
appealRoutes.get('/get-single-appeal/:appeal_id', appealControllers.getSingleAppeal)
appealRoutes.get('/get-your-appeals/:user_id', appealControllers.getYourAppeals)
// appealRoutes.get('/get-your-single-appeal/:user_id', appealControllers.)



export default appealRoutes