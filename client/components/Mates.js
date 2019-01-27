import React from "react";
import * as r from "ramda";
import Button from "./Button";
import "./Mates.css";

const renderMate = r.curry((removeMate, mate, id) => (
  <li key={id} className="mates__mate">
    <span className="mates__mate-name">{mate}</span>
    <span className="mates__mate-remove" onClick={() => removeMate(id)}>
      &times;
    </span>
  </li>
));

const Mates = ({ mates, searchGames, removeMate, loading }) => {
  return (
    <section className="mates">
      <ul>
        {r.pipe(
          r.mapObjIndexed(renderMate(removeMate)),
          r.values
        )(mates)}
      </ul>

      {r.values(mates).length > 1 && (
        <Button
          onClick={searchGames}
          disabled={loading}
          className="mates__search"
        >
          Find Games
        </Button>
      )}
    </section>
  );
};

export default Mates;
