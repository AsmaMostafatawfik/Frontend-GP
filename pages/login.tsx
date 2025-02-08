
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const token = response.data.token;
      Cookies.set('token', token, { expires: 1 }); // Set token in cookies for 1 day
      router.push('/userhome'); // Redirect to home page
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Handle known Axios errors
        if (err.response && err.response.status === 400) {
          setError('Invalid email or password');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        // Handle unexpected errors
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading after request finishes
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
    >
      <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
        <h1 className="text-center text-black font-bold text-2xl mb-6">Login</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
            disabled={loading}
          />

          {/* Login Button with Loader */}
          <button
            type="submit"
            className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
