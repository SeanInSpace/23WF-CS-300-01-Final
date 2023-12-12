import 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const resultContainer = document.getElementById('result');
  const summonerNameElement = document.getElementById('summonerName');
  const summonerLevelElement = document.getElementById('summonerLevel');
  const championMasteryElement = document.getElementById('championMastery');

  // Set default values to my account
  document.getElementById('gameName').value = 'SeanInSpace';
  document.getElementById('tagLine').value = 'NA1';

  let championData = {};
  (async function fetchChampionData() {
    try {
      const response = await axios.get('/championData');
      championData = response.data;
    } catch (error) {
      console.error('Error fetching champion data:', error);
    }
  })();
  searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const gameName = document.getElementById('gameName').value;
    const tagLine = document.getElementById('tagLine').value;

    try {
      const response = await axios.get(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);


      if (response.status === 200) {
        const data = response.data;
        console.log('API Response:', response.data);

        // Display summoner information
        summonerNameElement.textContent = `Summoner Name: ${data.summonerByPuuidData.name}`;
        summonerLevelElement.textContent = `Summoner Level: ${data.summonerByPuuidData.summonerLevel}`;

        // Display champion mastery information
        if (data.championMasteryData.length > 0) {
          const championMasteryHTML = data.championMasteryData.map((mastery) => {
            const champion = Object.values(championData).find(champion => champion.key == mastery.championId);
            const championName = champion.id;
            const championIconUrl = `https://ddragon.leagueoflegends.com/cdn/12.6.1/img/champion/${champion.image.full}`;
            return `<li><div style="display: flex; align-items: center;"><img src="${championIconUrl}" alt="${championName} Icon" style="margin-right: 10px;"><div><h3>${championName}</h3><p>Mastery Level: ${mastery.championLevel}</p></div></div></li>`;
          }).join('');
          championMasteryElement.innerHTML = `<ul>${championMasteryHTML}</ul>`;
        } else {
          championMasteryElement.innerHTML = '<p>No champion mastery data available.</p>';
        }

        resultContainer.style.display = 'block';
      } else {
        resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
        resultContainer.style.display = 'block';
      }
    } catch (error) {
      console.error('API Error:', error);
      resultContainer.innerHTML = '<p>Error.</p>';
      resultContainer.style.display = 'block';
    }
  });
});
