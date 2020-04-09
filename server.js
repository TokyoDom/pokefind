const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const config = require('./config');

//Create sql connection

const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

//Connect to SQL DB
db.connect((err) => {
    if(err) {
        throw(err);
    } else {
        console.log('MySql connected');
    }
});

//Queries
app.get('/getPokeMoveIDs/:pokemon', (req, res) => {

  let sql = 
  `SELECT DISTINCT pokemon_moves.move_id
  FROM pokemon_moves 
  INNER JOIN pokemon ON pokemon.id = pokemon_moves.pokemon_id
  WHERE pokemon.identifier = "${req.params.pokemon}";`

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Move IDs fetched');
    res.send(results);
  });
});


app.get('/getPokeMoveDetails/:pokemon/:moveIDs', (req, res) => {

  let sql = 
  `SELECT DISTINCT moves.identifier, move_effect_prose.short_effect, moves.effect_chance, 
  move_meta_ailment_names.name, moves.power, moves.pp, moves.accuracy, types.identifier AS move_type
  FROM pokemon
  INNER JOIN moves ON moves.id in (${req.params.moveIDs})
  INNER JOIN move_effect_prose ON moves.effect_id = move_effect_prose.move_effect_id
  INNER JOIN move_meta ON move_meta.move_id = moves.id
  INNER JOIN move_meta_ailment_names ON move_meta_ailment_names.move_meta_ailment_id = move_meta.meta_ailment_id
  INNER JOIN types ON types.id = moves.type_id
  WHERE pokemon.identifier = "${req.params.pokemon}" AND move_meta_ailment_names.local_language_id = 9
  ORDER BY moves.identifier;`

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Move IDs fetched');
    res.send(results);
  });
});

app.get('/getPokeType/:pokemon', (req, res) => {
    
    let sql =
    `SELECT pokemon.identifier, types.identifier, type_efficacy.damage_factor 
    FROM pokemon.type_efficacy
    INNER JOIN pokemon_types ON type_efficacy.target_type_id = pokemon_types.type_id
    INNER JOIN pokemon ON pokemon_types.pokemon_id = pokemon.id
    INNER JOIN types ON type_efficacy.damage_type_id = types.id
    WHERE pokemon.identifier = "${req.params.name}";`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Types fetched');
        res.send(results);
    });
});

app.get('/getMovePokeIDs/:move', (req, res) => {

  let sql = 
  `SELECT DISTINCT pokemon_id
  FROM pokemon_moves
  INNER JOIN pokemon.moves ON moves.id = pokemon_moves.move_id
  WHERE moves.identifier = "${req.params.move}";`

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log('Pokemon IDs fetched');
    res.send(results);
  });
});

app.get('/getMovePokeDetails/:move/:pokemonIDs', (req, res) => {
    
    let sql =
    `SELECT DISTINCT pokemon.identifier AS pokemon, types.identifier AS type
    FROM moves
    INNER JOIN pokemon ON pokemon.id in (${req.params.pokemonIDs})
    INNER JOIN pokemon_types ON pokemon_types.pokemon_id = pokemon.id
    INNER JOIN types ON types.id = pokemon_types.type_id
    WHERE moves.identifier = "${req.params.move}"
    ORDER BY pokemon.identifier;`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Move data fetched');
        res.send(results);
    });
});

app.get('/getMoveDetails/:move', (req, res) => {
    
    let sql = 
    `SELECT DISTINCT moves.identifier, move_effect_prose.short_effect, moves.effect_chance, move_meta_ailment_names.name,
    moves.power, moves.accuracy, moves.pp, types.identifier AS move_type
    FROM pokemon.move_effect_prose
    INNER JOIN moves ON move_effect_prose.move_effect_id = moves.effect_id
    INNER JOIN move_meta ON move_meta.move_id = moves.id
    INNER JOIN move_meta_ailment_names ON move_meta_ailment_names.move_meta_ailment_id = move_meta.meta_ailment_id
    INNER JOIN types ON types.id = moves.type_id
    WHERE moves.identifier = "${req.params.move}" AND move_meta_ailment_names.local_language_id = 9;`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Move details fetched');
        res.send(results);
    });
});

app.get('/getAbilityLearnedBy/:ability', (req, res) => {
    
  let sql =
  `SELECT DISTINCT pokemon.identifier AS pokemon, types.identifier AS type
  FROM pokemon_abilities
  INNER JOIN abilities ON abilities.id = pokemon_abilities.ability_id
  INNER JOIN pokemon ON pokemon.id = pokemon_abilities.pokemon_id
  INNER JOIN pokemon_types ON pokemon_types.pokemon_id = pokemon.id
  INNER JOIN types ON types.id = pokemon_types.type_id
  WHERE abilities.identifier = "${req.params.ability}"
  ORDER BY pokemon.identifier;`

  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log('Move data fetched');
      res.send(results);
  });
});

app.get('/getDamageEff/:type', (req, res) => {
    
    let sql = 
    `SELECT damage.identifier AS atk_type, target.identifier AS def_type, type_efficacy.damage_factor 
    FROM pokemon.type_efficacy
    INNER JOIN types damage ON type_efficacy.damage_type_id = damage.id
    INNER JOIN types target ON type_efficacy.target_type_id = target.id
    WHERE damage.identifier = "${req.params.type}";`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Move details fetched');
        res.send(results);
    });
});

app.get('/getResistEff/:type', (req, res) => {
    
    let sql = 
    `SELECT damage.identifier AS atk_type, target.identifier AS def_type, type_efficacy.damage_factor 
    FROM pokemon.type_efficacy
    INNER JOIN types damage ON type_efficacy.damage_type_id = damage.id
    INNER JOIN types target ON type_efficacy.target_type_id = target.id
    WHERE target.identifier = "${req.params.type}";`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Move details fetched');
        res.send(results);
    });
});

app.get('/getPokesofType/:type', (req, res) => {
    
    let sql = 
    `SELECT pokemon.identifier AS pokemon, types.identifier AS type
    FROM pokemon.pokemon_types
    INNER JOIN pokemon.pokemon ON pokemon.id = pokemon_types.pokemon_id
    INNER JOIN types ON types.id = pokemon_types.type_id
    WHERE pokemon_id = ANY (SELECT pokemon_id
    FROM pokemon.pokemon_types
    INNER JOIN types ON types.id = pokemon_types.type_id
    WHERE types.identifier = "${req.params.type}")
    ORDER BY pokemon.identifier, pokemon_types.slot;`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Move details fetched');
        res.send(results);
    });
});

app.get('/getAll/:name', (req, res) => {
    
    let sql = 
    `SELECT identifier 
    FROM pokemon.${req.params.name}
    WHERE id < "10000"
    ORDER BY identifier;`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('Category fetched');
        res.send(results);
    });
});

app.get('/getAllMoves', (req, res) => {
    
    let sql = 
    `SELECT identifier 
    FROM pokemon.moves
    WHERE id < "10000" AND NOT pp = 1
    ORDER BY identifier;`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('All Moves fetched');
        res.send(results);
    });
});

app.get('/getAllPokemon', (req, res) => {
    let sql = 
    `SELECT identifier 
    FROM pokemon.pokemon
    ORDER BY identifier;`

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log('All pokemon fetched');
        res.send(results);
    });
});

if(process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}


const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});