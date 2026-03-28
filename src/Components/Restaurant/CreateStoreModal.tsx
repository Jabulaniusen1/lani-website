import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Store,
  Clock,
  CheckCircle2,
  Loader2,
  ImagePlus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/Backend/api";

const RESTAURANT_TYPES = [
  "FAST_FOOD",
  "LOCAL",
  "CONTINENTAL",
  "PIZZA",
  "GRILL",
  "BAKERY",
  "CAFE",
  "CHINESE",
  "SEAFOOD",
  "VEGETARIAN",
] as const;

export type CreatedStore = { id: string; name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  merchantType: string;
  onCreated: (store: CreatedStore) => void;
};

type Step1Form = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
};

type Step2Form = {
  openingTime: string;
  closingTime: string;
  restaurantType: string;
  avgPrepTime: string;
};

const STEP1_EMPTY: Step1Form = {
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
};

const STEP2_EMPTY: Step2Form = {
  openingTime: "08:00",
  closingTime: "22:00",
  restaurantType: "LOCAL",
  avgPrepTime: "",
};

const storePlaceholders: Record<string, { name: string; description: string }> = {
  PHARMACY: {
    name: "e.g. HealthPlus Pharmacy",
    description: "Trusted pharmacy offering quality medicines and healthcare products",
  },
  SUPERMARKET: {
    name: "e.g. FreshMart Supermarket",
    description: "Your one-stop shop for fresh produce, groceries and household essentials",
  },
  RESTAURANT: {
    name: "e.g. Mama Emeka Kitchen",
    description: "Authentic Nigerian cuisine delivered fresh to your door",
  },
};

const TOTAL_STEPS = 3;

const stepTitles = ["Store Details", "Operating Hours", "Add Profile Photos"];

const ImageUploadBox = ({
  label,
  hint,
  preview,
  onFile,
  aspectClass,
}: {
  label: string;
  hint: string;
  preview: string | null;
  onFile: (file: File) => void;
  aspectClass: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1">
      <p className="text-xs text-sub">{label}</p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`relative w-full ${aspectClass} rounded-xl border-2 border-dashed border-line bg-background_2 overflow-hidden hover:border-primary/50 transition-colors`}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-sub">
            <ImagePlus size={20} className="text-primary/60" />
            <p className="text-xs">{hint}</p>
          </div>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
};

const CreateStoreModal = ({ isOpen, onClose, merchantType, onCreated }: Props) => {
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1Form>(STEP1_EMPTY);
  const [step2, setStep2] = useState<Step2Form>(STEP2_EMPTY);
  const [saving, setSaving] = useState(false);

  // Step 3
  const [createdStore, setCreatedStore] = useState<CreatedStore | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const isRestaurant = merchantType === "RESTAURANT";
  const ph = storePlaceholders[merchantType] || storePlaceholders.RESTAURANT;

  const validateStep1 = () => {
    if (!step1.name.trim()) throw new Error("Store name is required");
    if (!step1.address.trim()) throw new Error("Address is required");
    if (!step1.city.trim()) throw new Error("City is required");
    if (!step1.state.trim()) throw new Error("State is required");
    if (step1.description.length > 500)
      throw new Error("Description must be under 500 characters");
  };

  const validateStep2 = () => {
    if (!step2.openingTime) throw new Error("Opening time is required");
    if (!step2.closingTime) throw new Error("Closing time is required");
    if (isRestaurant && !step2.restaurantType)
      throw new Error("Restaurant type is required");
    if (step2.avgPrepTime) {
      const n = Number(step2.avgPrepTime);
      if (!Number.isFinite(n) || n < 1 || n > 180)
        throw new Error("Prep time must be between 1 and 180 minutes");
    }
  };

  const goNext = () => {
    try {
      validateStep1();
      setStep(2);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleCreateStore = async () => {
    try {
      validateStep2();
    } catch (err) {
      toast.error((err as Error).message);
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: step1.name.trim(),
        description: step1.description.trim(),
        address: step1.address.trim(),
        city: step1.city.trim(),
        state: step1.state.trim(),
        openingTime: step2.openingTime,
        closingTime: step2.closingTime,
      };

      if (isRestaurant) payload.restaurantType = step2.restaurantType;
      if (step2.avgPrepTime) payload.avgPrepTime = Number(step2.avgPrepTime);

      const data = await apiRequest<{
        restaurant?: CreatedStore;
        store?: CreatedStore;
        data?: { restaurant?: CreatedStore; store?: CreatedStore };
      }>("/restaurants", { method: "POST", body: payload });

      const created =
        data.restaurant || data.store || data.data?.restaurant || data.data?.store;

      if (!created?.id) throw new Error("Store created but response is missing store ID");

      setCreatedStore(created);
      setStep(3); // advance to profile photo step
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (type: "logo" | "cover", file: File) => {
    const url = URL.createObjectURL(file);
    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(url);
    } else {
      setCoverFile(file);
      setCoverPreview(url);
    }
  };

  const handleFinishSetup = async () => {
    if (!createdStore) return;

    setUploadingImages(true);
    try {
      const uploads: Promise<unknown>[] = [];

      if (logoFile) {
        const fd = new FormData();
        fd.append("image", logoFile);
        uploads.push(
          apiRequest(`/restaurants/${createdStore.id}/logo`, {
            method: "POST",
            body: fd,
          })
        );
      }

      if (coverFile) {
        const fd = new FormData();
        fd.append("image", coverFile);
        uploads.push(
          apiRequest(`/restaurants/${createdStore.id}/cover`, {
            method: "POST",
            body: fd,
          })
        );
      }

      await Promise.all(uploads);
      toast.success("Store profile photos saved!");
    } catch {
      toast.error("Photos could not be saved — you can upload them later in Profile.");
    } finally {
      setUploadingImages(false);
      finishAndClose();
    }
  };

  const finishAndClose = () => {
    const store = createdStore;
    resetState();
    if (store) onCreated(store);
  };

  const resetState = () => {
    setStep(1);
    setStep1(STEP1_EMPTY);
    setStep2(STEP2_EMPTY);
    setCreatedStore(null);
    setLogoFile(null);
    setCoverFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setLogoPreview(null);
    setCoverPreview(null);
    onClose();
  };

  const handleClose = () => {
    if (saving || uploadingImages) return;
    // If already on step 3 (store was created), treat close as "skip"
    if (step === 3 && createdStore) {
      finishAndClose();
      return;
    }
    resetState();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative bg-secondary border border-line rounded-2xl z-20 w-[90%] md:w-[520px] max-h-[90dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-secondary flex items-center justify-between px-4 py-3 border-b border-line z-10">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                disabled={saving}
                className="h-8 w-8 center rounded-lg bg-background_2 text-sub"
              >
                <ArrowLeft size={14} />
              </button>
            )}
            <Store size={16} className="text-primary" />
            <h3 className="text-sm font-sora font-semibold">{stepTitles[step - 1]}</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s ? "w-6 bg-primary" : "w-3 bg-line"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleClose}
              disabled={saving || uploadingImages}
              className="h-8 w-8 center rounded-full bg-background"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Store Details ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs text-sub">Store name *</label>
                  <input
                    value={step1.name}
                    onChange={(e) => setStep1((p) => ({ ...p, name: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    placeholder={ph.name}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-sub">Description</label>
                  <textarea
                    value={step1.description}
                    onChange={(e) =>
                      setStep1((p) => ({ ...p, description: e.target.value }))
                    }
                    className="w-full min-h-[80px] rounded-lg border border-line bg-background_2 px-3 py-2 text-sm resize-none"
                    placeholder={ph.description}
                    maxLength={500}
                  />
                  <p className="text-xs text-sub text-right">
                    {step1.description.length}/500
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-sub">Address *</label>
                  <input
                    value={step1.address}
                    onChange={(e) =>
                      setStep1((p) => ({ ...p, address: e.target.value }))
                    }
                    className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    placeholder="12 Broad Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-sub">City *</label>
                    <input
                      value={step1.city}
                      onChange={(e) =>
                        setStep1((p) => ({ ...p, city: e.target.value }))
                      }
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                      placeholder="Lagos"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-sub">State *</label>
                    <input
                      value={step1.state}
                      onChange={(e) =>
                        setStep1((p) => ({ ...p, state: e.target.value }))
                      }
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                      placeholder="Lagos"
                    />
                  </div>
                </div>

                <button
                  onClick={goNext}
                  className="w-full h-10 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 mt-2"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── Step 2: Operating Hours ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background_2 text-sm text-sub">
                  <Clock size={15} className="text-primary flex-shrink-0" />
                  <span>When is your store open for orders?</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Opening time *</label>
                    <input
                      type="time"
                      value={step2.openingTime}
                      onChange={(e) =>
                        setStep2((p) => ({ ...p, openingTime: e.target.value }))
                      }
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Closing time *</label>
                    <input
                      type="time"
                      value={step2.closingTime}
                      onChange={(e) =>
                        setStep2((p) => ({ ...p, closingTime: e.target.value }))
                      }
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    />
                  </div>
                </div>

                {isRestaurant && (
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Restaurant type *</label>
                    <select
                      value={step2.restaurantType}
                      onChange={(e) =>
                        setStep2((p) => ({ ...p, restaurantType: e.target.value }))
                      }
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    >
                      {RESTAURANT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-sub">
                    Avg. prep time (minutes){" "}
                    <span className="opacity-60">— optional</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={step2.avgPrepTime}
                    onChange={(e) =>
                      setStep2((p) => ({ ...p, avgPrepTime: e.target.value }))
                    }
                    className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    placeholder="e.g. 25"
                  />
                </div>

                <button
                  onClick={handleCreateStore}
                  disabled={saving}
                  className="w-full h-10 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating store...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      Create Store
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* ── Step 3: Profile Photos ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-sm text-green-600">
                  <CheckCircle2 size={15} className="flex-shrink-0" />
                  <span>
                    <strong>{createdStore?.name}</strong> created! Now let customers
                    recognise your store.
                  </span>
                </div>

                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-background_2 text-xs text-sub">
                  <Sparkles size={13} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Stores with a logo and cover photo get up to 3× more customer clicks.
                    Both are optional — you can add them later in Profile.
                  </span>
                </div>

                {/* Logo */}
                <ImageUploadBox
                  label="Store Logo"
                  hint="Tap to upload logo (square works best)"
                  preview={logoPreview}
                  onFile={(f) => handleFileChange("logo", f)}
                  aspectClass="aspect-square max-w-[140px]"
                />

                {/* Cover */}
                <ImageUploadBox
                  label="Cover Photo"
                  hint="Tap to upload cover banner"
                  preview={coverPreview}
                  onFile={(f) => handleFileChange("cover", f)}
                  aspectClass="aspect-[16/5]"
                />

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleFinishSetup}
                    disabled={uploadingImages}
                    className="w-full h-10 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Finish Setup"
                    )}
                  </button>
                  <button
                    onClick={finishAndClose}
                    disabled={uploadingImages}
                    className="w-full h-9 rounded-xl bg-background_2 text-sub text-sm"
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateStoreModal;
