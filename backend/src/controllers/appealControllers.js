import {StatusCodes} from 'http-status-codes'
import apealService from '../services/apealService.js'
const createAppeal=async(req,res)=>{

try {
    const { user_id, title, description, status, stakeholder_response, stakeholder}=req.body
if(!description || !user_id || !title || !description || !stakeholder){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"ALl basic fields is required to make appeal."
    })
}

const ifappelIsSubmitted = await apealService.submitAppealService({user_id, title, description, status, stakeholder_response, stakeholder})


if(!ifappelIsSubmitted){
return res.status(StatusCodes.BAD_REQUEST).json({
    status:false,
    msg:"Fail to Make appeal."
})
}
 return res.status(StatusCodes.OK).json({
    status:false,
    msg:"Your appeal is submitted be outdate for response.",
    data:ifappelIsSubmitted
 })

} catch (error) {
    console.log(error)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status:false ,
    msg:"Internal Server Error."
  }) 
}

}
const editAppeal=async(req,res)=>{

    try {

       const {appeal_id}= req.params
      if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "At least one field is required to update the appeal."
    });
}
if (!req.body.user_id || !appeal_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "User ID and Appeal ID are required."
    });
}

const isUpdated =  await apealService.editAppealService(req.body,appeal_id)
if(!isUpdated){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"Fail to update."
    })
}

return res.status(StatusCodes.OK).json({
    status:false,
    msg:"Updated successfully.",
    data:isUpdated

})

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: "internal Server error."
        })
    }
}
const getAllAppeal=async(req,res)=>{

try {
    const allAppeals= await apealService.getAppealService()
    if(!allAppeals){
        return res.status(StatusCodes.BAD_REQUEST).json({
            status:false,
            msg:"Fail to fetch appeals."
        })
    }
    return res.status(StatusCodes.OK).json({
        status:true,
        data:allAppeals
    })

} catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        msg: "internal Server error."
    })
}

}
const getSingleAppeal=async(req,res)=>{
const {appeal_id}=req.params
try {
    const singleAppeal= await apealService.getSigleAppealService(appeal_id)
    if(!singleAppeal){
        return res.status(StatusCodes.BAD_REQUEST).json({
            status:false,
            msg:"Fail to fetch appeal."
        })
    }
    return res.status(StatusCodes.OK).json({
        status:true,
        data:singleAppeal
    })  }catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        msg: "internal Server error."
    })  

}}
const deleteAppeal=async(req,res)=>{
    try {
        const {appeal_id}=req.params
        if(!appeal_id){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:false,
                msg:"Appeal id is required."
            })
        }
        const isDeleted= await apealService.deleteAppealService(appeal_id)
        if(!isDeleted){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:false,
                msg:"Fail to delete appeal."
            })
        }
        return res.status(StatusCodes.OK).json({
            status:true,
            msg:"Appeal deleted successfully."
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: "internal Server error."
        })
    }
}


const getYourAppeals=async(req,res)=>{

    const {user_id}=req.params
    try {
        const yourAppeals= await apealService.getYourAppealsService(user_id)
        if(!yourAppeals){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status:false,
                msg:"Fail to fetch your appeals."
            })
        }
        return res.status(StatusCodes.OK).json({
            status:true,
            data:yourAppeals
        })
    
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            msg: "internal Server error."
        })
    }
    
    }



export default {
    createAppeal,
    editAppeal,
    getAllAppeal,
    getSingleAppeal,
    deleteAppeal,
    getYourAppeals
}