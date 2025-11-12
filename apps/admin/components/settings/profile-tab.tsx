"use client";

import { useState, useTransition } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateProfileAction } from "@/data-access/actions/user";

type Props = {
  userId: number;
  initial: {
    name: string;
    email: string;
    phone: string;
  };
};

const schema = Yup.object({
  name: Yup.string().trim().min(2, "Minimalno 2 znaka").required("Ime je obavezno"),
  email: Yup.string().trim().email("Neispravna e-pošta").required("E-pošta je obavezna"),
  phone: Yup.string()
    .trim()
    .max(30, "Predugačak broj")
    .matches(/^[\d +().-]*$/, "Dozvoljene su samo znamenke i + ( ) . - razmak")
    .nullable(),
});

export default function ProfileTab({ userId, initial }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formik = useFormik({
    initialValues: initial,
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: () => {
      // samo otvori modal; stvarni save ide na Confirm
      setConfirmOpen(true);
    },
    enableReinitialize: true,
  });

  const nameErr = formik.touched.name && formik.errors.name;
  const emailErr = formik.touched.email && formik.errors.email;
  const phoneErr = formik.touched.phone && formik.errors.phone;

  function doSave() {
    setConfirmOpen(false);
    startTransition(async () => {
      try {
        await updateProfileAction({ userId, ...formik.values });
        toast.success("Profil uspješno ažuriran.");
        formik.setSubmitting(false);
      } catch (e) {
        // podrži backend pattern: throw new Error(JSON.stringify({ field, message }))
        try {
          const parsed = JSON.parse((e as Error).message);
          if (parsed?.field && parsed?.message) {
            formik.setFieldError(parsed.field, parsed.message);
          } else {
            toast.error((e as Error).message || "Došlo je do pogreške pri ažuriranju profila.");
          }
        } catch {
          toast.error((e as Error).message || "Došlo je do pogreške pri ažuriranju profila.");
        } finally {
          formik.setSubmitting(false);
        }
      }
    });
  }

  const saving = formik.isSubmitting || isPending;

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Osobni podaci</CardTitle>
        <CardDescription>Ažurirajte svoje osnovne informacije i postavke profila.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-6" onSubmit={formik.handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ime</Label>
              <Input
                id="firstName"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={nameErr ? "border-destructive" : ""}
              />
              {nameErr && <p className="text-xs text-destructive">{formik.errors.name}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-pošta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={emailErr ? "border-destructive" : ""}
            />
            {emailErr && <p className="text-xs text-destructive">{formik.errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formik.values.phone ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={phoneErr ? "border-destructive" : ""}
            />
            {phoneErr && <p className="text-xs text-destructive">{formik.errors.phone}</p>}
          </div>
          <Button
            onClick={doSave}
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Spremanje…" : "Spremi promjene"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
