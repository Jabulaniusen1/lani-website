import { DispatchFormContext } from "@/Context/DispatchFormContext";
import { useState } from "react";
import { dispatchFormValidation } from "@/Utils/formValidation";
import { toast } from "sonner";
import { usePackageOrder, useAuth, useAdmin } from "@/Hooks";
import { calculatePrice } from "@/Utils/helpers";


const DispatchFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { createOrder, loading } = usePackageOrder();
  const { userData } = useAuth();
  const { rates } = useAdmin();
  // States
 
  const rate =
    Number(userData?.location === "Uyo" ? rates?.rateForUyo : rates?.rateForPh) ||
    300;

  const [currentStep, setCurrentStep] = useState(1);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    image: null,
    name: "",
    texture: "",
    notes: "",
  });

  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    pickupDate: new Date().toISOString().split("T")[0],
    pickupTime: "",
    pickupLocation: "",
    pickupLocationLat: 0,
    pickupLocationLng: 0,
  });

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    deliveryLocation: "",
    receiverName: "",
    receiverPhone: "",
    deliveryLocationLat: 0,
    deliveryLocationLng: 0,
  });

  const [pickupAutocomplete, setPickupAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [deliveryAutocomplete, setDeliveryAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Errors
  const [packageErrors, setPackageErrors] = useState<
    PackageDetails | undefined
  >();
  const [pickupErrors, setPickupErrors] = useState<PickupDetails | undefined>();
  const [deliveryErrors, setDeliveryErrors] = useState<
    DeliveryDetails | undefined
  >();

  //   Handlers
  const handlePackageDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPackageDetails({ ...packageDetails, [name]: value });
    setPackageErrors({
      ...packageErrors,
      name: "",
      texture: "",
      image: null,
      notes: "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPackageDetails({ ...packageDetails, image: file });
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPackageDetails({ ...packageDetails, [name]: value });
    setPackageErrors({
      ...packageErrors,
      name: "",
      texture: "",
      image: null,
      notes: "",
    });
  };

  const handlePickupDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPickupDetails({ ...pickupDetails, [name]: value });
    setPickupErrors({
      ...pickupErrors,
      pickupDate: "",
      pickupTime: "",
      pickupLocation: "",
      pickupLocationLat: 0,
      pickupLocationLng: 0,
    });
  };

  const handleDeliveryDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails({ ...deliveryDetails, [name]: value });
    setDeliveryErrors({
      ...deliveryErrors,
      deliveryLocation: "",
      receiverName: "",
      receiverPhone: "",
      deliveryLocationLat: 0,
      deliveryLocationLng: 0,
    });
  };

  //   Change Steps
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePlaceSelect = (type: "pickup" | "delivery") => {
    const autocomplete =
      type === "pickup" ? pickupAutocomplete : deliveryAutocomplete;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place) {
        const lat = place?.geometry?.location?.lat() || 0;
        const lng = place?.geometry?.location?.lng() || 0;
        if (type === "pickup") {
          setPickupDetails((prev) => ({
            ...prev,
            pickupLocation: place?.formatted_address || "",
            pickupLocationLat: lat,
            pickupLocationLng: lng,
          }));
        } else {
          setDeliveryDetails((prev) => ({
            ...prev,
            deliveryLocation: place?.formatted_address || "",
            deliveryLocationLat: lat,
            deliveryLocationLng: lng,
          }));
        }
      }
    }
  };

  const handleSubmitWithPayment = () => {
    if (
      dispatchFormValidation(
        setCurrentStep,
        packageDetails,
        pickupDetails,
        deliveryDetails,
        setPackageErrors,
        packageErrors as PackageDetails,
        pickupErrors as PickupDetails,
        deliveryErrors as DeliveryDetails,
        setPickupErrors,
        setDeliveryErrors
      )
    ) {
      const pickup = {
        lat: pickupDetails.pickupLocationLat,
        lon: pickupDetails.pickupLocationLng,
      };
      const delivery = {
        lat: deliveryDetails.deliveryLocationLat,
        lon: deliveryDetails.deliveryLocationLng,
      };
      const price = calculatePrice(pickup, delivery, rate);
      toast.promise(createOrder(packageDetails, deliveryDetails, pickupDetails, price, true), {
        loading: "Creating order...",
        success: "Order created successfully",
        error: (error) => (error as Error).message,
      });
    }
  };
  const handleSubmitWithoutPayment = () => {
    if (
      dispatchFormValidation(
        setCurrentStep,
        packageDetails,
        pickupDetails,
        deliveryDetails,
        setPackageErrors,
        packageErrors as PackageDetails,
        pickupErrors as PickupDetails,
        deliveryErrors as DeliveryDetails,
        setPickupErrors,
        setDeliveryErrors
      )
    ) {
      const pickup = {
        lat: pickupDetails.pickupLocationLat,
        lon: pickupDetails.pickupLocationLng,
      };
      const delivery = {
        lat: deliveryDetails.deliveryLocationLat,
        lon: deliveryDetails.deliveryLocationLng,
      };
      const price = calculatePrice(pickup, delivery, rate);
     
      toast.promise(createOrder(packageDetails, deliveryDetails, pickupDetails, price, false), {
        loading: "Creating order...",
        success: "Order created successfully",
        error: (error) => (error as Error).message,
      });
    }
  };

  const value: DispatchFormContextType = {
    currentStep,
    setCurrentStep,
    packageDetails,
    setPackageDetails,
    imgPreview,
    setImgPreview,
    handlePackageDetails,
    handleImageChange,
    handleSelectChange,
    handleNextStep,
    handlePrevStep,
    pickupDetails,
    setPickupDetails,
    handlePickupDetails,
    deliveryDetails,
    setDeliveryDetails,
    handleDeliveryDetails,
    handleSubmitWithPayment,
    handleSubmitWithoutPayment,
    packageErrors,
    setPackageErrors,
    pickupErrors,
    setPickupErrors,
    deliveryErrors,
    setDeliveryErrors,
    pickupAutocomplete,
    setPickupAutocomplete,
    deliveryAutocomplete,
    setDeliveryAutocomplete,
    handlePlaceSelect,
    loading,
  };
  return (
    <DispatchFormContext.Provider value={value}>
      {children}
    </DispatchFormContext.Provider>
  );
};

export default DispatchFormProvider;
