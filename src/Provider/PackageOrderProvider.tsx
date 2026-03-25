import { PackageOrderContext } from "../Context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/Hooks";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/Backend/api";

type ApiOrder = Record<string, any>;

type ApiDelivery = Record<string, any>;

const DEFAULT_RESTAURANT_ID = import.meta.env.VITE_DEFAULT_RESTAURANT_ID;
const DEFAULT_ADDRESS_ID = import.meta.env.VITE_DEFAULT_ADDRESS_ID;
const DEFAULT_MENU_ITEM_ID = import.meta.env.VITE_DEFAULT_MENU_ITEM_ID;

const toLegacyStatus = (status?: string) => {
  const normalized = String(status || "").toUpperCase();

  if (["DELIVERED"].includes(normalized)) return "delivered";
  if (["CANCELLED", "FAILED"].includes(normalized)) return "cancelled";
  if (["PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "PICKED_UP"].includes(normalized)) {
    return "in transit";
  }

  return "pending";
};

const normalizeName = (input: Record<string, any> | undefined) => {
  if (!input) return "Customer";
  if (input.name) return String(input.name);

  const firstName = input.firstName || "";
  const lastName = input.lastName || "";
  return `${firstName} ${lastName}`.trim() || "Customer";
};

const mapApiOrderToLegacy = (order: ApiOrder, options?: { deliveryId?: string }) => {
  const firstItem = Array.isArray(order.items) ? order.items[0] : undefined;
  const menuItem = firstItem?.menuItem || firstItem?.item || firstItem;
  const restaurant = order.restaurant || {};
  const address = order.address || {};
  const rider = order.rider || order.delivery?.rider || {};
  const customer = order.user || order.customer || {};

  const createdAt =
    order.createdAt ||
    order.$createdAt ||
    order.updatedAt ||
    new Date().toISOString();

  const trackingId =
    order.trackingId ||
    order.reference ||
    `lani-${String(order.id || options?.deliveryId || Date.now()).slice(-6).toUpperCase()}`;

  return {
    $id: String(options?.deliveryId || order.id || order._id || trackingId),
    $createdAt: createdAt,
    $updatedAt: order.updatedAt || createdAt,
    trackingId,
    customerId: String(order.userId || customer.id || customer.userId || ""),
    riderId: String(order.delivery?.riderId || rider.id || ""),
    city: restaurant.city || address.city || "",
    status: toLegacyStatus(order.status || order.delivery?.status),
    rawStatus: order.status || order.delivery?.status || "PENDING",
    paymentStatus: order.paymentStatus || "PENDING",
    price: Number(order.total || order.subtotal || 0),
    subtotal: Number(order.subtotal || 0),
    deliveryFee: Number(order.deliveryFee || 0),
    serviceCharge: Number(order.serviceCharge || 0),
    pickupAddress: restaurant.address || "",
    pickupLandmark: restaurant.address || "",
    deliveryAddress:
      address.fullAddress ||
      address.address ||
      address.street ||
      address.addressLine ||
      "",
    deliveryLandmark:
      address.fullAddress ||
      address.address ||
      address.street ||
      address.addressLine ||
      "",
    notes: order.note || "",
    time: new Date(createdAt).toLocaleTimeString(),
    scheduledDate: new Date(createdAt).toISOString().split("T")[0],
    receiverName: normalizeName(customer),
    receiverPhone: String(customer.phone || ""),
    packageName:
      menuItem?.name ||
      restaurant.name ||
      `Order ${String(order.id || "").slice(-6)}`,
    packageTexture:
      menuItem?.category?.name ||
      restaurant.merchant?.merchantType ||
      "Food",
    packageImage: menuItem?.imageUrl || menuItem?.image || "/placeholder.png",
    senderName: restaurant.name || "Store",
    senderPhone: String(restaurant.phone || ""),
    senderEmail: String(restaurant.email || ""),
    riderName: normalizeName(rider),
    riderPhone: String(rider.phone || ""),
    isPaid: String(order.paymentStatus || "").toUpperCase() === "PAID",
    deliveryId: String(options?.deliveryId || order.delivery?.id || ""),
    _raw: order,
  } satisfies Models.Document;
};

const mapApiDeliveryToLegacy = (delivery: ApiDelivery) => {
  const sourceOrder = delivery.order || delivery;
  const mapped = mapApiOrderToLegacy(sourceOrder, {
    deliveryId: String(delivery.id || sourceOrder.delivery?.id || sourceOrder.id),
  });

  return {
    ...mapped,
    rawStatus: sourceOrder.status || delivery.status || mapped.rawStatus,
    status: toLegacyStatus(sourceOrder.status || delivery.status),
    deliveryId: String(delivery.id || mapped.deliveryId || mapped.$id),
    riderId: String(delivery.riderId || mapped.riderId || ""),
  };
};

const mergeUnique = (items: Models.Document[]) => {
  const map = new Map<string, Models.Document>();
  items.forEach((item) => {
    map.set(item.$id, item);
  });

  return Array.from(map.values()).sort(
    (a, b) =>
      Number(new Date(b.$createdAt || b.$updatedAt)) -
      Number(new Date(a.$createdAt || a.$updatedAt))
  );
};

const PackageOrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Models.Document[]>([]);
  const [parcels, setParcels] = useState<Models.Document[]>([]);
  const [allOrders, setAllOrders] = useState<Models.Document[]>([]);

  const fetchMerchantStoreOrders = useCallback(async () => {
    const storesData = await apiRequest<{ stores?: ApiOrder[]; restaurants?: ApiOrder[] }>(
      "/restaurants/merchant/me"
    );

    const stores = storesData.stores || storesData.restaurants || [];
    if (stores.length === 0) {
      return [] as Models.Document[];
    }

    const ordersByStore = await Promise.all(
      stores.map((store) =>
        apiRequest<{ orders?: ApiOrder[] }>(`/orders/restaurant/${store.id}`).catch(() => ({
          orders: [],
        }))
      )
    );

    const mappedOrders = ordersByStore
      .flatMap((item) => item.orders || [])
      .map((order) => mapApiOrderToLegacy(order));

    return mergeUnique(mappedOrders);
  }, []);

  const loadOrders = useCallback(async () => {
    if (!userData?.role) {
      setOrders([]);
      setParcels([]);
      setAllOrders([]);
      return;
    }

    setLoading(true);

    try {
      if (userData.role === "customer") {
        const data = await apiRequest<{ orders?: ApiOrder[] }>("/orders/my");
        const mapped = (data.orders || []).map((order) => mapApiOrderToLegacy(order));

        setOrders(mapped);
        setParcels(mapped);
        setAllOrders([]);
        return;
      }

      if (userData.role === "rider") {
        const [myData, availableData] = await Promise.all([
          apiRequest<{ deliveries?: ApiDelivery[] }>("/rider/deliveries/my"),
          apiRequest<{ deliveries?: ApiDelivery[] }>("/rider/deliveries/available"),
        ]);

        const myOrders = (myData.deliveries || []).map((delivery) =>
          mapApiDeliveryToLegacy(delivery)
        );
        const availableOrders = (availableData.deliveries || []).map((delivery) =>
          mapApiDeliveryToLegacy(delivery)
        );

        setOrders(myOrders);
        setAllOrders(availableOrders);
        setParcels(mergeUnique([...myOrders, ...availableOrders]));
        return;
      }

      if (userData.role === "admin") {
        const data = await apiRequest<{ orders?: ApiOrder[] }>(
          "/admin/orders?page=1&limit=200"
        );

        const mapped = (data.orders || []).map((order) => mapApiOrderToLegacy(order));
        setOrders(mapped);
        setParcels(mapped);
        setAllOrders([]);
        return;
      }

      if (userData.role === "restaurant") {
        const merchantOrders = await fetchMerchantStoreOrders();
        setOrders(merchantOrders);
        setParcels(merchantOrders);
        setAllOrders([]);
        return;
      }

      setOrders([]);
      setParcels([]);
      setAllOrders([]);
    } catch (error) {
      setOrders([]);
      setParcels([]);
      setAllOrders([]);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchMerchantStoreOrders, userData?.role, userData?.$id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = async (
    packageDetails: PackageDetails,
    deliveryDetails: DeliveryDetails,
    _pickupDetails: PickupDetails,
    _price: number,
    _isPaid: boolean
  ) => {
    setLoading(true);

    try {
      if (!DEFAULT_RESTAURANT_ID || !DEFAULT_ADDRESS_ID || !DEFAULT_MENU_ITEM_ID) {
        throw new Error(
          "Missing order defaults. Set VITE_DEFAULT_RESTAURANT_ID, VITE_DEFAULT_ADDRESS_ID, and VITE_DEFAULT_MENU_ITEM_ID in .env"
        );
      }

      const data = await apiRequest<{ order: ApiOrder }>("/orders", {
        method: "POST",
        body: {
          restaurantId: DEFAULT_RESTAURANT_ID,
          addressId: DEFAULT_ADDRESS_ID,
          note: `${packageDetails.name || "Order"} - ${packageDetails.notes || deliveryDetails.deliveryLocation || ""}`.trim(),
          items: [
            {
              menuItemId: DEFAULT_MENU_ITEM_ID,
              quantity: 1,
            },
          ],
        },
      });

      const mapped = mapApiOrderToLegacy(data.order);
      await loadOrders();
      navigate(`/orders/${mapped.trackingId}`, { state: { order: mapped } });
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    setLoading(true);

    try {
      await apiRequest(`/rider/deliveries/${orderId}/accept`, {
        method: "PATCH",
      });
      toast.success("Delivery accepted successfully");
      await loadOrders();
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (order: Models.Document) => {
    setLoading(true);

    try {
      const deliveryId = order.deliveryId || order.$id;
      const confirmationCode = window.prompt(
        "Enter customer confirmation code",
        ""
      );

      if (!confirmationCode) {
        throw new Error("Confirmation code is required");
      }

      const data = await apiRequest<{ delivery?: ApiDelivery }>(
        `/rider/deliveries/${deliveryId}/status`,
        {
          method: "PATCH",
          body: {
            status: "DELIVERED",
            confirmationCode,
          },
        }
      );

      toast.success("Delivery marked successfully");
      await loadOrders();

      if (data.delivery) {
        return mapApiDeliveryToLegacy(data.delivery);
      }

      return {
        ...order,
        status: "delivered",
        rawStatus: "DELIVERED",
      } as Models.Document;
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markPaymentAsReceived = async (order: Models.Document) => {
    toast.info("Payment status is managed by the API payment flow");
    return order;
  };

  const value: PackageOrderContextType = useMemo(
    () => ({
      orders,
      createOrder,
      loading,
      allOrders,
      acceptOrder,
      markAsDelivered,
      markPaymentAsReceived,
      parcels,
    }),
    [orders, loading, allOrders, parcels]
  );

  return (
    <PackageOrderContext.Provider value={value}>
      {children}
    </PackageOrderContext.Provider>
  );
};

export default PackageOrderProvider;
