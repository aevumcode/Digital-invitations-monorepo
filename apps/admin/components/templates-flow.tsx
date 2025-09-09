"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import * as Yup from "yup";

import { TemplateSelectGrid } from "./template-select-grid";
import { TemplateCard, type TemplateLite } from "./template-card";
import FormPanel from "../components/forms/template-form";
import { templateSchema as schema } from "@/schemas/_template";

import {
  saveProjectAction,
  publishProjectAction,
  buildWhatsAppLink,
} from "@/data-access/actions/templates";

type Errors = Partial<Record<keyof Yup.InferType<typeof schema>, string>>;

export default function TemplatesFlow({
  userId,
  templates,
}: {
  userId: string;
  templates: TemplateLite[];
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    templates.length === 1 ? templates[0].id : null,
  );

  const [form, setForm] = useState({
    title: "",
    groomName: "",
    brideName: "",
    date: "",
    time: "",
    venue: "",
    city: "",
    message: "",
    heroImage: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const [saving, startSaving] = useTransition();
  const [publishing, startPublishing] = useTransition();

  const [projectId, setProjectId] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [publicSlug, setPublicSlug] = useState<string | null>(null);
  const [whatsappHref, setWhatsappHref] = useState<string>("#");

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || null;

  async function validateAll(): Promise<boolean> {
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const map: Errors = {};
      (e?.inner || []).forEach((err: Yup.ValidationError) => {
        if (err?.path && !map[err.path as keyof Errors])
          map[err.path as keyof Errors] = err.message;
      });
      setErrors(map);
      return false;
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // clear field error as user edits
    setErrors((old) => ({ ...old, [key]: undefined }));
  }

  async function onSave() {
    if (!userId || !selectedTemplate) return alert("Pick a template first.");
    const ok = await validateAll();
    if (!ok) return;

    startSaving(async () => {
      try {
        const result = await saveProjectAction({
          userId,
          templateId: selectedTemplate.id,
          title: form.title,
          config: {
            ...form,
            couple: `${form.groomName} & ${form.brideName}`,
          },
          projectId: projectId ?? undefined,
        });

        setProjectId(result.id);
        setPreviewSlug(result.slug);
        setPublicSlug(result.publicSlug ?? null);
      } catch (err) {
        console.error(err);
        alert("Failed to save project");
      }
    });
  }

  async function onPublish() {
    if (!projectId) return;
    startPublishing(async () => {
      try {
        const { publicSlug } = await publishProjectAction(projectId, userId);
        setPublicSlug(publicSlug);
      } catch (e) {
        console.error(e);
        alert("Failed to publish");
      }
    });
  }

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "");
  const previewUrl = previewSlug ? `${origin}/i/${previewSlug}` : "";
  const liveUrl = publicSlug ? `${origin}/v/${publicSlug}` : "";

  React.useEffect(() => {
    if (publicSlug) {
      buildWhatsAppLink(form.message, `${liveUrl}`).then((link) => setWhatsappHref(link));
    }
  }, [publicSlug, form.message, liveUrl]);

  // ---------- Layout ----------
  const oneTemplateOnly = templates.length === 1;
  const showSideBySide = oneTemplateOnly && !!selectedTemplate; // your requested rule

  const container = " w-full max-w-[1200px] px-2 md:px-4";

  return (
    <div className="space-y-10">
      {/* 1) Intro */}
      <div className={`${container} space-y-2`}>
        <h1 className="text-3xl font-semibold">Let’s get your invitation ready ✨</h1>
        <p className="text-muted-foreground">
          Pick one of your purchased templates, fill the details, preview, and publish.
        </p>
      </div>

      <div className="space-y-10 mx-auto w-full max-w-[1200px] px-2 md:px-4">
        <div className={`space-y-10 ${container}`}>
          {/* 2) Template selection (full-width on mobile) */}
          {!showSideBySide && (
            <TemplateSelectGrid
              templates={templates}
              selectedId={selectedTemplateId}
              onSelect={setSelectedTemplateId}
            />
          )}

          {/* 3) Side-by-side (only if there's one template total) */}
          {showSideBySide && selectedTemplate && (
            <div
              className="grid items-start justify-center gap-8
                  lg:grid-cols-[520px_minmax(520px,1fr)]"
            >
              {/* Left: poster, centered. Card itself is full-width on mobile, capped on lg+. */}
              <div className="flex justify-center">
                <TemplateCard
                  template={selectedTemplate}
                  selected
                  aspect="aspect-[3/4]"
                  size="sm"
                />
              </div>

              {/* Right: form, also capped and centered within its column */}
              <div className="mx-auto w-full max-w-[720px]">
                <FormPanel
                  form={form}
                  errors={errors}
                  set={set}
                  onSave={onSave}
                  saving={saving}
                  onPublish={onPublish}
                  publishing={publishing}
                  previewUrl={previewUrl}
                  publicSlug={publicSlug}
                  liveUrl={liveUrl}
                  whatsappHref={whatsappHref}
                  projectId={projectId}
                  compact
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4) Form (normal flow; grid above). Make the form full-width on mobile too. */}
      {!showSideBySide && selectedTemplate && (
        <div className={container}>
          <FormPanel
            form={form}
            errors={errors}
            set={set}
            onSave={onSave}
            saving={saving}
            onPublish={onPublish}
            publishing={publishing}
            previewUrl={previewUrl}
            publicSlug={publicSlug}
            liveUrl={liveUrl}
            whatsappHref={whatsappHref}
            projectId={projectId}
          />
        </div>
      )}
    </div>
  );
}
