import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { MainLayout } from "@/Layouts";
import { WalletBanner } from "@/Components/Customer";
import { Subtitle, TransactionList } from "@/Components/UI";
import { useAuth } from "@/Hooks";
import { apiRequest } from "@/Backend/api";

type MerchantEarnings = {
  balance?: {
    available?: number;
    totalEarned?: number;
    totalPaidOut?: number;
  };
  commissionRate?: number;
};

type RiderEarnings = {
  balance?: {
    available?: number;
  };
};

type PayoutConfig = {
  minPayout?: number;
  commissionRate?: number;
};

type PayoutItem = {
  id: string;
  amount?: number;
  status?: string;
  reference?: string;
  requestedAt?: string;
  processedAt?: string;
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const payoutStatusClass = (status?: string) => {
  if (status === "COMPLETED") return "bg-green-500/10 text-green-500";
  if (status === "PENDING" || status === "PROCESSING") {
    return "bg-yellow-500/10 text-yellow-500";
  }
  if (status === "FAILED") return "bg-red-500/10 text-red-500";
  return "bg-background_2 text-sub";
};

const Wallet = () => {
  const { userData } = useAuth();
  const isMerchant = userData?.role === "restaurant" || userData?.role === "merchant";
  const isRider = userData?.role === "rider";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiBalance, setApiBalance] = useState<number | null>(null);

  const [merchantEarnings, setMerchantEarnings] = useState<MerchantEarnings | null>(null);
  const [payoutConfig, setPayoutConfig] = useState<PayoutConfig>({
    minPayout: 1000,
    commissionRate: 0.9,
  });
  const [payoutHistory, setPayoutHistory] = useState<PayoutItem[]>([]);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [isPayoutSubmitting, setIsPayoutSubmitting] = useState(false);

  const loadEarningsData = useCallback(async () => {
    if (!userData?.$id) {
      setApiBalance(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isMerchant) {
        const [earningsData, configData, historyData] = await Promise.all([
          apiRequest<MerchantEarnings>("/payouts/earnings"),
          apiRequest<PayoutConfig>("/payouts/config", { auth: false }),
          apiRequest<{ payouts?: PayoutItem[] }>("/payouts/history"),
        ]);

        setMerchantEarnings(earningsData);
        setPayoutConfig({
          minPayout: Number(configData.minPayout || 1000),
          commissionRate: Number(configData.commissionRate || 0.9),
        });
        setPayoutHistory(historyData.payouts || []);
        setApiBalance(Number(earningsData.balance?.available || 0));
        return;
      }

      if (isRider) {
        const data = await apiRequest<RiderEarnings>("/rider/wallet/earnings");
        setMerchantEarnings(null);
        setPayoutHistory([]);
        setApiBalance(Number(data.balance?.available || 0));
        return;
      }

      setMerchantEarnings(null);
      setPayoutHistory([]);
      setApiBalance(Number(userData?.wallet || 0));
    } catch (err) {
      setError((err as Error).message);
      setApiBalance(Number(userData?.wallet || 0));
    } finally {
      setLoading(false);
    }
  }, [isMerchant, isRider, userData?.$id, userData?.wallet]);

  useEffect(() => {
    loadEarningsData();
  }, [loadEarningsData]);

  const handlePayoutRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const amount = Number(payoutAmount);
    const minPayout = Number(payoutConfig.minPayout || 1000);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid payout amount");
      return;
    }

    if (amount < minPayout) {
      toast.error(`Minimum withdrawal is ${formatCurrency(minPayout)}`);
      return;
    }

    setIsPayoutSubmitting(true);
    try {
      await apiRequest("/payouts/request", {
        method: "POST",
        body: { amount },
      });
      toast.success("Withdrawal request submitted");
      setPayoutAmount("");
      await loadEarningsData();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsPayoutSubmitting(false);
    }
  };

  const totalEarnings = apiBalance ?? Number(userData?.wallet || 0);

  return (
    <MainLayout title="Earnings">
      <WalletBanner balance={totalEarnings} />

      {loading && (
        <div className="bg-background border border-line rounded-xl p-6 center flex-col gap-2 text-sub mb-4">
          <Loader2 className="animate-spin" size={20} />
          <p>Loading earnings...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 flex items-start gap-2 text-sm mb-4">
          <CircleAlert size={16} className="mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {isMerchant && (
            <>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-4">
                <InfoCard
                  label="Available Balance"
                  value={formatCurrency(merchantEarnings?.balance?.available || 0)}
                />
                <InfoCard
                  label="Total Earned"
                  value={formatCurrency(merchantEarnings?.balance?.totalEarned || 0)}
                />
                <InfoCard
                  label="Total Withdrawn"
                  value={formatCurrency(merchantEarnings?.balance?.totalPaidOut || 0)}
                />
                <InfoCard
                  label="Commission"
                  value={`${Math.round(
                    Number(
                      (merchantEarnings?.commissionRate || payoutConfig.commissionRate || 0) *
                        100
                    )
                  )}%`}
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-background border border-line rounded-xl p-4 space-y-2">
                  <h3 className="font-sora font-semibold">Request Withdrawal</h3>
                  <p className="text-xs text-sub">
                    Minimum withdrawal is {formatCurrency(payoutConfig.minPayout || 1000)}
                  </p>

                  <form onSubmit={handlePayoutRequest} className="flex items-center gap-2">
                    <input
                      type="number"
                      min={payoutConfig.minPayout || 1000}
                      value={payoutAmount}
                      onChange={(event) => setPayoutAmount(event.target.value)}
                      className="w-full h-10 rounded-lg border border-line bg-background_2 px-3 text-sm"
                      placeholder="Enter amount"
                    />
                    <button
                      disabled={isPayoutSubmitting}
                      className="h-10 px-4 rounded-lg bg-primary text-white text-sm"
                    >
                      {isPayoutSubmitting ? "Sending..." : "Withdraw"}
                    </button>
                  </form>
                </div>

                <div className="bg-background border border-line rounded-xl p-4 space-y-2">
                  <h3 className="font-sora font-semibold">Withdrawal Details</h3>
                  {payoutHistory.length === 0 && (
                    <p className="text-sm text-sub">No withdrawal history yet.</p>
                  )}

                  {payoutHistory.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border border-line rounded-lg p-2 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(item.amount || 0)}</p>
                        <p className="text-xs text-sub">{formatDateTime(item.requestedAt)}</p>
                      </div>
                      <span
                        className={clsx(
                          "text-xs px-2 py-1 rounded-full",
                          payoutStatusClass(item.status)
                        )}
                      >
                        {item.status || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <Subtitle title={isMerchant ? "Earnings History" : "Transaction History"} />
            <TransactionList />
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Wallet;

const InfoCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-background border border-line rounded-lg p-4">
      <p className="text-xs text-sub">{label}</p>
      <p className="text-lg font-bold font-sora mt-1">{value}</p>
    </div>
  );
};