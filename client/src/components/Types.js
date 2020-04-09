import React, { Component } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import _ from "lodash";
import { Link } from "react-router-dom";
import "./styles/Types.css";

class Types extends Component {
  constructor(props) {
    super(props);
    this.state = {
      damage0: [],
      damage50: [],
      damage200: [],
      resist0: [],
      resist50: [],
      resist200: [],
      pokes: []
    };
  }

  async componentDidMount() {
    const input = this.props.match.params.name;
    this.setState({ loading: true });

    try {
      const damageEff = await axios(
        `/getDamageEff/${input}`
      ).then(res => res.data);
      const resistEff = await axios(
        `/getResistEff/${input}`
      ).then(res => res.data);
      const pokesOfType = await axios(
        `/getPokesofType/${input}`
      ).then(res => res.data);

      const pokemon = _.reduce(
        pokesOfType,
        (acc, val, key) => {
          (acc[val.pokemon] || (acc[val.pokemon] = [])).push(val.type);
          return acc;
        },
        []
      );

      this.setState({
        loading: false,
        name: input,
        damage0: damageEff
          .filter(el => el.damage_factor === 0)
          .map(el => el.def_type),
        damage50: damageEff
          .filter(el => el.damage_factor === 50)
          .map(el => el.def_type),
        damage200: damageEff
          .filter(el => el.damage_factor === 200)
          .map(el => el.def_type),
        resist0: resistEff
          .filter(el => el.damage_factor === 0)
          .map(el => el.atk_type),
        resist50: resistEff
          .filter(el => el.damage_factor === 50)
          .map(el => el.atk_type),
        resist200: resistEff
          .filter(el => el.damage_factor === 200)
          .map(el => el.atk_type),
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
            <section className="type-section">
              <Card>
                <CardContent className="type-card">
                  <h3>{this.state.name}</h3>
                  <hr></hr>
                  <div className="atk-def">
                    <div className="attacking">
                      {this.state.damage0.length === 0 ? null : (
                        <div className="damage0">
                          <h4>No effect against:</h4>
                          {this.state.damage0.map((el, i) => (
                            <Link key={i} to={`/types/${el}`}>
                              <div className={el}>{el}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {this.state.damage50.length === 0 ? null : (
                        <div className="damage50">
                          <h4>Not very effective against:</h4>
                          {this.state.damage50.map((el, i) => (
                            <Link key={i} to={`/types/${el}`}>
                              <div className={el}>{el}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {this.state.damage200.length === 0 ? null : (
                        <div className="damage200">
                          <h4>Super effective against:</h4>
                          {this.state.damage200.map((el, i) => (
                            <Link key={i} to={`/types/${el}`}>
                              <div className={el}>{el}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="defending">
                      {this.state.resist0.length === 0 ? null : (
                        <div className="resist0">
                          <h4>Immune to:</h4>
                          {this.state.resist0.map((el, i) => (
                            <Link key={i} to={`/types/${el}`}>
                              <div className={el}>{el}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {this.state.resist50.length === 0 ? null : (
                        <div className="resist50">
                          <h4>Resistant to:</h4>
                          {this.state.resist50.map((el, i) => (
                            <Link key={i} to={`/types/${el}`}>
                              <div className={el}>{el}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {this.state.resist200.length === 0 ? null : (
                        <div className="resist200">
                          <h4>Weak to:</h4>
                          {this.state.resist200.map((el, i) => (
                            <Link key={i} to={`/types/${el}`}>
                              <div className={el}>{el}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            <section className="pokesOfType__sec">
              <table className="pokesOfType">
                <caption>Pokemon that are {this.state.name} type</caption>
                <tbody>
                  {Object.keys(this.state.pokes).map((el, i) => (
                    <tr key={i}>
                      <td className="pokesOfType__name">
                        <Link to={`/pokemon/${el}`}>{el}</Link>
                      </td>
                      <td className="pokesOfType-type__container">
                        {Object.values(this.state.pokes)[i].map((el, i) => (
                          <Link key={i} to={`/types/${el}`}>
                            <div className={`${el} pokesOfType__type`}>
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

export default Types;
