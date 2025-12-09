
import statusCode from 'http-status-codes'
import verifyAssignedTeacher from '../Utils/verifyAssignedTeacher.js'
import examService from '../services/examService.js'
const submitExam =async(req,res)=>{
   
       const user = req.user
// console.log("IN TEACHER CONTROLLER",user)
const isAssigned = await verifyAssignedTeacher(user);
    try {
        const {
subject_id,
    class_id,
    teacher_id,
    student_id,
    exam_type_id,
    total_marks}  = req.body
if (!student_id || !subject_id|| !class_id ||!teacher_id || !total_marks || !exam_type_id){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false ,
        msg:"All Data of Student is required."
    })

    
    }

const submitted = await  examService.submitExamService({subject_id,
    class_id,
    teacher_id,
    exam_type_id,
    student_id,
    total_marks})  

if (!submitted){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false,
        msg:"Fail to Submit Exam"
    })
}
return res.status(statusCode.OK).json({
    status:false ,
    msg:"Exam Is Submitted Successfully.",
    exam:submitted
})
    } catch (error) {
        console.log("Internal Server Error." , error)

        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            msg:"Internal Server Error."
        })
    }
}


const updateExam =async(req ,res)=>{
    const user = req.user
// console.log("IN TEACHER CONTROLLER",user)
const isAssigned = await verifyAssignedTeacher(user);
    try {
        const {subject_id,
    class_id,
    teacher_id,
    student_id,
    exam_type_id,
    total_marks,} = req.body
if(!teacher_id ||!student_id || !subject_id){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false,
        msg:"Basic Atleast three fields is regired."
    })
}

const updated =await examService.updateExamService({subject_id,
    class_id,
    teacher_id,
    exam_type_id,
    student_id,
    total_marks});
    if (!updated){
        return res.status(statusCode.BAD_REQUEST).json({
            status:false,
            msg:"Fail to Update Exam"
        })}
        return res.status(statusCode.OK).json({
            status:true,
            msg:"Exam Updated Successfully",
            exam:updated
        })

    } catch (error) {
       console.log(error) 
    }

}


const getAllExam =async(req,res)=>{
    try {
           const user = req.user
// console.log("IN TEACHER CONTROLLER",user)
const isAssigned = await verifyAssignedTeacher(user);
if (!isAssigned){
    return res.status(statusCode.FORBIDDEN).json({
        status:false,
        msg:"You are not assigned to this class."
    })
}
     const { teacher_id } = req.params;
     console.log(teacher_id)
     if(!teacher_id){
        return res.status(statusCode.BAD_REQUEST).json({
            status:false,
            msg:"Correct Teacer ID is required."
        })
     }
const exams = await examService.getAllExamService(teacher_id);
if (!exams){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false,
        msg:"No Exams Found."
    })
}
return res.status(statusCode.OK).json({
    status:true,
    msg:"Exams fetched Successfully.",
    exams:exams
})
    
    } catch (error) {
        console.log(error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status:false,
            msg:"Internal Server Error."
        })
    }
}


const getSumExamMarks =async(req,res)=>{
        const user = req.user
// console.log("IN TEACHER CONTROLLER",user)
const isAssigned = await verifyAssignedTeacher(user);
    try {   
        
        console.log(req)
        const { student_id } = req.body
 
      const totalMarks = await examService.totalExamService(student_id);
      if (!totalMarks) {
        return res.status(statusCode.BAD_REQUEST).json({
          status: false,
          msg: "No exam marks found.",
        });
      }
      return res.status(statusCode.OK).json({
        status: true,
        msg: "Total exam marks fetched successfully.",
        totalMarks: totalMarks,
      });
    }catch (error) {
      console.log(error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        msg: "Internal Server Error.",
      });
    }

}
export default {submitExam,updateExam,getAllExam, getSumExamMarks}