import { Loader, LocateFixed } from "lucide-react";
import { Modal } from "../UI";
import { Input } from "../UI";
import { useState } from "react";
import { statusColorFormat } from "@/Utils/statusColorFormat";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { usePackageOrder } from "@/Hooks";
import { useNavigate } from "react-router-dom";

const Track = () => {
  const { orders, imgUrl } = usePackageOrder();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [order, setOrder] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    setIsFound(false);
    setOrder(null);
    setTrackingNumber("");
  };

  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trackingNumber) {
      toast.error("Tracking number is required");
      return;
    }
    const order = orders.find((order) => order.trackingId === trackingNumber);
    if (order) {
      setOrder(order);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsFound(true);
      }, 1000);
    } else {
      setIsFound(false);
      toast.error("Order not found");
    }
  };
  return (
    <>
      <div
        onClick={toggleModal}
        className="flex items-center gap-2 bg-background text-sub h-10 border border-line rounded-lg px-4"
      >
        <LocateFixed size={20} />
        <p className="text-sm font-sora">Track your shipment</p>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Track your shipment"
            isOpen={isOpen}
            toggleModal={toggleModal}
          >
            {!isFound && (
              <form onSubmit={handleTrack} className="space-y-4">
                <Input
                  label="Enter tracking number"
                  placeholder="e.g lani-123456"
                  value={trackingNumber}
                  name="trackingNumber"
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  icon={<LocateFixed size={20} />}
                />
                <button
                  disabled={loading}
                  className="bg-primary btn w-full text-white px-4 py-2 rounded-lg"
                >
                  {loading ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    "Track"
                  )}
                </button>
              </form>
            )}

            {isFound && (
              <>
              

                {order && (
                  <div className="flex md:flex-row flex-col gap-4">
                    <div className="center h-[200px] md:w-[200px] w-full rounded-xl overflow-hidden">
                      <img
                        src={imgUrl(order?.packageImage)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-4 min-h-full">
                      <div>
                        <p className="text-lg font-medium font-sora">
                          Macbook Pro
                        </p>
                        <p className="text-sm font-sora">
                          Status:{" "}
                          <span
                            className={`${statusColorFormat(order?.status)}`}
                          >
                            {order?.status}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate(`/orders/${order?.trackingId}`, {
                            state: { order },
                          });
                        }}
                        className="bg-primary btn w-full ms-0 mt-auto text-white px-4 py-2 rounded-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Track;
