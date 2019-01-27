import React from "react";
import * as r from "ramda";
import Button from "./Button";
import "./MatesGames.css";

const MatesGames = ({ games, reset }) => {
  if (games.length === 0) {
    return (
      <section className="mates-games">
        <h3 className="mates-games__title mates-games__title_no-result">
          No matching games found
        </h3>
      </section>
    );
  }

  return (
    <section className="mates-games">
      <h3 className="mates-games__title mates-games__title_lined">
        You can play those games together:
      </h3>

      <ul>
        {r.map(
          game => (
            <li key={game.appid} className="mates-games__game">
              {game.name}
            </li>
          ),
          games
        )}
      </ul>

      <Button onClick={reset} className="mates-games__reset">
        Reset
      </Button>
    </section>
  );
};

export default MatesGames;
