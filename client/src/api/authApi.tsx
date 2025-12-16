import { RegisterInput } from "@/pages/auth/register"
import { api } from "./axios"


export const registerApi =async(data:RegisterInput)=>{
    try {
        console.log("data in register", data)
        //check  parse
        const response = await api.post('/auth/register',data)
        console.log("respnse of registeration.",response)
        return response.data
    } catch (error) {
        console.log(error)
        return error
    }
}



export const loginApi =async(data:RegisterInput)=>{
    try {
        console.log("data in login", data)
        //check  parse
        const response = await api.post('/auth/login', data)
        console.log("respnse of login.", response)
        return response.data
    } catch (error) {
        console.log(error)
        return error
    }
}