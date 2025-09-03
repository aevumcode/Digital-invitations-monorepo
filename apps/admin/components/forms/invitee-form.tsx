"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import type { FormikHelpers } from "formik";
import { inviteeSchema, CreateInviteeDto } from "@/schemas/_invitee";
import { DialogMode } from "@/types/_dialog-mode";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export type InviteeFormHandle = {
  submitForm: () => void;
};

type Props = {
  defaultValues: CreateInviteeDto;
  mode: DialogMode;
  onSubmit: (
    data: CreateInviteeDto,
    formikHelpers?: FormikHelpers<CreateInviteeDto>
  ) => void;
};

export const InviteeForm = forwardRef<InviteeFormHandle, Props>(
  ({ defaultValues, mode, onSubmit }, ref) => {
    const isReadOnly = mode === DialogMode.PREVIEW;

    const form = useFormik<CreateInviteeDto>({
      initialValues: defaultValues,
      validationSchema: inviteeSchema,
      onSubmit: async (values) => onSubmit(values),
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => form.submitForm(),
    }));

    return (
      <div className="space-y-4">
        {/* First name */}
        <div className="grid gap-2">
          <Label htmlFor="firstName">Ime</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            readOnly={isReadOnly}
            value={form.values.firstName}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.touched.firstName && form.errors.firstName && (
            <p className="text-sm text-red-500">{form.errors.firstName}</p>
          )}
        </div>

        {/* Last name */}
        <div className="grid gap-2">
          <Label htmlFor="lastName">Prezime</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            readOnly={isReadOnly}
            value={form.values.lastName}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.touched.lastName && form.errors.lastName && (
            <p className="text-sm text-red-500">{form.errors.lastName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="grid gap-2">
          <Label htmlFor="phone">Broj mobitela</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            readOnly={isReadOnly}
            value={form.values.phone || ""}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.touched.phone && form.errors.phone && (
            <p className="text-sm text-red-500">{form.errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            readOnly={isReadOnly}
            value={form.values.email || ""}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.touched.email && form.errors.email && (
            <p className="text-sm text-red-500">{form.errors.email}</p>
          )}
        </div>

        {/* Tag (optional) */}
        <div className="grid gap-2">
          <Label htmlFor="tag">Tag (opcionalno)</Label>
          <Input
            id="tag"
            name="tag"
            type="text"
            readOnly={isReadOnly}
            value={form.values.tag || ""}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.touched.tag && form.errors.tag && (
            <p className="text-sm text-red-500">{form.errors.tag}</p>
          )}
        </div>
      </div>
    );
  }
);

InviteeForm.displayName = "InviteeForm";
