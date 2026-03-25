import { Link, useSearchParams } from "react-router-dom";
import {
  Building2,
  Loader,
  Mail,
  Phone,
  LogIn,
  Lock,
  UserRound,
  MapPin,
} from "lucide-react";
import { Input } from "../UI";
import { useState } from "react";
import { registerFormValidation } from "@/Utils/formValidation";
import { Autocomplete } from "@react-google-maps/api";
import { AuthLayout } from "@/Layouts";
interface UserRegistrationProps {
  form: FormType;
  setSteps: (steps: { step: string, subrole: string, role: string }) => void;
  addressAutocomplete: google.maps.places.Autocomplete | null;
  setAddressAutocomplete: (
    addressAutocomplete: google.maps.places.Autocomplete | null
  ) => void;
  errors: FormType;
  setErrors: (errors: FormType) => void;
  handleAddressSelect: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const UserRegistration = ({
  form,
  setSteps,
  setAddressAutocomplete,
  errors,
  setErrors,
  handleAddressSelect,
  handleChange,
}: UserRegistrationProps) => {
const [searchParams] = useSearchParams()
const subrole = searchParams.get("subrole")
  const isBusiness = subrole === "business";
  const isCompany = subrole === "company";
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (registerFormValidation(form, setErrors, errors)) {
      setLoading(true);
      setTimeout(() => {
        setSteps({ step: "location", subrole: form.subRole || "", role: form.role || "" });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
    <AuthLayout
      title="Create an account 🚀"
      subtitle="Fill in the form below to continue"
    >
        
      <div className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          icon={<UserRound size={18} />}
          styles="capitalize placeholder:normal-case"
          placeholder="e.g. John Doe"
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          icon={<Mail size={18} />}
          styles="lowercase"
          placeholder="e.g. johndoe@gmail.com"
          error={errors.email}
        />
            
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={form.phoneNumber}
          onChange={handleChange}
          icon={<Phone size={18} />}
          placeholder="e.g. 08060000000 or +2348060000000"
          error={errors.phoneNumber}
        />
        {(isBusiness || isCompany) && (
            <>
          <Input
            label={`${isBusiness ? "Business Name" : "Company Name"}`}
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            icon={<Building2 size={18} />}
            placeholder="e.g. ABC123"
            error={errors.businessName}
          />
          <Input
            label={`${isBusiness ? "Business Registration Number" : "Company Registration Number"}`}
            name="businessRegNo"
            value={form.businessRegNo}
            onChange={handleChange}
            icon={<Building2 size={18} />}
            placeholder="e.g. ABC123"
            error={errors.businessRegNo}
          />
          <Autocomplete
                  onLoad={(autocomplete) => setAddressAutocomplete(autocomplete)}
                  onPlaceChanged={handleAddressSelect}
                >
                  <Input
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    icon={<MapPin size={18} />}
                    placeholder="e.g. 123 Main St, City"
                    error={errors.address}
                  />
                </Autocomplete>
          </>
        )}
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          icon={<Lock size={18} />}
          placeholder="minimum 8 characters"
          error={errors.password}
        />
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full btn bg-primary text-white px-4 h-10 center rounded-full"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : "Continue"}
        </button>
      </div>

      <div className="flex items-center text-sub text-sm center my-6 gap-3">
        <p>Already have an account?</p>
        <Link
          to="/login"
          className="bg-primary/10 text-primary btn px-4 py-2 rounded-full"
        >
          <LogIn size={18} />
          <span>Login</span>
        </Link>
      </div>
      </AuthLayout>
    </>
  );
};

export default UserRegistration;
