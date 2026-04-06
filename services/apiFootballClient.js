const axios = require('axios');
require('dotenv').config();

// API configuration from API-FOOTBALL documentation
const API_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.FOOTBALL_API_KEY;
const API_HOST = process.env.FOOTBALL_API_HOST || 'v3.football.api-sports.io';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST
  },
  timeout: 10000
});

// Make API requests with error handling
async function makeRequest(endpoint, params = {}) {
  try {
    const response = await apiClient.get(endpoint, { params });
    
    if (response.data && response.data.response) {
      return response.data.response;
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'API request failed';
      
      console.error(`API Error (${status}):`, message);
      
      if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 401 || status === 403) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`API error: ${message}`);
      }
    } else if (error.request) {
      console.error('No response from API:', error.message);
      throw new Error('Could not connect to the API. Please check your internet connection.');
    } else {
      console.error('Request setup error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
}

// API functions following API-FOOTBALL documentation
async function getLeagues(params = {}) {
  return makeRequest('/leagues', params);
}

async function getTeams(params) {
  if (!params.league || !params.season) {
    throw new Error('League ID and season are required');
  }
  return makeRequest('/teams', params);
}

async function getTeamStatistics(params) {
  if (!params.league || !params.season || !params.team) {
    throw new Error('League ID, season, and team ID are required');
  }
  return makeRequest('/teams/statistics', params);
}

async function getFixtures(params) {
  if (!params.team) {
    throw new Error('Team ID is required');
  }
  return makeRequest('/fixtures', params);
}

async function getHeadToHead(params) {
  if (!params.h2h) {
    throw new Error('Both team IDs are required for head-to-head');
  }
  return makeRequest('/fixtures/headtohead', params);
}

async function getStandings(params) {
  if (!params.league || !params.season) {
    throw new Error('League ID and season are required');
  }
  return makeRequest('/standings', params);
}

module.exports = {
  getLeagues,
  getTeams,
  getTeamStatistics,
  getFixtures,
  getHeadToHead,
  getStandings
};

