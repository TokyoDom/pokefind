import React, { Component } from "react";
import axios from "axios";
import Pokedex from "pokedex-promise-v2";
import { Link } from "react-router-dom";
import "./styles/Pokemon.css";

class Pokemon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sprites: [],
      types: [],
      stats: [0, 0, 0, 0, 0, 0],
      abilities: [],
      moves: [],
      moveEffect: [],
      movePower: [],
      movePP: [],
      moveAcc: [],
      moveType: []
    };
    this.P = new Pokedex();
  }

  async componentDidMount() {
    const input = this.props.match.params.name;
    this.setState({ loading: true });

    try {
      const info = await this.P.getPokemonByName(input);
      const moveIDs = await axios(`/getPokeMoveIDs/${input}`);
      const inputIDs = moveIDs.data.map(el => el.move_id);
      const moves = await axios(`/getPokeMoveDetails/${input}/${inputIDs}`);

      this.setState({
        sprite: info.sprites.front_default,
        sprites: [
          info.sprites.front_default,
          info.sprites.front_shiny,
          info.sprites.back_default,
          info.sprites.back_shiny
        ],
        name: info.name,
        types: info.types.map(el => el.type.name),
        stats: info.stats.map(el => el.base_stat).reverse(),
        abilities: info.abilities.map(el => el.ability.name),
        moves: moves.data.map(el => el.identifier),
        moveEffect: moves.data.map(el =>
          el.short_effect
            .replace(/\$effect_chance/g, el.effect_chance)
            .replace(
              `[${el.name.toLowerCase()}]{mechanic:${el.name.toLowerCase()}}`,
              el.name.toLowerCase()
            )
            .replace("[paralyze]{mechanic:paralysis}", "paralyze")
        ),
        movePower: moves.data.map(el => el.power),
        movePP: moves.data.map(el => el.pp),
        moveAcc: moves.data.map(el => el.accuracy),
        moveType: moves.data.map(el => el.move_type),
        loading: false
      });
    } catch (err) {
      this.setState({ loading: false });
      throw(err);
    }
  }

  render() {
    return (
      <div className="spin-container">
        {this.state.loading ? (
          <div className="spinner"></div>
        ) : (
          <div>
            <section className="pokemon-info-section">
              <div className="basic-info">
                <div className="sprite">
                  <img src={this.state.sprite} alt={this.state.sprite} />
                </div>
                <h3 className="poke-name">{this.state.name}</h3>
                <div className="poke-types">
                  {this.state.types.map(el => (
                    <Link key={el} to={`/types/${el}`}>
                      <div className={el}>{el}</div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="stat-section">
                <div className="stats">
                  <div>HP: {this.state.stats[0]}</div>
                  <div>ATK: {this.state.stats[1]}</div>
                  <div>DEF: {this.state.stats[2]}</div>
                  <div>SPATK: {this.state.stats[3]}</div>
                  <div>SPDEF: {this.state.stats[4]}</div>
                  <div>SPEED: {this.state.stats[5]}</div>
                </div>
                <div className="stat-graph">
                  <div style={{ width: this.state.stats[0] * 1.2 }}></div>
                  <div style={{ width: this.state.stats[1] * 1.2 }}></div>
                  <div style={{ width: this.state.stats[2] * 1.2 }}></div>
                  <div style={{ width: this.state.stats[3] * 1.2 }}></div>
                  <div style={{ width: this.state.stats[4] * 1.2 }}></div>
                  <div style={{ width: this.state.stats[5] * 1.2 }}></div>
                </div>
              </div>
              <div className="poke-abilities">
                <h4>Abilities</h4>
                {this.state.abilities.map(el => (
                  <Link key={el} to={`/abilities/${el}`}>
                    <div>{el.replace("-", " ")}</div>
                  </Link>
                ))}
              </div>
              <div className="sprites-all">
                <div className="front-sprites">
                  {this.state.sprites.slice(0, 2).map((el, i) =>
                    el !== null ? (
                      <div key={i}>
                        <img src={el} alt={i} />
                      </div>
                    ) : null
                  )}
                </div>
                <div className="back-sprites">
                  {this.state.sprites.slice(2, 4).map((el, i) =>
                    el !== null ? (
                      <div key={i}>
                        <img src={el} alt={i} />
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </section>
            <section className="poke-moves">
              <table className="poke-moves__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Power</th>
                    <th>Acc</th>
                    <th>PP</th>
                    <th className="head-desc">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.moves.map((el, i) => (
                    <tr key={i}>
                      <td className="moves-name">
                        <Link to={`/moves/${el}`}>{el.replace(/-/g, " ")}</Link>
                      </td>
                      <td>
                        <Link to={`/types/${this.state.moveType[i]}`}>
                          <div
                            className={`${this.state.moveType[i]} moves-type`}
                          >
                            {this.state.moveType[i]}
                          </div>
                        </Link>
                      </td>
                      <td className="moves-power">
                        {this.state.movePower[i] === ""
                          ? "-"
                          : this.state.movePower[i]}
                      </td>
                      <td className="moves-acc">
                        {this.state.moveAcc[i] === ""
                          ? "-"
                          : this.state.moveAcc[i]}
                      </td>
                      <td className="moves-pp">{this.state.movePP[i]}</td>
                      <td className="moves-eff">{this.state.moveEffect[i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    );
  }
}

export default Pokemon;
