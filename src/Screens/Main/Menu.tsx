import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { CircleAlert, Loader2, Plus, Store } from "lucide-react";
import clsx from "clsx";
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

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  image?: string;
  images?: string[];
  isAvailable?: boolean;
  stockQuantity?: number;
  requiresPrescription?: boolean;
  categoryId?: string;
  category?: {
    id?: string;
    name?: string;
  };
};

type MenuResponse =
  | MenuItem[]
  | {
      items?: MenuItem[];
      menuItems?: MenuItem[];
      products?: MenuItem[];
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
  isAvailable: boolean;
};

const EMPTY_FORM: MenuForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  stockQuantity: "",
  requiresPrescription: false,
  isAvailable: true,
};

const normalizeMenuItems = (data: MenuResponse): MenuItem[] => {
  if (Array.isArray(data)) return data;
  return data.items || data.menuItems || data.products || [];
};

const normalizeCategories = (data?: CategoryResponse | null): MenuCategory[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter((item) => Boolean(item?.id && item?.name));
  const values = data.categories || data.items || data.data || [];
  return values.filter((item) => Boolean(item?.id && item?.name));
};

const deriveCategoriesFromMenuItems = (items: MenuItem[]): MenuCategory[] => {
  const map = new Map<string, string>();

  items.forEach((item) => {
    const id = item.categoryId || item.category?.id;
    const name = item.category?.name;
    if (id && name && !map.has(id)) {
      map.set(id, name);
    }
  });

  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
};

const getMenuItemImage = (item: MenuItem) => {
  return item.imageUrl || item.image || item.images?.[0] || "/placeholder.png";
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const getMerchantType = (store?: MerchantStore) => {
  return String(store?.merchant?.merchantType || store?.restaurantType || "RESTAURANT")
    .toUpperCase()
    .trim();
};

const Menu = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedStoreId = searchParams.get("storeId") || "";
  const isMerchant = userData?.role === "restaurant" || userData?.role === "merchant";

  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [activeStoreId, setActiveStoreId] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingMenuItemId, setEditingMenuItemId] = useState("");
  const [editForm, setEditForm] = useState<MenuForm>(EMPTY_FORM);

  const activeStore = useMemo(
    () => stores.find((item) => item.id === activeStoreId),
    [stores, activeStoreId]
  );

  const merchantType = getMerchantType(activeStore);
  const isRestaurantStore = merchantType === "RESTAURANT";
  const isPharmacyStore = merchantType === "PHARMACY";
  const isStockBasedStore = isPharmacyStore || merchantType === "SUPERMARKET";

  const requestData = useCallback(
    async <T,>(
      path: string,
      options: RequestInit = {},
      requiresAuth = true
    ): Promise<T> => {
      const body =
        typeof options.body === "string"
          ? (JSON.parse(options.body) as Record<string, unknown>)
          : (options.body as Record<string, unknown> | undefined);

      return apiRequest<T>(path, {
        method: options.method || "GET",
        body,
        auth: requiresAuth,
      });
    },
    []
  );

  const loadCatalog = useCallback(
    async (storeId: string, currentStores: MerchantStore[]) => {
      if (!storeId) {
        setMenuItems([]);
        setMenuCategories([]);
        return;
      }

      const selectedStore = currentStores.find((item) => item.id === storeId);
      const selectedStoreType = getMerchantType(selectedStore);

      const menuData = await requestData<MenuResponse>(`/restaurants/${storeId}/menu`, {}, false);
      const normalizedMenuItems = normalizeMenuItems(menuData);
      setMenuItems(normalizedMenuItems);

      if (selectedStoreType !== "RESTAURANT") {
        setMenuCategories([]);
        return;
      }

      const categoriesData = await requestData<CategoryResponse>(
        `/restaurants/${storeId}/menu/categories`
      ).catch(() => null);

      const normalizedCategories = normalizeCategories(categoriesData);
      const derivedCategories = deriveCategoriesFromMenuItems(normalizedMenuItems);
      const resolvedCategories =
        normalizedCategories.length > 0
          ? normalizedCategories
          : derivedCategories;

      console.log("[Menu] Categories from backend", {
        storeId,
        selectedStoreType,
        categoriesData,
        normalizedCategories,
        derivedCategories,
        resolvedCategories,
      });

      setMenuCategories(resolvedCategories);
    },
    [requestData]
  );

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const storesData = await requestData<{
        restaurants?: MerchantStore[];
        stores?: MerchantStore[];
      }>("/restaurants/merchant/me");

      const merchantStores =
        storesData.restaurants || storesData.stores || ([] as MerchantStore[]);
      setStores(merchantStores);

      if (merchantStores.length === 0) {
        setActiveStoreId("");
        setMenuItems([]);
        setMenuCategories([]);
        return;
      }

      const hasRequestedStore = merchantStores.some((item) => item.id === requestedStoreId);
      const resolvedStoreId = hasRequestedStore ? requestedStoreId : merchantStores[0].id;
      setActiveStoreId(resolvedStoreId);
      await loadCatalog(resolvedStoreId, merchantStores);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [requestData, loadCatalog, requestedStoreId]);

  useEffect(() => {
    if (!isMerchant) return;
    loadInitialData();
  }, [isMerchant, loadInitialData]);

  const handleStoreSelection = async (storeId: string) => {
    setActiveStoreId(storeId);
    setEditingMenuItemId("");
    setEditForm(EMPTY_FORM);

    navigate(`/menu?storeId=${storeId}`, { replace: true });

    try {
      await loadCatalog(storeId, stores);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const openAddMenuPage = () => {
    const addPath = activeStoreId ? `/menu/add?storeId=${activeStoreId}` : "/menu/add";
    navigate(addPath);
  };

  const validateForm = (form: MenuForm) => {
    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name) {
      throw new Error("Product name is required");
    }

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Enter a valid price");
    }

    if (isRestaurantStore && !form.categoryId) {
      throw new Error("Select a category first");
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

  const startEditing = (item: MenuItem) => {
    setEditingMenuItemId(item.id);
    setEditForm({
      name: item.name || "",
      description: item.description || "",
      price: String(Number(item.price || 0)),
      categoryId: item.categoryId || item.category?.id || "",
      stockQuantity:
        typeof item.stockQuantity === "number" ? String(item.stockQuantity) : "",
      requiresPrescription: Boolean(item.requiresPrescription),
      isAvailable: Boolean(item.isAvailable ?? true),
    });
  };

  const cancelEditing = () => {
    setEditingMenuItemId("");
    setEditForm(EMPTY_FORM);
  };

  const handleUpdateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeStore || !editingMenuItemId) return;

    setSaving(true);
    try {
      const { name, description, price, stockQuantity } = validateForm(editForm);

      const payload: Record<string, unknown> = {
        name,
        description,
        price,
        isAvailable: editForm.isAvailable,
      };

      if (isRestaurantStore) {
        payload.categoryId = editForm.categoryId;
      }

      if (isPharmacyStore) {
        payload.requiresPrescription = editForm.requiresPrescription;
      }

      if (isStockBasedStore && stockQuantity !== null) {
        payload.stockQuantity = stockQuantity;
        if (stockQuantity === 0) {
          payload.isAvailable = false;
        }
      }

      await requestData(`/restaurants/${activeStore.id}/menu/${editingMenuItemId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success("Item updated");
      setEditingMenuItemId("");
      setEditForm(EMPTY_FORM);
      await loadCatalog(activeStore.id, stores);
    } catch (err) {
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
        <div className="bg-background border border-line rounded-xl p-4 flex items-center justify-between gap-3 md:flex-row flex-col">
          <div>
            <h1 className="text-xl font-sora font-semibold">Menu Management</h1>
            <p className="text-sm text-sub">
              Manage menu/product items for your store.
            </p>
          </div>

          <select
            className="h-10 rounded-lg border border-line bg-background_2 px-3 text-sm w-full md:w-auto"
            value={activeStoreId}
            onChange={(event) => handleStoreSelection(event.target.value)}
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="bg-background border border-line rounded-xl p-8 center flex-col gap-2 text-sub">
            <Loader2 className="animate-spin" size={20} />
            <p>Loading menu data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 flex items-start gap-2 text-sm">
            <CircleAlert size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && activeStore && (
          <div className="bg-background border border-line rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-primary" />
                <h3 className="font-sora font-semibold">Menu / Products</h3>
              </div>

              <button
                onClick={openAddMenuPage}
                className="h-9 px-3 rounded-lg bg-primary text-white text-xs flex items-center gap-2"
              >
                <Plus size={14} />
                Add Menu
              </button>
            </div>

            {menuItems.length === 0 && (
              <p className="text-sm text-sub">
                No menu/product items yet. Use the plus card below to add one.
              </p>
            )}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <button
                onClick={openAddMenuPage}
                className="border border-dashed border-line rounded-lg p-3 min-h-48 bg-background_2/40 hover:bg-background_2 transition flex flex-col items-center justify-center gap-2 text-sub"
              >
                <span className="h-10 w-10 rounded-full bg-primary text-white center">
                  <Plus size={18} />
                </span>
                <p className="text-sm font-medium text-main">Add New Item</p>
                <p className="text-xs">Open add menu page</p>
              </button>

              {menuItems.map((item) => (
                <div key={item.id} className="border border-line rounded-lg p-3 space-y-2">
                  <div className="w-full h-36 rounded-md overflow-hidden bg-background_2">
                    <img
                      src={getMenuItemImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-sub">
                        {item.category?.name || "Uncategorized"} •{" "}
                        {formatCurrency(item.price || 0)}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "text-xs px-2 py-1 rounded-full",
                        item.isAvailable
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {typeof item.stockQuantity === "number" && (
                    <p className="text-xs text-sub">Stock: {item.stockQuantity}</p>
                  )}

                  {editingMenuItemId === item.id ? (
                    <form onSubmit={handleUpdateItem} className="space-y-2">
                      <input
                        value={editForm.name}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full h-9 rounded-lg border border-line bg-background_2 px-3 text-sm"
                        placeholder="Product name"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(event) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                        className="w-full min-h-20 rounded-lg border border-line bg-background_2 px-3 py-2 text-sm"
                        placeholder="Description"
                      />

                      <div className="grid md:grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={1}
                          value={editForm.price}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, price: event.target.value }))
                          }
                          className="w-full h-9 rounded-lg border border-line bg-background_2 px-3 text-sm"
                          placeholder="Price"
                        />

                        {isRestaurantStore && menuCategories.length > 0 ? (
                          <select
                            value={editForm.categoryId}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                categoryId: event.target.value,
                              }))
                            }
                            className="w-full h-9 rounded-lg border border-line bg-background_2 px-3 text-sm"
                          >
                            <option value="">Select category</option>
                            {menuCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="h-9 rounded-lg border border-line bg-background_2 px-3 text-xs text-sub flex items-center">
                            {merchantType}
                          </div>
                        )}
                      </div>

                      {isStockBasedStore && (
                        <input
                          type="number"
                          min={0}
                          value={editForm.stockQuantity}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              stockQuantity: event.target.value,
                            }))
                          }
                          className="w-full h-9 rounded-lg border border-line bg-background_2 px-3 text-sm"
                          placeholder="Stock quantity"
                        />
                      )}

                      {isPharmacyStore && (
                        <label className="flex items-center gap-2 text-sm text-main">
                          <input
                            type="checkbox"
                            checked={editForm.requiresPrescription}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                requiresPrescription: event.target.checked,
                              }))
                            }
                          />
                          Requires prescription
                        </label>
                      )}

                      <label className="flex items-center gap-2 text-sm text-main">
                        <input
                          type="checkbox"
                          checked={editForm.isAvailable}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              isAvailable: event.target.checked,
                            }))
                          }
                        />
                        Available for ordering
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="h-9 px-3 rounded-lg bg-primary text-white text-xs"
                        >
                          {saving ? "Saving..." : "Save changes"}
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={cancelEditing}
                          className="h-9 px-3 rounded-lg bg-background_2 text-sub text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => startEditing(item)}
                      className="h-8 px-3 rounded-md text-xs bg-background_2 text-main"
                    >
                      Edit item
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default Menu;
