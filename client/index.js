import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import MateInput from "./components/MateInput";
import Mates from "./components/Mates";
import MatesGames from "./components/MatesGames";
import MatesRequestError from "./components/MatesRequestError";
import "./index.css";

const GAMES_MATES_URL = "/mates";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steamMates: [],
      matesGames: null,
      gamesRequestError: null
    };

    this.requestMatesGames = this.requestMatesGames.bind(this);
    this.addMate = this.addMate.bind(this);
  }

  addMate(mate) {
    const { steamMates } = this.state;

    this.setState({
      steamMates: [...steamMates, mate]
    });
  }

  requestMatesGames() {
    const { steamMates } = this.state;

    axios
      .post(GAMES_MATES_URL, {
        mates: steamMates
      })
      .then(response => {
        const { games } = response.data;
        this.setState({
          matesGames: games,
          gamesRequestError: null
        });
      })
      .catch(error => {
        this.setState({
          matesGames: null,
          gamesRequestError: error.response.data
        });
      });
  }

  render() {
    const { steamMates, matesGames, gamesRequestError } = this.state;

    return (
      <div className="app">
        <h2>Welcome to GameMates</h2>

        <MateInput submit={this.addMate} />
        <Mates mates={steamMates} searchGames={this.requestMatesGames} />

        {matesGames && <MatesGames games={matesGames} />}

        {gamesRequestError && <MatesRequestError />}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
