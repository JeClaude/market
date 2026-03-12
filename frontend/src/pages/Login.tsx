import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate checking if email exists
    setTimeout(() => {
      setIsLoading(false);
      setStep("password");
    }, 800);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert("Login successful! (Demo)");
      navigate("/");
    }, 800);
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
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
                <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">Sign in to your account</h1>
                
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
                      !email || isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700'
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
                    <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                  </button>

                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Continue with Facebook</span>
                  </button>

                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaApple className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium text-gray-700">Continue with Apple</span>
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>

                <p className="mt-4 text-center text-xs text-gray-400">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-gray-500 hover:underline">User Agreement</Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-gray-500 hover:underline">Privacy Notice</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-semibold text-gray-900">Enter your password</h1>
                </div>
                
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                      autoFocus
                    />
                  </div>

                  <div className="text-right mb-4">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!password || isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium transition-all ${
                      !password || isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "Sign in"
                    )}
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