/// ALL ROUTES DEFINED HERE BASICALLY TO CALLED AT APP.JS OR ENTRY POINT


import express from 'express'

const routes = express.Router()



routes.use('/auth'  ,()=>{console.log("auth")})  
routes.use('/parent',()=>{console.log("parent")})  
routes.use('/admin',()=>{console.log("admin")})  
routes.use('/teacher',()=>{console.log("teacher")})  
routes.use('/student',()=>{console.log("student")})  



export default routes