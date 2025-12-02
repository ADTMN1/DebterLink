import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware, verifyRole } from "./middleware/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);


router.get("/super-admin",    authMiddleware,  verifyRole() , (req, res) => res.send("SUPER ADMIN route"));
router.get("/director",  authMiddleware,  verifyRole(1) , (req, res) => res.send("DIRECTOR route"));
router.get("/admin",  authMiddleware,  verifyRole(5) , (req, res) => res.send("admin route"));
router.get("/parent",  authMiddleware,  verifyRole(3) , (req, res) => res.send("parent route"));
router.get("/teacher",  authMiddleware,  verifyRole(2) , (req, res) => res.send("teacher route"));
router.get("/student",  authMiddleware,  verifyRole(4) , (req, res) => res.send("student route"));

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