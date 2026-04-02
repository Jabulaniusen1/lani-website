import { Actions } from "../Main";
import { CustomerStats } from ".";
import { MainLayout } from "@/Layouts";
import { RecentOrders } from "../UI";
const CustomerDashboard = () => {
  return (
    <>
    <MainLayout>
      <div>
        <div className="bg-background border border-line rounded-xl p-4 mb-4">
          <h2 className="font-sora font-semibold text-main">Order Meals</h2>
          <p className="text-sm text-sub mt-1">
            Place meal orders and track delivery updates from your orders flow.
          </p>
        </div>
        <Actions />
        <CustomerStats />
        <RecentOrders />
      </div>
    </MainLayout>
    </>
  );
};

export default CustomerDashboard;
