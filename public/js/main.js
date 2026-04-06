// Main JavaScript for team dropdowns
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing team dropdowns...');
    initTeamDropdowns();
});

// Populate team dropdowns when league/season is selected
function initTeamDropdowns() {
    const leagueSelect = document.getElementById('leagueId');
    const seasonSelect = document.getElementById('season');
    const teamASelect = document.getElementById('teamAId');
    const teamBSelect = document.getElementById('teamBId');
    const submitBtn = document.getElementById('submitBtn');

    if (!leagueSelect || !seasonSelect || !teamASelect || !teamBSelect) {
        return;
    }

    async function fetchTeams() {
        const leagueId = leagueSelect.value;
        const season = seasonSelect.value;

        if (!leagueId || !season) {
            teamASelect.disabled = true;
            teamBSelect.disabled = true;
            teamASelect.innerHTML = '<option value="">Select league and season first...</option>';
            teamBSelect.innerHTML = '<option value="">Select league and season first...</option>';
            submitBtn.disabled = true;
            return;
        }

        teamASelect.disabled = true;
        teamBSelect.disabled = true;
        teamASelect.innerHTML = '<option value="">Loading teams...</option>';
        teamBSelect.innerHTML = '<option value="">Loading teams...</option>';

        try {
            console.log('Fetching teams for league:', leagueId, 'season:', season);
            const response = await fetch(`/compare/teams?league=${leagueId}&season=${season}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Teams data received:', data);

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.teams || !Array.isArray(data.teams)) {
                throw new Error('Invalid response format: teams array not found');
            }

            teamASelect.innerHTML = '<option value="">Select Team A...</option>';
            teamBSelect.innerHTML = '<option value="">Select Team B...</option>';

            if (data.teams.length === 0) {
                teamASelect.innerHTML = '<option value="">No teams found for this league/season</option>';
                teamBSelect.innerHTML = '<option value="">No teams found for this league/season</option>';
                return;
            }

            data.teams.forEach(team => {
                const optionA = document.createElement('option');
                optionA.value = team.id;
                optionA.textContent = team.name;
                teamASelect.appendChild(optionA);

                const optionB = document.createElement('option');
                optionB.value = team.id;
                optionB.textContent = team.name;
                teamBSelect.appendChild(optionB);
            });

            teamASelect.disabled = false;
            teamBSelect.disabled = false;
            updateSubmitButton();
        } catch (error) {
            console.error('Error fetching teams:', error);
            teamASelect.innerHTML = '<option value="">Error loading teams. Please try again.</option>';
            teamBSelect.innerHTML = '<option value="">Error loading teams. Please try again.</option>';
            alert('Could not load teams: ' + error.message + '\n\nPlease check your browser console for more details.');
        }
    }

    function updateSubmitButton() {
        if (teamASelect.value && teamBSelect.value && teamASelect.value !== teamBSelect.value) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    console.log('Setting up team dropdown event listeners');
    leagueSelect.addEventListener('change', function() {
        console.log('League changed to:', this.value);
        fetchTeams();
    });
    seasonSelect.addEventListener('change', function() {
        console.log('Season changed to:', this.value);
        fetchTeams();
    });
    teamASelect.addEventListener('change', updateSubmitButton);
    teamBSelect.addEventListener('change', updateSubmitButton);

    // Check URL for pre-selected league
    const urlParams = new URLSearchParams(window.location.search);
    const leagueParam = urlParams.get('league');
    if (leagueParam) {
        leagueSelect.value = leagueParam;
        fetchTeams();
    }
}


