const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
let championData = {};
axios.get('https://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json')
  .then(response => {
    championData = response.data.data;
  })
  .catch(error => {
    console.error('Error fetching champion data:', error);
  });
const PORT = process.env.PORT || 3000;
const RIOT_API_URL = 'https://americas.api.riotgames.com';
const LOL_API_URL = 'https://na1.api.riotgames.com';

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/championData', (req, res) => {
  res.json(championData);
});
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/riot/account/v1/accounts/by-riot-id/:gameName/:tagLine', async (req, res) => {
  const { gameName, tagLine } = req.params;

  try {
    const summonerResponse = await axios.get(
      `${RIOT_API_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${encodeURIComponent(tagLine)}`,
      { params: { api_key: process.env.RIOT_API_KEY } }
    );

    const puuid = summonerResponse.data.puuid;

    // Make a second request using the obtained puuid
    const championMasteryResponse = await axios.get(
      `${LOL_API_URL}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=2`,
      { params: { api_key: process.env.RIOT_API_KEY } }
    );

    // Make a third request using the obtained puuid
    const summonerByPuuidResponse = await axios.get(
      `${LOL_API_URL}/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { params: { api_key: process.env.RIOT_API_KEY } }
    );

    res.json({
      summonerData: summonerResponse.data,
      championMasteryData: championMasteryResponse.data,
      summonerByPuuidData: summonerByPuuidResponse.data,
    });
  } catch (error) {
    console.error('API Error:', error);

    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      res.status(error.response.status).json({ error: 'Internal Server Error' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
