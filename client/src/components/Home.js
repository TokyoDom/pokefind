import React from 'react';
import { Link } from 'react-router-dom';
import pikachu from '../detectivepikachu.png';

function Home(props) {

  const random = Math.floor(Math.random() * props.data.length);

  return (
    <section className="home-section">
    <Link to={`/pokemon/${props.data[random]}`}><img src={pikachu} alt="Home" className="home-pic"/></Link>
    <h1>Welcome to PokeFind!</h1>
    <p>Use the search bar or tabs to start finding. Don't know what to look for?</p>
     <p>Click on me and I'll find a Pokemon for you! </p>
    </section>
  );
}

export default Home;