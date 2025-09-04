"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginSchema from "@/schemas/_login";
import { loginAction } from "@/data-access/auth/login";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError(null);

    const result = await loginAction(values);

    if (!result.success) {
      setError(result.error);
    } else {
      router.push("/");
    }

    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  return (
    <section>
      <header className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground">
          Enter your email and password to access your account.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border px-3 py-2 text-sm border-destructive/30 text-destructive bg-destructive/10"
        >
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={formik.handleSubmit} noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@company.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.errors.email && formik.touched.email
                ? "border-destructive"
                : ""
            }
            required
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-xs text-destructive">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.errors.password && formik.touched.password
                  ? "border-destructive pr-10"
                  : "pr-10"
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {formik.errors.password && formik.touched.password && (
            <p className="text-xs text-destructive">{formik.errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Logging in…" : "Log In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#3F3FF3] hover:underline"
          >
            Register Now
          </Link>
        </p>
      </form>
    </section>
  );
}
