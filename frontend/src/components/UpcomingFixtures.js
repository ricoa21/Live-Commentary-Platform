import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const DanishFixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ date: '', team: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view fixtures');
      setLoading(false);
      return;
    }

    const fetchFixtures = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/fixtures/danish',
          {
            params: filters,
            headers: { Authorization: `Bearer ${token}` }, // Use token from localStorage
          }
        );

        setFixtures(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load fixtures');
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [filters]);

  // Rest of component remains unchanged...
};

export default DanishFixtures;
