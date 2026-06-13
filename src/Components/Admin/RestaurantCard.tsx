import { Check, Copy, Loader, Power, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";

const RestaurantCard = ({
  restaurant,
  loadingAction,
  onUpdateStatus,
}: {
  restaurant: Models.Document;
  loadingAction?: string | null;
  onUpdateStatus: (restaurant: Models.Document, next: { isApproved?: boolean; isOpen?: boolean; reason?: string }) => Promise<void>;
}) => {
  const isSuspended = restaurant.isApproved === false;
  const isOpen = restaurant.isOpen === true;
  const isUpdating = loadingAction === restaurant.$id;
  const ownerName = [restaurant.merchant?.user?.firstName, restaurant.merchant?.user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const handleSuspendToggle = () => {
    const nextApproved = !restaurant.isApproved;
    const reason = nextApproved
      ? "Store reactivated by admin"
      : window.prompt("Reason for suspending this store?", "Admin review required") || "Admin review required";

    return onUpdateStatus(restaurant, {
      isApproved: nextApproved,
      ...(nextApproved ? {} : { isOpen: false }),
      reason,
    });
  };

  const handleOpenToggle = () => {
    return onUpdateStatus(restaurant, {
      isOpen: !isOpen,
      reason: !isOpen ? "Store reopened by admin" : "Store closed by admin",
    });
  };

  return (
    <div className="bg-background p-4 rounded-lg border border-line">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-main font-sora font-bold text-lg truncate">{restaurant.name}</h3>
          <p className="text-sub text-sm truncate">{restaurant.merchant?.businessName || ownerName || "Merchant"}</p>
        </div>
        <span className={clsx("px-2 py-1 rounded-lg text-xs font-sora font-bold shrink-0", isSuspended ? "text-red-500 bg-red-500/10" : isOpen ? "text-green-500 bg-green-500/10" : "text-yellow-500 bg-yellow-500/10")}>
          {isSuspended ? "Suspended" : isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <div className="mb-4 space-y-2 border-t border-b border-line py-4">
        <Item value={restaurant.address} label="Address" />
        <Item value={`${restaurant.city || ""}${restaurant.state ? `, ${restaurant.state}` : ""}`} label="Location" />
        <Item value={restaurant.merchant?.user?.phone || ""} label="Phone number" />
        <Item value={restaurant.merchant?.user?.email || ""} label="Email" />
      </div>

      <div className="ms-0 mt-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-sub">
          <span>{restaurant._count?.orders || 0} orders</span>
          <span>{restaurant._count?.menuItems || 0} items</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={isUpdating || isSuspended}
            onClick={handleOpenToggle}
            className={clsx(
              "h-9 px-3 rounded-lg text-xs font-sora font-bold center gap-2",
              isOpen ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500",
              "disabled:opacity-50"
            )}
          >
            {isUpdating ? <Loader className="animate-spin" size={16} /> : <Power size={16} />}
            <span>{isOpen ? "Close" : "Open"}</span>
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={handleSuspendToggle}
            className={clsx(
              "h-9 px-3 rounded-lg text-xs font-sora font-bold center gap-2",
              isSuspended ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
              "disabled:opacity-50"
            )}
          >
            {isUpdating ? <Loader className="animate-spin" size={16} /> : isSuspended ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            <span>{isSuspended ? "Reactivate" : "Suspend"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

const Item = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    setCopied(true);
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-sub text-sm line-clamp-1">{value || "Not provided"}</p>
      <button className="center" onClick={handleCopy} disabled={!value}>
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy
            size={16}
            className="text-sub hover:text-main transition-all duration-300"
          />
        )}
      </button>
    </div>
  );
};
