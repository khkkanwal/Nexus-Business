import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CircleDollarSign,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { UserRole } from "../../types";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      return "Full name is required";
    }

    if (name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }

    if (!email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email";
    }

    if (!password) {
      return "Password is required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password.trim(), role);

      navigate(
        role === "entrepreneur"
          ? "/dashboard/entrepreneur"
          : "/dashboard/investor",
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Join Business Nexus
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Register as
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center ${
                    role === "entrepreneur"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300"
                  }`}
                  onClick={() => setRole("entrepreneur")}
                >
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>

                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center ${
                    role === "investor"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300"
                  }`}
                  onClick={() => setRole("investor")}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              startAdornment={<User size={18} />}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              startAdornment={<Mail size={18} />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              startAdornment={<Lock size={18} />}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              startAdornment={<Lock size={18} />}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Create Account
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
