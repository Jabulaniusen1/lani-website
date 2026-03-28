import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/Layouts";
import { Input, Select } from "@/Components/UI";
import { apiRequest } from "@/Backend/api";
import { useAuth } from "@/Hooks";
import { toast } from "sonner";
import { Bike, CreditCard, Loader, MapPin, User } from "lucide-react";

type OnboardingForm = {
  vehicleType: string;
  vehiclePlate: string;
  nin: string;
  dateOfBirth: string;
  gender: string;
  homeAddress: string;
};

type OnboardingErrors = Partial<Record<keyof OnboardingForm, string>>;

const vehicleOptions = [
  { value: "bike", label: "Bike (Motorcycle)" },
  { value: "bicycle", label: "Bicycle" },
  { value: "car", label: "Car" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const validate = (
  form: OnboardingForm,
  setErrors: (e: OnboardingErrors) => void
): boolean => {
  const errors: OnboardingErrors = {};
  if (!form.vehicleType) errors.vehicleType = "Please select a vehicle type";
  if (!form.nin) errors.nin = "NIN is required";
  else if (!/^\d{11}$/.test(form.nin)) errors.nin = "NIN must be exactly 11 digits";
  if (!form.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  if (!form.gender) errors.gender = "Please select a gender";
  if (!form.homeAddress) errors.homeAddress = "Home address is required";
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

const RiderOnboarding = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OnboardingForm>({
    vehicleType: "",
    vehiclePlate: "",
    nin: "",
    dateOfBirth: "",
    gender: "",
    homeAddress: "",
  });
  const [errors, setErrors] = useState<OnboardingErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form, setErrors)) return;

    setLoading(true);
    try {
      await apiRequest("/rider/onboarding", {
        method: "POST",
        body: {
          vehicleType: form.vehicleType,
          ...(form.vehiclePlate ? { vehiclePlate: form.vehiclePlate } : {}),
          nin: form.nin,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          homeAddress: form.homeAddress,
        },
      });
      await refreshUser();
      toast.success("Onboarding submitted! Your account is under review.");
      navigate("/dashboard");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Complete Your Onboarding 🏍️"
      subtitle="Fill in your details below. Our team will review and approve your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Vehicle Type"
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          options={vehicleOptions}
          error={errors.vehicleType}
        />
        <Input
          label="Vehicle Plate Number (optional)"
          name="vehiclePlate"
          value={form.vehiclePlate}
          onChange={handleChange}
          icon={<Bike size={18} />}
          placeholder="e.g. LND 123 XY"
        />
        <Input
          label="NIN (National Identification Number)"
          name="nin"
          value={form.nin}
          onChange={handleChange}
          icon={<CreditCard size={18} />}
          placeholder="11-digit NIN"
          error={errors.nin}
        />
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={handleChange}
          icon={<User size={18} />}
          error={errors.dateOfBirth}
        />
        <Select
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={genderOptions}
          error={errors.gender}
        />
        <Input
          label="Home Address"
          name="homeAddress"
          value={form.homeAddress}
          onChange={handleChange}
          icon={<MapPin size={18} />}
          placeholder="e.g. 15 Aka Road, Uyo, Akwa Ibom"
          error={errors.homeAddress}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full btn bg-primary text-white px-4 h-10 rounded-full"
        >
          {loading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            "Submit Onboarding"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RiderOnboarding;
