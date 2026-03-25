import { useContext } from "react"
import { PackageOrderContext } from "@/Context"
const usePackageOrder = () => {
const context = useContext(PackageOrderContext)
if (!context) {
    throw new Error("usePackageOrder must be used within a PackageOrderProvider")
}

const imgUrl = (id?: string) => {
  return id || "/placeholder.png"
}
  return {
    ...context,
    imgUrl
  }
}

export default usePackageOrder
