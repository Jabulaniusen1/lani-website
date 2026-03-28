import { AuthLayout } from "@/Layouts";
import { Circle, CircleCheck, Loader } from "lucide-react";
import { toast } from "sonner";

interface RoleProps {
  handleNextStep: () => void;
  form: FormType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  loading: boolean;
  setSteps: (steps: { step: string }) => void;
}

const Role = ({ handleNextStep, form, handleChange, loading, setSteps }: RoleProps) => {
  const handleNext = () => {
    if (form.role === "") {
      toast.error("Please select a role first!");
      return;
    }
    if (form.role !== "vendor") {
      handleNextStep();
    } else {
      setSteps({ step: "vendor" });
    }
  };
  return (
    <>
      <AuthLayout
        title="Select a Role 🚀"
        subtitle="Choose how you want to use Lani: order as a customer, sell as a merchant, or deliver as a rider."
      >
        <div className="flex flex-col gap-4">
          <label
            htmlFor="vendor"
            className="text-main font-sora text-sm font-medium"
          >
            <input
              type="radio"
              name="role"
              id="vendor"
              value="vendor"
              checked={form.role === "vendor"}
              className="hidden"
              onChange={handleChange}
            />
            <div
              className={`flex items-center gap-2 bg-background border border-line rounded-xl p-4 ${form.role === "vendor" ? "border-primary" : ""}`}
            >
              {form.role === "vendor" ? (
                <CircleCheck size={20} className="text-primary" />
              ) : (
                <Circle size={20} className="text-sub" />
              )}
              Vendor
            </div>
          </label>
          <label
            htmlFor="rider"
            className="text-main font-sora text-sm font-medium"
          >
            <input
              type="radio"
              name="role"
              id="rider"
              value="rider"
              checked={form.role === "rider"}
              className="hidden"
              onChange={handleChange}
            />
            <div
              className={`flex items-center gap-2 bg-background border border-line rounded-xl p-4 ${form.role === "rider" ? "border-primary" : ""}`}
            >
              {form.role === "rider" ? (
                <CircleCheck size={20} className="text-primary" />
              ) : (
                <Circle size={20} className="text-sub" />
              )}
              Rider
            </div>
          </label>
          <button
            disabled={loading}
            onClick={handleNext}
            className="btn h-10 w-full bg-primary text-white mt-4"
          >
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </AuthLayout>
    </>
  );
};

export default Role;
