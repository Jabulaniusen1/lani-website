import { NotificationContext } from "@/Context/NotificationContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/Hooks";
import { io, Socket } from "socket.io-client";
import { apiRequest, getApiBaseUrl } from "@/Backend/api";

const toSocketBaseUrl = () => {
  const envUrl = import.meta.env.VITE_LANIEATS_SOCKET_URL as string | undefined;
  if (envUrl) return envUrl;

  const apiUrl = getApiBaseUrl();
  return apiUrl.replace(/\/api\/v\d+\/?$/, "");
};

const createNotificationDocument = (
  notification: Notifications,
  id: string
): Models.Document => {
  const now = new Date().toISOString();

  return {
    $id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    $createdAt: now,
    $updatedAt: now,
    notificationId: id,
    type: notification.type,
    content: notification.content,
    title: notification.title,
    path: notification.path || "/",
    activity: notification.activity,
    isRead: notification.isRead ?? false,
  };
};

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const [notifications, setNotifications] = useState<Models.Document[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUnreadCount(notifications.filter((item) => !item.isRead).length);
  }, [notifications]);

  const pushNotification = useCallback(
    (notification: Notifications) => {
      if (!userData?.$id) return;

      setNotifications((prev) => [
        createNotificationDocument(notification, userData.$id),
        ...prev,
      ]);
    },
    [userData?.$id]
  );

  const createNotifications = useCallback(
    async (notification: Notifications, _id: string) => {
      pushNotification(notification);
    },
    [pushNotification]
  );

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
          $updatedAt: new Date().toISOString(),
        }))
      );
      toast.success("All notifications marked as read");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.$id === notificationId
          ? {
              ...item,
              isRead: true,
              $updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  useEffect(() => {
    if (!userData?.$id) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setNotifications([]);
      return;
    }

    const socket = io(toSocketBaseUrl(), {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    if (userData.role === "customer") {
      socket.emit("join_customer_room", userData.$id);
    }

    if (userData.role === "rider") {
      socket.emit("join_rider_room", userData.riderId || userData.$id);
    }

    if (userData.role === "restaurant") {
      apiRequest<{ stores?: Array<{ id: string }>; restaurants?: Array<{ id: string }> }>(
        "/restaurants/merchant/me"
      )
        .then((data) => {
          const stores = data.stores || data.restaurants || [];
          if (stores[0]?.id) {
            socket.emit("join_merchant_room", stores[0].id);
          }
        })
        .catch(() => {
          // noop
        });
    }

    socket.on("order_status_updated", (payload: Record<string, any>) => {
      pushNotification({
        type: "order",
        title: "Order Status Updated",
        content: `Order ${payload.orderId || ""} is now ${payload.status || "updated"}`,
        path: payload.orderId,
      });
    });

    socket.on("order_confirmed", (payload: Record<string, any>) => {
      pushNotification({
        type: "success",
        title: "Order Confirmed",
        content: payload.message || "A new order payment was confirmed",
        path: payload.orderId,
      });
    });

    socket.on("rider_assigned", (payload: Record<string, any>) => {
      pushNotification({
        type: "order",
        title: "Rider Assigned",
        content: payload.message || "A rider has been assigned",
        path: payload.orderId,
      });
    });

    socket.on("delivery_available", (payload: Record<string, any>) => {
      pushNotification({
        type: "system",
        title: "Delivery Available",
        content:
          payload.restaurantName
            ? `A delivery is available from ${payload.restaurantName}`
            : "A new delivery is available",
        path: payload.orderId,
      });
    });

    socket.on("delivery_code_issued", (payload: Record<string, any>) => {
      pushNotification({
        type: "alert",
        title: "Delivery Code Issued",
        content: payload.message || `Your delivery code is ${payload.deliveryCode || ""}`,
        path: payload.orderId,
      });
    });

    socket.on("order_cancelled", (payload: Record<string, any>) => {
      pushNotification({
        type: "alert",
        title: "Order Cancelled",
        content: payload.message || payload.cancelReason || "An order was cancelled",
        path: payload.orderId,
      });
    });

    socket.on("rider_location_updated", (payload: Record<string, any>) => {
      pushNotification({
        type: "system",
        title: "Rider Location Updated",
        content: `Rider location changed for order ${payload.orderId || ""}`,
        path: payload.orderId,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [pushNotification, userData?.$id, userData?.role, userData?.riderId]);

  const contextValue: NotificationContextType = useMemo(
    () => ({
      createNotifications,
      markAllAsRead,
      notifications,
      unreadCount,
      isLoading,
      markAsRead,
    }),
    [createNotifications, notifications, unreadCount, isLoading]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
