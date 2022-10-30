const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  user: User,
  profile: Profile,
  items: Items,
  mypokemon: MyPokemon,
  mydetailpokemon: MyDetailPokemon,
  pokemon: Pokemon,
  pokemonevolutionto: PokemonEvolutionTo,
  pokemonelement: PokemonElement,
  arena: Arena,
  marketpokemon: MarketPokemon,
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
  PokemonElement,
  Arena,
  MarketPokemon,
  Transaction,
};
