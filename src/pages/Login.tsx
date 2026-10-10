import { Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { authReady, user } = useAuth();

  if (authReady && user) {
    return <Navigate to="/analyzer" replace />;
  }

  return (
    <AuthLayout
      title="Secure Access"
      description="Start with login or OTP verification, then move into the analyzer, dashboard, personal details, logout, and message history flow."
      alternateLabel="Need an account?"
      alternateHref="/register"
      alternateAction="Register"
    >
      <AuthForm mode="login" />
    </AuthLayout>
  );
};

export default Login;
