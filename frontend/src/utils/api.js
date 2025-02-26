import axios from 'axios';

const API_KEY = 'ygK23d0Wym1qwEEu7Zch3fEO01VzhuNltJoR1sYEsbLNxCshvjEmTY3E3beE';
const BASE_URL = 'https://soccer.sportmonks.com/api/v2.0';

export const getFixtures = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: {
        api_token: API_KEY,
        include: 'localTeam,visitorTeam',
      },
    });
    return response.data.data; // Return the fixtures array
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};
