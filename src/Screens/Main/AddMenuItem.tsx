import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CircleAlert, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { RestaurantLayout } from "@/Layouts";
import { useAuth } from "@/Hooks";
import { apiRequest } from "@/Backend/api";

type MerchantStore = {
  id: string;
  name: string;
  merchant?: {
    merchantType?: string;
  };
  restaurantType?: string;
};

type MenuCategory = {
  id: string;
  name: string;
};

type CategoryResponse =
  | MenuCategory[]
  | {
      categories?: MenuCategory[];
      items?: MenuCategory[];
      data?: MenuCategory[];
    };

type MenuForm = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  stockQuantity: string;
  requiresPrescription: boolean;
};

type CreateMenuItemResponse = {
  id?: string;
  item?: { id?: string };
  menuItem?: { id?: string };
  product?: { id?: string };
};

const EMPTY_FORM: MenuForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  stockQuantity: "",
  requiresPrescription: false,
};

const normalizeCategories = (data?: CategoryResponse | null): MenuCategory[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter((item) => Boolean(item?.id && item?.name));
  const values = data.categories || data.items || data.data || [];
  return values.filter((item) => Boolean(item?.id && item?.name));
};

const getMerchantType = (store?: MerchantStore) => {
  return String(store?.merchant?.merchantType || store?.restaurantType || "RESTAURANT")
    .toUpperCase()
    .trim();
};

const getCreatedItemId = (payload?: CreateMenuItemResponse) => {
  return String(
    payload?.id || payload?.item?.id || payload?.menuItem?.id || payload?.product?.id || ""
  ).trim();
};

const AddMenuItem = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedStoreId = searchParams.get("storeId") || "";
  const isMerchant = userData?.role === "restaurant" || userData?.role === "merchant";

  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [activeStoreId, setActiveStoreId] = useState("");
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [form, setForm] = useState<MenuForm>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activeStore = useMemo(
    () => stores.find((item) => item.id === activeStoreId),
    [stores, activeStoreId]
  );

  const merchantType = getMerchantType(activeStore);
  const isPharmacyStore = merchantType === "PHARMACY";
  const isStockBasedStore = isPharmacyStore || merchantType === "SUPERMARKET";

  const canCreateInStore = menuCategories.length > 0;
  const canEnterCreateDetails = Boolean(form.categoryId);

  const goBackToMenu = () => {
    const menuPath = activeStoreId ? `/menu?storeId=${activeStoreId}` : "/menu";
    navigate(menuPath);
  };

  const loadStoreCategories = useCallback(
    async (storeId: string, currentStores: MerchantStore[]) => {
      if (!storeId) {
        setMenuCategories([]);
        return;
      }

      const selectedStore = currentStores.find((item) => item.id === storeId);
      const selectedStoreType = getMerchantType(selectedStore);

      const categoriesData = await apiRequest<CategoryResponse>(
        `/restaurants/${storeId}/menu/categories`
      ).catch(() => null);

      const normalizedCategories = normalizeCategories(categoriesData);
      const resolvedCategories = normalizedCategories;

      console.log("[AddMenuItem] Categories from backend", {
        storeId,
        selectedStoreType,
        categoriesData,
        normalizedCategories,
        resolvedCategories,
      });

      setMenuCategories(resolvedCategories);
    },
    []
  );

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const storesData = await apiRequest<{
        restaurants?: MerchantStore[];
        stores?: MerchantStore[];
      }>("/restaurants/merchant/me");

      const merchantStores =
        storesData.restaurants || storesData.stores || ([] as MerchantStore[]);
      setStores(merchantStores);

      if (merchantStores.length === 0) {
        setActiveStoreId("");
        setMenuCategories([]);
        return;
      }

      const hasRequestedStore = merchantStores.some((item) => item.id === requestedStoreId);
      const resolvedStoreId = hasRequestedStore ? requestedStoreId : merchantStores[0].id;
      setActiveStoreId(resolvedStoreId);
      await loadStoreCategories(resolvedStoreId, merchantStores);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [requestedStoreId, loadStoreCategories]);

  useEffect(() => {
    if (!isMerchant) return;
    loadInitialData();
  }, [isMerchant, loadInitialData]);

  const handleStoreSelection = async (storeId: string) => {
    setActiveStoreId(storeId);
    setForm((prev) => ({ ...prev, categoryId: "" }));
    setImageFile(null);

    try {
      await loadStoreCategories(storeId, stores);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const validateForm = () => {
    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name) {
      throw new Error("Product name is required");
    }

    if (!description) {
      throw new Error("Description is required");
    }

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Enter a valid price");
    }

    if (!form.categoryId) {
      throw new Error("Select a category");
    }

    if (!imageFile) {
      throw new Error("Upload an item image");
    }

    let stockQuantity: number | null = null;
    if (isStockBasedStore) {
      stockQuantity = Number(form.stockQuantity);
      if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
        throw new Error("Enter a valid stock quantity");
      }
    }

    return { name, description, price, stockQuantity };
  };

  const handleCreateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeStore) return;

    setSaving(true);
    let createdItemId = "";

    try {
      const { name, description, price, stockQuantity } = validateForm();

      const payload: Record<string, unknown> = {
        name,
        description,
        price,
        categoryId: form.categoryId,
      };

      if (isPharmacyStore) {
        payload.requiresPrescription = form.requiresPrescription;
      }

      if (isStockBasedStore && stockQuantity !== null) {
        payload.stockQuantity = stockQuantity;
      }

      const createdItem = await apiRequest<CreateMenuItemResponse>(
        `/restaurants/${activeStore.id}/menu`,
        {
          method: "POST",
          body: payload,
        }
      );

      createdItemId = getCreatedItemId(createdItem);
      if (!createdItemId) {
        throw new Error("Item created but image upload could not start");
      }

      const formData = new FormData();
      formData.append("image", imageFile as Blob);

      await apiRequest(`/restaurants/${activeStore.id}/menu/${createdItemId}/image`, {
        method: "POST",
        body: formData,
      });

      toast.success("Item added to menu");
      goBackToMenu();
    } catch (err) {
      if (createdItemId) {
        await apiRequest(`/restaurants/${activeStore.id}/menu/${createdItemId}`, {
          method: "DELETE",
        }).catch(() => null);
      }

      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!isMerchant) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <RestaurantLayout>
      <div className="py-6 space-y-4">
        <div className="bg-background border border-line rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={goBackToMenu}
              className="h-9 px-3 rounded-lg bg-background_2 text-sub text-xs flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back to Menu
            </button>
          </div>

          <div>
            <h1 className="text-xl font-sora font-semibold">Add Menu Item</h1>
            <p className="text-sm text-sub">
              Fill in the item details and save to your store catalog.
            </p>
          </div>
        </div>

        {loading && (
          <div className="bg-background border border-line rounded-xl p-8 center flex-col gap-2 text-sub">
            <Loader2 className="animate-spin" size={20} />
            <p>Loading store details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 flex items-start gap-2 text-sm">
            <CircleAlert size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && stores.length === 0 && (
          <div className="bg-background border border-line rounded-xl p-8 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 center">
              <Store size={28} className="text-primary" />
            </div>
            <div>
              <h3 className="font-sora font-semibold">No stores found</h3>
              <p className="text-sub text-sm mt-1">
                You need to create a store before you can add menu items.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-medium"
            >
              Go to Dashboard to Create Store
            </button>
          </div>
        )}

        {!loading && !error && activeStore && (
          <div className="bg-background border border-line rounded-xl p-4 space-y-3">
            <form onSubmit={handleCreateItem} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-sub">Store</label>
                <select
                  value={activeStoreId}
                  onChange={(event) => handleStoreSelection(event.target.value)}
                  className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-sub">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      categoryId: event.target.value,
                    }))
                  }
                  className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                >
                  <option value="">Select category</option>
                  {menuCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!canCreateInStore && (
                  <p className="text-xs text-yellow-500">
                    No categories found for this store. Add categories first.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-sub">Item image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm file:mr-3 file:border-0 file:bg-primary file:text-white file:px-3 file:py-1.5 file:rounded-md"
                />
                {imageFile && <p className="text-xs text-sub">Selected: {imageFile.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-sub">Item name</label>
                <input
                  disabled={!canCreateInStore || !canEnterCreateDetails}
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm disabled:opacity-50"
                  placeholder="Item name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-sub">Description</label>
                <textarea
                  disabled={!canCreateInStore || !canEnterCreateDetails}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="w-full min-h-20 rounded-lg border border-line bg-background_2 px-3 py-2 text-sm disabled:opacity-50"
                  placeholder="Description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-sub">Price (NGN)</label>
                  <input
                    disabled={!canCreateInStore || !canEnterCreateDetails}
                    type="number"
                    min={1}
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, price: event.target.value }))
                    }
                    className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm disabled:opacity-50"
                    placeholder="Price"
                  />
                </div>

                {isStockBasedStore && (
                  <div className="space-y-1">
                    <label className="text-xs text-sub">Stock quantity</label>
                    <input
                      disabled={!canCreateInStore || !canEnterCreateDetails}
                      type="number"
                      min={0}
                      value={form.stockQuantity}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          stockQuantity: event.target.value,
                        }))
                      }
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm disabled:opacity-50"
                      placeholder="Stock quantity"
                    />
                  </div>
                )}
              </div>

              {isPharmacyStore && (
                <label className="flex items-center gap-2 text-sm text-main">
                  <input
                    type="checkbox"
                    checked={form.requiresPrescription}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        requiresPrescription: event.target.checked,
                      }))
                    }
                  />
                  Requires prescription
                </label>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={saving || !canCreateInStore || !canEnterCreateDetails}
                  className="h-10 px-4 rounded-lg bg-primary text-white text-sm"
                >
                  {saving ? "Saving..." : "Add Item"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={goBackToMenu}
                  className="h-10 px-4 rounded-lg bg-background_2 text-sub text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default AddMenuItem;
