import { MapsContext } from "@/Context/MapsContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];

const MapsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded: isMapsLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [riderLocation, setRiderLocation] = useState<{
    address: string;
    city: string;
    country: string;
  } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    useEffect(() => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          setIsLocationEnabled(result.state === "granted");
        });
      }
  }, []);

  const getRiderLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.log(error);
          toast.error(error.message);
          reject(error);
        }
      );
    });
  };

  const askForLocation = async () => {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });

      if (result.state === "granted") {
        setIsLocationEnabled(true);
      } else if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          () => {
            setIsLocationEnabled(true);
          },
          (error) => {
            console.error(error);
            setIsLocationEnabled(false);
          }
        );
      } else {
        setIsLocationEnabled(false);
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsFetchingLocation(true);
    if (!latitude || !longitude) {
      console.log("No latitude or longitude");
      setIsFetchingLocation(false);
      return null;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.address) {
        setRiderLocation(data.address); // Assuming you want to set the entire address object
        console.log(data.address);
      } else {
        console.log("No address found for the given coordinates.");
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const value: MapsContextType = {
    isMapsLoaded,
    isLocationEnabled,
    getRiderLocation,
    askForLocation,
    reverseGeocode,
    isFetchingLocation,
    riderLocation,
  };
  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
};

export default MapsProvider;
