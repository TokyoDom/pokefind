import React, { Component } from "react";
import Select, { createFilter } from "react-select";
import { Link, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import "./styles/Searchbar.css";
import logo from "../pokefindlogo.png";

class Searchbar extends Component {
  state = {
    input: ""
  };

  render() {
    return (
      <section className="search-section">
        <div className="logo-div">
          <Link to="/">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </div>
        <div className="search-bar">
          <Select
            filterOption={createFilter({
              ignoreAccents: false,
              matchFrom: "start"
            })}
            options={this.state.input.length >= 2 ? this.props.data : []}
            noOptionsMessage={() => null}
            components={{ DropdownIndicator: () => null }}
            placeholder="Find!"
            onChange={e => {
              this.props.history.push(`/${e.type}/${e.value}`);
            }}
            onInputChange={e => this.setState({ input: e })}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div className="filter-buttons">
          <Link to="/pokemon">
            <Button>Pokemon</Button>
          </Link>
          <Link to="/moves">
            <Button>Moves</Button>
          </Link>
          <Link to="/abilities">
            <Button>Abilities</Button>
          </Link>
          <Link to="/types">
            <Button>Types</Button>
          </Link>
        </div>
      </section>
    );
  }
}

export default withRouter(Searchbar);
