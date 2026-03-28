import { MainLayout } from "@/Layouts";
import {
  ProfileCard,
  ContactInformation,
  AccountActions,
  CompanyInformation,
  StoreInformation,
} from "@/Components/Profile";
import { useAuth } from "@/Hooks";
const Profile = () => {
  const { userData } = useAuth();
  const isCompany = userData?.subrole === "company";
  const isMerchant = userData?.role === "restaurant";

  return (
    <>
      <MainLayout title="Profile">
        <div className="space-y-4">
          <ProfileCard />
          <ContactInformation />
          {isCompany && <CompanyInformation />}
          {isMerchant && <StoreInformation />}
          <AccountActions />
        </div>
      </MainLayout>
    </>
  );
};

export default Profile;
