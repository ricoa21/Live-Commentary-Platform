import axios from 'axios';

const BASE_URL = 'https://api.sportmonks.com/v3/football';
const API_KEY = process.env.REACT_APP_SPORTSMONK_API_KEY; // Access the API key from .env

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_token: API_KEY, // Automatically include the API token in every request
  },
});

// Function to fetch fixtures
export const getFixtures = async () => {
  try {
    const response = await api.get('/fixtures', {
      params: {
        include: 'localTeam,visitorTeam', // Example of including related data
      },
    });
    return response.data.data; // Return only the data array
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};

export default api;
