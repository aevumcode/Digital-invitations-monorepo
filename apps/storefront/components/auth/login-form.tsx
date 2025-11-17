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
import { useSearchParams } from "next/navigation";
import { useCart } from "../cart/cart-context";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const { cart } = useCart();

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError(null);

    startTransition(async () => {
      try {
        const { checkoutUrl } = await loginAction({ ...values, redirectTo, cart });

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        redirectTo ? (window.location.href = redirectTo) : (window.location.href = "/");
      } catch (e) {
        try {
          const parsed = JSON.parse((e as Error).message);
          if (parsed.field && parsed.message) {
            formik.setFieldError(parsed.field, parsed.message);
          } else {
            setError(parsed.message || (e as Error).message);
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
        <p className="text-muted-foreground">Unesite svoj email i lozinku za pristup računu.</p>

        {/* Info kod checkouta */}
        {redirectTo?.includes("checkout") && (
          <p className="text-sm text-blue-600 mt-2 px-4">
            Nastavljate prema plaćanju — ako nemate račun, napravite ga sada.
            <br />
            <span className="font-semibold">
              Nakon kupnje moći ćete se odmah prijaviti u Admin Panel koristeći iste podatke.
            </span>
          </p>
        )}
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
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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

          {/* Lozinka */}
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
          {formik.isSubmitting || isPending ? "Prijavljivanje…" : "Prijava"}
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Nemaš račun?{" "}
          <Link
            href={redirectTo ? `/auth/register?redirect=${redirectTo}` : `/auth/register`}
            className="font-medium text-[#3F3FF3] hover:underline"
          >
            Registriraj se
          </Link>
        </p>
      </form>
    </section>
  );
}
