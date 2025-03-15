import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const SummaryReport = () => {
  const router = useRouter();
  const { scanId } = router.query;
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scanId) return;
  
    const fetchSummary = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          return;
        }
  
        const response = await axios.get(
          `http://localhost:5000/api/scanners/summary?scanId=${scanId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setSummary(response.data.Summary || "No summary available.");
      } catch (err) {
        setError("Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSummary();
  }, [scanId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Summary Report</h1>
      {loading && <p>Loading summary...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <p className="border p-4 rounded bg-gray-100">{summary}</p>}

      <button
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={() => router.back()}
      >
        Back to Results
      </button>
    </div>
  );
};

export default SummaryReport;