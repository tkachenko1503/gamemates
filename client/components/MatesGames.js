import React from "react";
import * as r from "ramda";
import "./MatesGames.css";

const MatesGames = ({ games }) => {
  if (games.length === 0) {
    return (
      <section className="mates-games">
        <h3 className="mates-games__title">No matching games found</h3>
      </section>
    );
  }

  return (
    <section className="mates-games">
      <h3 className="mates-games__title">You can play those games together:</h3>

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
    </section>
  );
};

export default MatesGames;
