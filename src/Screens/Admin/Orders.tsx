import { OrderFilter } from "@/Components/UI"
import { MainLayout } from "@/Layouts"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { usePackageOrder } from "@/Hooks"
import { AlertTriangle, CheckCircle2, ListFilter, Loader2, PackageCheck } from "lucide-react"
import clsx from "clsx"
import { statusColorFormat } from "@/Utils/statusColorFormat"
import { Search } from "@/Components/UI"
import { apiRequest } from "@/Backend/api"
import { toast } from "sonner"

const getIssueRiderName = (issue: Record<string, any>) => {
  const user = issue.rider?.user || {};
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || "Assigned rider";
};

const AdminOrderCard = ({
  order,
  resolvingIssueId,
  resolvedIssueIds,
  onResolveIssue,
}: {
  order: Models.Document;
  resolvingIssueId: string | null;
  resolvedIssueIds: Set<string>;
  onResolveIssue: (issueId: string) => Promise<void>;
}) => {
  const issues = Array.isArray(order.deliveryIssues) ? order.deliveryIssues : [];
  const unresolvedIssues = issues.filter((issue) => !issue.resolvedAt && !resolvedIssueIds.has(issue.id));

  return (
    <div className="bg-background border border-line rounded-xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary center shrink-0">
            <PackageCheck size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-sora font-bold text-main truncate">{order.packageName}</p>
            <p className="text-xs text-sub">ID: {order.trackingId}</p>
          </div>
        </div>
        <span className={clsx(statusColorFormat(order.status), "capitalize px-2 py-1 rounded-full text-xs font-sora font-medium shrink-0")}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-sub text-xs">Customer</p>
          <p className="text-main font-medium truncate">{order.receiverName}</p>
        </div>
        <div>
          <p className="text-sub text-xs">Store</p>
          <p className="text-main font-medium truncate">{order.senderName}</p>
        </div>
        <div>
          <p className="text-sub text-xs">Payment</p>
          <p className="text-main font-medium">{order.paymentStatus}</p>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="border-t border-line pt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-sora font-bold text-main">
            <AlertTriangle size={18} className={unresolvedIssues.length ? "text-yellow-500" : "text-green-500"} />
            <span>{unresolvedIssues.length ? "Open delivery issue" : "Delivery issues resolved"}</span>
          </div>

          {issues.map((issue) => {
            const issueResolved = Boolean(issue.resolvedAt) || resolvedIssueIds.has(issue.id);
            const isResolving = resolvingIssueId === issue.id;

            return (
              <div key={issue.id} className="bg-mid border border-line rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx("px-2 py-1 rounded-full text-xs font-sora font-medium", issueResolved ? "text-green-500 bg-green-500/10" : "text-yellow-500 bg-yellow-500/10")}>
                      {issueResolved ? "Resolved" : "Open"}
                    </span>
                    <span className="text-main text-sm font-medium">{String(issue.type || "Issue").replace(/_/g, " ")}</span>
                  </div>
                  <p className="text-sub text-xs mt-1 truncate">
                    {getIssueRiderName(issue)} {issue.description ? `- ${issue.description}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={issueResolved || isResolving}
                  onClick={() => onResolveIssue(issue.id)}
                  className={clsx(
                    "h-9 px-3 rounded-lg text-xs font-sora font-bold center gap-2 transition-all",
                    issueResolved
                      ? "bg-green-500/10 text-green-500 cursor-default"
                      : "bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                  )}
                >
                  {isResolving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>{issueResolved ? "Resolved" : "Resolve"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
    const { parcels } = usePackageOrder();
    const filters = [
      "All Orders",
      "pending",
      "in transit",
      "delivered",
      "cancelled",
    ];
    const types = ["All", "Package", "Food"];
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(filters[0]);
    const [orderType, setOrderType] = useState(types[0]);
    const [showFilter, setShowFilter] = useState(false);
    const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
    const [resolvedIssueIds, setResolvedIssueIds] = useState<Set<string>>(new Set());
    const toggleFilter = () => {
      setShowFilter((prev) => !prev);
      };

    const handleResolveIssue = async (issueId: string) => {
      setResolvingIssueId(issueId);
      try {
        await apiRequest(`/admin/delivery-issues/${issueId}/resolve`, {
          method: "PATCH",
        });
        setResolvedIssueIds((current) => new Set(current).add(issueId));
        toast.success("Delivery issue resolved");
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setResolvingIssueId(null);
      }
    };
  
    const filteredOrders = parcels.filter((order) => {
      const query = search.toLowerCase();
      const matchedOrderName = [order.packageName, order.trackingId, order.receiverName, order.senderName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
      const matchedOrderStatus = filter === "All Orders" || order.status === filter;
      const matchedOrderType = orderType === "All" || String(order.packageTexture || "").toLowerCase() === orderType.toLowerCase();
      return matchedOrderName && matchedOrderStatus && matchedOrderType;
    });
  return (
    <>
    <MainLayout title={`${orderType} Orders Management`}>
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
          {filteredOrders.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <AdminOrderCard
                  key={order.$id}
                  order={order}
                  resolvingIssueId={resolvingIssueId}
                  resolvedIssueIds={resolvedIssueIds}
                  onResolveIssue={handleResolveIssue}
                />
              ))}
            </div>
          )}
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
            types={types}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Orders
