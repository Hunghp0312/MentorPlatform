// LoginPage.tsx
import React, { useState } from "react";
import InputCustom from "../../components/input/InputCustom";
import InputCheckbox from "../../components/input/InputCheckbox";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation example
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    // Simulate API call
    console.log("Login attempt with:", { email, password, rememberMe });
    // Replace with your actual login logic:
    // try {
    //   const response = await loginUser({ email, password });
    //   // Handle successful login (e.g., redirect, set token)
    //   console.log("Login successful:", response);
    // } catch (apiError: any) {
    //   setError(apiError.message || "Login failed. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
    setTimeout(() => {
      // Simulate delay
      // Example error
      if (email === "fail@example.com") {
        setError("Invalid credentials provided.");
      } else {
        alert(`Login successful (simulated) for ${email}`);
        // Reset form or redirect
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-200">
      <div className="absolute top-8 text-center w-full">
        <h1 className="text-3xl font-bold text-orange-500">MentorConnect</h1>
      </div>

      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl mt-16 sm:mt-20">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to continue to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InputCustom
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            isRequired
            // Assuming InputCustom applies dark theme styles internally
            // If not, you might pass specific classNames like:
            // className="bg-slate-700 border-slate-600 text-slate-100 focus:ring-orange-500 focus:border-orange-500"
          />

          <div>
            <InputCustom
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              isRequired
              // Assuming InputCustom applies dark theme styles internally
            />
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() =>
                  alert("Forgot password functionality not implemented yet.")
                }
                className="text-xs font-medium text-orange-500 hover:text-orange-400">
                Forgot password?
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <InputCheckbox
              label="Remember me"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              // Assuming InputCheckbox styles match the theme
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center bg-red-900 bg-opacity-30 p-2 rounded-md">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-slate-800 text-sm text-slate-500">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-md shadow-sm bg-red-500 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500">
              {/* Replace with Google icon */}
              <span className="sr-only">Sign in with Google</span>G
            </button>
          </div>
          <div>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-md shadow-sm bg-slate-600 text-sm font-medium text-white hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500">
              {/* Replace with GitHub icon */}
              <span className="sr-only">Sign in with GitHub</span> GH
            </button>
          </div>
          <div>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500">
              {/* Replace with LinkedIn icon */}
              <span className="sr-only">Sign in with LinkedIn</span> LI
            </button>
          </div>
        </div>

        <div className="text-sm text-center mt-8">
          <p className="text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() =>
                alert("Sign-up functionality not implemented yet.")
              }
              className="font-medium text-orange-500 hover:text-orange-400">
              Sign up
            </button>
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 text-center w-full px-4">
        <p className="text-xs text-slate-500">
          By continuing, you agree to our{" "}
          <button
            type="button"
            onClick={() =>
              alert("Privacy Policy functionality not implemented yet.")
            }
            className="font-medium text-orange-500 hover:text-orange-400">
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() =>
              alert("Privacy Policy functionality not implemented yet.")
            }
            className="font-medium text-orange-500 hover:text-orange-400">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
