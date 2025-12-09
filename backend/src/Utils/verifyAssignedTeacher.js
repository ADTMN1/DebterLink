
import { StatusCodes } from "http-status-codes";
import pool from "../../config/db.config.js";

const verifyAssignedTeacher = async(user) => {
const teacher= user;
 const   sql = `SELECT * FROM class`;
    const params = [user.id];   
console.log("params",params)

const _class =   await pool.query(sql)

// console.log("_class",_class)
if (_class.class_teacher_id !== teacher.user_id) {
    return false

}
else {
    return true
}
}

export default verifyAssignedTeacher;