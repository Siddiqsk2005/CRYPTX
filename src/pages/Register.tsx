import { Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const { authReady, user } = useAuth();

  if (authReady && user) {
    return <Navigate to="/analyzer" replace />;
  }

  return (
    <AuthLayout
      title="Create Account"
      description="Create your access profile with username plus mobile number or email, verify it with OTP, and continue into the threat monitoring console."
      alternateLabel="Already have an account?"
      alternateHref="/login"
      alternateAction="Login"
    >
      <AuthForm mode="register" />
    </AuthLayout>
  );
};

export default Register;
