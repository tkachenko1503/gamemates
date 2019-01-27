import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import * as r from "ramda";
import MateInput from "./components/MateInput";
import Mates from "./components/Mates";
import MatesGames from "./components/MatesGames";
import MatesRequestError from "./components/MatesRequestError";
import "./index.css";

const GAMES_MATES_URL = "/mates";
const CancelToken = axios.CancelToken;

let nextMateId = 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steamMates: {},
      matesGames: null,
      gamesRequestError: null,
      loading: false
    };

    this.cancelLastRequest = null;

    this.requestMatesGames = this.requestMatesGames.bind(this);
    this.addMate = this.addMate.bind(this);
    this.removeMate = this.removeMate.bind(this);
    this.reset = this.reset.bind(this);
  }

  addMate(mate) {
    const { steamMates } = this.state;

    this.setState({
      steamMates: {
        ...steamMates,
        [nextMateId++]: mate
      }
    });
  }

  removeMate(mateId) {
    const { steamMates } = this.state;

    this.setState({
      steamMates: r.omit([mateId], steamMates)
    });
  }

  reset() {
    this.setState({
      steamMates: {},
      matesGames: null,
      gamesRequestError: null,
      loading: false
    });
  }

  requestMatesGames() {
    const { steamMates } = this.state;

    if (this.cancelLastRequest) {
      this.cancelLastRequest();
      this.cancelLastRequest = null;
    }

    this.setState({
      loading: true
    });

    axios
      .post(
        GAMES_MATES_URL,
        {
          mates: r.values(steamMates)
        },
        {
          cancelToken: new CancelToken(c => {
            this.cancelLastRequest = c;
          })
        }
      )
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
      })
      .then(() => {
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { steamMates, matesGames, gamesRequestError, loading } = this.state;

    return (
      <div className="app">
        <h2 className="app__title">Welcome to GameMates</h2>

        <MateInput submit={this.addMate} />
        <Mates
          mates={steamMates}
          searchGames={this.requestMatesGames}
          removeMate={this.removeMate}
          loading={loading}
        />

        {loading && <h3 className="app__loader">Loading...</h3>}

        {!loading && matesGames && (
          <MatesGames games={matesGames} reset={this.reset} />
        )}

        {!loading && gamesRequestError && <MatesRequestError />}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
