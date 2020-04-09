import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import Pokedex from "pokedex-promise-v2";
import "./DataRouteHub.css";
import Home from "./components/Home";
import Searchbar from "./components/Searchbar";
import MainInfo from "./components/MainInfo";
import Pokemon from "./components/Pokemon";
import Moves from "./components/Moves";
import Abilities from "./components/Abilities";
import Types from "./components/Types";

class DataRouteHub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pokemonAll: [],
      movesAll: [],
      abilitiesAll: [],
      typesAll: [],
      all: []
    };

    this.initState = this.state;
    this.P = new Pokedex();
  }

  async componentDidMount() {
    try {
      const pokemonAll = await axios("/getAllPokemon").then(res =>
        res.data.map(el => el.identifier)
      );
      const movesAll = await axios("/getAllMoves").then(res =>
        res.data.map(el => el.identifier)
      );
      const abilitiesAll = await axios("/getAll/abilities").then(res =>
        res.data.map(el => el.identifier)
      );
      const typesAll = await axios("/getAll/types").then(res =>
        res.data.map(el => el.identifier)
      );

      this.setState({
        pokemonAll: pokemonAll,
        movesAll: movesAll,
        abilitiesAll: abilitiesAll,
        typesAll: typesAll,
        all: [
          {
            label: "Pokemon",
            options: pokemonAll.map(el => {
              return { value: el, label: el, type: "pokemon" };
            })
          },
          {
            label: "Moves",
            options: movesAll.map(el => {
              return { value: el, label: el.replace(/-/g, " "), type: "moves" };
            })
          },
          {
            label: "Abilities",
            options: abilitiesAll.map(el => {
              return {
                value: el,
                label: el.replace(/-/g, " "),
                type: "abilities"
              };
            })
          },
          {
            label: "Types",
            options: typesAll.map(el => {
              return { value: el, label: el, type: "types" };
            })
          }
        ]
      });
    } catch (err) {
      throw(err);
    }
  }

  render() {
    return (
      <div className="container">
        <Searchbar
          data={this.state.all}
          getInput={this.getInput}
          input={this.state.input}
        />
        <Switch>
          <Route
            path="/pokemon/:name"
            render={props => (
              <Pokemon {...props} key={window.location.pathname} />
            )}
          />
          <Route path="/pokemon">
            <MainInfo data={this.state.pokemonAll} />
          </Route>
          <Route
            path="/moves/:name"
            render={props => (
              <Moves {...props} key={window.location.pathname} />
            )}
          />
          <Route path="/moves">
            <MainInfo data={this.state.movesAll} />
          </Route>
          <Route
            path="/abilities/:name"
            render={props => (
              <Abilities {...props} key={window.location.pathname} />
            )}
          />
          <Route path="/abilities">
            <MainInfo data={this.state.abilitiesAll} />
          </Route>
          <Route
            path="/types/:name"
            render={props => (
              <Types {...props} key={window.location.pathname} />
            )}
          />
          <Route path="/types">
            <MainInfo data={this.state.typesAll} />
          </Route>
          <Route exact path="/">
            <Home data={this.state.pokemonAll} />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default DataRouteHub;
