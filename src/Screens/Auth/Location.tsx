import { AuthLayout } from "@/Layouts";
import { Search } from "@/Components/UI";
import { useState } from "react";
import { states } from "@/Constants/data";
import { CheckCircle, Circle, Loader, MapPinned } from "lucide-react";
import { useAuth } from "@/Hooks";
import { toast } from "sonner";

interface LocationProps {
  form: FormType;
  setSteps: (steps: { step: string }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  loading: boolean;
}

const Location = ({form, handleChange}: LocationProps) => {

  const {register, loading} = useAuth();

  const [search, setSearch] = useState("");

  const filteredStates = states.filter((state) =>
    state.capital.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.location) {
      toast.error("Please select a city");
      return;
    }

    toast.promise(register(form), {
      loading: "Registering...",
      success: "Registered successfully",
      error: (error) => (error as Error).message,
    });
  };

  

  return (
    <AuthLayout
      title="Select Your Location 📍"
      subtitle="Choose the city where you'll be making deliveries."
    >
       
      <Search search={search} setSearch={setSearch} placeholder="Search for a city" />

      {filteredStates.length === 0 && (
        <div className="flex flex-col gap-2 center mt-4">
          <p className="text-sm text-sub">No results found!</p>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {filteredStates.map((state) => (
          <label key={state.id}>
            <input
              type="radio"
              name="location"
              value={state.capital}
              checked={
                form.location === state.capital
              }
              onChange={handleChange}
              className="hidden"
            />
            <div
              className={`flex items-center gap-4 bg-background rounded-xl p-2 ${
                form.location === state.capital
                  ? "border border-primary"
                  : "border border-line"
              }`}
            >
              <div
                className={`rounded-md h-10 w-10 center ${
                  form.location === state.capital
                    ? "bg-primary/10 text-primary"
                    : "bg-background-2 text-sub"
                }`}
              >
                <MapPinned size={20} />
              </div>
              <div className="flex-1">
                <span className="text-sm font-sora font-medium">{state.capital}</span>
                <p className="text-xs text-sub">{state.state}</p>
              </div>

              <div className="center h-10 w-10">
                {form.location === state.capital ? (
                  <CheckCircle size={20} className="text-primary" />
                ) : (
                  <Circle size={20} className="text-sub" />
                )}
              </div>
            </div>
          </label>
        ))}
        <button onClick={handleSubmit} className="btn h-10 bg-primary text-white center rounded-xl" disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Done"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default Location;
