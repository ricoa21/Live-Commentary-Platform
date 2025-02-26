import axios from 'axios';

const BASE_URL = 'https://api.sportmonks.com/v3/football';
const API_KEY = 'ygK23d0Wym1qwEEu7Zch3fEO01VzhuNltJoR1sYEsbLNxCshvjEmTY3E3beE';

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
        include: 'localTeam,visitorTeam', // Ensure proper capitalization
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};

export default api;
