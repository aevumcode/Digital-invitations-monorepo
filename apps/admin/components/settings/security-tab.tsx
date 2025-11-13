"use client";

import { useState, useTransition } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { changePasswordAction } from "@/data-access/actions/user";

type Props = { userId: number };

const schema = Yup.object({
  current: Yup.string().required("Unesite trenutnu lozinku"),
  next: Yup.string().min(8, "Minimalno 8 znakova").required("Unesite novu lozinku"),
  confirm: Yup.string()
    .oneOf([Yup.ref("next")], "Lozinke se ne podudaraju")
    .required("Potvrdite novu lozinku"),
});

export default function SecurityTab({ userId }: Props) {
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formik = useFormik({
    initialValues: { current: "", next: "", confirm: "" },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
      startTransition(async () => {
        try {
          await changePasswordAction({
            userId,
            currentPassword: values.current,
            newPassword: values.next,
            confirmNewPassword: values.confirm,
          });

          resetForm();
          toast.success("Lozinka je uspješno ažurirana.");
        } catch (e) {
          try {
            const parsed = JSON.parse((e as Error).message);
            if (parsed?.field && parsed?.message) {
              setFieldError(parsed.field, parsed.message);
            } else {
              toast.error((e as Error).message || "Neuspješno ažuriranje lozinke.");
            }
          } catch {
            toast.error((e as Error).message || "Neuspješno ažuriranje lozinke.");
          }
        } finally {
          setSubmitting(false);
        }
      });
    },
  });

  const currentErr = formik.touched.current && formik.errors.current;
  const nextErr = formik.touched.next && formik.errors.next;
  const confirmErr = formik.touched.confirm && formik.errors.confirm;

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Sigurnosne postavke</CardTitle>
        <CardDescription>Upravljajte lozinkom i autentifikacijom.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
          <h3 className="font-medium text-gray-900">Lozinka</h3>

          {/* --- CURRENT PASSWORD --- */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Trenutna lozinka</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="current"
                type={show ? "text" : "password"}
                placeholder="Unesite trenutnu lozinku"
                value={formik.values.current}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={currentErr ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {currentErr && <p className="text-xs text-destructive">{formik.errors.current}</p>}
          </div>

          {/* --- NEW PASSWORD --- */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova lozinka</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="next"
                type={show ? "text" : "password"}
                placeholder="Unesite novu lozinku"
                value={formik.values.next}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={nextErr ? "border-destructive" : ""}
              />
              {/* isti toggle */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {nextErr && <p className="text-xs text-destructive">{formik.errors.next}</p>}
          </div>

          {/* --- CONFIRM PASSWORD --- */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potvrdite novu lozinku</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirm"
                type={show ? "text" : "password"}
                placeholder="Potvrdite novu lozinku"
                value={formik.values.confirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={confirmErr ? "border-destructive" : ""}
              />

              {/* isti toggle */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {confirmErr && <p className="text-xs text-destructive">{formik.errors.confirm}</p>}
          </div>

          <Button
            type="submit"
            variant="outline"
            className="gap-2 bg-transparent"
            disabled={formik.isSubmitting || isPending}
          >
            <Lock className="w-4 h-4" />
            {formik.isSubmitting || isPending ? "Ažuriranje…" : "Ažuriraj lozinku"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
