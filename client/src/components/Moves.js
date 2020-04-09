import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Link } from "react-router-dom";
import "./styles/Moves.css";

class Moves extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pokes: []
    };
  }

  async componentDidMount() {
    const input = this.props.match.params.name;
    this.setState({ loading: true });

    try {
      const pokeIDs = await axios(`/getMovePokeIDs/${input}`);
      const moveLearnedByIDs = pokeIDs.data.map(el => el.pokemon_id);

      const moveLearnedBy = await axios(
        `/getMovePokeDetails/${input}/${moveLearnedByIDs}`
      );
      const moveDetails = await axios(
        `/getMoveDetails/${input}`
      );

      const move = moveDetails.data[0];

      const pokemon = _.reduce(
        moveLearnedBy.data,
        (acc, val, key) => {
          (acc[val.pokemon] || (acc[val.pokemon] = [])).push(val.type);
          return acc;
        },
        []
      );

      this.setState({
        loading: false,
        name: move.identifier.replace(/-/g, " "),
        effect: move.short_effect
          .replace(/\$effect_chance/g, move.effect_chance)
          .replace(
            `[${move.name.toLowerCase()}]{mechanic:${move.name.toLowerCase()}}`,
            move.name.toLowerCase()
          )
          .replace("[paralyze]{mechanic:paralysis}", "paralyze"),
        power: move.power,
        acc: move.accuracy,
        pp: move.pp,
        type: move.move_type,
        pokes: pokemon
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
            <section className="move-section">
              <Card>
                <CardContent>
                  <h3>{this.state.name}</h3>
                  <Link to={`/types/${this.state.type}`}>
                    <div className={this.state.type}>{this.state.type}</div>
                  </Link>
                  <hr></hr>
                  <div>{this.state.effect}</div>
                  <div className="move-details">
                    <div className="move-power">
                      <small>POWER</small>
                      {this.state.power === "" ? "-" : this.state.power}
                    </div>
                    <div className="move-acc">
                      <small>ACCURACY</small>
                      {this.state.acc === "" ? "-" : this.state.acc}
                    </div>
                    <div className="move-pp">
                      <small>PP</small>
                      {this.state.pp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            <section className="move-learnedby__sec">
              <table className="move-learnedby">
                <caption>Pokemon that learn {this.state.name}</caption>
                <tbody>
                  {Object.keys(this.state.pokes).map((el, i) => (
                    <tr key={i}>
                      <td className="move-learnedby__name"><Link to={`/pokemon/${el}`}>{el}</Link></td>
                      <td className="move-type__container">
                        {Object.values(this.state.pokes)[i].map((el, i) => (
                          <Link key={i} to={`/types/${el}`}>
                          <div className={`${el} move-learnedby__type`}>
                            {el}
                          </div>
                          </Link>
                        ))}
                      </td>
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

export default Moves;
