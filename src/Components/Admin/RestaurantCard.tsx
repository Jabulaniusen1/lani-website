import { BadgeCheck, Check, Copy, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/Hooks";
import clsx from "clsx";

const RestaurantCard = ({ restaurant }: { restaurant: Models.Document }) => {
    const { updateRestaurant, loading } = useAuth();
  return (
    <div className="bg-background p-4 rounded-lg border border-line">
      <h3 className="text-main font-sora font-bold text-lg flex flex-col ">
        {restaurant.name}
      </h3>
      <div className="mb-4 space-y-2 border-t border-b border-line py-4">
        <Item value={restaurant.address} label="Address" />
        <Item value={restaurant.phone} label="Phone number" />
        <Item value={restaurant.email} label="Email" />
      </div>

      <div className="ms-0 mt-auto flex items-center justify-between gap-2">

       { !restaurant.isVerified && <button disabled={loading} onClick={() => updateRestaurant(restaurant)} className=" flex items-center gap-2 bg-green-500/10 h-9 px-4 rounded-lg text-green-500 font-sora font-bold text-sm">
          <span>{loading ? "Verifying..." : "Verify Restaurant"}</span>
          {loading ? <Loader className="animate-spin" size={20} /> : <BadgeCheck size={20} />}
        </button>}

        <span className={clsx(" px-2 py-1 rounded-lg text-sm", restaurant.isVerified ? "text-green-500 bg-green-500/10" : "text-yellow-500 bg-yellow-500/10")}>
            {restaurant.isVerified ? "Verified" : "Not Verified"}
        </span>
      </div>
    </div>
  );
};

export default RestaurantCard;

const Item = ({ value, label }: { value: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-sub text-sm line-clamp-1">{value}</p>
      <button className="center" onClick={handleCopy}>
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
