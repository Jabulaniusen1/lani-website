import { Input } from "../UI";
import { AlertCircle, Loader, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FundWallet = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount) {
      setError("Amount is required");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.info("Wallet funding is not available in the current API specification.");
      setAmount("");
      setError("");
    }, 500);
  };

  return (
    <div className="bg-background rounded-lg">
      <div className="flex flex-col justify-between">
        <p className="text-sm p-4 font-sora border-b border-line pb-2 font-medium">
          Fund Wallet
        </p>
        <form onSubmit={handleSubmit} className="space-y-2 mt-4 px-4 pb-4">
          <Input
            type="number"
            placeholder="Amount"
            styles="bg-secondary"
            icon={<Wallet size={18} />}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={error}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-primary text-white h-9 w-full"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Fund"}
          </button>
          <div className="text-xs text-sub flex items-start gap-1 mt-1">
            <AlertCircle size={14} className="mt-0.5" />
            <span>Use merchant/rider payout endpoints from the API for wallet operations.</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundWallet;
