"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginSchema from "@/schemas/_login";
import { loginAction } from "@/data-access/actions/auth";
import { useFormik } from "formik";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError(null);

    startTransition(async () => {
      try {
        await loginAction(values);
      } catch (e) {
        try {
          const parsed = JSON.parse((e as Error).message);
          if (parsed.field && parsed.message) {
            formik.setFieldError(parsed.field, parsed.message);
          } else {
            setError((e as Error).message);
          }
        } catch {
          setError((e as Error).message);
        }
      } finally {
        setSubmitting(false);
      }
    });
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const emailError = formik.touched.email && formik.errors.email;
  const passwordError = formik.touched.password && formik.errors.password;

  return (
    <section>
      <header className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-semibold text-foreground">Dobrodošli natrag</h2>
        <p className="text-muted-foreground">Unesite e-mail i lozinku za pristup svom računu.</p>
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
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@company.com"
              className={`h-12 ${emailError ? "border-destructive" : ""}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {emailError && <p className="text-xs text-destructive">{formik.errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Unesite lozinku"
                className={`h-12 pr-10 ${passwordError ? "border-destructive" : ""}`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {passwordError && <p className="text-xs text-destructive">{formik.errors.password}</p>}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-12" disabled={formik.isSubmitting || isPending}>
          {formik.isSubmitting || isPending ? "Prijava…" : "Prijavi se"}
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Nemate račun?{" "}
          <Link href="/register" className="font-medium text-[#3F3FF3] hover:underline">
            Registrirajte se
          </Link>
        </p>
      </form>
    </section>
  );
}
