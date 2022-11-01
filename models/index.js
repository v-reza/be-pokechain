const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  user: User,
  profile: Profile,
  myItems: MyItems,
  myPokemon: MyPokemon,
  myDetailPokemon: MyDetailPokemon,
  pokemon: Pokemon,
  pokemonEvolution: PokemonEvolution,
  arena: Arena,
  marketPokemon: MarketPokemon,
  transaction: Transaction,
  marketItems: MarketItems,
} = prisma;

module.exports = {
  User,
  Profile,
  MyItems,
  MyPokemon,
  MyDetailPokemon,
  Pokemon,
  PokemonEvolution,
  Arena,
  MarketPokemon,
  Transaction,
  MarketItems
};
