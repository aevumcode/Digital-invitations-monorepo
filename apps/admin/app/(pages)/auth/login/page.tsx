import AuthLayout from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
