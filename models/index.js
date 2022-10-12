const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  user: User,
  profile: Profile,
  mypokemon: MyPokemon,
  arena: Arena,
  pokemon: Pokemon,
  marketpokemon: MarketPokemon,
  cart: Cart,
  transaction: Transaction,
} = prisma;

module.exports = {
  User,
  Profile,
  MyPokemon,
  Arena,
  Pokemon,
  MarketPokemon,
  Cart,
  Transaction,
};
