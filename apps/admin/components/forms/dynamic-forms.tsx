"use client";

import * as React from "react";
import * as Yup from "yup";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";

// ===== Types for schema =====
type BaseField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "time" | "url" | "number";
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
};

export type FormSchema = {
  title?: string;
  sections: Array<{
    title?: string;
    fields: BaseField[];
  }>;
};

// ===== Build initial values from schema =====
export function buildInitialFromSchema(schema: FormSchema, initial?: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...(initial ?? {}) };
  for (const sec of schema.sections) {
    for (const f of sec.fields) {
      if (out[f.name] === undefined || out[f.name] === null) {
        // sensible defaults per type
        switch (f.type) {
          case "number":
            out[f.name] = "";
            break;
          default:
            out[f.name] = "";
        }
      }
    }
  }
  return out;
}

// ===== Yup builder from schema =====
export function buildYupFromSchema(schema: FormSchema) {
  const shape: Record<string, Yup.AnySchema> = {};
  for (const sec of schema.sections) {
    for (const f of sec.fields) {
      let s: Yup.AnySchema;

      switch (f.type) {
        case "text":
        case "date":
        case "time":
          s = Yup.string();
          if (f.required) s = (s as Yup.StringSchema).trim().required("Required");
          if (f.maxLength) s = (s as Yup.StringSchema).max(f.maxLength, `Max ${f.maxLength} chars`);
          break;

        case "textarea":
          s = Yup.string();
          if (f.required) s = (s as Yup.StringSchema).trim().required("Required");
          if (f.maxLength) s = (s as Yup.StringSchema).max(f.maxLength, `Max ${f.maxLength} chars`);
          break;

        case "url":
          s = Yup.string();
          if (f.required) s = s.required("Required");
          s = (s as Yup.StringSchema).url("Enter a valid URL");
          break;

        case "number": {
          s = Yup.number().typeError("Enter a number");
          if (f.required) s = (s as Yup.NumberSchema).required("Required");
          if (typeof f.min === "number") s = (s as Yup.NumberSchema).min(f.min, `Min ${f.min}`);
          if (typeof f.max === "number") s = (s as Yup.NumberSchema).max(f.max, `Max ${f.max}`);
          break;
        }

        default:
          s = Yup.mixed();
      }

      shape[f.name] = s;
    }
  }

  return Yup.object(shape);
}

function FieldControl({
  field,
  value,
  onChange,
  error,
  compact,
}: {
  field: BaseField;
  value: unknown;
  onChange: (val: unknown) => void;
  error?: string;
  compact?: boolean;
}) {
  const base = "w-full rounded-md border px-3 outline-none focus:ring-2 focus:ring-purple-400";
  const cls = `${base} ${compact ? "h-9 text-sm py-1.5" : "h-10 py-2"} ${
    error ? "border-red-400 focus:ring-red-400" : "border-gray-300"
  }`;

  switch (field.type) {
    case "textarea":
      return (
        <>
          <Textarea
            className={`${base} ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300"} min-h-[100px]`}
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.maxLength != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              {String((value as string)?.length ?? 0)}/{field.maxLength}
            </p>
          )}
        </>
      );

    case "date":
      return (
        <Input
          type="date"
          className={cls}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "time":
      return (
        <Input
          type="time"
          className={cls}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "url":
      return (
        <Input
          type="url"
          className={cls}
          value={(value as string) ?? ""}
          placeholder={field.placeholder ?? "https://…"}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          className={cls}
          value={value === "" || value == null ? "" : String(value)}
          placeholder={field.placeholder}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? "" : Number(v));
          }}
          min={field.min}
          max={field.max}
        />
      );

    case "text":
    default:
      return (
        <Input
          className={cls}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export function DynamicForm({
  schema,
  form,
  errors,
  set,
  // onSave,
  saving,
  onPublish,
  publishing,
  previewUrl,
  publicSlug,
  liveUrl,
  whatsappHref,
  projectId,
  compact,
  canSubmit,
  onPreview,
}: {
  schema: FormSchema;
  form: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  set: (k: string, v: unknown) => void;
  // onSave: () => void;
  saving: boolean;
  onPublish: () => void;
  publishing: boolean;
  previewUrl: string;
  publicSlug: string | null;
  liveUrl: string;
  whatsappHref: string;
  projectId: string | null;
  compact?: boolean;
  canSubmit: boolean;
  onPreview: () => void;
}) {
  const DISABLED_MESSAGE = "Za nastavak popunite formu";

  const handleCopyToClipboard = () => {
    if (publicSlug) {
      const url = liveUrl;
      navigator.clipboard.writeText(url).then(
        () => {
          toast.success(
            "Javna poveznica je kopirana u međuspremnik. Zalijepite je gdje želite podijeliti.",
          );
        },
        () => {
          toast.error("Kopiranje poveznice nije uspjelo.");
        },
      );
    }
  };

  return (
    <div className="space-y-6 rounded-lg border p-4 sm:p-6">
      {schema.title && <h2 className="text-lg font-semibold">{schema.title}</h2>}

      {schema.sections.map((sec, i) => (
        <div key={i} className="space-y-3">
          {sec.title && <h3 className="text-base font-medium">{sec.title}</h3>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sec.fields.map((f) => (
              <div key={f.name} className="space-y-1.5 md:col-span-1">
                <Label className="mb-1 text-sm">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </Label>
                <FieldControl
                  field={f}
                  value={form[f.name]}
                  onChange={(val) => set(f.name, val)}
                  error={errors[f.name]}
                  compact={!!compact}
                />
                {errors[f.name] && <p className="text-xs text-red-600">{errors[f.name]}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <TooltipProvider>
        <div className="flex flex-wrap gap-3">
          {/* <Button onClick={onSave} disabled={saving}>
          {saving ? "Spremanje…" : "Spremi skicu"}
        </Button> */}

          {!publicSlug && projectId && (
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    variant="default"
                    onClick={onPublish}
                    disabled={!canSubmit || publishing}
                  >
                    {publishing ? "Objavljivanje…" : "Objavi"}
                  </Button>
                </span>
              </TooltipTrigger>
              {!canSubmit && <TooltipContent>{DISABLED_MESSAGE}</TooltipContent>}
            </Tooltip>
          )}

          {previewUrl && (
            <Button variant="outline" asChild>
              <Link href={previewUrl} target="_blank" rel="noreferrer">
                Pregled
              </Link>
            </Button>
          )}

          {publicSlug && (
            <>
              <Button variant="outline" asChild>
                <Link href={liveUrl} target="_blank" rel="noreferrer">
                  Otvori javnu poveznicu
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyToClipboard}
                title="Kopiraj javnu poveznicu"
              >
                Kopiraj poveznicu
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  Podijeli putem WhatsAppa
                </a>
              </Button>
            </>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
