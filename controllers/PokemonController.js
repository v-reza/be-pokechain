const { Pokemon, User } = require("../models");

const pokemonsGetController = async (req, res) => {
  try {
    
    // const user = await User.findFirst({
    //   where: {
    //     username: "reza"
    //   },
    //   include: {
    //     profile: {
    //       include: {
    //         my_pokemons: {
    //           include: {
    //             detail_pokemon: true
    //           }
    //         }
    //       }
    //     }
    //   }
    // })
    // const pokemon = await Pokemon.findMany({
    //   include: {
    //     pokemon_evolutions: true
    //   }
    // })
    // const evolution = []
    // user.profile.my_pokemons.map((item, _) => {
    //   pokemon.filter((pk) => {
    //     if (pk.name === item.detail_pokemon.name) {
    //       evolution.push(pk)
    //     }
    //   })
    // })

    // return res.status(200).json({ msg: "success", evolution, user });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  pokemonsGetController,
};
