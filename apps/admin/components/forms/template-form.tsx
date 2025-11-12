import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function ReqLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <Label htmlFor={htmlFor} className="mb-1 inline-flex items-center gap-1 text-sm">
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

// ---------- Form Panel (extracted) ----------
type PanelProps = {
  form: {
    title: string;
    groomName: string;
    brideName: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    message: string;
    heroImage: string;
  };
  errors: Partial<Record<string, string>>;
  set: <K extends keyof PanelProps["form"]>(key: K, v: PanelProps["form"][K]) => void;
  onSave: () => void;
  saving: boolean;
  onPublish: () => void;
  publishing: boolean;
  previewUrl: string;
  publicSlug: string | null;
  liveUrl: string;
  whatsappHref: string;
  projectId: string | null;
  compact?: boolean;
};

function FormPanel({
  form,
  errors,
  set,
  onSave,
  saving,
  onPublish,
  publishing,
  previewUrl,
  publicSlug,
  liveUrl,
  whatsappHref,
  projectId,
  compact,
}: PanelProps) {
  const inputClass = `w-full ${compact ? "h-9 text-sm" : "h-10"} rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400`;
  const groupClass = "space-y-1.5";
  return (
    <div className="space-y-6 rounded-lg border p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Detalji pozivnice</h2>

      {/* Mobile spacing improved, labels spaced from inputs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={groupClass}>
          <ReqLabel>Naziv projekta</ReqLabel>
          <Input
            className={`${inputClass} ${errors.title ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Vjenčanje Ane i Marka"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className={groupClass}>
          <Label className="mb-1 text-sm">URL naslovne slike (opcionalno)</Label>
          <Input
            className={`${inputClass} ${errors.heroImage ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.heroImage}
            onChange={(e) => set("heroImage", e.target.value)}
            placeholder="https://…"
          />
          {errors.heroImage && <p className="text-xs text-red-600">{errors.heroImage}</p>}
        </div>

        <div className={groupClass}>
          <ReqLabel>Ime mladoženje</ReqLabel>
          <Input
            className={`${inputClass} ${errors.groomName ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.groomName}
            onChange={(e) => set("groomName", e.target.value)}
            placeholder="Marko"
          />
          {errors.groomName && <p className="text-xs text-red-600">{errors.groomName}</p>}
        </div>

        <div className={groupClass}>
          <ReqLabel>Ime mladenke</ReqLabel>
          <Input
            className={`${inputClass} ${errors.brideName ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.brideName}
            onChange={(e) => set("brideName", e.target.value)}
            placeholder="Ana"
          />
          {errors.brideName && <p className="text-xs text-red-600">{errors.brideName}</p>}
        </div>

        <div className={groupClass}>
          <ReqLabel>Datum</ReqLabel>
          <Input
            className={`${inputClass} ${errors.date ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
        </div>

        <div className={groupClass}>
          <ReqLabel>Vrijeme</ReqLabel>
          <Input
            className={`${inputClass} ${errors.time ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
            placeholder="HH:mm"
          />
          {errors.time && <p className="text-xs text-red-600">{errors.time}</p>}
        </div>

        <div className={groupClass}>
          <ReqLabel>Lokacija</ReqLabel>
          <Input
            className={`${inputClass} ${errors.venue ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.venue}
            onChange={(e) => set("venue", e.target.value)}
            placeholder="Villa Dalmacija"
          />
          {errors.venue && <p className="text-xs text-red-600">{errors.venue}</p>}
        </div>

        <div className={groupClass}>
          <ReqLabel>Grad</ReqLabel>
          <Input
            className={`${inputClass} ${errors.city ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Split"
          />
          {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
        </div>

        <div className={`md:col-span-2 ${groupClass}`}>
          <ReqLabel>WhatsApp poruka</ReqLabel>
          <Input
            className={`${inputClass} ${errors.message ? "border-red-400 focus:ring-red-400" : "border-gray-300"}`}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Vjenčamo se! Pridružite nam se…"
          />
          {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Spremanje…" : "Spremi skicu"}
        </Button>

        {!publicSlug && projectId && (
          <Button onClick={onPublish} variant="secondary" disabled={publishing}>
            {publishing ? "Objavljivanje…" : "Objavi"}
          </Button>
        )}

        {previewUrl && (
          <Button variant="outline" asChild>
            <a href={previewUrl} target="_blank" rel="noreferrer">
              Pregled
            </a>
          </Button>
        )}

        {publicSlug && (
          <>
            <Button variant="outline" asChild>
              <a href={liveUrl} target="_blank" rel="noreferrer">
                Otvori javnu poveznicu
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(liveUrl)}
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
    </div>
  );
}

export default FormPanel;
