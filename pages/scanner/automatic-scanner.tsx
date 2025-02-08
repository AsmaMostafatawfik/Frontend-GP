import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const AutomaticScannerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setProgress(0);

    const token = Cookies.get('token');
    if (!token) {
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      // Fake progress simulation (replace with real scan status if available)
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 500);

      const response = await axios.post(
        'http://localhost:5000/api/scan-requests',
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearInterval(progressInterval);
      setProgress(100); // Complete progress

      const { redirectUrl } = response.data;
      if (redirectUrl) {
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } catch (err) {
      setError('An error occurred during scan submission.');
      console.error(err);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      {/* Centered Main Container */}
      <main className="flex items-center justify-center h-screen bg-[#0A0A23] text-white">
        <div className="flex flex-col items-center max-w-md w-full p-5 bg-white rounded shadow-lg">
          <h1 className="text-3xl mb-5 text-black font-bold">Automatic Scanner</h1>
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <label className="text-lg mb-2 text-black">
              URL:
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                placeholder="Enter URL"
                required
              />
            </label>

            {/* Replacing Button with Progress Bar */}
            {!loading ? (
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded flex items-center justify-center"
              >
                Scan
              </button>
            ) : (
              <div className="w-full bg-gray-300 h-10 mt-4 rounded overflow-hidden relative">
                <div
                  className="h-full transition-all duration-500 ease-in-out flex items-center justify-center"
                  style={{ width: `${progress}%`, backgroundColor: '#0A0A23' }}
                >
                  <span className="text-white font-semibold">{progress}%</span>
                </div>
              </div>
            )}
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </main>
    </Layout>
  );
};

export default AutomaticScannerPage;
