import { Mail, Phone, MapPin, Loader, Building } from "lucide-react";
import { useState } from "react";
import { useAuth, useMaps } from "@/Hooks";
import { AnimatePresence } from "framer-motion";
import { Modal } from "@/Components/UI";
import { Input } from "@/Components/UI";
import { Autocomplete } from "@react-google-maps/api";
import { toast } from "sonner";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CompanyInformation = () => {
  const {
    userData,
    loading,
    updateCompanyName,
    updateCompanyAddress,
    updateCompanyEmail,
  } = useAuth();
  const email = userData?.companyEmail;
  const name = userData?.companyName;
  const address = userData?.companyAddress;
  const [isOpen, setIsOpen] = useState(false);
  const [change, setChange] = useState("");
  const [companyName, setCompanyName] = useState(name);
  const [companyEmail, setCompanyEmail] = useState(email);
  const [companyAddress, setCompanyAddress] = useState(address);
  const [addressAutocomplete, setAddressAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isMapsLoaded } = useMaps();

  const handleAddressSelect = () => {
    const autocomplete = addressAutocomplete;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place) {
        const address = place?.formatted_address || "";
        setCompanyAddress(address);
      }
    }
  };

  const handleNameChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyName) {
      toast.error("Please enter a company name");
      return;
    }
    toast.promise(updateCompanyName(companyName), {
      loading: "Updating company name...",
      success: "Company name updated successfully",
      error: (error) => (error as Error).message,
    });
  };

  const handleEmailChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyEmail) {
      toast.error("Please enter a company email");
      return;
    }
    toast.promise(updateCompanyEmail(companyEmail), {
      loading: "Updating company email...",
      success: "Company email updated successfully",
      error: (error) => (error as Error).message,
    });
  };

  const handleAddressChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyAddress) {
      toast.error("Please enter a company address");
      return;
    }
    toast.promise(updateCompanyAddress(companyAddress), {
      loading: "Updating company address...",
      success: "Company address updated successfully",
      error: (error) => (error as Error).message,
    });
  };

  const toggleModal = (key: string) => {
    setIsOpen((prev) => !prev);
    setChange(key);
  };

  return (
    <>
      <div className="bg-background border border-line rounded-xl overflow-hidden">
        <div className="p-4 border-b border-line">
          <h3 className="font-medium font-sora text-main">
            Company Information
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sub text-xs">Company Name</p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-main text-sm">{name || "No name added"}</p>
                <button
                  onClick={() => toggleModal("name")}
                  className="text-sm text-primary font-medium font-sora hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sub text-xs">Company Email</p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-main text-sm">{email || "No email added"}</p>
                <button
                  onClick={() => toggleModal("email")}
                  className="text-sm text-primary font-medium font-sora hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sub text-xs">Company Address</p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-main text-sm">
                  {address || "No address added"}
                </p>
                <button
                  onClick={() => toggleModal("address")}
                  className="text-sm text-primary font-medium font-sora hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
        {address && (
          <div className="p-4 rounded-b-xl overflow-hidden">
            <MapEmbed address={address} />
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <Modal
            title={change}
            isOpen={isOpen}
            toggleModal={() => setIsOpen(false)}
          >
            {change === "name" && (
              <form onSubmit={handleNameChange} className="space-y-4">
                <p className="text-sub text-xs">
                  Please enter your company name
                </p>
                <Input
                  label="Company Name"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  name="phone"
                  icon={<Building size={18} />}
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-primary btn w-full text-white px-4 h-10 rounded-lg"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    "Change"
                  )}
                </button>
              </form>
            )}

            {change === "email" && (
              <form onSubmit={handleEmailChange} className="space-y-4">
                <p className="text-sub text-xs">
                  Please enter your company email
                </p>
                <Input
                  label="Company Email"
                  placeholder="Enter your company email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  name="email"
                  icon={<Mail size={18} />}
                />

                <button
                  disabled={loading}
                  type="submit"
                  className="bg-primary btn w-full text-white px-4 h-10 rounded-lg"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    "Change"
                  )}
                </button>
              </form>
            )}
            {change === "address" && (
              <form onSubmit={handleAddressChange} className="space-y-4">
                <p className="text-sub text-xs">
                  Please enter your company address
                </p>
                {isMapsLoaded ? (
                  <Autocomplete
                    onLoad={(autocomplete) =>
                      setAddressAutocomplete(autocomplete)
                    }
                    onPlaceChanged={handleAddressSelect}
                  >
                    <Input
                      label="Company Address"
                      placeholder="Enter your company address"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      name="address"
                      icon={<MapPin size={18} />}
                    />
                  </Autocomplete>
                ) : (
                  <Input
                    label="Company Address"
                    placeholder="Enter your company address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    name="address"
                    icon={<MapPin size={18} />}
                  />
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="bg-primary btn w-full text-white px-4 h-10 rounded-lg"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    "Change"
                  )}
                </button>
              </form>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompanyInformation;

const MapEmbed = ({ address }: { address: string }) => {
  const encodedAddress = encodeURIComponent(address);
  const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="400"
        frameBorder="0"
        style={{ border: 0 }}
        src={googleMapSrc}
        allowFullScreen
      ></iframe>
    </div>
  );
};
