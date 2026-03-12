import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) return;
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      alert("Registration successful! (Demo)");
      navigate("/login");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">Create your account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                required
                minLength={6}
              />
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              By selecting Create personal account, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">User Agreement</Link>{" "}
              and acknowledge reading our{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">User Privacy Notice</Link>.
            </p>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!firstName || !lastName || !email || !password || isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium transition-all ${
                !firstName || !lastName || !email || !password || isLoading
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Create personal account"
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or</span>
              </div>
            </div>

            {/* Social Buttons - Updated with "Continue with" text */}
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
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;