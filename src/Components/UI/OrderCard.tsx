import { usePackageOrder } from "@/Hooks";
import { statusColorFormat } from "@/Utils/statusColorFormat";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
const OrderCard = ({order}: {order: Models.Document}) => {
    const {imgUrl} = usePackageOrder()
    const navigate = useNavigate()
    const handlePreview = () => {
        navigate(`/orders/${order.trackingId}`, {state: {order}})
    }
  return (
    <div className="flex relative border border-line hover:border-primary transition-all duration-300 gap-4 w-full bg-background p-4 rounded-xl" onClick={handlePreview}>
        <div className="h-14 w-14 rounded-md bg-mid center overflow-hidden">
            <img src={imgUrl(order.packageImage)} alt={order.packageName} />
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium font-sora">{order.packageName}</p>
                    <p className="text-sm text-sub">ID: {order.trackingId}</p>
                </div>
                <p className={clsx(statusColorFormat(order.status), "capitalize absolute top-3 right-3")}>{order.status}</p>
            </div>
            <p className="line-clamp-1 text-sub font-medium text-sm">{order.pickupAddress}</p>
        </div>
    </div>
  )
}

export default OrderCard