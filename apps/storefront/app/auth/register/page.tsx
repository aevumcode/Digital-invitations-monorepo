"use client";

import AuthLayout from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
