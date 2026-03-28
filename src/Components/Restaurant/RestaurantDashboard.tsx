import {
  Building2,
  CircleAlert,
  Loader2,
  PartyPopper,
  Plus,
  ShieldEllipsis,
  Store,
} from "lucide-react";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RestaurantLayout } from "@/Layouts";
import { useAuth } from "@/Hooks";
import { apiRequest } from "@/Backend/api";
import CreateStoreModal, { type CreatedStore } from "./CreateStoreModal";

type MerchantStore = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  isOpen?: boolean;
  isBusy?: boolean;
  busyMessage?: string;
  merchant?: {
    merchantType?: string;
  };
  restaurantType?: string;
  avgPrepTime?: number;
};

type MerchantOrder = {
  id: string;
  status: string;
  total?: number;
  subtotal?: number;
  createdAt?: string;
  estimatedPrepTime?: number;
  cancelReason?: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
};

type OverviewStats = {
  period?: string;
  totalOrders?: number;
  deliveredOrders?: number;
  cancelledOrders?: number;
  completionRate?: number;
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const statusClass = (status?: string) => {
  if (status === "DELIVERED" || status === "COMPLETED") {
    return "bg-green-500/10 text-green-500";
  }
  if (status === "PREPARING" || status === "PROCESSING") {
    return "bg-yellow-500/10 text-yellow-500";
  }
  if (status === "READY_FOR_PICKUP") {
    return "bg-blue-500/10 text-blue-500";
  }
  if (status === "CANCELLED" || status === "FAILED") {
    return "bg-red-500/10 text-red-500";
  }

  return "bg-background_2 text-sub";
};

const RestaurantDashboard = () => {
  const { userData } = useAuth();
  const isVerified = userData?.isVerified;
  const merchantType =
    String(
      (userData?._raw as { merchant?: { merchantType?: string } })?.merchant
        ?.merchantType || "RESTAURANT"
    ).toUpperCase();

  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [activeStoreId, setActiveStoreId] = useState("");
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStoreUpdating, setIsStoreUpdating] = useState(false);
  const [mutatingOrderId, setMutatingOrderId] = useState("");

  const [showCreateStore, setShowCreateStore] = useState(false);
  const [showApprovalWelcome, setShowApprovalWelcome] = useState(false);

  const activeStore = useMemo(
    () => stores.find((item) => item.id === activeStoreId),
    [stores, activeStoreId]
  );

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

  const loadStoreOrders = useCallback(
    async (storeId: string) => {
      if (!storeId) {
        setOrders([]);
        return;
      }

      const ordersData = await requestData<{ orders?: MerchantOrder[] }>(
        `/orders/restaurant/${storeId}`
      );
      setOrders(ordersData.orders || []);
    },
    [requestData]
  );

  const loadDashboard = useCallback(async () => {
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
        setOrders([]);
        setOverview(null);
        // Show approval welcome popup if verified and no stores yet
        if (isVerified) {
          setShowApprovalWelcome(true);
        }
        return;
      }

      const overviewSettled = await Promise.allSettled(
        merchantStores.map((store) =>
          requestData<OverviewStats>(`/analytics/${store.id}/overview?period=7d`)
        )
      );

      const aggregatedOverview = overviewSettled.reduce<OverviewStats>(
        (acc, item) => {
          if (item.status !== "fulfilled") return acc;

          const value = item.value;
          acc.totalOrders = Number(acc.totalOrders || 0) + Number(value.totalOrders || 0);
          acc.deliveredOrders =
            Number(acc.deliveredOrders || 0) + Number(value.deliveredOrders || 0);
          acc.cancelledOrders =
            Number(acc.cancelledOrders || 0) + Number(value.cancelledOrders || 0);
          return acc;
        },
        {
          period: "7d",
          totalOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          completionRate: 0,
        }
      );

      const totalOrders = Number(aggregatedOverview.totalOrders || 0);
      const deliveredOrders = Number(aggregatedOverview.deliveredOrders || 0);
      aggregatedOverview.completionRate =
        totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

      setOverview(aggregatedOverview);

      const resolvedStoreId = merchantStores.some((item) => item.id === activeStoreId)
        ? activeStoreId
        : merchantStores[0].id;

      if (resolvedStoreId !== activeStoreId) {
        setActiveStoreId(resolvedStoreId);
      }

      await loadStoreOrders(resolvedStoreId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [requestData, activeStoreId, loadStoreOrders, isVerified]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const updateStoreInState = (storeId: string, updates: Partial<MerchantStore>) => {
    setStores((prev) =>
      prev.map((item) =>
        item.id === storeId
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );
  };

  const handleStoreSelection = async (storeId: string) => {
    setActiveStoreId(storeId);

    try {
      await loadStoreOrders(storeId);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleToggleOpen = async () => {
    if (!activeStore) return;

    setIsStoreUpdating(true);
    try {
      const nextOpenState = !activeStore.isOpen;
      await requestData(`/restaurants/${activeStore.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isOpen: nextOpenState }),
      });
      updateStoreInState(activeStore.id, { isOpen: nextOpenState });
      toast.success(`Store is now ${nextOpenState ? "open" : "closed"}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsStoreUpdating(false);
    }
  };

  const handleToggleBusy = async () => {
    if (!activeStore) return;

    setIsStoreUpdating(true);
    try {
      const nextBusyState = !activeStore.isBusy;
      const message = activeStore.busyMessage || "Restaurant is very busy right now";

      await requestData(`/restaurants/${activeStore.id}/busy`, {
        method: "PATCH",
        body: JSON.stringify({
          isBusy: nextBusyState,
          busyMessage: nextBusyState ? message : "",
        }),
      });

      updateStoreInState(activeStore.id, {
        isBusy: nextBusyState,
        busyMessage: nextBusyState ? message : "",
      });
      toast.success(nextBusyState ? "Busy mode enabled" : "Busy mode disabled");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsStoreUpdating(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    nextStatus: "PREPARING" | "READY_FOR_PICKUP" | "CANCELLED"
  ) => {
    setMutatingOrderId(orderId);

    try {
      const payload: {
        status: string;
        estimatedPrepTime?: number;
        cancelReason?: string;
      } = { status: nextStatus };

      if (nextStatus === "PREPARING") {
        const defaultPrep = String(activeStore?.avgPrepTime || 25);
        const input = window.prompt("Estimated prep time (minutes):", defaultPrep);
        if (!input) return;

        const prepMinutes = Number(input);
        if (!Number.isFinite(prepMinutes) || prepMinutes <= 0) {
          toast.error("Enter a valid prep time in minutes");
          return;
        }

        payload.estimatedPrepTime = prepMinutes;
      }

      if (nextStatus === "CANCELLED") {
        const reason = window.prompt(
          "Cancellation reason (required):",
          "Item out of stock"
        );

        if (!reason) {
          toast.error("Cancellation reason is required");
          return;
        }

        payload.cancelReason = reason;
      }

      await requestData(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success(`Order moved to ${nextStatus}`);
      await loadDashboard();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setMutatingOrderId("");
    }
  };

  const handleStoreCreated = async (store: CreatedStore) => {
    setShowApprovalWelcome(false);
    setShowCreateStore(false);
    // Reload dashboard to pick up the new store
    await loadDashboard();
    toast.success(`"${store.name}" is live! Now add your first menu item.`);
  };

  const merchantName = userData?.businessName || userData?.name;
  const merchantAddress = userData?.address || activeStore?.address || "-";
  const totalOrders = Number(overview?.totalOrders ?? 0);
  const deliveredOrders = Number(overview?.deliveredOrders ?? 0);
  const completionRate = Number(overview?.completionRate ?? 0);
  const pendingOrders = orders.filter((item) =>
    ["CONFIRMED", "PREPARING", "READY_FOR_PICKUP"].includes(item.status)
  );

  if (!isVerified) {
    return (
      <RestaurantLayout>
        <div className="md:w-[480px] w-full mx-auto mt-6 space-y-4">
          <div>
            <h2 className="text-lg font-sora font-semibold text-center">{merchantName}</h2>
            <p className="text-sub text-sm text-center">{merchantAddress}</p>
          </div>
          <div className="bg-background rounded-lg p-6 gap-4 flex items-center flex-col space-x-4">
            <div className="flex-shrink-0 center h-20 w-20 rounded-full bg-yellow-500/10">
              <ShieldEllipsis className="text-yellow-500" size={40} />
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-xl font-sora font-semibold">Merchant Verification</h2>
              <p className="text-sub text-sm mt-2">
                Your merchant account is still under review by the admin team.
              </p>
              <div className="center mt-4">
                <Loader2 className="animate-spin text-yellow-500" size={20} />
                <span className="ml-2 text-base text-main">Verification in progress...</span>
              </div>
            </div>
          </div>
        </div>
      </RestaurantLayout>
    );
  }

  return (
    <RestaurantLayout>
      <div className="py-6 space-y-4">
        <div className="bg-background border border-line rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg center bg-primary/10 text-primary">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-sora font-semibold">{merchantName}</h1>
              <p className="text-sm text-sub">{merchantAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
              Merchant
            </span>
            <button
              onClick={() => setShowCreateStore(true)}
              className="h-8 px-3 rounded-lg bg-primary text-white text-xs flex items-center gap-1.5"
            >
              <Plus size={13} />
              New Store
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={loadDashboard}
            className="text-xs px-3 h-8 rounded-lg bg-background_2 text-main"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <div className="bg-background border border-line rounded-xl p-8 center flex-col gap-2 text-sub">
            <Loader2 className="animate-spin" size={20} />
            <p>Loading merchant dashboard...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 flex items-start gap-2 text-sm">
            <CircleAlert size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* No stores CTA */}
            {stores.length === 0 && (
              <div className="bg-background border border-line rounded-xl p-8 flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 center">
                  <Store size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-sora font-semibold">No stores yet</h3>
                  <p className="text-sub text-sm mt-1">
                    Create your first store to start receiving orders.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateStore(true)}
                  className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create Your Store
                </button>
              </div>
            )}

            {stores.length > 0 && (
              <>
                <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
                  <StatCard label="Total Orders" value={String(totalOrders)} />
                  <StatCard label="Delivered" value={String(deliveredOrders)} />
                  <StatCard label="Completion" value={`${completionRate}%`} />
                  <StatCard label="Pending" value={String(pendingOrders.length)} />
                </div>

                <div className="bg-background border border-line rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between gap-3 md:flex-row flex-col">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Store size={18} className="text-primary" />
                      <h3 className="font-sora font-semibold">Store Controls</h3>
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

                  <div className="text-sm text-sub">
                    <p>{activeStore?.address || "No address"}</p>
                    <p>
                      {activeStore?.merchant?.merchantType || "RESTAURANT"}
                      {activeStore?.restaurantType ? ` • ${activeStore.restaurantType}` : ""}
                    </p>
                  </div>

                  <div className="flex md:flex-row flex-col gap-2">
                    <button
                      disabled={isStoreUpdating}
                      onClick={handleToggleOpen}
                      className={clsx(
                        "h-10 px-4 rounded-lg text-sm font-medium",
                        activeStore?.isOpen
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {isStoreUpdating
                        ? "Updating..."
                        : activeStore?.isOpen
                        ? "Set Offline"
                        : "Set Online"}
                    </button>
                    <button
                      disabled={isStoreUpdating}
                      onClick={handleToggleBusy}
                      className={clsx(
                        "h-10 px-4 rounded-lg text-sm font-medium",
                        activeStore?.isBusy
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-background_2 text-sub"
                      )}
                    >
                      {isStoreUpdating
                        ? "Updating..."
                        : activeStore?.isBusy
                        ? "Disable Busy Mode"
                        : "Enable Busy Mode"}
                    </button>
                  </div>

                  {activeStore?.isBusy && activeStore?.busyMessage && (
                    <p className="text-xs text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-lg">
                      {activeStore.busyMessage}
                    </p>
                  )}
                </div>

                <div className="bg-background border border-line rounded-xl p-4 space-y-3">
                  <h3 className="font-sora font-semibold">Order Queue</h3>
                  {pendingOrders.length === 0 && (
                    <p className="text-sm text-sub">No active orders right now.</p>
                  )}
                  {pendingOrders.slice(0, 10).map((order) => (
                    <div
                      key={order.id}
                      className="border border-line rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">#{order.id.slice(-8)}</p>
                          <p className="text-xs text-sub">
                            {order.user?.firstName || "Customer"} {order.user?.lastName || ""}
                          </p>
                        </div>
                        <span
                          className={clsx(
                            "text-xs px-2 py-1 rounded-full",
                            statusClass(order.status)
                          )}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="text-xs text-sub flex items-center justify-between gap-2">
                        <span>{formatCurrency(order.total || order.subtotal || 0)}</span>
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>

                      <div className="flex gap-2">
                        {order.status === "CONFIRMED" && (
                          <button
                            disabled={mutatingOrderId === order.id}
                            onClick={() => handleUpdateOrderStatus(order.id, "PREPARING")}
                            className="h-8 px-3 rounded-md text-xs bg-yellow-500/10 text-yellow-500"
                          >
                            {mutatingOrderId === order.id ? "Updating..." : "Mark PREPARING"}
                          </button>
                        )}

                        {order.status === "PREPARING" && (
                          <button
                            disabled={mutatingOrderId === order.id}
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, "READY_FOR_PICKUP")
                            }
                            className="h-8 px-3 rounded-md text-xs bg-blue-500/10 text-blue-500"
                          >
                            {mutatingOrderId === order.id
                              ? "Updating..."
                              : "Mark READY_FOR_PICKUP"}
                          </button>
                        )}

                        {["CONFIRMED", "PREPARING", "READY_FOR_PICKUP"].includes(
                          order.status
                        ) && (
                          <button
                            disabled={mutatingOrderId === order.id}
                            onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                            className="h-8 px-3 rounded-md text-xs bg-red-500/10 text-red-500"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Approval Welcome Popup */}
      {showApprovalWelcome && !showCreateStore && (
        <div className="fixed inset-0 z-50 center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowApprovalWelcome(false)}
          />
          <div className="relative bg-secondary border border-line rounded-2xl z-20 w-[90%] md:w-[440px] p-6 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-500/10 center">
              <PartyPopper size={30} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-sora font-semibold">You're Approved!</h2>
              <p className="text-sub text-sm mt-2">
                Your merchant account has been approved. Set up your{" "}
                {merchantType === "PHARMACY"
                  ? "pharmacy"
                  : merchantType === "SUPERMARKET"
                  ? "supermarket"
                  : "restaurant"}{" "}
                to start receiving orders on Lani.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => {
                  setShowApprovalWelcome(false);
                  setShowCreateStore(true);
                }}
                className="w-full h-11 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <Store size={16} />
                Create My Store
              </button>
              <button
                onClick={() => setShowApprovalWelcome(false)}
                className="w-full h-10 rounded-xl bg-background_2 text-sub text-sm"
              >
                I'll do this later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Store Modal */}
      <CreateStoreModal
        isOpen={showCreateStore}
        onClose={() => setShowCreateStore(false)}
        merchantType={merchantType}
        onCreated={handleStoreCreated}
      />
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-background border border-line rounded-xl p-3">
      <p className="text-xs text-sub">{label}</p>
      <p className="font-sora font-semibold text-sm md:text-base mt-1">{value}</p>
    </div>
  );
};
