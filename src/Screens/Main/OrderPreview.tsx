import { useLocation } from "react-router-dom";
import { MainLayout } from "@/Layouts";
import {
  Loader,
  Package,
  MapPin,
  Clock,
  Calendar,
  Copy,
  Check,
  MapPinned,
  TriangleAlert,
  UserRound,
  Phone,
} from "lucide-react";
import clsx from "clsx";
import { statusColorFormat } from "@/Utils/statusColorFormat";
import { usePackageOrder } from "@/Hooks";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/Hooks";

const OrderPreview = () => {
  const { userData, users } = useAuth();
  const location = useLocation();
  const order = location.state?.order;
  const {
    imgUrl,
    acceptOrder,
    loading,
    orders,
    markAsDelivered,
    markPaymentAsReceived,
  } = usePackageOrder();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(order.trackingId);
    setCopied(true);
    toast.success("Tracking ID copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const rider = users?.find((user) => user.$id === order.riderId);

  const activeOrders = orders?.filter((order) => order.status === "in transit");
  const isMax = activeOrders?.length === 2;

  if (!order)
    return (
      <MainLayout title="Order Preview">
        <div className="flex items-center justify-center h-[calc(100vh-60px)]">
          <div className="flex items-center justify-center flex-col gap-2">
            <Loader className="animate-spin" size={30} />
            <span>Fetching order details...</span>
          </div>
        </div>
      </MainLayout>
    );
  return (
    <>
      <MainLayout>
        {isMax && userData?.role === "rider" && order.status === "pending" && (
          <div className="bg-yellow-500/10 mb-4 text-yellow-500 p-4 rounded-lg text-sm flex items-center gap-2">
            <TriangleAlert className="flex-shrink-0" />
            <p>
              You have reached the maximum number of orders you can accept at
              the moment. Please complete your current order before accepting a
              new one.
            </p>
          </div>
        )}
        <div className="space-y-4">
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-main">Order Details</h1>
                <p className="text-sm text-sub flex items-center gap-2">
                  ID: {order.trackingId}{" "}
                  <span>
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy
                        size={16}
                        className="cursor-pointer"
                        onClick={handleCopy}
                      />
                    )}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={clsx(
                    statusColorFormat(order.status),
                    "capitalize"
                  )}
                >
                  {order.status}
                </span>
                <span
                  className={clsx(
                    order.isPaid
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500",
                    "capitalize text-sm px-2 font-medium font-sora py-1 rounded-full"
                  )}
                >
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>

            {/* Cancel Button for Pending Orders */}
            {order.status === "pending" && userData?.role === "customer" && (
              <button
                className="w-full mt-4 px-3 h-10 font-sora rounded-xl
                text-red-500 bg-red-500/10 hover:bg-red-500/20
                transition-colors text-sm font-medium"
              >
                Cancel Order
              </button>
            )}
            {!isMax &&
              order.status === "pending" &&
              userData?.role === "rider" && (
                <button
                  onClick={() => {
                    acceptOrder(order.$id);
                  }}
                  disabled={loading}
                  className="w-full mt-4 px-3 h-10 center font-sora rounded-xl
                text-green-500 bg-green-500/10 hover:bg-green-500/20
                transition-colors text-sm font-medium"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    "Accept Order"
                  )}
                </button>
              )}
            {order.status === "in transit" &&
              userData?.role === "rider" &&
              (order.isPaid ? (
                <button
                  onClick={() => {
                    markAsDelivered(order as Models.Document);
                  }}
                  disabled={loading}
                  className="w-full mt-4 px-3 h-10 center font-sora rounded-xl
                text-purple-500 bg-purple-500/10 hover:bg-purple-500/20
                transition-colors text-sm font-medium"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    "Mark as Delivered"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    markPaymentAsReceived(order);
                  }}
                  disabled={loading}
                  className="w-full mt-4 p-3 center rounded-xl
                text-primary bg-primary/10 hover:bg-primary/20
                transition-colors text-sm font-medium"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    "Mark Payment as Received"
                  )}
                </button>
              ))}

            {/* Add to JSX for rider view when payment is pending */}
            {/* {userData?.role === 'rider' && 
         order.status === "in transit" && 
         !order.isPaid && (
          <button
            onClick={() => {
              markPaymentAsReceived(order);
            }}
            disabled={loading}
            className="w-full mt-4 p-3 center rounded-xl
              text-primary bg-primary/10 hover:bg-primary/20
              transition-colors text-sm font-medium"
          >
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              "Mark Payment as Received"
            )}
          </button>
        )} */}
          </div>

          {/* Package Details with Image */}
          <div className="bg-background border border-line rounded-xl overflow-hidden">
            <div className="p-4 border-b border-line">
              <h2 className="font-semibold font-sora text-main">
                Package Details
              </h2>
            </div>
            <div className="p-4">
              {order?.packageImage ? (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-background_2">
                  <img
                    src={imgUrl(order?.packageImage)}
                    alt={order?.packageName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 mb-4 rounded-lg bg-background_2 flex items-center justify-center">
                  <Package size={48} className="text-sub" />
                </div>
              )}

              <div className="flex items-start gap-3">
                <Package size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sub text-sm">Package Name</p>
                  <p className="text-main font-sora">{order?.packageName}</p>
                  <p className="text-xs text-sub capitalize">
                    Type: {order?.packageTexture}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="bg-background border border-line rounded-xl overflow-hidden">
            <div className="p-4 border-b border-line">
              <h2 className="font-semibold text-main">Delivery Information</h2>
            </div>
            <div className="p-4 space-y-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sub text-sm">Pickup Location</p>
                  <p className="text-main">{order?.pickupAddress}</p>
                  {/* <p className="text-xs text-sub mt-1">Landmark: {order?.pickupLandmark}</p> */}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-2 mt-1" />
                <div>
                  <p className="text-sub text-sm">Delivery Location</p>
                  <p className="text-main">{order?.deliveryAddress}</p>
                  {/* <p className="text-xs text-sub mt-1">Landmark: {order?.deliveryLandmark}</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-background border border-line rounded-xl overflow-hidden">
            <div className="p-4 border-b border-line">
              <h2 className="font-semibold text-main">Contact Information</h2>
            </div>

            <div className="p-4 space-y-4">
              <div className=" space-y-2 bg-mid p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <UserRound size={18} className="text-primary mt-1" />
                  <div>
                    <p className="text-sub text-sm">Customer Name</p>
                    <p className="text-main">{order?.senderName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-primary mt-1" />
                    <div>
                      <p className="text-sub text-sm">Customer Phone</p>
                      <p className="text-main">{order?.senderPhone}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:+${order?.senderPhone}`}
                    className=" font-sora font-medium px-4 py-1 btn bg-green-500/10 text-green-500"
                  >
                    Call
                  </a>
                </div>
              </div>

              <div className=" space-y-2 bg-mid p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <UserRound size={18} className="text-blue-500 mt-1" />
                  <div>
                    <p className="text-sub text-sm">Receiver Name</p>
                    <p className="text-main">{order?.receiverName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sub text-sm">Receiver Phone</p>
                      <p className="text-main">{order?.receiverPhone}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:+${order?.receiverPhone}`}
                    className=" font-sora font-medium px-4 py-1 btn bg-blue-500/10 text-blue-500"
                  >
                    Call
                  </a>
                </div>
              </div>

              {rider && (
                <div className=" space-y-2 bg-mid p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <UserRound size={18} className="text-purple-500 mt-1" />
                    <div>
                      <p className="text-sub text-sm">Rider Name</p>
                      <p className="text-main">{rider?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-purple-500 mt-1" />
                      <div>
                        <p className="text-sub text-sm">Rider Phone</p>
                        <p className="text-main">{rider?.phone}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:+${rider?.phone}`}
                      className=" font-sora font-medium px-4 py-1 btn bg-purple-500/10 text-purple-500"
                    >
                      Call
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time and Cost */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background border border-line rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sub text-sm">Pickup Time</p>
                  <p className="text-main">
                    {order?.time === "immediate"
                      ? "Immediate Pickup"
                      : new Date(order?.scheduledDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-background border border-line rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-primary mt-1" />
                <div>
                  <p className="text-sub text-sm">Order Date</p>
                  <p className="text-main">
                    {new Date(order.$createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background border border-line rounded-xl p-4">
            <button
              onClick={() => {
                toast.warning("This feature is not available yet!");
              }}
              className="center font-sora w-full font-medium text-sm bg-primary/10 text-primary h-10 rounded-md"
            >
              <MapPinned size={16} className="mr-2" /> View on Map
            </button>
          </div>

          {/* Amount */}
          <div className="bg-background border border-line rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-main font-medium">Total Amount</span>
              <span className="text-xl font-semibold font-sora text-primary">
                ₦{order?.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default OrderPreview;
