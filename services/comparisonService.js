const apiClient = require('./apiFootballClient');

// Build comparison data for two teams
async function buildComparison({ leagueId, season, teamAId, teamBId }) {
  try {
    // Get stats for both teams
    const [teamAStats, teamBStats] = await Promise.all([
      apiClient.getTeamStatistics({ league: leagueId, season, team: teamAId }),
      apiClient.getTeamStatistics({ league: leagueId, season, team: teamBId })
    ]);

    const teamA = teamAStats.team || {};
    const teamB = teamBStats.team || {};
    const league = teamAStats.league || {};

    const teamAFormation = teamAStats.formation || 'N/A';
    const teamBFormation = teamBStats.formation || 'N/A';

    const teamAFixtureStats = teamAStats.fixtures || {};
    const teamBFixtureStats = teamBStats.fixtures || {};
    const teamAGoals = teamAStats.goals || {};
    const teamBGoals = teamBStats.goals || {};

    const teamAGamesPlayed = teamAFixtureStats.played?.total || 0;
    const teamBGamesPlayed = teamBFixtureStats.played?.total || 0;

    const teamAWins = teamAFixtureStats.wins?.total || 0;
    const teamBWins = teamBFixtureStats.wins?.total || 0;
    const teamADraws = teamAFixtureStats.draws?.total || 0;
    const teamBDraws = teamBFixtureStats.draws?.total || 0;
    const teamALosses = teamAFixtureStats.loses?.total || 0;
    const teamBLosses = teamBFixtureStats.loses?.total || 0;

    const teamAGoalsFor = teamAGoals.for?.total?.total || 0;
    const teamBGoalsFor = teamBGoals.for?.total?.total || 0;
    const teamAGoalsAgainst = teamAGoals.against?.total?.total || 0;
    const teamBGoalsAgainst = teamBGoals.against?.total?.total || 0;

    const teamAAvgGoalsFor = teamAGamesPlayed > 0 
      ? (teamAGoalsFor / teamAGamesPlayed).toFixed(2) 
      : '0.00';
    const teamBAvgGoalsFor = teamBGamesPlayed > 0 
      ? (teamBGoalsFor / teamBGamesPlayed).toFixed(2) 
      : '0.00';

    // Get last 5 matches from form string
    let teamAForm = teamAStats.form || 'N/A';
    let teamBForm = teamBStats.form || 'N/A';
    
    if (typeof teamAForm === 'string' && teamAForm.length > 5) {
      teamAForm = teamAForm.slice(-5);
    }
    if (typeof teamBForm === 'string' && teamBForm.length > 5) {
      teamBForm = teamBForm.slice(-5);
    }
    const comparison = {
      league: {
        id: leagueId,
        name: league.name || 'Unknown League',
        season: season
      },
      teamA: {
        id: teamAId,
        name: teamA.name || 'Team A',
        logo: teamA.logo || null,
        gamesPlayed: teamAGamesPlayed,
        wins: teamAWins,
        draws: teamADraws,
        losses: teamALosses,
        goalsFor: teamAGoalsFor,
        goalsAgainst: teamAGoalsAgainst,
        avgGoalsFor: teamAAvgGoalsFor,
        form: teamAForm,
        formation: teamAFormation
      },
      teamB: {
        id: teamBId,
        name: teamB.name || 'Team B',
        logo: teamB.logo || null,
        gamesPlayed: teamBGamesPlayed,
        wins: teamBWins,
        draws: teamBDraws,
        losses: teamBLosses,
        goalsFor: teamBGoalsFor,
        goalsAgainst: teamBGoalsAgainst,
        avgGoalsFor: teamBAvgGoalsFor,
        form: teamBForm,
        formation: teamBFormation
      }
    };

    return comparison;
  } catch (error) {
    console.error('Error building comparison:', error);
    throw error;
  }
}

// Check which team has the better value for a stat
function getBetterTeam(valueA, valueB, higherIsBetter = true) {
  if (valueA === valueB) return null;
  
  if (higherIsBetter) {
    return valueA > valueB ? 'A' : 'B';
  } else {
    return valueA < valueB ? 'A' : 'B';
  }
}

module.exports = {
  buildComparison,
  getBetterTeam
};

