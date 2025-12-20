import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { User, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/layouts/auth-layout";
import { useToast } from "@/hooks/use-toast";
import { LoginFormData, loginSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSanitizedForm } from "@/hooks";
import { loginApi } from "@/api/authApi";
import { useState } from "react";
interface LoginResponse {
  data: {
    status: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    data: any; // Or your User type
  };
}
export default function LoginPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [error, setError] = useState("");
  // Accessing your store to save auth state
  const setAuth = useAuthStore((state) => state.setAuth);
  const USER= useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const refreshToken= useAuthStore((state) => state.refreshToken);
  const token= useAuthStore((state) => state.token);
  
// console.log("USER:",USER.email);
// console.log("isAuthenticated:", isAuthenticated);
// console.log("refreshToken:",refreshToken);
// console.log("token:", token);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useSanitizedForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 
  const handleOnSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginApi(data);
      const res = response as LoginResponse;
      if (res?.data?.status) {
        setError("")
        setAuth(res.data.data, res.data.accessToken,res.data.refreshToken);
////NAVIGATE TO DASHBOARD WILL BE DEFINED HERE
        toast({
          title: "Success",
          description: res.data.message || "Welcome back!",
        });
      }

    } catch (error: any) {
      console.error("Login Error: Failure Point", error);

      const errorMessage = error.response?.data?.message || error.message || "Login failed";

      console.log("Extracted Error Message:", errorMessage);

      setError(errorMessage);

      toast({
        variant: "destructive",
        title: "Login Error",
        description: errorMessage,
      });
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t("common.welcome")}</h2>
        <p className="text-muted-foreground text-sm">Sign in to your DebterLink account</p>
      </div>

      <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4">
        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="student@debterlink.com"
              className={`pl-9 h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-input"}`}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className={`pl-9 h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary ${errors.password ? "border-red-500" : "border-input"}`}
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            t("common.login") || "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        {/* Fixed: react-router-dom uses 'to' prop, not 'href' */}
        {error && (
          <div className="flex items-center bg-red-100 border border-red-500 rounded-lg p-4 mb-4">
            <svg
              className="w-6 h-6 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            <p className="text-red-500 text-xl">{error}</p>
          </div>
        )}{" "}
        <a
          href="/forgot-password"
          className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground border-t pt-4">
        <p>Note: Only administrators can create new user accounts</p>
      </div>
    </AuthLayout>
  );
}
