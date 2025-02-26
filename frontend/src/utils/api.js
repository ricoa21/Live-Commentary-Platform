import axios from 'axios';

const API_KEY = process.env.REACT_APP_SPORTSMONK_API_KEY;
const BASE_URL = 'https://api.sportmonks.com/v3/football';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_token: API_KEY,
  },
});

export const getFixtures = async () => {
  try {
    const response = await api.get('/fixtures', {
      params: {
        include: 'localTeam,visitorTeam',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};

export default api;
