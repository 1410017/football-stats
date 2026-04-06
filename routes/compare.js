const express = require('express');
const router = express.Router();
const apiClient = require('../services/apiFootballClient');
const comparisonService = require('../services/comparisonService');

// Show comparison form
router.get('/', async (req, res) => {
  try {
    const popularLeagues = [
      { id: 39, name: 'Premier League', country: 'England' },
      { id: 140, name: 'La Liga', country: 'Spain' },
      { id: 78, name: 'Bundesliga', country: 'Germany' },
      { id: 135, name: 'Serie A', country: 'Italy' },
      { id: 61, name: 'Ligue 1', country: 'France' },
      { id: 6, name: 'Africa Cup of Nations', country: 'Africa' }
    ];

    const seasons = [2024, 2023, 2022, 2021, 2020];

    res.render('compare', {
      title: 'Compare Teams',
      page: 'compare',
      popularLeagues,
      seasons,
      error: null
    });
  } catch (error) {
    console.error('Error loading compare page:', error);
    res.render('compare', {
      title: 'Compare Teams',
      page: 'compare',
      popularLeagues: [],
      seasons: [],
      error: 'Could not load page. Please try again later.'
    });
  }
});

// Get teams for dropdown (called by JavaScript)
router.get('/teams', async (req, res) => {
  try {
    const { league, season } = req.query;

    if (!league || !season) {
      return res.status(400).json({ 
        error: 'League ID and season are required' 
      });
    }

    const teams = await apiClient.getTeams({ 
      league: parseInt(league), 
      season: parseInt(season) 
    });

    const formattedTeams = teams.map(team => ({
      id: team.team.id,
      name: team.team.name,
      logo: team.team.logo
    }));

    res.json({ teams: formattedTeams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ 
      error: error.message || 'Could not fetch teams. Please try again later.' 
    });
  }
});

// Show comparison results
router.get('/result', async (req, res) => {
  try {
    const { leagueId, season, teamAId, teamBId } = req.query;

    if (!leagueId || !season || !teamAId || !teamBId) {
      return res.status(400).render('error', {
        title: 'Invalid Request',
        message: 'Please select a league, season, and both teams.'
      });
    }

    const comparisonParams = {
      leagueId: parseInt(leagueId),
      season: parseInt(season),
      teamAId: parseInt(teamAId),
      teamBId: parseInt(teamBId)
    };

    const comparison = await comparisonService.buildComparison(comparisonParams);

    // Figure out which team is better for each stat
    const betterTeam = {
      wins: comparisonService.getBetterTeam(
        comparison.teamA.wins, 
        comparison.teamB.wins, 
        true
      ),
      losses: comparisonService.getBetterTeam(
        comparison.teamA.losses, 
        comparison.teamB.losses, 
        false
      ),
      goalsFor: comparisonService.getBetterTeam(
        comparison.teamA.goalsFor, 
        comparison.teamB.goalsFor, 
        true
      ),
      goalsAgainst: comparisonService.getBetterTeam(
        comparison.teamA.goalsAgainst, 
        comparison.teamB.goalsAgainst, 
        false
      ),
      avgGoalsFor: comparisonService.getBetterTeam(
        parseFloat(comparison.teamA.avgGoalsFor), 
        parseFloat(comparison.teamB.avgGoalsFor), 
        true
      )
    };

    res.render('compare', {
      title: 'Comparison Results',
      page: 'compare',
      comparison,
      betterTeam,
      showForm: false,
      error: null
    });
  } catch (error) {
    console.error('Error building comparison:', error);
    res.render('compare', {
      title: 'Compare Teams',
      page: 'compare',
      error: error.message || 'Could not load comparison data. Please try again later.',
      showForm: true
    });
  }
});

module.exports = router;

