import { useCallback, useEffect, useRef, useState } from "react";
import {
  Store,
  MapPin,
  Clock,
  ImagePlus,
  Loader2,
  CircleAlert,
  Pencil,
  TriangleAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Modal } from "@/Components/UI";
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

type StoreData = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  openingTime?: string;
  closingTime?: string;
  restaurantType?: string;
  avgPrepTime?: number;
  isOpen?: boolean;
  logoUrl?: string;
  coverUrl?: string;
  merchant?: { merchantType?: string };
};

type EditField =
  | "name"
  | "description"
  | "location"
  | "openingTime"
  | "avgPrepTime"
  | "restaurantType";

const fieldLabels: Record<EditField, string> = {
  name: "Store Name",
  description: "Description",
  location: "Location",
  openingTime: "Operating Hours",
  avgPrepTime: "Avg. Prep Time (min)",
  restaurantType: "Restaurant Type",
};

const getMerchantType = (store: StoreData) =>
  String(store.merchant?.merchantType || "RESTAURANT")
    .toUpperCase()
    .trim();

const isProfileIncomplete = (store: StoreData) =>
  !store.logoUrl || !store.coverUrl || !store.description;

// ── Image upload button ───────────────────────────────────────────────────────

const ImageUploadButton = ({
  label,
  src,
  storeId,
  type,
  onUploaded,
  className,
}: {
  label: string;
  src?: string;
  storeId: string;
  type: "logo" | "cover";
  onUploaded: (url: string) => void;
  className?: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const data = await apiRequest<{
        restaurant?: { logoUrl?: string; coverUrl?: string };
        store?: { logoUrl?: string; coverUrl?: string };
        data?: { restaurant?: { logoUrl?: string; coverUrl?: string } };
      }>(`/restaurants/${storeId}/${type}`, { method: "POST", body: fd });

      const updated =
        data.restaurant || data.store || data.data?.restaurant;
      const url = type === "logo" ? updated?.logoUrl : updated?.coverUrl;
      if (url) onUploaded(url);
      toast.success(`${type === "logo" ? "Logo" : "Cover photo"} updated`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <p className="text-xs text-sub">{label}</p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="relative w-full h-full rounded-xl border border-dashed border-line bg-background_2 overflow-hidden hover:border-primary/60 transition-colors disabled:opacity-60"
      >
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-sub">
            <ImagePlus size={18} className="text-primary/60" />
            <p className="text-xs">Click to upload</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 size={20} className="text-white animate-spin" />
          </div>
        )}
        {src && !uploading && (
          <div className="absolute bottom-1 right-1 bg-black/60 rounded-md p-1">
            <Pencil size={11} className="text-white" />
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
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ── Store card ────────────────────────────────────────────────────────────────

const StoreCard = ({
  initialStore,
  defaultExpanded,
}: {
  initialStore: StoreData;
  defaultExpanded: boolean;
}) => {
  const [store, setStore] = useState<StoreData>(initialStore);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [editField, setEditField] = useState<EditField | null>(null);
  const [saving, setSaving] = useState(false);

  // Individual edit state per field type
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editOpeningTime, setEditOpeningTime] = useState("");
  const [editClosingTime, setEditClosingTime] = useState("");
  const [editAvgPrepTime, setEditAvgPrepTime] = useState("");
  const [editRestaurantType, setEditRestaurantType] = useState("");

  const merchantType = getMerchantType(store);
  const isRestaurant = merchantType === "RESTAURANT";
  const incomplete = isProfileIncomplete(store);

  const openEdit = (field: EditField) => {
    switch (field) {
      case "name":
        setEditName(store.name || "");
        break;
      case "description":
        setEditDescription(store.description || "");
        break;
      case "location":
        setEditAddress(store.address || "");
        setEditCity(store.city || "");
        setEditState(store.state || "");
        break;
      case "openingTime":
        setEditOpeningTime(store.openingTime || "08:00");
        setEditClosingTime(store.closingTime || "22:00");
        break;
      case "avgPrepTime":
        setEditAvgPrepTime(store.avgPrepTime ? String(store.avgPrepTime) : "");
        break;
      case "restaurantType":
        setEditRestaurantType(store.restaurantType || "LOCAL");
        break;
    }
    setEditField(field);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editField) return;

    const payload: Record<string, unknown> = {};
    let storeUpdate: Partial<StoreData> = {};

    switch (editField) {
      case "name": {
        const v = editName.trim();
        if (!v) { toast.error("Store name is required"); return; }
        payload.name = v;
        storeUpdate = { name: v };
        break;
      }
      case "description": {
        const v = editDescription.trim();
        if (v.length > 500) { toast.error("Description must be under 500 characters"); return; }
        payload.description = v;
        storeUpdate = { description: v };
        break;
      }
      case "location": {
        const addr = editAddress.trim();
        const city = editCity.trim();
        const state = editState.trim();
        if (!addr) { toast.error("Address is required"); return; }
        if (!city) { toast.error("City is required"); return; }
        if (!state) { toast.error("State is required"); return; }
        payload.address = addr;
        payload.city = city;
        payload.state = state;
        storeUpdate = { address: addr, city, state };
        break;
      }
      case "openingTime": {
        if (!editOpeningTime) { toast.error("Opening time is required"); return; }
        if (!editClosingTime) { toast.error("Closing time is required"); return; }
        payload.openingTime = editOpeningTime;
        payload.closingTime = editClosingTime;
        storeUpdate = { openingTime: editOpeningTime, closingTime: editClosingTime };
        break;
      }
      case "avgPrepTime": {
        if (editAvgPrepTime) {
          const n = Number(editAvgPrepTime);
          if (!Number.isFinite(n) || n < 1 || n > 180) {
            toast.error("Prep time must be between 1 and 180 minutes");
            return;
          }
          payload.avgPrepTime = n;
          storeUpdate = { avgPrepTime: n };
        } else {
          payload.avgPrepTime = null;
          storeUpdate = { avgPrepTime: undefined };
        }
        break;
      }
      case "restaurantType": {
        payload.restaurantType = editRestaurantType;
        storeUpdate = { restaurantType: editRestaurantType };
        break;
      }
    }

    setSaving(true);
    try {
      await apiRequest(`/restaurants/${store.id}`, {
        method: "PATCH",
        body: payload,
      });
      setStore((prev) => ({ ...prev, ...storeUpdate }));
      toast.success(`${fieldLabels[editField]} updated`);
      setEditField(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const locationDisplay =
    [store.address, store.city, store.state].filter(Boolean).join(", ") ||
    "No address set";

  const hoursDisplay =
    store.openingTime && store.closingTime
      ? `${store.openingTime} – ${store.closingTime}`
      : "Not set";

  const rows: { field: EditField; icon: React.ReactNode; label: string; value: string }[] = [
    { field: "name", icon: <Store size={16} />, label: "Store Name", value: store.name },
    {
      field: "description",
      icon: <Pencil size={16} />,
      label: "Description",
      value: store.description || "No description",
    },
    { field: "location", icon: <MapPin size={16} />, label: "Location", value: locationDisplay },
    { field: "openingTime", icon: <Clock size={16} />, label: "Operating Hours", value: hoursDisplay },
    ...(isRestaurant
      ? [
          {
            field: "restaurantType" as EditField,
            icon: <Store size={16} />,
            label: "Restaurant Type",
            value: store.restaurantType?.replace(/_/g, " ") || "Not set",
          },
        ]
      : []),
    {
      field: "avgPrepTime",
      icon: <Clock size={16} />,
      label: "Avg. Prep Time",
      value: store.avgPrepTime ? `${store.avgPrepTime} min` : "Not set",
    },
  ];

  return (
    <>
      <div className="border border-line rounded-xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-background_2/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 center flex-shrink-0 overflow-hidden">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store size={18} className="text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-main">{store.name}</p>
              <p className="text-xs text-sub">{store.city || store.address || merchantType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {incomplete && (
              <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full hidden sm:flex items-center gap-1">
                <TriangleAlert size={11} />
                Incomplete
              </span>
            )}
            {expanded ? (
              <ChevronUp size={16} className="text-sub" />
            ) : (
              <ChevronDown size={16} className="text-sub" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-line px-4 pt-4 pb-4 space-y-4">
                {/* Incomplete banner */}
                {incomplete && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-xs text-amber-600">
                    <TriangleAlert size={13} className="mt-0.5 flex-shrink-0" />
                    <span>
                      Complete your store profile — add a logo, cover photo, and description
                      so customers can find and trust you.
                    </span>
                  </div>
                )}

                {/* Cover + logo side by side */}
                <div className="flex gap-3">
                  <ImageUploadButton
                    label="Logo"
                    src={store.logoUrl}
                    storeId={store.id}
                    type="logo"
                    onUploaded={(url) => setStore((p) => ({ ...p, logoUrl: url }))}
                    className="w-[90px] h-[90px] flex-shrink-0"
                  />
                  <ImageUploadButton
                    label="Cover Photo"
                    src={store.coverUrl}
                    storeId={store.id}
                    type="cover"
                    onUploaded={(url) => setStore((p) => ({ ...p, coverUrl: url }))}
                    className="flex-1 h-[90px]"
                  />
                </div>

                {/* Editable rows */}
                <div className="space-y-3">
                  {rows.map(({ field, icon, label, value }) => (
                    <div key={field} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 flex-shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-sub">{label}</p>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-main truncate">{value}</p>
                          <button
                            onClick={() => openEdit(field)}
                            className="text-xs text-primary font-medium font-sora hover:underline flex-shrink-0"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editField && (
          <Modal
            title={fieldLabels[editField]}
            isOpen={!!editField}
            toggleModal={() => !saving && setEditField(null)}
          >
            <form onSubmit={handleSave} className="space-y-4">

              {editField === "name" && (
                <div className="space-y-1">
                  <label className="text-xs text-sub">Store Name *</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    placeholder="e.g. Mama Emeka Kitchen"
                    autoFocus
                  />
                </div>
              )}

              {editField === "description" && (
                <div className="space-y-1">
                  <label className="text-xs text-sub">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full min-h-[100px] rounded-lg border border-line bg-background_2 px-3 py-2 text-sm resize-none"
                    placeholder="Describe your store…"
                    maxLength={500}
                    autoFocus
                  />
                  <p className="text-xs text-sub text-right">{editDescription.length}/500</p>
                </div>
              )}

              {editField === "location" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Street Address *</label>
                    <input
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                      placeholder="12 Broad Street"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-sub">City *</label>
                      <input
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                        placeholder="Lagos"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-sub">State *</label>
                      <input
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                        placeholder="Lagos"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editField === "openingTime" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Opening time *</label>
                    <input
                      type="time"
                      value={editOpeningTime}
                      onChange={(e) => setEditOpeningTime(e.target.value)}
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Closing time *</label>
                    <input
                      type="time"
                      value={editClosingTime}
                      onChange={(e) => setEditClosingTime(e.target.value)}
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    />
                  </div>
                </div>
              )}

              {editField === "restaurantType" && (
                <div className="space-y-1">
                  <label className="text-xs text-sub">Restaurant Type *</label>
                  <select
                    value={editRestaurantType}
                    onChange={(e) => setEditRestaurantType(e.target.value)}
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

              {editField === "avgPrepTime" && (
                <div className="space-y-1">
                  <label className="text-xs text-sub">Avg. Prep Time (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={editAvgPrepTime}
                    onChange={(e) => setEditAvgPrepTime(e.target.value)}
                    className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                    placeholder="e.g. 25"
                    autoFocus
                  />
                  <p className="text-xs text-sub">Leave blank to clear</p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditField(null)}
                  className="h-10 px-4 rounded-lg bg-background_2 text-sub text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Parent ────────────────────────────────────────────────────────────────────

const StoreInformation = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<{
        restaurants?: StoreData[];
        stores?: StoreData[];
      }>("/restaurants/merchant/me");
      setStores(data.restaurants || data.stores || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  return (
    <div className="bg-background border border-line rounded-xl overflow-hidden">
      <div className="p-4 border-b border-line flex items-center justify-between gap-3">
        <h3 className="font-medium font-sora text-main">My Stores</h3>
        {!loading && stores.length > 0 && (
          <span className="text-xs text-sub bg-background_2 px-2 py-0.5 rounded-full">
            {stores.length} {stores.length === 1 ? "store" : "stores"}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {loading && (
          <div className="flex items-center gap-2 text-sub text-sm py-2">
            <Loader2 size={16} className="animate-spin" />
            Loading stores…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 text-red-500 text-sm">
            <CircleAlert size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && stores.length === 0 && (
          <p className="text-sm text-sub py-2">
            No stores yet. Create one from your dashboard.
          </p>
        )}

        {!loading &&
          !error &&
          stores.map((store, i) => (
            <StoreCard
              key={store.id}
              initialStore={store}
              defaultExpanded={i === 0}
            />
          ))}
      </div>
    </div>
  );
};

export default StoreInformation;
