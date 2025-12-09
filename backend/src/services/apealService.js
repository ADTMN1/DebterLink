import pool from '../../config/db.config.js'
const submitAppealService = async(payload) => {
console.log(payload)
try {
const sql = 'INSERT INTO appeal (title, user_id, description, status, stakeholder) VALUES ($1, $2, $3, $4, $5 ) RETURNING *;'
const values =[
   payload.title,
   payload.user_id,
   payload.description,
   payload.status,
   payload.stakeholder ]
const result =await pool.query(sql,values)

return result.rows[0]


} catch (error) {
   console.log(error)
   throw error 
}
}
//edit appel service
const editAppealService = async( body ,appeal_id) => {
console.log(body,appeal_id,body.user_id)
try {
const checkSql = `
    SELECT * FROM appeal
    WHERE appeal_id = $1 AND user_id = $2;
`;
const checkResult = await pool.query(checkSql, [appeal_id, body.user_id]);
console.log(checkResult.rows[0])
if (checkResult.rowCount === 0) {
    return false;  // User not allowed or appeal doesn't exist
}

const sql = `
    UPDATE appeal
    SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        stakeholder_response = COALESCE($4, stakeholder_response),
        stakeholder = COALESCE($5, stakeholder)
    WHERE appeal_id = $6
    RETURNING *;
`;

const values = [
    body.title,
    body.description,
    body.status,
    body.stakeholder_response ,
    body.stakeholder,
    appeal_id
];

const result = await pool.query(sql, values);
console.log(result)
return result.rows[0];
} catch (error) {
    console.log(error)
    throw error
}

}
const getAppealService = async(appeal_id) => {
try {
  const sql = 'SELECT * FROM appeal;';
  const result = await pool.query(sql);
  return result.rows;
} catch (error) {
  console.log(error)
  throw error
}

}
const deleteAppealService = async(appeal_id) => {
try {
  const sql = 'DELETE FROM appeal WHERE appeal_id = $1 RETURNING *;';
  const values =[appeal_id]
  const result = await pool.query(sql,values);
  return result.rows[0];  
}catch (error) {
  console.log(error)
  throw error

}

}
const getSigleAppealService = async(appeal_id) => {
  try {
    console.log(appeal_id)
    const sql = 'SELECT * FROM appeal WHERE appeal_id = $1;';
    const values =[appeal_id]
    const result = await pool.query(sql,values);
    return result.rows[0];
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getYourAppealsService = async(user_id) => {
  try {
    const sql = 'SELECT * FROM appeal WHERE user_id = $1;';
    
    const values =[user_id]
    const result = await pool.query(sql,values);
    if(result.rows[0].user_id !== user_id){
      return null
    }
    return result.rows;
  } catch (error) {
    console.log(error)
    throw error}

  }

 
export  default {
    submitAppealService,
    editAppealService,
    getAppealService,
    deleteAppealService,
    getSigleAppealService,
    getYourAppealsService,
}



