// we dont upload files for now we use external file storage and our db store file url's 





// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); 
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "application/pdf",
//       "image/png",
//       "image/jpeg",
//       "application/msword",
//     ];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error("Only PDF, Word, and Images allowed"));
//     }
//     cb(null, true);
//   },
// });

// export default upload;
