import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const API_BASE_URL = 'http://localhost:5000';

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !password) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: `+${phone}`,
            password
        }),
        });

        const data = await response.json();

        if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
            navigate("/login");
        }, 2000);
        } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error('Registration error:', error);
        setErrorMessage("An error occurred. Please try again later.");
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Get a verification code sent to your phone
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            We'll send a code to verify your phone number
          </p>
          
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <PhoneInput
                country={'rw'}
                value={phone}
                onChange={setPhone}
                inputStyle={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  paddingLeft: '52px'
                }}
                buttonStyle={{
                  borderRadius: '0.5rem 0 0 0.5rem',
                  border: '1px solid #d1d5db',
                  borderRight: 'none',
                  background: 'white'
                }}
                dropdownStyle={{
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  marginTop: '4px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                enableSearch={true}
                searchPlaceholder="Search country..."
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification code to this number (charges may apply)
              </p>
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              disabled={!firstName || !lastName || !email || !phone || !password || isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium transition-all ${
                !firstName || !lastName || !email || !phone || !password || isLoading
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

            {/* Social Buttons */}
            <div className="space-y-3">
              <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FcGoogle className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>
              <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaFacebook className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Continue with Facebook</span>
              </button>
              <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
