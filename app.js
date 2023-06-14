const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at 3000 port.");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
  }
};
initializeDbAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team;`;
  const players_list = await db.all(getPlayersQuery);
  response.send(players_list);
  console.log("exec success");
  console.log(players_list);
});

//API 2

app.use(express.json());
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO ccbp submit NJSCPSCVYL
    cricket_team (player_name,jersey_number,role)
    VALUES(
        '${playerName}',
         ${jerseyNumber},
        '${role}'

    );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
  console.log(playerId);
});

//API 3
app.get("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  console.log(player_id);
  const getPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id=${player_id};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
  console.log(player);
});

//API 4
app.put("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  console.log(player_id);
  console.log(playerName, jerseyNumber, role);
  const updatePlayerQuery = ` UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role='${role}'
    WHERE
      player_id = ${player_id};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
}),
  //API 5
  app.delete("/players/:player_id/", async (request, response) => {
    const { player_id } = request.params;
    const deletePlayerQuery = `
    DELETE FROM
    cricket_team
    WHERE
    player_id=${player_id};`;
    await db.run(deletePlayerQuery);
    response.send("Player Removed");
    console.log("done");
  });
module.exports = app;
