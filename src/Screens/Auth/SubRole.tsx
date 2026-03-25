import { AuthLayout } from "@/Layouts";
import { CircleCheck, Circle, Loader } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
interface SubRoleProps {
 
  form: FormType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setSteps: (steps: { step: string, subrole: string }) => void;
}

const SubRole = ({ form, handleChange, setSteps }: SubRoleProps) => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams()
  const role = searchParams.get("role")
  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setSteps({step: "register", subrole: form.subRole || ""});
      setLoading(false);
    }, 1000);
  };
  return (
    <AuthLayout title="Account Type 🚀" subtitle="Choose the type of account you want to create">
      
        {role === "customer" && (
          <div className="flex flex-col gap-4">
          <label
            htmlFor="individual"
            className="text-main font-sora text-sm font-medium "
          >
            <input
              type="radio"
              name="subRole"
              id="individual"
              value="individual"
              checked={form.subRole === "individual"}
              className="hidden"
              onChange={handleChange}
            />
            <div
              className={`flex items-center gap-2 bg-background border border-line rounded-xl p-4 ${form.subRole === "individual" ? "border-primary" : ""}`}
            >
              {form.subRole === "individual" ? (
                <CircleCheck size={20} className="text-primary" />
              ) : (
                <Circle size={20} className="text-sub" />
              )}
              Individual  
            </div>
          </label>
          <label
            htmlFor="business"
            className="text-main font-sora text-sm font-medium"
          >
            <input
              type="radio"
              name="subRole"
              id="business"
              value="business"
              checked={form.subRole === "business"}
              className="hidden"
              onChange={handleChange}
            />
            <div
              className={`flex items-center gap-2 bg-background border border-line rounded-xl p-4 ${form.subRole === "business" ? "border-primary" : ""}`}
            >
              {form.subRole === "business" ? (
                <CircleCheck size={20} className="text-primary" />
              ) : (
                <Circle size={20} className="text-sub" />
              )}
              Business
            </div>
          </label>
          </div>
        )}

        {role === "rider" && (
          <div className="flex flex-col gap-4">
          <label
            htmlFor="individual"
            className="text-main font-sora text-sm font-medium "
          >
            <input
              type="radio"
              name="subRole"
              id="individual"
              value="individual"
              checked={form.subRole === "individual"}
              className="hidden"
              onChange={handleChange}
            />
            <div
              className={`flex items-center gap-2 bg-background border border-line rounded-xl p-4 ${form.subRole === "individual" ? "border-primary" : ""}`}
            >
              {form.subRole === "individual" ? (
                <CircleCheck size={20} className="text-primary" />
              ) : (
                <Circle size={20} className="text-sub" />
              )}
              Individual
            </div>
          </label>
          <label
            htmlFor="company"
            className="text-main font-sora text-sm font-medium"
          >
            <input
              type="radio"
              name="subRole"
              id="company"
              value="company"
              checked={form.subRole === "company"}
              className="hidden"
              onChange={handleChange}
            />
            <div
              className={`flex items-center gap-2 bg-background border border-line rounded-xl p-4 ${form.subRole === "company" ? "border-primary" : ""}`}
            >
              {form.subRole === "company" ? (
                <CircleCheck size={20} className="text-primary" />
              ) : (
                <Circle size={20} className="text-sub" />
              )}
              Company
            </div>
          </label>
          </div>
        )}
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
    </AuthLayout>
  )
}

export default SubRole
