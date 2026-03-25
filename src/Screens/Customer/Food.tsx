
import { Info } from "lucide-react";
import { MainLayout } from "@/Layouts"

const Food = () => {
  return (
    <MainLayout title="Food Delivery">
      <div className="flex flex-col items-center justify-center">
        <div className="p-4 bg-yellow-500/10 rounded-lg flex">
          <Info className="text-yellow-500 mr-3 flex-shrink-0" size={24} />
          <div>
            <h3 className=" text-yellow-500 font-semibold">Food Ordering Is Managed in Dashboard Flows</h3>
            <p className="text-sub text-sm">
              Lani currently supports ordering, tracking, and delivery through your
              active store and order dashboard screens.
            </p>
            <p className="text-sub text-sm">
              Use your menu and orders tabs to continue managing food operations.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Food
