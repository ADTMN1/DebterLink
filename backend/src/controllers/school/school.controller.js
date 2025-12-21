import { StatusCodes } from "http-status-codes";
import SchoolService from "../../services/schoolService.js/schoolService.js";

const createSchool = async (req, res) => {
  try {

const {school_name, address, phone, email, website, director_id} =req.body
const schoolExists = await SchoolService.schoolExists(req.body.school_name);
if (schoolExists) {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status: false,
    msg: "School already exists."
  });
}
if(!school_name || !address ||!phone || ! email){
  return res.status(StatusCodes.BAD_REQUEST).json({
    status:false,
    msg:"All Basic field is required."
  })
}

    const school = await SchoolService.createSchool({school_name,phone,email,address,website,director_id});
    if (!school){
        return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      msg: "Failed to create school"
    });
  }
    
    return res.status(StatusCodes.CREATED).json({
      status: true,
      msg: "School created successfully",
      school
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error."
    });
  }
};

const updateSchool = async (req, res) => {
  try {
   const hasField = Object.keys(req.body).length > 0;

if (!hasField) {
  return res.status(StatusCodes.BAD_REQUEST).json({
     status:false,
     msg: "At least one field must be provided in the request body." });
}
const {school_id} = req.params
if (!school_id){
  return res.status(StatusCodes.BAD_REQUEST).json({
    status:false,
    msg:"ID of School is Required To update."
  })
}
    

    const school = await SchoolService.updateSchool(school_id, req.body);
if(!school){
  return res.status(StatusCodes.BAD_REQUEST).json({
  status:false,
  msg:"Fail To update School information."
})
}

    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "School updated successfully",
      school:school
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};
const getAllSchools = async (req, res) => {
  try {
    const schools = await SchoolService.getAllSchools();
    if(!schools){
      return
    }
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Schools retrieved successfully",
      schools:schools 
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Failed to fetch schools"
    });
  }
};

const getSchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    if(!school_id){
      const schools = await SchoolService.getSchoolById(school_id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"School ID is required."
      })
    }
    const school = await SchoolService.getSchoolById(school_id);
    if(!school){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"School not found."
      })
    }
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "School retrieved successfully",
      school
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Failed to fetch school"
    });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    if(!school_id){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"School ID is required."
      })
    }
   const school = await SchoolService.deleteSchool(school_id);
    if(!school){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"Fail to delete school."
      })
    }
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "School deleted successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};





// Relations
const getSchoolClasses = async (req, res) => {
  const { school_id } = req.params;
  const classes = await SchoolService.getSchoolClasses(school_id);
  return res.json(classes);
};


const getSchoolTeachers = async (req, res) => {
  const { school_id } = req.params;
  const teachers = await SchoolService.getSchoolTeachers(school_id);
  return res.json(teachers);
};

const getSchoolStudents = async (req, res) => {
  const { school_id } = req.params;
  const students = await SchoolService.getSchoolStudents(school_id);
  return res.json(students);
};

export default {
  createSchool,
  updateSchool,
  deleteSchool,
  getSchool,
  getAllSchools,
  getSchoolClasses,
  getSchoolTeachers,
  getSchoolStudents
};
