const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  user: User,
  profile: Profile,
  items: Items,
  myPokemon: MyPokemon,
  myDetailPokemon: MyDetailPokemon,
  pokemon: Pokemon,
  pokemonEvolutionTo: PokemonEvolutionTo,
  arena: Arena,
  marketPokemon: MarketPokemon,
  transaction: Transaction,
} = prisma;

module.exports = {
  User,
  Profile,
  Items,
  MyPokemon,
  MyDetailPokemon,
  Pokemon,
  PokemonEvolutionTo,
  Arena,
  MarketPokemon,
  Transaction,
};
