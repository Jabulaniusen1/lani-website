import { Header } from "@/Components/Restaurant"
import { Navbar } from "@/Components/UI";


const RestaurantLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <>
    <Header/>
    <main className="dashboard-layout md:pl-24 lg:pl-64">
        <div className="pb-20 md:pb-8">{children}</div>
    </main>
    <Navbar />
    </>
  )
}

export default RestaurantLayout
