import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, useRouteMatch } from "react-router-dom";

function MainInfo(props) {
  let match = useRouteMatch();

  return (
    <section className="filter-section">
      <h2>{match.url.replace("/", "")}</h2>
      <List>
        {props.data.map((el, i) => (
          <ListItem key={i} button component={Link} to={`${match.url}/${el}`}>
            <ListItemText primary={el.replace(/-/g, " ")} />
          </ListItem>
        ))}
      </List>
    </section>
  );
}

export default MainInfo;
