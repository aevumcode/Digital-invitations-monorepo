/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState, useTransition, useMemo, useEffect } from "react";
import * as Yup from "yup";
import { TemplateSelectGrid } from "./template-select-grid";
import { TemplateCard } from "./template-card";
import {
  saveUserTemplateConfigAction,
  publishUserTemplateAction,
  buildWhatsAppLink,
  unpublishUserTemplateAction,
} from "@/data-access/actions/templates";

import type { PurchaseLiteDB } from "@/types/_template";
import type { PurchaseUI } from "@/types/_purchase";
import { getTemplateById } from "@/constants/template-data";
import { EmptyPurchases } from "./empty-purchases";

import { getFormSchemaForTemplate, wrapFieldsForSave } from "@/constants/form-schemas";
import {
  DynamicForm,
  buildInitialFromSchema,
  buildYupFromSchema,
} from "@/components/forms/dynamic-forms";
import { toast } from "sonner";

function mapPurchasesToUI(purchases: PurchaseLiteDB[]): PurchaseUI[] {
  return purchases.map((p) => {
    const meta = getTemplateById(p.templateId);
    return {
      id: p.id,
      template: {
        id: p.templateId,
        name: meta?.name ?? `Template #${p.templateId}`,
        previewUrl: meta?.previewUrl ?? "/placeholder.png",
        slug: meta?.slug ?? null,
      },
      customData: (p.customData as Record<string, unknown> | null) ?? null,
      publicSlug: p.publicSlug ?? null,
      previewSlug: p.previewSlug ?? null,
      isActive: p.isActive,
      numberOfGuests: p.numberOfGuests ?? 0,
    };
  });
}

type Props = { userId: number; purchases: PurchaseLiteDB[] };
type Errors = Record<string, string | undefined>;

export default function TemplatesFlow({ userId, purchases }: Props) {
  const resolvedPurchases = useMemo(() => mapPurchasesToUI(purchases), [purchases]);

  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    resolvedPurchases.length === 1 ? resolvedPurchases[0].id : null,
  );
  const selectedPurchase = useMemo(
    () => resolvedPurchases.find((p) => p.id === selectedPurchaseId) ?? null,
    [resolvedPurchases, selectedPurchaseId],
  );
  const selectedTemplate = selectedPurchase?.template ?? null;

  // Schema per template
  const schema = useMemo(
    () => (selectedTemplate ? getFormSchemaForTemplate(selectedTemplate.id) : { sections: [] }),
    [selectedTemplate?.id],
  );

  // Initial from DB JSON
  const initial = useMemo(() => {
    const raw = (selectedPurchase?.customData ?? {}) as any;
    const prefill = raw?.fields ?? raw ?? {};
    return buildInitialFromSchema(schema as any, prefill);
  }, [schema, selectedPurchase?.customData]);

  const [form, setForm] = useState<Record<string, unknown>>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, startSaving] = useTransition();
  const [publishing, startPublishing] = useTransition();

  useEffect(() => {
    setForm(initial);
    setErrors({});
  }, [initial]);

  // Yup & live validity
  const yupSchema = useMemo(() => buildYupFromSchema(schema as any), [schema]);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    let mounted = true;
    // validate reactively (async)
    (async () => {
      try {
        const ok = await yupSchema.isValid(form, { abortEarly: true });
        if (mounted) setCanSubmit(!!ok);
      } catch {
        if (mounted) setCanSubmit(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [form, yupSchema]);

  async function validateAll(): Promise<boolean> {
    try {
      await yupSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (e) {
      const map: Errors = {};
      (e as any)?.inner?.forEach((err: Yup.ValidationError) => {
        if (err?.path && !map[err.path]) map[err.path] = err.message;
      });
      setErrors(map);
      return false;
    }
  }

  function set<K extends string>(key: K, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
  }

  // origin + URLs
  const [origin, setOrigin] = useState<string>("");
  useEffect(() => setOrigin(window.location.origin), []);
  const previewUrl = origin && selectedPurchase ? `${origin}/preview/${selectedPurchase.id}` : "";

  const publicLink = selectedPurchase ? `${origin}/public/${selectedPurchase.id}` : "";

  const [whatsappHref, setWhatsappHref] = useState("#");
  useEffect(() => {
    if (publicLink && origin) {
      const msg = typeof form.message === "string" ? form.message : "";
      buildWhatsAppLink(msg, publicLink).then((link) => setWhatsappHref(link));
    } else {
      setWhatsappHref("#");
    }
  }, [form.message, publicLink, origin]);

  // save blob helper
  async function saveCurrentState() {
    if (!userId || !selectedPurchase || !selectedTemplate) throw new Error("Missing context");
    const payload = wrapFieldsForSave(selectedTemplate.id, form);
    await saveUserTemplateConfigAction({
      userId,
      userTemplateId: selectedPurchase.id,
      title:
        (typeof form.title === "string" && form.title) ||
        selectedTemplate?.name ||
        "Moja pozivnica",
      config: payload,
    });
  }

  // PREVIEW: validate -> save -> open
  async function onPreview() {
    if (!selectedPurchase) return;
    const ok = await validateAll();
    if (!ok) return;
    startSaving(async () => {
      try {
        await saveCurrentState();
        window.open(previewUrl, "_blank", "noopener,noreferrer");
      } catch (err) {
        console.error(err);
        alert("Nije moguće otvoriti pregled. Pokušajte ponovno.");
      }
    });
  }

  // PUBLISH: validate -> save -> publish
  async function onPublish() {
    if (!selectedPurchase) return;
    const ok = await validateAll();
    if (!ok) return;
    startPublishing(async () => {
      try {
        await saveCurrentState();
        const { publicKey } = await publishUserTemplateAction(selectedPurchase.id, userId);
      } catch (e) {
        console.error(e);
        alert("Objava nije uspjela. Pokušajte ponovno.");
      }
    });
  }

  async function onUnpublish() {
    if (!selectedPurchase) return;
    startPublishing(async () => {
      try {
        await unpublishUserTemplateAction(selectedPurchase.id, userId);
        toast.success("Objava ugašena.");
      } catch (e) {
        console.error(e);
        toast.error("Neuspješno gašenje objave.");
      }
    });
  }

  const onePurchaseOnly = resolvedPurchases.length === 1;
  const showSideBySide = onePurchaseOnly && !!selectedPurchase && !!selectedTemplate;
  const container = "w-full max-w-[1200px] px-2 md:px-4 mx-auto";

  if (!resolvedPurchases.length) {
    return (
      <div className="w-full max-w-[900px] mx-auto px-4">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-semibold">Pripremimo vašu digitalnu pozivnicu ✨</h1>
          <p className="text-muted-foreground">
            Za početak, odaberite i kupite predložak u našoj trgovini.
          </p>
        </div>
        <EmptyPurchases />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div
        className={`${container} flex flex-col md:flex-row md:items-center md:justify-between gap-2`}
      >
        {/* Left side: title + subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Pripremimo vašu digitalnu pozivnicu ✨</h1>
          <p className="text-muted-foreground">
            Odaberite jedan od kupljenih predložaka, ispunite detalje, pregledajte i objavite.
          </p>
        </div>

        {/* Right side: status badge */}
        <div>
          <span
            className={`
        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
        ${
          selectedPurchase?.isActive
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
        }
      `}
          >
            {selectedPurchase?.isActive ? "Aktivan" : "Neaktivan"}
          </span>
        </div>
      </div>

      <div className={`${container} space-y-10`}>
        {!showSideBySide && (
          <TemplateSelectGrid
            purchases={resolvedPurchases}
            selectedId={selectedPurchaseId}
            onSelect={setSelectedPurchaseId}
          />
        )}

        {showSideBySide && selectedPurchase && selectedTemplate && (
          <div className="grid items-start md:justify-center gap-8 lg:grid-cols-[520px_minmax(520px,1fr)]">
            <div className="flex justify-center">
              <TemplateCard template={selectedTemplate} selected aspect="aspect-[3/4]" size="sm" />
            </div>

            <div className="mx-auto w-full max-w-[720px]">
              <DynamicForm
                schema={schema as any}
                form={form}
                errors={errors}
                set={(k, v) => set(k, v)}
                // onSave={onSave} // hidden for now
                saving={saving}
                onPublish={onPublish}
                onUnpublish={onUnpublish}
                publishing={publishing}
                previewUrl={previewUrl}
                publicSlug={publicLink}
                liveUrl={publicLink}
                isActive={!!selectedPurchase.isActive}
                whatsappHref={whatsappHref}
                projectId={selectedPurchase?.id ?? null}
                compact
                canSubmit={canSubmit} // ← NEW
                onPreview={onPreview} // ← NEW
              />
            </div>
          </div>
        )}
      </div>

      {!showSideBySide && selectedPurchase && selectedTemplate && (
        <div className={container}>
          <DynamicForm
            schema={schema as any}
            form={form}
            errors={errors}
            set={(k, v) => set(k, v)}
            // onSave={onSave}
            saving={saving}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            publishing={publishing}
            previewUrl={previewUrl}
            publicSlug={publicLink}
            liveUrl={publicLink}
            isActive={!!selectedPurchase.isActive}
            whatsappHref={whatsappHref}
            projectId={selectedPurchase?.id ?? null}
            canSubmit={canSubmit}
            onPreview={onPreview}
          />
        </div>
      )}
    </div>
  );
}
