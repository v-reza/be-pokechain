const { Pokemon, PokemonEvolutionTo } = require("../models");

const pokemonsGetController = async (req, res) => {
  try {
    const pokemon = await Pokemon.findMany();
    const pokemonEvolution = await PokemonEvolutionTo.findMany();
    const duplicate = [];
    const filterDuplicate = pokemon.map((item) => {
      const filter = pokemonEvolution.filter((item2) => {
        if (item.name === item2.pokemonName) {
          duplicate.push(item2);
        }
      });
    });
    //

    return res.status(200).json(duplicate);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  pokemonsGetController,
};
