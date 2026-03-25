import { Input } from "@/Components/UI";
import { AuthLayout } from "@/Layouts";
import { Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "@/Backend/api";

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email) {
      setError((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!form.code) {
      setError((prev) => ({ ...prev, code: "Reset code is required" }));
      return;
    }
    if (!form.newPassword) {
      setError((prev) => ({ ...prev, newPassword: "New password is required" }));
      return;
    }
    if (form.newPassword.length < 8) {
      setError((prev) => ({
        ...prev,
        newPassword: "New password must be at least 8 characters",
      }));
      return;
    }
    if (!form.confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Confirm password is required",
      }));
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        auth: false,
        body: {
          email: form.email.toLowerCase(),
          code: form.code,
          newPassword: form.newPassword,
        },
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set New Password 🔑" subtitle="Enter your reset code and new password.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          value={form.email}
          onChange={handleChange}
          styles="lowercase"
          error={error.email}
        />
        <Input
          label="Reset Code"
          name="code"
          type="text"
          placeholder="Enter the 6-digit code"
          icon={<Shield size={18} />}
          value={form.code}
          onChange={handleChange}
          error={error.code}
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="Enter your new password"
          icon={<Lock size={18} />}
          value={form.newPassword}
          onChange={handleChange}
          styles="placeholder:normal-case"
          error={error.newPassword}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          icon={<Lock size={18} />}
          value={form.confirmPassword}
          onChange={handleChange}
          styles="placeholder:normal-case"
          error={error.confirmPassword}
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full btn bg-primary text-white px-4 h-10 rounded-full"
        >
          {loading ? "Resetting..." : "Set New Password"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default NewPassword;
