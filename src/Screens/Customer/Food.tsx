import { useState } from "react";
import { Loader2, MapPin, NotebookPen, Phone, Soup, UserRound } from "lucide-react";
import { MainLayout } from "@/Layouts";
import { Input } from "@/Components/UI";
import { usePackageOrder } from "@/Hooks";
import { toast } from "sonner";

const Food = () => {
  const { createOrder, loading } = usePackageOrder();
  const [form, setForm] = useState({
    mealName: "",
    notes: "",
    receiverName: "",
    receiverPhone: "",
    deliveryLocation: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.mealName || !form.receiverName || !form.receiverPhone || !form.deliveryLocation) {
      toast.error("Meal name, receiver details, and delivery location are required");
      return;
    }

    try {
      await createOrder(
        {
          image: null,
          name: form.mealName,
          texture: "Food",
          notes: form.notes,
        },
        {
          receiverName: form.receiverName,
          receiverPhone: form.receiverPhone,
          deliveryLocation: form.deliveryLocation,
          deliveryLocationLat: 0,
          deliveryLocationLng: 0,
        },
        {
          pickupDate: "",
          pickupTime: "",
          pickupLocation: "",
          pickupLocationLat: 0,
          pickupLocationLng: 0,
        },
        0,
        false
      );
      toast.success("Order created successfully");
    } catch {
      // handled in provider
    }
  };

  return (
    <MainLayout title="Order Meals">
      <div className="max-w-xl">
        <div className="p-4 bg-background border border-line rounded-xl mb-4">
          <h3 className="font-semibold font-sora text-main">Place a Meal Order</h3>
          <p className="text-sub text-sm mt-1">
            Submit your order details and continue with tracking in your orders list.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Meal Name"
            name="mealName"
            value={form.mealName}
            onChange={handleChange}
            placeholder="e.g. Jollof Rice + Chicken"
            icon={<Soup size={18} />}
          />
          <Input
            label="Special Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any meal preferences"
            icon={<NotebookPen size={18} />}
          />
          <Input
            label="Receiver Name"
            name="receiverName"
            value={form.receiverName}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            icon={<UserRound size={18} />}
          />
          <Input
            label="Receiver Phone"
            name="receiverPhone"
            value={form.receiverPhone}
            onChange={handleChange}
            placeholder="e.g. 08060000000"
            icon={<Phone size={18} />}
          />
          <Input
            label="Delivery Location"
            name="deliveryLocation"
            value={form.deliveryLocation}
            onChange={handleChange}
            placeholder="e.g. 15 Aka Road, Uyo"
            icon={<MapPin size={18} />}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-primary text-white px-4 h-10 rounded-full"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Place Order"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Food;
