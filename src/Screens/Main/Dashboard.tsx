import { CustomerDashboard } from "@/Components/Customer";
import { RiderDashboard } from "@/Components/Rider";
import { useAuth } from "@/Hooks";
import { RestaurantDashboard } from "@/Components/Restaurant";
import { Loading } from "@/Components/Main";
const Dashboard = () => {
  const { userData } = useAuth();
  const isRider = userData?.role === "rider";
  const isRestaurant =
    userData?.role === "restaurant" || userData?.role === "merchant";
 

  if (isRider) {
    return <RiderDashboard />;
  }

  if (isRestaurant) {
    return <RestaurantDashboard />;
  }

  if (!userData) {
    return <Loading />;
  }

  return <CustomerDashboard />;
};

export default Dashboard;
