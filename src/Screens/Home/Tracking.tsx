import { Goback, Input, ThemeToggle } from "@/Components/UI";
import { usePackageOrder, useAuth } from "@/Hooks";

import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { formatNumber } from "@/Utils/formatNumber";
import clsx from "clsx";

const Tracking = () => {
  const { user } = useAuth();
  const { parcels, imgUrl } = usePackageOrder();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [orderData, setOrderData] = useState<Models.Document | null>(null);
  const [showOrder, setShowOrder] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setError("");
  };

  const trackOrder = () => {
    if (!id) return setError("Please enter a valid tracking ID");
    const order = parcels.find((order) => order.trackingId === id);
    console.log(order);
    if (!order) {
      setError("Invalid Tracking ID!");
      toast.error("Order not found!");
      setShowOrder(false);
      return;
    }
    setOrderData(order);
    setLoading(true);
    setTimeout(() => {
      setShowOrder(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <main className="main pb-10">
        <header className="flex items-center justify-between h-[70px] line backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Goback />
            {/* logo */}
            <Link to="/" className="flex items-center">
                <img src="/logo-orange.png" alt="logo" width={35} />
                <h3 className="text-2xl font-sora font-bold">Lani</h3>
              </Link>
          </div>
          <ThemeToggle />
        </header>
        {!showOrder && (
          <div className="md:w-[500px] w-full mx-auto flex flex-col items-center justify-center gap-6 mt-10 rounded-lg p-6 border border-line">
            <div className="flex flex-col justify-center text-center">
              <h1 className="text-2xl font-sora font-bold">Order Tracking</h1>
              <p className="text-sub font-light">
                Input your order number to track your order
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Input
                type="text"
                name="id"
                value={id}
                onChange={handleChange}
                error={error}
                placeholder="Enter Tracking ID e.g. lani-ABCD1"
              />
              <button
                disabled={loading}
                onClick={trackOrder}
                className="bg-primary btn text-white font-medium font-sora px-4 h-10 rounded-full"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  "Track Order"
                )}
              </button>
            </div>
          </div>
        )}

        {/* order details */}
        {showOrder && (
          <div className="md:w-[500px] w-full mx-auto flex flex-col items-center justify-center gap-6 mt-10 rounded-lg p-6 border border-line">
            <h1 className="text-2xl font-sora font-bold">Order Details</h1>

            <div className="h-[150px] w-full rounded-lg overflow-hidden">
              <img
                src={imgUrl(orderData?.packageImage)}
                alt={orderData?.packageName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Package Name</p>
                <h3 className="text-lg font-sora font-bold">
                  {orderData?.packageName}
                </h3>
              </div>
              {orderData?.notes && (
                <div className="flex flex-col gap-2">
                  <p className="text-sub font-light">Notes</p>
                  <p className="text-lg font-sora font-bold">
                    {orderData?.notes}
                  </p>
                </div>
              )}
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Sender</p>
                <h3 className="text-lg font-sora font-bold">
                  {orderData?.senderName}
                </h3>
              </div>
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Receiver</p>
                <h3 className="text-lg font-sora font-bold">
                  {orderData?.receiverName}
                </h3>
              </div>
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Delivery Address</p>
                <h3 className="text-lg font-sora font-bold">
                  {orderData?.deliveryAddress}
                </h3>
              </div>
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Pickup Address</p>
                <h3 className="text-lg font-sora font-bold">
                  {orderData?.pickupAddress}
                </h3>
              </div>
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Price</p>
                <h3 className="text-lg font-sora font-bold">
                  {formatNumber(orderData?.price)}
                </h3>
              </div>
              <div className="border-b border-line pb-2">
                <p className="text-sub font-light">Status</p>
                <h3
                  className={clsx(
                    "text-lg font-sora font-bold capitalize",
                    orderData?.status === "pending" && "text-yellow-500",
                    orderData?.status === "delivered" && "text-green-500",
                    orderData?.status === "cancelled" && "text-red-500"
                  )}
                >
                  {orderData?.status}
                </h3>
              </div>
              {orderData?.status === "pending" &&
                user?.$id === orderData?.customerId && (
                  <button
                    
                    className="bg-primary btn text-white font-medium font-sora px-4 py-2 rounded-full mt-4"
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Tracking;
