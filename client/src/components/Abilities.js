import React, { Component } from "react";
import axios from 'axios';
import Pokedex from "pokedex-promise-v2";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import _ from 'lodash';
import { Link } from "react-router-dom";
import "./styles/Abilities.css";

class Abilities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pokes: []
    };
    this.P = new Pokedex();
  }

  async componentDidMount() {
    const input = this.props.match.params.name;
    this.setState({ loading: true });

    try {
      const ability = await this.P.getAbilityByName(input);
      const ablLearnedBy = await axios(`/getAbilityLearnedBy/${input}`);

      const pokemon = _.reduce(
        ablLearnedBy.data,
        (acc, val, key) => {
          (acc[val.pokemon] || (acc[val.pokemon] = [])).push(val.type);
          return acc;
        },
        []
      );

      this.setState({
        loading: false,
        name: ability.name.replace("-", " "),
        effect: ability.effect_entries[0].effect,
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
        {this.state.loading ? <div className="spinner"></div> : (
          <div>
            <section className="ability-section">
              <Card>
                <CardContent>
                  <h3>{this.state.name}</h3>
                <hr></hr>
                <div>{this.state.effect}</div>
                </CardContent>
              </Card>
            </section>
            <section className="ability-learnedby__sec">
              <table className="ability-learnedby">
                <caption>Pokemon that learn {this.state.name}</caption>
                <tbody>
                  {Object.keys(this.state.pokes).map((el, i) => (
                    <tr key={i}>
                      <td className="ability-learnedby__name"><Link to={`/pokemon/${el}`}>{el}</Link></td>
                      <td className="ability-type__container">
                        {Object.values(this.state.pokes)[i].map((el, i) => (
                          <Link key={i} to={`/types/${el}`}>
                          <div className={`${el} ability-learnedby__type`}>
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

export default Abilities;
