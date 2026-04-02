import { OrderCard, OrderFilter, Search } from "@/Components/UI";
import { MainLayout } from "@/Layouts";
import { AnimatePresence } from "framer-motion";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { usePackageOrder } from "@/Hooks";
import clsx from "clsx";
import { statusColorFormat } from "@/Utils/statusColorFormat";



const Orders = () => {
  const { orders } = usePackageOrder();
  const filters = [
    "All Orders",
    "pending",
    "in transit",
    "delivered",
    "cancelled",
  ];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filters[0]);
  const [orderType, setOrderType] = useState("Food");
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
    };

  const filteredOrders = orders.filter((order) => {
    const matchedOrderName = order.packageName.toLowerCase().includes(search.toLowerCase());
    const matchedOrderStatus = filter === "All Orders" || order.status === filter;
    return matchedOrderName && matchedOrderStatus;
  });
  return (
    <>
      <MainLayout title="Meal Orders">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Search
                placeholder="Search orders"
                search={search}
                setSearch={setSearch}
              />
            </div>
            <button
              onClick={toggleFilter}
              className="bg-primary text-white h-10 px-4 center gap-2 text-xs font-sora font-medium rounded-lg"
            >
              <ListFilter size={16} />
              Filter
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-sub my-4">
            <p>Filtered by:</p>
            <span className={clsx(statusColorFormat(filter), "capitalize px-2 py-1 rounded-full font-sora font-medium")}>
              {filter}
            </span>
          </div>
          {filteredOrders.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sub">No orders found</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.$id} order={order} />
            ))}
          </div>
        </div>
      </MainLayout>

      <AnimatePresence>
        {showFilter && (
          <OrderFilter
            toggleFilter={toggleFilter}
            filter={filter}
            setFilter={setFilter}
            filters={filters}
            orderType={orderType}
            setOrderType={setOrderType}
            types={["Food"]}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Orders;
