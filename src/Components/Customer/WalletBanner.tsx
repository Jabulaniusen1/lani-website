import { formatNumber } from "@/Utils/formatNumber";
import { useAuth } from "@/Hooks";
import { useLocation } from "react-router-dom";

type WalletBannerProps = {
    balance?: number;
};

const WalletBanner = ({ balance }: WalletBannerProps) => {
    const {userData} = useAuth()
    const location = useLocation()
    const isWallet = location.pathname === "/earnings" || location.pathname === "/wallet"
    const displayBalance = balance ?? Number(userData?.wallet || 0)
  return (
    <><div className="bg-gradient-to-br from-orange-800 to-primary text-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div>
                    <p className="text-xs font-sans font-medium">{isWallet ? "Total Earnings" : "Earnings Balance"}</p>
                    <p className="text-lg font-sora font-bold">{formatNumber(displayBalance)}</p>
                </div>
            </div>
            
        </div>
    </div>
    </>
  )
}

export default WalletBanner
