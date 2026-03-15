import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

type LoginProps = {
  setIsLoggedIn: (val: boolean) => void; // ✅ new prop for reactive navbar
};

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) setStep("password");
      else setEmailError(data.message || "Email not found");
    } catch (err) {
      console.error(err);
      setEmailError("Server error");
    }
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ update navbar immediately
        setIsLoggedIn(true);

        navigate(from, { replace: true });
      } else {
        setPasswordError(data.message || "Incorrect password");
      }
    } catch (err) {
      console.error(err);
      setPasswordError("Server error");
    }
    setIsLoading(false);
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setPasswordError("");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Your email form and buttons remain unchanged */}
                <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                  Sign in to your account
                </h1>
                {emailError && (
                  <div className="mb-2 w-full bg-red-50 text-red-600 font-medium px-3 py-2 rounded-md text-center">
                    {emailError}
                  </div>
                )}
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!email || isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium transition-all ${
                      !email || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </motion.button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400">or</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FcGoogle className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Google
                    </span>
                  </button>

                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Facebook
                    </span>
                  </button>

                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaApple className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium text-gray-700">
                      Continue with Apple
                    </span>
                  </button>
                </div>
                {/* Rest of social buttons and signup link unchanged */}
              </motion.div>
            ) : (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Password form unchanged */}
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    ←
                  </button>
                  <h1 className="text-2xl font-semibold text-gray-900">Enter your password</h1>
                </div>
                {passwordError && (
                  <div className="mb-2 w-full bg-red-50 text-red-600 font-medium px-3 py-2 rounded-md text-center">
                    {passwordError}
                  </div>
                )}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{email}</p>
                </div>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!password || isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;