import { Input } from "@/Components/UI"
import { AuthLayout } from "@/Layouts"
import { LogIn, Mail } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { apiRequest } from "@/Backend/api"

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!email){
            setError("Email is required");
            return;
        }
        setLoading(true);
        try {
          await apiRequest("/auth/forgot-password", {
            method: "POST",
            auth: false,
            body: { email: email.toLowerCase() },
          });
          toast.success("If that email is registered, a reset code has been sent");
          navigate(`/new-password?email=${encodeURIComponent(email.toLowerCase())}`);
        } catch (error) {
          toast.error((error as Error).message);
        } finally {
          setLoading(false);
        }
    }

    return (
        <AuthLayout title="Reset Password 🔐" subtitle="Enter your email to reset your password.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    icon={<Mail size={18} />}
                    value={email}
                    onChange={handleChange}
                    styles="lowercase placeholder:normal-case"
                    error={error}
                />
                <button disabled={loading} type="submit" className="w-full btn bg-primary text-white px-4 h-10 rounded-full">
                    {loading ? "Sending..." : "Send Reset Code"}
                </button>
            </form>
            <div className="flex items-center text-sub text-sm center my-6 gap-3">
                <p>Remembered your password?</p>
                <Link
                    to="/login"
                    className="bg-primary/10 text-primary btn px-4 py-2 rounded-full"
                >
                    <LogIn size={18} />
                    <span>Login</span>
                </Link>
            </div>
        </AuthLayout>
    )
}

export default ResetPassword; 
