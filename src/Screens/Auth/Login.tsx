import { Input } from "@/Components/UI";
import { AuthLayout } from "@/Layouts";
import { loginFormValidation } from "@/Utils/formValidation";
import { Mail, Lock, RefreshCcw, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/Hooks";
const Login = () => {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginFormValidation(form, setErrors, errors)) {
      toast.promise(login(form), {
        loading: "Logging in...",
        success: () => "Login successful",
        error: (error) => (error as Error).message,
      });
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <AuthLayout title="Welcome Back! 👋" subtitle="Login to your account to continue using our services.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          value={form.email}
          onChange={handleChange}
          styles="lowercase placeholder:normal-case"
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          icon={<Lock size={18} />}
          value={form.password}
          onChange={handleChange}
          styles="placeholder:normal-case"
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <div className="font-semibold capitalize text-primary text-sm">
            Forgot your password?
          </div>
          <Link
            to="/reset"
            className="bg-primary/10 text-primary btn items-center flex px-4 py-2 rounded-full"
          >
            <RefreshCcw size={18} />
            <span>Reset</span>
          </Link>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full btn bg-primary text-white px-4 h-10 rounded-full"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
