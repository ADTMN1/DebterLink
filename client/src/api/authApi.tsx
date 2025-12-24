import { RegisterInput } from "@/pages/auth/register"
import { api } from "./axios"
import { LoginFormData, schoolAndAdminSchema } from "@/lib/validations"


export const registerApi = async (data: schoolAndAdminSchema) => {
    // Map frontend form data to backend expected structure
    const payload = {
        school: {
            name: data.school_name,
            code: data.code,
            email: data.school_email,
            phone: data.school_phone,
            address: data.address,
            academic_year: data.academic_year,
            status: data.status.toLowerCase() // Convert 'Active' to 'active'
        },
        admin: {
            first_name: data.fullName.split(' ')[0] || data.fullName,
            last_name: data.fullName.split(' ').slice(1).join(' ') || 'Administrator', // Ensure last name is not empty and meets 2-50 char requirement
            email: data.admin_email,
            phone: data.admin_phone,
            password: data.password,
            confirmPassword: data.confirmed_password,
            role_id: 2 // Admin role
        },
        created_by: "super_admin"
    };
    try {
        console.log("=== REGISTRATION API DEBUG ===");
        console.log("Complete payload:", payload);
        console.log("School data:", payload.school);
        console.log("Admin data:", payload.admin);
        console.log("Created by:", payload.created_by);
        console.log("Endpoint: /auth/register");
        console.log("=== END REGISTRATION DEBUG ===");
        
        const response = await api.post("/auth/register", payload);
        console.log("=== REGISTRATION RESPONSE DEBUG ===");
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        console.log("=== END REGISTRATION RESPONSE DEBUG ===");
        return response
    } catch (error) {
        console.log("=== REGISTRATION ERROR DEBUG ===");
        console.log("Error status:", (error as any)?.response?.status);
        console.log("Error message:", (error as any)?.message);
        console.log("Error response data:", (error as any)?.response?.data);
        console.log("Validation errors:", (error as any)?.response?.data?.details);
        if ((error as any)?.response?.data?.details) {
            (error as any).response.data.details.forEach((detail: any, index: number) => {
                console.log(`Validation error ${index + 1}:`, detail);
            });
        }
        console.log("Error config:", (error as any)?.config);
        console.log("=== END REGISTRATION ERROR DEBUG ===");
        throw error
    }
}



export const loginApi =async(data:LoginFormData)=>{
    try {
        const response = await api.post("/auth/login", data);
        // console.log("respnse of login.", response)
        return response
    } catch (error) {
        // console.log(error)
        throw error
    }
}