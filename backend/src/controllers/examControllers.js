
import statusCode, { StatusCodes } from 'http-status-codes'
import verifyAssignedTeacher from '../Utils/verifyAssignedTeacher.js'
import examService from '../services/examService.js'
const submitExam =async(req,res)=>{
   
       const user = req.user
// console.log("IN TEACHER CONTROLLER",user)
const isAssigned = await verifyAssignedTeacher(user);
if (!isAssigned){
    return res.status(statusCode.FORBIDDEN).json({
        status:false,
        msg:"You are not assigned to this class."
    })
}
    try {
        const {
       subject_id,
        class_id,
        teacher_id,
       student_id,
       quiz_marks,
       assignment_marks,
       final_test_marks,
       mid_test_marks}  = req.body
if (!student_id || !subject_id|| !class_id ||!teacher_id ){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false ,
        msg:"All Data of Student is required."
    })

    
    }

const submitted = await  examService.submitExamService({
     subject_id,
     class_id,
     teacher_id,
     student_id,
     quiz_marks,
     assignment_marks,
     final_test_marks,
     mid_test_marks
})  

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
    
    
    try {
    const user = req.user
// console.log("IN TEACHER CONTROLLER",user)
// const isAssigned = await verifyAssignedTeacher(user);
// if (!isAssigned){
//     return res.status(statusCode.FORBIDDEN).json({
//         status:false,
//         msg:"You are not assigned to this class."
//     })
// }
    const {student_id} = req.params
    if(!req.body){
        return res.status(StatusCodes.BAD_REQUEST).json({
            status:false,
            msg:"Atleast on data is required to update."
        })
    }
    const {
    subject_id,
     class_id,
     teacher_id,
     quiz_marks,
     assignment_marks,
     final_test_marks,
     mid_test_marks
	} = req.body
   if(!student_id){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false,
        msg:"User ID is regired to update."
    })
}

const updated =await examService.updateExamService({
    subject_id,
    class_id,
     teacher_id,
     student_id,
     quiz_marks,
     assignment_marks,
     final_test_marks,
     mid_test_marks
});
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
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status:false,
        msg:"Internal Server Error."
       })
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
if (!isAssigned){
    return res.status(statusCode.FORBIDDEN).json({
        status:false,
        msg:"You are not assigned to this class."
    })
}
    try {   
        
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


const getSingleExamResult = async (req, res) => {
    try {
        const { student_id } = req.params;

        if (!student_id) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: false,
                msg: "Student ID is required."
            });
        }
        
        const examResult = await examService.getSingleExamResultService(student_id);  
        if (!examResult) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: false,
                msg: "No exam result found for the given student."
            });
        }
        return res.status(statusCode.OK).json({
            status: true,
            msg: "Exam result fetched successfully.",
            examResult: examResult
        }); } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: "Internal Server Error."
        });
    
    }}
export default {submitExam,updateExam,getAllExam, getSumExamMarks, getSingleExamResult}