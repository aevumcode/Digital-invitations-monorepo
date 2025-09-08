"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import registerSchema from "@/schemas/_register";
import { registerAction } from "@/data-access/actions/auth";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRegister = async (
    values: { name: string; email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError(null);

    startTransition(async () => {
      try {
        await registerAction(values);
      } catch (e) {
        try {
          const parsed = JSON.parse((e as Error).message);
          if (parsed.field && parsed.message) {
            formik.setFieldError(parsed.field, parsed.message);
          } else {
            setError((e as Error).message);
          }
        } catch {
          // Fallback if error.message is not JSON
          setError((e as Error).message);
        }
      } finally {
        setSubmitting(false);
      }
    });
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: handleRegister,
  });

  const err = formik.errors;
  const touched = formik.touched;

  return (
    <section>
      <header className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-semibold text-foreground">Create Account</h2>
        <p className="text-muted-foreground">Fill in your details to get started.</p>
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
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className={`h-12 ${touched.name && err.name ? "border-destructive" : ""}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {touched.name && err.name && <p className="text-xs text-destructive">{err.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@company.com"
              className={`h-12 ${touched.email && err.email ? "border-destructive" : ""}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {touched.email && err.email && <p className="text-xs text-destructive">{err.email}</p>}
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
                className={`h-12 pr-10 ${touched.password && err.password ? "border-destructive" : ""}`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
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
            {touched.password && err.password && (
              <p className="text-xs text-destructive">{err.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                className={`h-12 pr-10 ${touched.confirmPassword && err.confirmPassword ? "border-destructive" : ""}`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {touched.confirmPassword && err.confirmPassword && (
              <p className="text-xs text-destructive">{err.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-12" disabled={formik.isSubmitting || isPending}>
          {formik.isSubmitting || isPending ? "Creating account…" : "Create Account"}
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#3F3FF3] hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </section>
  );
}
