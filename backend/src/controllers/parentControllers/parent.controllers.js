import parentService from '../../services/parentService/parentService.js'
import { StatusCodes } from "http-status-codes"
const studentResult = async(req, res) => {

    try {
        
const { student_id } = req.params;
if(!student_id){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"Student ID is required."
    })
}

// Get parent_id from authenticated user
const parent_id = req.user.user_id;

const result = await parentService.getResults(parent_id, student_id);
if (!result){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"No Exam Result Found for this Student."
    })
}
return res.status(StatusCodes.OK).json({
    status:true,
    msg:"Exam Result fetched Successfully.",
    result:result
})  
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:false,
            msg:"Internal Server Error."
        })

    }
}



const getStudentInfo = async(req, res) => {

    try {
        
const { student_id } = req.params;
if(!student_id){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"Student ID is required."
    })
}

// Get parent_id from authenticated user
const parent_id = req.user.user_id;

const studentInfo = await parentService.getStudentInfo(parent_id, student_id);
if (!studentInfo){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"No Student Info Found for this Student."
    })
}
return res.status(StatusCodes.OK).json({
    status:true,
    msg:"Student Info fetched Successfully.",
    studentInfo:studentInfo 
})  
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:false,
            msg:"Internal Server Error."
        })

    }}
export default {
    studentResult,getStudentInfo
}


