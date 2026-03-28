import { Link } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  Loader,
  Mail,
  Phone,
  Lock,
  LogIn,
  MapPin,
  Upload,
} from "lucide-react";
import { Input } from "../UI";
import { vendorRegistrationFormValidation } from "@/Utils/formValidation";
import { Autocomplete } from "@react-google-maps/api";
import { AuthLayout } from "@/Layouts";
import { useState } from "react";

interface VendorRegistrationProps {
  form: FormType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCacDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAddressAutocomplete: (
    autocomplete: google.maps.places.Autocomplete | null
  ) => void;
  errors: FormType;
  setErrors: (errors: FormType) => void;
  handleAddressSelect: () => void;
  setSteps: (steps: { step: string }) => void;
}

const VendorRegistration = ({
  form,
  handleChange,
  handleCacDocumentChange,
  setSteps,
  setAddressAutocomplete,
  errors,
  setErrors,
  handleAddressSelect,
}: VendorRegistrationProps) => {
  const [loading, setLoading] = useState(false);
  const isBusinessRegistered = form.isBusinessRegistered === "true";

  const handleNext = () => {
    if (vendorRegistrationFormValidation(form, setErrors, errors)) {
      setLoading(true);
      setTimeout(() => {
        setSteps({ step: "location" });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <AuthLayout
        title="Vendor Registration 🚀"
        subtitle="Fill in the form below to continue"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            icon={<Building2 size={18} />}
            styles="capitalize placeholder:normal-case"
            placeholder="e.g. John Doe"
            error={errors.name}
          />
          <Input
            label="Contact Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            icon={<Mail size={18} />}
            styles="lowercase"
            placeholder="e.g. vendor@example.com"
            error={errors.email}
          />
          <Input
            label="Contact Phone"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            icon={<Phone size={18} />}
            placeholder="e.g. 08060000000 or +2348060000000"
            error={errors.phoneNumber}
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
              placeholder="e.g. 123 Main St, City (optional)"
              error={errors.address}
            />
          </Autocomplete>
          <div className="space-y-1.5">
            <label className="block font-sans text-sm text-sub font-medium mb-1">
              Merchant Type
            </label>
            <div className="relative">
              <select
                name="merchantType"
                value={form.merchantType}
                onChange={handleChange}
                className="w-full px-4 h-10 rounded-lg border border-line focus-within:border-primary bg-background text-sm text-main appearance-none"
              >
                <option value="RESTAURANT">Restaurant</option>
                <option value="PHARMACY">Pharmacy</option>
                <option value="SUPERMARKET">Supermarket</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sub pointer-events-none"
              />
            </div>
            {errors.merchantType && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.merchantType}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="block font-sans text-sm text-sub font-medium">
              Is your business CAC registered?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label
                htmlFor="registered-yes"
                className={`h-10 center rounded-lg border text-sm cursor-pointer ${
                  isBusinessRegistered
                    ? "border-primary text-primary bg-primary/5"
                    : "border-line text-sub"
                }`}
              >
                <input
                  id="registered-yes"
                  type="radio"
                  name="isBusinessRegistered"
                  value="true"
                  checked={isBusinessRegistered}
                  onChange={handleChange}
                  className="hidden"
                />
                Yes
              </label>
              <label
                htmlFor="registered-no"
                className={`h-10 center rounded-lg border text-sm cursor-pointer ${
                  !isBusinessRegistered
                    ? "border-primary text-primary bg-primary/5"
                    : "border-line text-sub"
                }`}
              >
                <input
                  id="registered-no"
                  type="radio"
                  name="isBusinessRegistered"
                  value="false"
                  checked={!isBusinessRegistered}
                  onChange={handleChange}
                  className="hidden"
                />
                No
              </label>
            </div>
          </div>
          {isBusinessRegistered && (
            <div className="space-y-1.5">
              <label
                htmlFor="cacDocument"
                className="block font-sans text-sm text-sub font-medium mb-1"
              >
                CAC Document (image or PDF)
              </label>
              <label
                htmlFor="cacDocument"
                className="h-10 px-3 rounded-lg border border-line bg-background text-sm text-main flex items-center gap-2 cursor-pointer"
              >
                <Upload size={16} className="text-sub" />
                <span className="truncate">
                  {form.cacDocument ? form.cacDocument.name : "Upload CAC document"}
                </span>
              </label>
              <input
                id="cacDocument"
                name="cacDocument"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleCacDocumentChange}
              />
              {!form.cacDocument && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  CAC document is required for registered businesses
                </p>
              )}
            </div>
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
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              "Continue"
            )}
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

export default VendorRegistration;
