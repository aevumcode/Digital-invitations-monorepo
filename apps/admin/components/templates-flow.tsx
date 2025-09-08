// components/admin/templates-flow.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveProjectAction } from "@/data-access/actions/templates";
import { publishProjectAction } from "@/data-access/actions/templates";
import { buildWhatsAppLink } from "@/data-access/actions/templates";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";

type TemplateLite = {
  id: string;
  name: string;
  slug: string;
  previewUrl: string;
  priceCents: number;
};

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  groomName: Yup.string().required("Groom name is required"),
  brideName: Yup.string().required("Bride name is required"),
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
  venue: Yup.string().required("Venue is required"),
  city: Yup.string().required("City is required"),
  message: Yup.string().required("Message for WhatsApp is required"),
  heroImage: Yup.string().url().nullable(),
});

export default function TemplatesFlow({
  userId,
  templates,
}: {
  userId: string;
  templates: TemplateLite[];
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // simple unified form state (fits all templates for now)
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

  const [saving, startSaving] = useTransition();
  const [publishing, startPublishing] = useTransition();

  // after save
  const [projectId, setProjectId] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [publicSlug, setPublicSlug] = useState<string | null>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || null;

  async function onSave() {
    if (!userId || !selectedTemplate) return alert("Pick a template first.");

    try {
      await schema.validate({ ...form }, { abortEarly: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg = e?.errors?.[0] || "Invalid data";
      alert(msg);
      return;
    }

    startSaving(async () => {
      try {
        const result = await saveProjectAction({
          userId,
          templateId: selectedTemplate.id,
          title: form.title,
          config: {
            ...form,
            // keep a normalized payload your renderer can read
            couple: `${form.groomName} & ${form.brideName}`,
          },
          projectId: projectId ?? undefined,
        });

        setProjectId(result.id);
        setPreviewSlug(result.slug);
        setPublicSlug(result.publicSlug ?? null);
        // feedback…
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

  const [whatsappHref, setWhatsappHref] = useState<string>("#");

  React.useEffect(() => {
    // const baseUrl =
    //   process.env.NEXT_PUBLIC_APP_URL ||
    //   (process.env.NODE_ENV === "development"
    //     ? "http://localhost:3000"
    //     : "https://your-production-domain.com");
    if (publicSlug) {
      buildWhatsAppLink(form.message, `${liveUrl}`).then((link) => setWhatsappHref(link));
    }
  }, [publicSlug, form.message, liveUrl]);

  return (
    <div className="space-y-10">
      {/* 1) Welcome */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Let’s get your invitation ready ✨</h1>
        <p className="text-muted-foreground">
          Pick one of your purchased templates, fill the details, preview, and publish.
        </p>
      </div>

      {/* 2) Purchased templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((tpl) => {
          const selected = tpl.id === selectedTemplateId;
          return (
            <Card
              key={tpl.id}
              onClick={() => setSelectedTemplateId(tpl.id)}
              className={`cursor-pointer transition-shadow ${
                selected ? "ring-2 ring-purple-500" : "hover:shadow-md"
              }`}
            >
              <CardContent className="p-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                  {tpl.previewUrl ? (
                    <Image
                      src={tpl.previewUrl}
                      alt={tpl.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                  {selected && (
                    <div className="absolute right-2 top-2 rounded bg-purple-600 px-2 py-1 text-xs text-white">
                      Selected
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div className="font-medium">{tpl.name}</div>
                  <div className="text-xs text-muted-foreground">#{tpl.slug}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3) Form */}
      {selectedTemplate && (
        <div className="rounded-lg border p-4 md:p-6 space-y-6">
          <h2 className="text-lg font-semibold">Invitation details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ana & Marko Wedding"
              />
            </div>
            <div>
              <Label>Hero Image URL (optional)</Label>
              <Input
                value={form.heroImage}
                onChange={(e) => setForm((f) => ({ ...f, heroImage: e.target.value }))}
                placeholder="https://…"
              />
            </div>
            <div>
              <Label>Groom name</Label>
              <Input
                value={form.groomName}
                onChange={(e) => setForm((f) => ({ ...f, groomName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Bride name</Label>
              <Input
                value={form.brideName}
                onChange={(e) => setForm((f) => ({ ...f, brideName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                placeholder="2025-09-22"
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                placeholder="17:00"
              />
            </div>
            <div>
              <Label>Venue</Label>
              <Input
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                placeholder="Villa GrandPa Luka"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <Label>WhatsApp message</Label>
              <Input
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="We’re getting married! Join us…"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save draft"}
            </Button>

            {!publicSlug && projectId && (
              <Button onClick={onPublish} variant="secondary" disabled={publishing}>
                {publishing ? "Publishing…" : "Publish"}
              </Button>
            )}

            {previewSlug && (
              <Button variant="outline" asChild>
                <a href={previewUrl} target="_blank" rel="noreferrer">
                  Preview
                </a>
              </Button>
            )}

            {publicSlug && (
              <>
                <Button variant="outline" asChild>
                  <a href={liveUrl} target="_blank" rel="noreferrer">
                    Open live link
                  </a>
                </Button>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(liveUrl)}>
                  Copy live link
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    Share via WhatsApp
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
