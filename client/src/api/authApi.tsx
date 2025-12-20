import { RegisterInput } from "@/pages/auth/register"
import { api } from "./axios"
import { LoginFormData, schoolAndAdminSchema } from "@/lib/validations"


export const registerApi =async(data:schoolAndAdminSchema)=>{

    console.log("before destructerd " , data)
    const parts = data.fullName.trim().split(/\s+/); 

  const first_name = parts[0];
  const last_name = parts.slice(1).join(" ")
    const payload = {
      school: {
        name: data.school_name,
        code: data.code,
        email: data.school_email,
        phone: data.school_phone,
        address: data.address,
        academic_year: data.academic_year,
        status: data.status.toLowerCase(), 
        website: data.website,
      },
      admin: {
        first_name: first_name,
        last_name: last_name,
        email: data.admin_email,
        phone: data.admin_phone,
        password: data.password,
        confirmPassword: data.password,
        role_id: 2,
      },
    };
    try {
        console.log("data in register", payload)
        const response = await api.post("/auth/register", payload);
        console.log("response of registeration.",response)
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}



export const loginApi =async(data:LoginFormData)=>{
    try {
        console.log("data in login", data)
        const response = await api.post("/auth/login", data);
        // console.log("respnse of login.", response)
        return response
    } catch (error) {
        // console.log(error)
        throw error
    }
}