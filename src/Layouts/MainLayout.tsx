import { Header } from "@/Components/Main"
import { Navbar } from "@/Components/UI"
import { useAuth } from "@/Hooks";
const MainLayout = ({title, children}: {title?: string, children: React.ReactNode}) => {
  const { userData } = useAuth();
  const isRider = userData?.role === "rider";
  const isVerified = userData?.isVerified === true;
  const notVerifiedRider = isRider && !isVerified;
  return (
   <>
      <Header />
      <main className="dashboard-layout py-6 md:pl-24 lg:pl-64">
        {title && (
          <h1 className="text-xl font-bold font-sora text-main mb-6">{title}</h1>
        )}
        <div className="pb-20 md:pb-8 mb-8">{children}</div>
      </main>
      {!notVerifiedRider && <Navbar />}
   </>
  )
}

export default MainLayout
