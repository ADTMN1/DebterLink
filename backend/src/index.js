import express from "express";
import authRoutes from "./routes/auth.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);


router.get("/super-admin",     verifyRole() , (req, res) => res.send("parent route"));
router.get("/director",   verifyRole() , (req, res) => res.send("parent route"));
router.get("/admin",   verifyRole() , (req, res) => res.send("admin route"));
router.get("/parent",   verifyRole() , (req, res) => res.send("parent route"));
router.get("/teacher",   verifyRole() , (req, res) => res.send("teacher route"));
router.get("/student",   verifyRole() , (req, res) => res.send("student route"));

export default router;
/*

bacckend folder structure

backend
│
├── config
│   ├── db.config.js
│   ├── install.js
│   └── schema.sql
│
├── src
│   ├── controllers
│   │   └── auth.controller.js and other controllers
│   ├── middlewares
│   │   └── auth.middleware.js and other middlewares
│   ├──routes
│   │   └── auth.routes.js and other routes
       -services
│   │   └── query
            -auth.service.js and other services
        api// example Ai integration    
│   └── index.js// all routes combined to export for app.js
│
├── app.js// main server file
├── package.json
└── .env
         
*/