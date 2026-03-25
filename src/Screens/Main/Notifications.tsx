import { useNotifications, usePackageOrder } from "@/Hooks";
import { MainLayout } from "@/Layouts";
import { notificationStyles } from "@/Utils/helpers";
import { Loader } from "lucide-react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formatTimestamp from "@/Utils/formatTimestamp";

const Notifications = () => {
  const {orders} = usePackageOrder()
  const {notifications, unreadCount, isLoading, markAllAsRead, markAsRead} = useNotifications()
 const navigate = useNavigate()
  const handleNotificationClick = (notification: Models.Document) => {
    if(markAsRead){
      markAsRead(notification?.$id)
    } 

    if (notification?.path && notification?.path !== '/') {
      const order = orders.find((order) => order?.trackingId === notification?.path)
      if(order){
        navigate(`/orders/${order?.$id}`, {state: {order}})
      }
    }
  };


  return (
    <MainLayout title="Notifications">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-background-2">
              <Bell size={20} className="text-main" />
            </div>

            <span className="text-sm text-sub">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary font-sora font-medium hover:text-primary/80"
            >
              {isLoading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Mark all as read"
              )}
            </button>
          )}
        </div>


        {/* Notifications List */}
        <div className="space-y-4">
          {notifications?.length === 0 ? (
            <div className="text-center py-12 text-sub">
              No notifications yet
            </div>
          ) : (
            notifications?.map((notification) => {
              const NotificationIcon = notificationStyles[notification?.type as NotificationType].icon;
              return (
                <div
                  key={notification?.$id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 border rounded-xl cursor-pointer transition-all
                    ${notification?.isRead 
                      ? 'bg-background border-line hover:border-primary' 
                      : 'bg-background-2 border-primary'
                    }
                  `}
                >
                  <div className="flex gap-4">
                    <div className={`
                      p-2 rounded-xl shrink-0 h-fit
                      ${notificationStyles[notification?.type as NotificationType].bgColor}
                    `}>
                      <NotificationIcon 
                        size={20} 
                        className={notificationStyles[notification?.type as NotificationType].iconColor} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-main">{notification?.title}</h3>
                          <p className="text-sm text-sub mt-1">{notification?.content}</p>
                        </div>
                        <span className="text-xs text-sub shrink-0">
                          {formatTimestamp(new Date(notification?.$createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
