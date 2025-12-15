import statusCode from 'http-status-codes'
import examService from '../../services/studentService/examService.js';
const studentResult =async(req,res)=>{
    try {
        const { student_id } = req.params;
        if(!student_id){
            return res.status(statusCode.BAD_REQUEST).json({
                status:false,
                msg:"Student ID is required."
            })
        }
        
const result = await examService.getYourExamService(student_id);
if (!result){
    return res.status(statusCode.BAD_REQUEST).json({
        status:false,
        msg:"No Exam Result Found."
    })
}
return res.status(statusCode.OK).json({
    status:true,
    msg:"Exam Result fetched Successfully.",
    result:result
})
    } catch (error) {
        console.log(error)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status:false,
            msg:"Internal Server Error."
        })
    }
}

export default {studentResult}