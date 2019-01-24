import React from 'react';
import * as r from 'ramda';
import './Mates.css';

const Mates = ({mates, searchGames}) => {
  return (
    <section className="mates">
      <ul>
        {r.map((mate) => (
          <li
            key={mate}
            className="mates__name"
          >
            {mate}
          </li>
        ), mates)}
      </ul>

      {mates.length > 1 &&
        <button
          onClick={searchGames}
          className="mates__search"
        >
          Search
        </button>}
    </section>
  );
};

export default Mates;
