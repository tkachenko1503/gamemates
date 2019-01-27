"use strict";

const express = require("express");
const axios = require("axios");
const r = require("ramda");
const morgan = require("morgan");

const PORT = 3000;
const STEAM_KEY = "8738270D3B5D8959A13E1BC255D5702A";
const STEAM_ID_URL =
  "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/";
const STEAM_GAMES_URL =
  "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/";
const STEAM_SPY_URL = "http://steamspy.com/api.php";

const app = express();

app.use(express.static("dist"));
app.use(morgan("combined"));
app.use(express.json());

const requestSteamIdByName = username => {
  return axios(STEAM_ID_URL, {
    params: {
      key: STEAM_KEY,
      vanityurl: username
    }
  });
};

const requestAllSteamIds = r.map(requestSteamIdByName);

const extractIds = matesIds => {
  return matesIds.map(({ steamid }) => steamid);
};

const requestSteamGames = steamid => {
  return axios(STEAM_GAMES_URL, {
    params: {
      key: STEAM_KEY,
      steamid: steamid,
      format: "json"
    }
  });
};

const extractGames = r.pipe(
  r.map(r.prop("games")),
  r.flatten
);

const groupByAppID = r.groupBy(r.prop("appid"));

const filterNotPresentedByAllMates = r.curry((matesCount, groupedGames) => {
  return r.pipe(
    r.values,
    r.filter(games => games.length === matesCount)
  )(groupedGames);
});

const leftSimilarGames = r.curry((matesCount, matesGames) => {
  return r.pipe(
    extractGames,
    groupByAppID,
    filterNotPresentedByAllMates(matesCount),
    r.map(r.head)
  )(matesGames);
});

const requestGameTags = appid => {
  return axios(STEAM_SPY_URL, {
    params: {
      request: "appdetails",
      appid: appid
    }
  });
};

const requestGamesTags = r.pipe(
  r.map(r.prop("appid")),
  r.map(requestGameTags)
);

const filterNotMultiplayerGames = r.pipe(
  r.filter(({ tags }) => r.has("Multiplayer", tags)),
  r.map(r.pick(["name", "appid"]))
);

const responseWithMatesGames = r.curry((res, matesGames) => {
  res.status(200).json({ games: matesGames || [] });
});

const extractAxiosResponse = r.map(r.path(["data", "response"]));
const extractAxiosData = r.map(r.prop("data"));

app.post("/mates", (req, res) => {
  const mates = req.body.mates || ["gwellir", "molotoko", "Tryr"];
  const matesCount = mates.length;

  axios
    .all(requestAllSteamIds(mates))
    .then(extractAxiosResponse)
    .then(extractIds)
    .then(matesIds => axios.all(r.map(requestSteamGames, matesIds)))
    .then(extractAxiosResponse)
    .then(leftSimilarGames(matesCount))
    .then(requestGamesTags)
    .then(gamesRequests => axios.all(gamesRequests))
    .then(extractAxiosData)
    .then(filterNotMultiplayerGames)
    .then(responseWithMatesGames(res))
    .catch(error => {
      console.log("Game Mates error - ", error.message);
      res.status(400).json({ message: error.message });
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
