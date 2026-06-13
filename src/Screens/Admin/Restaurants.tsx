import { Search } from "@/Components/UI";
import { MainLayout } from "@/Layouts";
import { useEffect, useMemo, useState } from "react";
import { RestaurantCard } from "@/Components/Admin";
import { apiRequest } from "@/Backend/api";
import { toast } from "sonner";

const Restaurants = () => {
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState<Models.Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const loadRestaurants = async () => {
        setLoading(true);
        try {
            const data = await apiRequest<{ restaurants?: Array<Record<string, any>> }>("/admin/restaurants?limit=100");
            const mapped = (data.restaurants || []).map((restaurant) => ({
                $id: String(restaurant.id),
                $createdAt: String(restaurant.createdAt || new Date().toISOString()),
                $updatedAt: String(restaurant.updatedAt || restaurant.createdAt || new Date().toISOString()),
                ...restaurant,
            }));
            setRestaurants(mapped);
        } catch (error) {
            toast.error((error as Error).message);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRestaurants();
    }, []);

    const filteredRestaurants = useMemo(() => {
        const query = search.toLowerCase();
        return restaurants.filter((restaurant) =>
            [
                restaurant.name,
                restaurant.address,
                restaurant.city,
                restaurant.state,
                restaurant.merchant?.businessName,
                restaurant.merchant?.user?.email,
                restaurant.merchant?.user?.phone,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query))
        );
    }, [restaurants, search]);

    const handleUpdateStatus = async (
        restaurant: Models.Document,
        next: { isApproved?: boolean; isOpen?: boolean; reason?: string }
    ) => {
        setLoadingAction(restaurant.$id);
        try {
            const data = await apiRequest<{ restaurant?: Record<string, any> }>(`/admin/restaurants/${restaurant.$id}/status`, {
                method: "PATCH",
                body: next,
            });
            const updated = data.restaurant;
            if (updated) {
                setRestaurants((current) =>
                    current.map((item) =>
                        item.$id === restaurant.$id
                            ? {
                                ...item,
                                ...updated,
                                $id: String(updated.id || item.$id),
                                $updatedAt: String(updated.updatedAt || new Date().toISOString()),
                            }
                            : item
                    )
                );
            }
            toast.success("Store status updated");
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoadingAction(null);
        }
    };

  return (
    <MainLayout title="Restaurants">
        <div className="space-y-4">
            <Search search={search} setSearch={setSearch} placeholder="Search stores by name, city, or merchant..." />
            {loading && (
                <div className="bg-background border border-line rounded-xl p-6 text-center text-sub text-sm">
                    Loading stores...
                </div>
            )}
            {!loading && filteredRestaurants.length === 0 && (
                <div className="bg-background border border-line rounded-xl p-6 text-center text-sub text-sm">
                    No stores found
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.$id}
                        restaurant={restaurant}
                        loadingAction={loadingAction}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ))}
            </div>
        </div>
    </MainLayout>
  )
}

export default Restaurants
